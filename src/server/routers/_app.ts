import { router } from "src/server/trpc";
import { sessionRouter } from "./session";

export const appRouter = router({
  session: sessionRouter,
});

export type AppRouter = typeof appRouter;
