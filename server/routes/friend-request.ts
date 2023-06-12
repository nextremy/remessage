import { Type } from "@sinclair/typebox";
import { FastifyInstanceTypebox } from "fastify";
import prisma from "../prisma/client";

export default async function friendRequestRoutes(
  fastify: FastifyInstanceTypebox
) {
  fastify.get(
    "/users/:userId/sent-friend-requests",
    {
      schema: {
        params: Type.Object({
          userId: Type.String(),
        }),
        response: {
          200: Type.Array(
            Type.Object({
              senderId: Type.String(),
              receiverId: Type.String(),
            })
          ),
        },
      },
    },
    async (request) => {
      const { userId } = request.params;
      fastify.assert(userId === request.session.id);

      const friendRequest = await prisma.friendRequest.findMany({
        select: {
          senderId: true,
          receiverId: true,
        },
        where: {
          senderId: userId,
        },
      });

      return friendRequest;
    }
  );

  fastify.get(
    "/users/:userId/received-friend-requests",
    {
      schema: {
        params: Type.Object({
          userId: Type.String(),
        }),
        response: {
          200: Type.Array(
            Type.Object({
              senderId: Type.String(),
              receiverId: Type.String(),
            })
          ),
        },
      },
    },
    async (request) => {
      const { userId } = request.params;
      fastify.assert(userId === request.session.id);

      const friendRequest = await prisma.friendRequest.findMany({
        select: {
          senderId: true,
          receiverId: true,
        },
        where: {
          receiverId: userId,
        },
      });

      return friendRequest;
    }
  );

  fastify.post(
    "/users/:userId/sent-friend-requests",
    {
      schema: {
        params: Type.Object({
          userId: Type.String(),
        }),
        body: Type.Object({
          receiverUsername: Type.String(),
        }),
      },
    },
    async (request) => {
      const { userId: senderId } = request.params;
      const { receiverUsername } = request.body;
      fastify.assert(senderId === request.session.id);

      await prisma.$transaction(async (tx) => {
        const receiver = await tx.user.findUnique({
          select: {
            id: true,
            friends: {
              where: {
                id: senderId,
              },
            },
            sentFriendRequests: {
              where: {
                receiverId: senderId,
              },
            },
            receivedFriendRequests: {
              where: {
                senderId,
              },
            },
          },
          where: {
            username: receiverUsername,
          },
        });
        fastify.assert(receiver);
        fastify.assert(senderId !== receiver.id);
        fastify.assert(receiver.friends.length === 0);
        fastify.assert(receiver.sentFriendRequests.length === 0);
        fastify.assert(receiver.receivedFriendRequests.length === 0);

        await tx.user.update({
          data: {
            sentFriendRequests: {
              create: {
                receiverId: receiver.id,
              },
            },
          },
          where: {
            id: senderId,
          },
        });
      });
    }
  );

  fastify.delete(
    "/users/:userId/sent-friend-requests/:receiverId",
    {
      schema: {
        params: Type.Object({
          userId: Type.String(),
          receiverId: Type.String(),
        }),
      },
    },
    async (request) => {
      const { userId: senderId, receiverId } = request.params;
      fastify.assert(senderId === request.session.id);

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
    "/users/:userId/received-friend-requests/:senderId",
    {
      schema: {
        params: Type.Object({
          userId: Type.String(),
          senderId: Type.String(),
        }),
      },
    },
    async (request) => {
      const { userId: receiverId, senderId } = request.params;
      fastify.assert(receiverId === request.session.id);

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

  // TODO: Move to POST /users/:userId/friends
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
}
