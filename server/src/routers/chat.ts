import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../prisma/client";
import { protectedProcedure, router } from "../trpc";

export const chatRouter = router({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const chat = await db.chat.findUnique({
        select: {
          id: true,
          type: true,
          lastNotificationTimestamp: true,
          users: { select: { id: true, username: true } },
        },
        where: { ...input },
      });
      if (!chat) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      if (!chat.users.some((user) => user.id === ctx.userId)) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return chat;
    }),
  list: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (input.userId !== ctx.userId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const chats = await db.chat.findMany({
        select: {
          id: true,
          type: true,
          lastNotificationTimestamp: true,
          users: { select: { id: true, username: true } },
        },
        where: { users: { some: { id: input.userId } } },
        orderBy: { lastNotificationTimestamp: "desc" },
      });
      return chats;
    }),
});
