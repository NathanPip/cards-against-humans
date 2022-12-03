import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const lobbyRouter = router({
  createLobby: publicProcedure
    .input(z.object({ name: z.string(), id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const newLobby = await ctx.prisma.lobby.create({
        data: { name: input?.name, id: input?.id },
      });
      return {
        id: newLobby.id,
      };
    }),
  getLobby: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const lobby = await ctx.prisma.lobby.findUnique({
        where: { id: input?.id },
      });
      return lobby;
    }),
});
