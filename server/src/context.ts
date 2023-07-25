import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import type { IncomingMessage } from "http";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "./env";

function getUserId(req: IncomingMessage) {
  if (req.headers.authorization === undefined) {
    return null;
  }
  const token = req.headers.authorization.split(" ")[1];
  const payload = z
    .object({ userId: z.string() })
    .parse(jwt.verify(token, env.JWT_SECRET));
  return payload.userId;
}

export function createContext({
  req,
}: CreateHTTPContextOptions | CreateWSSContextFnOptions) {
  return { userId: getUserId(req) };
}

export type Context = inferAsyncReturnType<typeof createContext>;
