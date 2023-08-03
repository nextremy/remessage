import { TRPCError } from "@trpc/server";
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
    .query(async ({ input, ctx }) => {
      const chat = await db.chat.findUnique({
        select: { users: { select: { id: true } } },
        where: { id: input.chatId },
      });
      if (!chat) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      if (!chat.users.some((user) => user.id === ctx.userId)) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
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
    .mutation(async ({ input, ctx }) => {
      await db.$transaction(async (db) => {
        const chat = await db.chat.findUnique({
          select: { users: { select: { id: true } } },
          where: { id: input.chatId },
        });
        if (!chat) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        if (!chat.users.some((user) => user.id === ctx.userId)) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
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
        await db.chat.update({
          data: { lastNotificationTimestamp: message.timestamp },
          where: { id: input.chatId },
        });
        ee.emit("messageCreate", message);
      });
    }),
});
