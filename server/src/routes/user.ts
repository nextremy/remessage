import { Type } from "@fastify/type-provider-typebox";
import { db } from "../database/client";
import { AppInstance } from "../types/app-instance";

export default async function (app: AppInstance) {
  app.get(
    "/users/:userId",
    {
      schema: {
        params: Type.Object({
          userId: Type.String(),
        }),
        response: {
          200: Type.Object({
            id: Type.String(),
            username: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const user = await db.user.findUnique({
        where: {
          id: request.params.userId,
        },
      });
      if (!user) {
        reply.code(404);
        throw new Error();
      }
      return {
        id: user.id,
        username: user.username,
      };
    },
  );

  app.get(
    "/users/:userId/friends",
    {
      schema: {
        params: Type.Object({
          userId: Type.String(),
        }),
        response: {
          200: Type.Array(
            Type.Object({
              id: Type.String(),
              username: Type.String(),
            }),
          ),
        },
      },
    },
    async (request, reply) => {
      if (request.user.userId !== request.params.userId) {
        reply.code(403);
        throw new Error();
      }
      const user = await db.user.findUnique({
        include: {
          friends: true,
        },
        where: {
          id: request.params.userId,
        },
      });
      if (!user) {
        reply.code(404);
        throw new Error();
      }
      return user.friends.map((friend) => ({
        id: friend.id,
        username: friend.username,
      }));
    },
  );

  app.delete(
    "/users/:userId/friends/:friendId",
    {
      schema: {
        params: Type.Object({
          userId: Type.String(),
          friendId: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      if (request.user.userId !== request.params.userId) {
        reply.code(403);
        throw new Error();
      }
      await db.user.update({
        data: {
          friends: {
            delete: {
              id: request.params.friendId,
            },
          },
        },
        where: {
          id: request.params.userId,
        },
      });
    },
  );

  app.get(
    "/users/:userId/friend-requests",
    {
      schema: {
        params: Type.Object({
          userId: Type.String(),
        }),
        response: {
          200: Type.Array(
            Type.Object({
              id: Type.String(),
              sender: Type.Object({
                id: Type.String(),
                username: Type.String(),
              }),
              receiver: Type.Object({
                id: Type.String(),
                username: Type.String(),
              }),
            }),
          ),
        },
      },
    },
    async (request, reply) => {
      if (request.user.userId !== request.params.userId) {
        reply.code(403);
        throw new Error();
      }
      return await db.friendRequest.findMany({
        select: {
          id: true,
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
          id: request.params.userId,
        },
      });
    },
  );

  app.post(
    "/users/:userId/friend-requests",
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
    async (request, reply) => {
      if (request.user.userId !== request.params.userId) {
        reply.code(403);
        throw new Error();
      }
      await db.$transaction(async (db) => {
        const receiver = await db.user.findUniqueOrThrow({
          where: {
            username: request.body.receiverUsername,
          },
        });
        await db.friendRequest.create({
          data: {
            senderId: request.params.userId,
            receiverId: receiver.id,
          },
        });
      });
    },
  );

  app.delete(
    "/users/:userId/friend-requests/:friendRequestId",
    {
      schema: {
        params: Type.Object({
          userId: Type.String(),
          friendRequestId: Type.String(),
        }),
        querystring: Type.Object({
          accept: Type.Optional(Type.Boolean()),
        }),
      },
    },
    async (request, reply) => {
      if (request.user.userId !== request.params.userId) {
        reply.code(403);
        throw new Error();
      }
      await db.$transaction(async (db) => {
        const friendRequest = await db.friendRequest.findUniqueOrThrow({
          where: {
            id: request.params.friendRequestId,
          },
        });
        if (
          friendRequest.senderId !== request.params.userId &&
          friendRequest.receiverId !== request.params.userId
        ) {
          reply.code(403);
          throw new Error();
        }
        if (
          friendRequest.receiverId === request.params.userId &&
          request.query.accept
        ) {
          await db.user.update({
            data: {
              friends: {
                connect: {
                  id: friendRequest.receiverId,
                },
              },
              INTERNAL_friends: {
                connect: {
                  id: friendRequest.receiverId,
                },
              },
            },
            where: {
              id: request.params.userId,
            },
          });
        }
        await db.friendRequest.delete({
          where: {
            id: request.params.friendRequestId,
          },
        });
      });
    },
  );
}
