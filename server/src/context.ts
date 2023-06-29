import { PrismaClient } from "@prisma/client";
import { inferAsyncReturnType } from "@trpc/server";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { IncomingMessage } from "http";
import * as jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "./env";

const db = new PrismaClient();

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

export function createContext({ req }: CreateHTTPContextOptions) {
  return { db, userId: getUserId(req) };
}

export type Context = inferAsyncReturnType<typeof createContext>;
