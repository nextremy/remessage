import { TRPCError, initTRPC } from "@trpc/server";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create();

const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (ctx.userId === null) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { userId: ctx.userId } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
