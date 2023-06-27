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
    "/users/:userId/sent-friend-requests",
    {
      schema: {
        params: Type.Object({
          userId: Type.String(),
        }),
        response: {
          200: Type.Array(
            Type.Object({
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
          receiver: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        where: {
          senderId: request.params.userId,
        },
      });
    },
  );

  app.post(
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
    "/users/:userId/sent-friend-requests/:receiverId",
    {
      schema: {
        params: Type.Object({
          userId: Type.String(),
          receiverId: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      if (request.user.userId !== request.params.userId) {
        reply.code(403);
        throw new Error();
      }
      await db.friendRequest.delete({
        where: {
          senderId_receiverId: {
            senderId: request.params.userId,
            receiverId: request.params.receiverId,
          },
        },
      });
    },
  );

  app.get(
    "/users/:userId/received-friend-requests",
    {
      schema: {
        params: Type.Object({
          userId: Type.String(),
        }),
        response: {
          200: Type.Array(
            Type.Object({
              sender: Type.Object({
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
          sender: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        where: {
          receiverId: request.params.userId,
        },
      });
    },
  );

  app.delete(
    "/users/:userId/received-friend-requests/:senderId",
    {
      schema: {
        params: Type.Object({
          userId: Type.String(),
          senderId: Type.String(),
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
        if (request.query.accept) {
          await db.user.update({
            data: {
              friends: {
                connect: {
                  id: request.params.senderId,
                },
              },
            },
            where: {
              id: request.params.userId,
            },
          });
          await db.user.update({
            data: {
              friends: {
                connect: {
                  id: request.params.userId,
                },
              },
            },
            where: {
              id: request.params.senderId,
            },
          });
        }
        await db.friendRequest.delete({
          where: {
            senderId_receiverId: {
              senderId: request.params.senderId,
              receiverId: request.params.userId,
            },
          },
        });
      });
    },
  );
}
