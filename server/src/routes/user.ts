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
}
