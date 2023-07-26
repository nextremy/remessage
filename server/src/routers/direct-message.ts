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
  receiver: { id: string; username: string };
};

export const directMessageRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        userIds: z.array(z.string()).length(2),
        limit: z.number().int().min(1).max(50),
      })
    )
    .query(async ({ input }) => {
      const directMessages = await db.directMessage.findMany({
        select: {
          id: true,
          textContent: true,
          timestamp: true,
          sender: { select: { id: true, username: true } },
          receiver: { select: { id: true, username: true } },
        },
        where: {
          OR: [
            { senderId: input.userIds[0], receiverId: input.userIds[1] },
            { senderId: input.userIds[1], receiverId: input.userIds[0] },
          ],
        },
        orderBy: { timestamp: "asc" },
        take: 50,
      });
      return directMessages;
    }),
  // TODO: Change to protected procedure once cookie auth is implemented
  stream: publicProcedure
    .input(z.object({ userIds: z.array(z.string()).length(2) }))
    .subscription(({ input }) => {
      return observable<Message>((emit) => {
        function onDirectMessageCreate(message: Message) {
          if (
            input.userIds.includes(message.sender.id) &&
            input.userIds.includes(message.receiver.id)
          ) {
            emit.next(message);
          }
        }
        ee.on("directMessageCreate", onDirectMessageCreate);
        return () => ee.off("directMessageCreate", onDirectMessageCreate);
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        textContent: z.string().min(1).max(2000),
        senderId: z.string(),
        receiverId: z.string(),
      })
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
      ee.emit("directMessageCreate", directMessage);
      return directMessage;
    }),
});
