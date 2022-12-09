import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRoom, getConnectedPlayers, getExistingRoom, setInitialRoomStorage } from "../../../utils/liveblocksUtils";

import { router, publicProcedure } from "../trpc";

export const lobbyRouter = router({
  createLobby: publicProcedure
    .input(z.object({ name: z.string(), id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user?.id) throw new TRPCError({ code: "UNAUTHORIZED", message: "must be logged in" });
      const newRoom = await createRoom({
        id: input.id,
        defaultAccesses: ["room:write"],
      });
      await setInitialRoomStorage(newRoom.id, {name: input.name, owner: ctx.session.user.id});
      await ctx.prisma.lobby.create({
        data: { name: input?.name, id: input?.id, userId: ctx.session.user.id },
      });
    }),
  getLobby: publicProcedure
    .input(z.object({ id: z.string().nullish() }))
    .query(async ({ input, ctx }) => {
      if (!input.id) return null;
      const lobby = await ctx.prisma.lobby.findUnique({
        where: { id: input.id },
      });
      await getExistingRoom(input.id);
      return lobby;
    }),
  getRoom: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      if(!input) throw new TRPCError({ code: "BAD_REQUEST", message: "No room id provided" });
      const room = await getExistingRoom(input);
      return room;
    }),
  getConnectedPlayers: publicProcedure.input(z.string()).query(async ({ input }) => {
    if(!input) throw new TRPCError({ code: "BAD_REQUEST", message: "No room id provided" });
    const players = await getConnectedPlayers(input);
    return players;
  })
});
