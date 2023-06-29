import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const friendRequestRouter = router({
  list: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
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
  create: protectedProcedure
    .input(z.object({ senderId: z.string(), receiverId: z.string() }))
    .query(async ({ input, ctx }) => {
      await ctx.db.friendRequest.create({
        data: { senderId: input.senderId, receiverId: input.receiverId },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ senderId: z.string(), receiverId: z.string() }))
    .query(async ({ input, ctx }) => {
      await ctx.db.friendRequest.delete({
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
    .query(async ({ input, ctx }) => {
      await ctx.db.$transaction([
        ctx.db.friendRequest.delete({
          where: {
            senderId_receiverId: {
              senderId: input.senderId,
              receiverId: input.receiverId,
            },
          },
        }),
        ctx.db.user.update({
          data: { friends: { connect: { id: input.receiverId } } },
          where: { id: input.senderId },
        }),
        ctx.db.user.update({
          data: { friends: { connect: { id: input.senderId } } },
          where: { id: input.receiverId },
        }),
      ]);
    }),
});
