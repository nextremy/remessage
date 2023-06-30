import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../prisma/client";
import { protectedProcedure, router } from "../trpc";

export const friendRouter = router({
  list: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const user = await db.user.findUnique({
        select: { friends: { select: { id: true, username: true } } },
        where: { id: input.userId },
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return user.friends;
    }),
  delete: protectedProcedure
    .input(z.object({ userId: z.string(), friendId: z.string() }))
    .mutation(async ({ input }) => {
      await db.user.update({
        data: { friends: { delete: { id: input.friendId } } },
        where: { id: input.userId },
      });
    }),
});
