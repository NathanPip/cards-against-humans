import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const gameRouter = router({
  getBasicGameInfo: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input, ctx }) => {
      console.log(input.name)
      if (input.name === "Cards Against Humanity") {
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
    }),
  getSelectedCardPacks: publicProcedure
    .input(z.array(z.string()).nullish())
    .query(async ({ input, ctx }) => {
      if(!input) return null;
      const cardPacks = await ctx.prisma.cAHPack.findMany({
        where: {
          id: {
            in: input,
          },
        },
        include: {
          blackCards: true,
          whiteCards: true,
        },
      });
      return { cardPacks };
    }),
});
