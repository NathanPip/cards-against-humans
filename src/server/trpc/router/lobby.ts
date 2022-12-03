import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const lobbyRouter = router({
  createLobby: publicProcedure
    .input(z.object({ name: z.string(), id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if(!ctx.session?.user?.id) throw new TRPCError({ code: "UNAUTHORIZED" }) 
      await ctx.prisma.lobby.create({
        data: { name: input?.name, id: input?.id, userId: ctx.session.user.id },
      });
    }),
  getLobby: publicProcedure
    .input(z.object({ id: z.string().nullish() }))
    .query(async ({ input, ctx }) => {
      if(!input.id) return null;
      const lobby = await ctx.prisma.lobby.findUnique({
        where: { id: input?.id },
      });
      return lobby;
    }),
});
