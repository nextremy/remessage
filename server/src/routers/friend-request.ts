import { z } from "zod";
import { db } from "../prisma/client";
import { publicProcedure, router } from "../trpc";

export const friendRequestRouter = router({
  list: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const user = await db.user.findUnique({
        select: {
          sentFriendRequests: {
            select: { receiver: { select: { id: true, username: true } } },
          },
          receivedFriendRequests: {
            select: { sender: { select: { id: true, username: true } } },
          },
        },
        where: { id: input.userId },
      });
      if (!user) return null;
      return [...user.sentFriendRequests, ...user.receivedFriendRequests];
    }),
  create: publicProcedure
    .input(z.object({ senderId: z.string(), receiverId: z.string() }))
    .query(async ({ input }) => {
      await db.friendRequest.create({
        data: { senderId: input.senderId, receiverId: input.receiverId },
      });
    }),
  delete: publicProcedure
    .input(z.object({ senderId: z.string(), receiverId: z.string() }))
    .query(async ({ input }) => {
      await db.friendRequest.delete({
        where: {
          senderId_receiverId: {
            senderId: input.senderId,
            receiverId: input.receiverId,
          },
        },
      });
    }),
  accept: publicProcedure
    .input(z.object({ senderId: z.string(), receiverId: z.string() }))
    .query(async ({ input }) => {
      await db.$transaction([
        db.friendRequest.delete({
          where: {
            senderId_receiverId: {
              senderId: input.senderId,
              receiverId: input.receiverId,
            },
          },
        }),
        db.user.update({
          data: { friends: { connect: { id: input.receiverId } } },
          where: { id: input.senderId },
        }),
        db.user.update({
          data: { friends: { connect: { id: input.senderId } } },
          where: { id: input.receiverId },
        }),
      ]);
    }),
});
