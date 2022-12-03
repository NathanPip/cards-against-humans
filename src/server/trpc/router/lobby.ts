import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRoom, setInitialRoomStorage } from "../../../utils/liveblocksUtils";

import { router, publicProcedure } from "../trpc";

export const lobbyRouter = router({
  createLobby: publicProcedure
    .input(z.object({ name: z.string(), id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
      if (!ctx.session?.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });
      const newRoom = await createRoom({
        id: input.id,
        defaultAccesses: ["room:write"],
      });
      await setInitialRoomStorage(newRoom.id, {name: input.name, owner: ctx.session.user.id});
      await ctx.prisma.lobby.create({
        data: { name: input?.name, id: input?.id, userId: ctx.session.user.id },
      });
    } catch (error) {
      let message
      if (error instanceof Error) message = error.message
      else message = String(error)
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: message });
    }
    }),
  getLobby: publicProcedure
    .input(z.object({ id: z.string().nullish() }))
    .query(async ({ input, ctx }) => {
      if (!input.id) return null;
      const lobby = await ctx.prisma.lobby.findUnique({
        where: { id: input.id },
      });
      return lobby;
    }),
});
