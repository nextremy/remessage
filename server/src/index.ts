import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import cors from "cors";
import { WebSocketServer } from "ws";
import { createContext } from "./context";
import { authRouter } from "./routers/auth";
import { directMessageRouter } from "./routers/direct-message";
import { friendRouter } from "./routers/friend";
import { friendRequestRouter } from "./routers/friend-request";
import { userRouter } from "./routers/user";
import { router } from "./trpc";

const appRouter = router({
  auth: authRouter,
  user: userRouter,
  friend: friendRouter,
  friendRequest: friendRequestRouter,
  directMessage: directMessageRouter,
});

export type AppRouter = typeof appRouter;

const { server, listen } = createHTTPServer({
  router: appRouter,
  middleware: cors(),
  createContext,
});

const wss = new WebSocketServer({ server });
applyWSSHandler<AppRouter>({
  router: appRouter,
  wss,
  createContext,
});

listen(4000);
