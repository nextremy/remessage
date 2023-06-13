import { Type } from "@sinclair/typebox";
import { CustomFastifyInstance } from "fastify";
import prisma from "../prisma/client";

export default async function friendRequestRoutes(
  fastify: CustomFastifyInstance
) {
  fastify.get(
    "/friend-requests",
    {
      schema: {
        querystring: Type.Object({
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
      const { userId } = request.query;
      fastify.assert(userId === request.session.id);

      const friendRequest = await prisma.friendRequest.findMany({
        select: {
          senderId: true,
          receiverId: true,
        },
        where: {
          OR: [
            {
              senderId: userId,
            },
            {
              receiverId: userId,
            },
          ],
        },
      });

      return friendRequest;
    }
  );

  fastify.post(
    "/send-friend-request",
    {
      schema: {
        body: Type.Object({
          senderId: Type.String(),
          receiverId: Type.String(),
        }),
      },
    },
    async (request) => {
      const { senderId, receiverId } = request.body;
      fastify.assert(senderId === request.session.id);
      fastify.assert(senderId !== receiverId);

      await prisma.$transaction(async (tx) => {
        const receiver = await tx.user.findUnique({
          select: {
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
            id: receiverId,
          },
        });
        fastify.assert(receiver);
        fastify.assert(receiver.friends.length === 0);
        fastify.assert(receiver.sentFriendRequests.length === 0);
        fastify.assert(receiver.receivedFriendRequests.length === 0);

        await tx.user.update({
          data: {
            sentFriendRequests: {
              create: {
                receiverId,
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

  fastify.post(
    "/accept-friend-request",
    {
      schema: {
        body: Type.Object({
          senderId: Type.String(),
          receiverId: Type.String(),
        }),
      },
    },
    async (request) => {
      const { senderId, receiverId } = request.body;
      fastify.assert(receiverId === request.session.id);

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
    "/remove-friend-request",
    {
      schema: {
        body: Type.Object({
          senderId: Type.String(),
          receiverId: Type.String(),
        }),
      },
    },
    async (request) => {
      const { id: sessionId } = request.session;
      const { senderId, receiverId } = request.body;
      fastify.assert(sessionId === senderId || sessionId === receiverId);

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
