import { router } from "../trpc";
import { authRouter } from "./auth";
import { lobbyRouter } from "./lobby";

export const appRouter = router({
  lobby: lobbyRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
