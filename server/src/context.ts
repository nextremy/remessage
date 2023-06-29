import { inferAsyncReturnType } from "@trpc/server";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import * as jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "./env";

export async function createContext({ req }: CreateHTTPContextOptions) {
  if (req.headers.authorization === undefined) {
    return { userId: null };
  }
  const token = req.headers.authorization.split(" ")[1];
  const payload = z
    .object({ userId: z.string() })
    .parse(jwt.verify(token, env.JWT_SECRET));
  return { userId: payload.userId };
}

export type Context = inferAsyncReturnType<typeof createContext>;
