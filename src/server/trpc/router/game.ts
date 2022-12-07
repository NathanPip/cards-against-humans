import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const gameRouter = router({
  getBasicGameInfo: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        if (input.name === "CAH") {
          const cardPacks = await ctx.prisma.cAHPack.findMany({
            include: {
              _count: {
                select: { whiteCards: true, blackCards: true },
              },
            },
          });
          return { cardPacks };
        } else {
            throw new TRPCError({ code: "NOT_FOUND" });
        }
      } catch (err) {
        let message;
        if (err instanceof Error) message = err.message;
        else message = String(err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: message });
      }
    }),
});