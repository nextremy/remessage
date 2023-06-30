import { TRPCError } from "@trpc/server";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../env";
import { db } from "../prisma/client";
import { publicProcedure, router } from "../trpc";

export const authRouter = router({
  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ input }) => {
      const user = await db.user.findUnique({
        where: { username: input.username },
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      if (!(await argon2.verify(user.passwordHash, input.password))) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const token = jwt.sign({ userId: user.id }, env.JWT_SECRET);
      return { token };
    }),
});
