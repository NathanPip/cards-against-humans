import { router } from "../trpc";
import { authRouter } from "./auth";
import { gameRouter } from "./game";
import { lobbyRouter } from "./lobby";

export const appRouter = router({
  lobby: lobbyRouter,
  auth: authRouter,
  game: gameRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
