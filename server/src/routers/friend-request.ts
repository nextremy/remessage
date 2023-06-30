import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../prisma/client";
import { protectedProcedure, router } from "../trpc";

export const friendRequestRouter = router({
  list: protectedProcedure
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
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return [...user.sentFriendRequests, ...user.receivedFriendRequests];
    }),
  create: protectedProcedure
    .input(z.object({ senderId: z.string(), receiverId: z.string() }))
    .mutation(async ({ input }) => {
      await db.friendRequest.create({
        data: { senderId: input.senderId, receiverId: input.receiverId },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ senderId: z.string(), receiverId: z.string() }))
    .mutation(async ({ input }) => {
      await db.friendRequest.delete({
        where: {
          senderId_receiverId: {
            senderId: input.senderId,
            receiverId: input.receiverId,
          },
        },
      });
    }),
  accept: protectedProcedure
    .input(z.object({ senderId: z.string(), receiverId: z.string() }))
    .mutation(async ({ input }) => {
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
