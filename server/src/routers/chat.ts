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
  list: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const chats = await db.chat.findMany({
        select: {
          id: true,
          type: true,
          lastNotificationTimestamp: true,
          users: { select: { id: true, username: true } },
        },
        where: { users: { some: { id: input.userId } } },
        orderBy: { lastNotificationTimestamp: "asc" },
      });
      return chats;
    }),
});
