import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import cors from "cors";
import { WebSocketServer } from "ws";
import { createContext } from "./context";
import { authRouter } from "./routers/auth";
import { directChatRouter } from "./routers/direct-chat";
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
  directChat: directChatRouter,
  message: messageRouter,
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
