import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../prisma/client";
import { protectedProcedure, router } from "../trpc";

export const friendRequestRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.user.findUnique({
      select: {
        id: true,
        sentFriendRequests: {
          select: { receiver: { select: { id: true, username: true } } },
        },
        receivedFriendRequests: {
          select: { sender: { select: { id: true, username: true } } },
        },
      },
      where: { id: ctx.userId },
    });
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return [...user.sentFriendRequests, ...user.receivedFriendRequests];
  }),
  create: protectedProcedure
    .input(z.object({ receiverUsername: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await db.$transaction(async (db) => {
        const user = await db.user.findUnique({
          where: { username: input.receiverUsername },
        });
        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        await db.friendRequest.create({
          data: { senderId: ctx.userId, receiverId: user.id },
        });
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.friendRequest.delete({ where: { id: input.id } });
    }),
  accept: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.$transaction(async (db) => {
        const friendRequest = await db.friendRequest.delete({
          where: { id: input.id },
        });
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
