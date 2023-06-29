import { z } from "zod";
import { db } from "../prisma/client";
import { protectedProcedure, router } from "../trpc";

export const messageRouter = router({
  list: protectedProcedure
    .input(z.object({ chatId: z.string(), limit: z.number().int().max(50) }))
    .query(async ({ input }) => {
      const messages = await db.message.findMany({
        select: {
          id: true,
          timestamp: true,
          textContent: true,
          authorId: true,
          chatId: true,
        },
        where: { chatId: input.chatId },
        orderBy: { timestamp: "asc" },
        take: 50,
      });
      return messages;
    }),
  create: protectedProcedure
    .input(
      z.object({
        textContent: z.string().max(2000),
        authorId: z.string(),
        chatId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.message.create({ data: { ...input } });
    }),
});
