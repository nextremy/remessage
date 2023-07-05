import { z } from "zod";
import { db } from "../prisma/client";
import { protectedProcedure, router } from "../trpc";

export const directMessageRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        senderId: z.string(),
        receiverId: z.string(),
        limit: z.number().int().min(1).max(50),
      }),
    )
    .query(async ({ input }) => {
      const directMessages = await db.directMessage.findMany({
        select: {
          id: true,
          textContent: true,
          timestamp: true,
          senderId: true,
        },
        where: { senderId: input.senderId, receiverId: input.receiverId },
        orderBy: { timestamp: "asc" },
        take: 50,
      });
      return directMessages;
    }),
  create: protectedProcedure
    .input(
      z.object({
        textContent: z.string().min(1).max(2000),
        senderId: z.string(),
        receiverId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const directMessage = await db.directMessage.create({
        select: {
          id: true,
          textContent: true,
          timestamp: true,
          senderId: true,
          receiverId: true,
        },
        data: {
          textContent: input.textContent,
          senderId: input.senderId,
          receiverId: input.receiverId,
        },
      });
      return directMessage;
    }),
});
