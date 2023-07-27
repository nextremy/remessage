import { z } from "zod";
import { db } from "../prisma/client";
import { protectedProcedure, router } from "../trpc";

export const chatRouter = router({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const chat = await db.chat.findUnique({
        select: {
          id: true,
          type: true,
          lastNotificationTimestamp: true,
          users: { select: { id: true, username: true } },
        },
        where: { ...input },
      });
      return chat;
    }),
});
