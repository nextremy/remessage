import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { createContext } from "./context";
import { authRouter } from "./routers/auth";
import { friendRouter } from "./routers/friend";
import { friendRequestRouter } from "./routers/friend-request";
import { messageRouter } from "./routers/message";
import { userRouter } from "./routers/user";
import { router } from "./trpc";

const appRouter = router({
  auth: authRouter,
  user: userRouter,
  friend: friendRouter,
  friendRequest: friendRequestRouter,
  message: messageRouter,
});

export type AppRouter = typeof appRouter;

createHTTPServer({
  router: appRouter,
  middleware: cors(),
  createContext,
}).listen(4000);
