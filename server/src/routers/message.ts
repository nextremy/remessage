import { observable } from "@trpc/server/observable";
import EventEmitter from "events";
import { z } from "zod";
import { db } from "../prisma/client";
import { protectedProcedure, publicProcedure, router } from "../trpc";

const ee = new EventEmitter();

type Message = {
  id: string;
  textContent: string;
  timestamp: Date;
  sender: { id: string; username: string };
  chatId: string;
};

export const messageRouter = router({
  list: protectedProcedure
    .input(
      z.object({ chatId: z.string(), limit: z.number().int().min(1).max(50) })
    )
    .query(async ({ input }) => {
      const messages = await db.message.findMany({
        select: {
          id: true,
          textContent: true,
          timestamp: true,
          sender: { select: { id: true, username: true } },
        },
        where: { chatId: input.chatId },
        orderBy: { timestamp: "asc" },
        take: input.limit,
      });
      return messages;
    }),
  // TODO: Change to protected procedure once cookie auth is implemented
  stream: publicProcedure
    .input(z.object({ chatId: z.string() }))
    .subscription(({ input }) => {
      return observable<Message>((emit) => {
        function onMessageCreate(message: Message) {
          if (input.chatId === message.chatId) {
            emit.next(message);
          }
        }
        ee.on("messageCreate", onMessageCreate);
        return () => ee.off("messageCreate", onMessageCreate);
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        textContent: z.string().min(1).max(2000),
        senderId: z.string(),
        chatId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const message = await db.message.create({
        select: {
          id: true,
          textContent: true,
          timestamp: true,
          sender: { select: { id: true, username: true } },
          chatId: true,
        },
        data: { ...input },
      });
      ee.emit("messageCreate", message);
    }),
});
