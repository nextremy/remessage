import { z } from "zod";
import { db } from "../database/client";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  get: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const user = await db.user.findUnique({
        select: { id: true, username: true },
        where: { id: input.userId },
      });
      return user;
    }),
});
