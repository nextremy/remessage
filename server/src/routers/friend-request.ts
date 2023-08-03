import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../prisma/client";
import { protectedProcedure, router } from "../trpc";

export const friendRequestRouter = router({
  list: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (input.userId !== ctx.userId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const user = await db.user.findUnique({
        select: {
          sentFriendRequests: {
            select: {
              id: true,
              sender: { select: { id: true, username: true } },
              receiver: { select: { id: true, username: true } },
            },
          },
          receivedFriendRequests: {
            select: {
              id: true,
              sender: { select: { id: true, username: true } },
              receiver: { select: { id: true, username: true } },
            },
          },
        },
        where: { id: input.userId },
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return user.sentFriendRequests.concat(user.receivedFriendRequests);
    }),
  create: protectedProcedure
    .input(z.object({ senderId: z.string(), receiverUsername: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (input.senderId !== ctx.userId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      await db.$transaction(async (db) => {
        const receiver = await db.user.findUnique({
          select: { id: true, friends: { select: { id: true } } },
          where: { username: input.receiverUsername },
        });
        if (!receiver) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        const usersAreFriends = receiver.friends.some(
          (friend) => friend.id === input.senderId
        );
        if (usersAreFriends) {
          throw new TRPCError({ code: "CONFLICT" });
        }
        const existingFriendRequest = await db.friendRequest.findFirst({
          where: {
            OR: [
              { senderId: input.senderId, receiverId: receiver.id },
              { senderId: receiver.id, receiverId: input.senderId },
            ],
          },
        });
        if (existingFriendRequest) {
          throw new TRPCError({ code: "CONFLICT" });
        }
        await db.friendRequest.create({
          data: { senderId: input.senderId, receiverId: receiver.id },
        });
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await db.$transaction(async (db) => {
        const friendRequest = await db.friendRequest.findUnique({
          where: { id: input.id },
        });
        if (!friendRequest) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        if (
          ctx.userId !== friendRequest.senderId &&
          ctx.userId !== friendRequest.receiverId
        ) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await db.friendRequest.delete({ where: { id: input.id } });
      });
    }),
  accept: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await db.$transaction(async (db) => {
        const friendRequest = await db.friendRequest.delete({
          where: { id: input.id },
        });
        if (
          ctx.userId !== friendRequest.senderId &&
          ctx.userId !== friendRequest.receiverId
        ) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await db.user.update({
          data: { friends: { connect: { id: friendRequest.receiverId } } },
          where: { id: friendRequest.senderId },
        });
        await db.user.update({
          data: { friends: { connect: { id: friendRequest.senderId } } },
          where: { id: friendRequest.receiverId },
        });
      });
    }),
});
