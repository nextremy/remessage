import { Type } from "@sinclair/typebox";
import { FastifyInstanceTypebox } from "fastify";
import prisma from "../prisma/client";

export default async function friendshipRoutes(
  fastify: FastifyInstanceTypebox
) {
  fastify.get(
    "/friend-requests",
    {
      schema: {
        response: {
          200: Type.Array(
            Type.Object({
              sender: Type.Object({
                id: Type.String(),
                username: Type.String(),
              }),
              receiver: Type.Object({
                id: Type.String(),
                username: Type.String(),
              }),
            })
          ),
        },
      },
    },
    async (request) => {
      const receiverId = request.session.id;

      const friendRequests = await prisma.friendRequest.findMany({
        select: {
          sender: { select: { id: true, username: true } },
          receiver: { select: { id: true, username: true } },
        },
        where: { receiverId },
      });

      return friendRequests;
    }
  );

  fastify.post(
    "/send-friend-request",
    { schema: { body: Type.Object({ receiverUsername: Type.String() }) } },
    async (request) => {
      const senderId = request.session.id!;
      const { receiverUsername } = request.body;

      await prisma.$transaction(async (tx) => {
        const receiver = await tx.user.findUnique({
          select: { id: true },
          where: { username: receiverUsername },
        });

        fastify.assert(receiver);
        fastify.assert(senderId !== receiver.id);
        const friendshipExists = Boolean(
          tx.friendship.findUnique({
            where: {
              userId_friendId: { userId: senderId, friendId: receiver.id },
            },
          })
        );
        fastify.assert(!friendshipExists);
        const friendRequestExists = Boolean(
          tx.friendRequest.findFirst({
            where: {
              OR: [
                { senderId, receiverId: receiver.id },
                { senderId: receiver.id, receiverId: senderId },
              ],
            },
          })
        );
        fastify.assert(!friendRequestExists);

        await tx.friendRequest.create({
          data: { senderId, receiverId: receiver.id },
        });
      });
    }
  );

  fastify.post(
    "/unsend-friend-request",
    { schema: { body: Type.Object({ receiverId: Type.String() }) } },
    async (request) => {
      const senderId = request.session.id!;
      const { receiverId } = request.body;

      await prisma.friendRequest.delete({
        where: { senderId_receiverId: { senderId, receiverId } },
      });
    }
  );

  fastify.post(
    "/accept-friend-request",
    { schema: { body: Type.Object({ senderId: Type.String() }) } },
    async (request) => {
      const { senderId } = request.body;
      const receiverId = request.session.id!;

      await prisma.$transaction([
        prisma.friendRequest.delete({
          where: { senderId_receiverId: { senderId, receiverId } },
        }),
        prisma.friendship.create({
          data: { userId: senderId, friendId: receiverId },
        }),
        prisma.friendship.create({
          data: { userId: receiverId, friendId: senderId },
        }),
      ]);
    }
  );

  fastify.post(
    "/reject-friend-request",
    { schema: { body: Type.Object({ senderId: Type.String() }) } },
    async (request) => {
      const { senderId } = request.body;
      const receiverId = request.session.id!;

      await prisma.friendRequest.delete({
        where: { senderId_receiverId: { senderId, receiverId } },
      });
    }
  );
}
