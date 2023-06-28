import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { friendRouter } from "./routers/friend";
import { friendRequestRouter } from "./routers/friend-request";
import { userRouter } from "./routers/user";
import { router } from "./trpc";

const appRouter = router({
  user: userRouter,
  friend: friendRouter,
  friendRequest: friendRequestRouter,
});

export type AppRouter = typeof appRouter;

createHTTPServer({
  middleware: cors(),
  router: appRouter,
}).listen(4000);
