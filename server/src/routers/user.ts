import { TRPCError } from "@trpc/server";
import argon2 from "argon2";
import { z } from "zod";
import { db } from "../prisma/client";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const userRouter = router({
  get: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const user = await db.user.findUnique({
        select: { id: true, username: true },
        where: { id: input.userId },
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return user;
    }),
  create: publicProcedure
    .input(
      z.object({
        username: z
          .string()
          .min(1)
          .max(16)
          .regex(/^[a-z0-9_]*/),
        password: z.string().min(8).max(256),
      }),
    )
    .mutation(async ({ input }) => {
      const passwordHash = await argon2.hash(input.password);
      await db.user.create({
        data: { username: input.username, passwordHash },
      });
    }),
});
