import { Type } from "@sinclair/typebox";
import { FastifyInstanceTypebox } from "fastify";
import prisma from "../prisma/client";

export default async function friendRequestRoutes(
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
          sender: {
            select: {
              id: true,
              username: true,
            },
          },
          receiver: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        where: {
          receiverId,
        },
      });

      return friendRequests;
    }
  );

  fastify.post(
    "/send-friend-request",
    {
      schema: {
        body: Type.Object({
          receiverUsername: Type.String(),
        }),
      },
    },
    async (request) => {
      const userId = request.session.id!;
      const { receiverUsername } = request.body;

      await prisma.$transaction(async (tx) => {
        const receiver = await tx.user.findUnique({
          select: {
            id: true,
            friends: {
              select: {
                id: true,
              },
              where: {
                id: userId,
              },
            },
            sentFriendRequests: {
              select: {
                receiverId: true,
              },
              where: {
                receiverId: userId,
              },
            },
            receivedFriendRequests: {
              select: {
                senderId: true,
              },
              where: {
                senderId: userId,
              },
            },
          },
          where: {
            username: receiverUsername,
          },
        });
        fastify.assert(receiver);
        fastify.assert(userId !== receiver.id);
        fastify.assert(receiver.friends.length === 0);
        fastify.assert(receiver.sentFriendRequests.length === 0);
        fastify.assert(receiver.receivedFriendRequests.length === 0);

        await tx.user.update({
          data: {
            sentFriendRequests: {
              connect: {
                senderId_receiverId: {
                  senderId: userId,
                  receiverId: receiver.id,
                },
              },
            },
          },
          where: {
            id: userId,
          },
        });
      });
    }
  );

  fastify.post(
    "/unsend-friend-request",
    {
      schema: {
        body: Type.Object({
          receiverId: Type.String(),
        }),
      },
    },
    async (request) => {
      const senderId = request.session.id!;
      const { receiverId } = request.body;

      await prisma.friendRequest.delete({
        where: {
          senderId_receiverId: {
            senderId,
            receiverId,
          },
        },
      });
    }
  );

  fastify.post(
    "/accept-friend-request",
    {
      schema: {
        body: Type.Object({
          senderId: Type.String(),
        }),
      },
    },
    async (request) => {
      const { senderId } = request.body;
      const receiverId = request.session.id!;

      await prisma.$transaction([
        prisma.user.update({
          data: {
            friends: {
              connect: {
                id: senderId,
              },
            },
          },
          where: {
            id: receiverId,
          },
        }),
        prisma.user.update({
          data: {
            friends: {
              connect: {
                id: receiverId,
              },
            },
          },
          where: {
            id: senderId,
          },
        }),
        prisma.friendRequest.delete({
          where: {
            senderId_receiverId: {
              senderId,
              receiverId,
            },
          },
        }),
      ]);
    }
  );

  fastify.post(
    "/reject-friend-request",
    {
      schema: {
        body: Type.Object({
          senderId: Type.String(),
        }),
      },
    },
    async (request) => {
      const { senderId } = request.body;
      const receiverId = request.session.id!;

      await prisma.friendRequest.delete({
        where: {
          senderId_receiverId: {
            senderId,
            receiverId,
          },
        },
      });
    }
  );
}
