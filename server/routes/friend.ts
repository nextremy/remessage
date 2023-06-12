import { Type } from "@sinclair/typebox";
import { CustomFastifyInstance } from "fastify";
import prisma from "../prisma/client";

export default async function friendRoutes(fastify: CustomFastifyInstance) {
  fastify.get(
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
            })
          ),
        },
      },
    },
    async (request) => {
      const { userId } = request.params;
      fastify.assert(userId === request.session.id);

      const user = await prisma.user.findUnique({
        select: {
          friends: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        where: {
          id: userId,
        },
      });
      fastify.assert(user);

      return user.friends;
    }
  );

  fastify.delete(
    "/users/:userId/friends/:friendId",
    {
      schema: {
        params: Type.Object({
          userId: Type.String(),
          friendId: Type.String(),
        }),
      },
    },
    async (request) => {
      const { userId, friendId } = request.params;
      fastify.assert(userId === request.session.id);

      await prisma.$transaction([
        prisma.user.update({
          data: {
            friends: {
              delete: {
                id: friendId,
              },
            },
          },
          where: {
            id: userId,
          },
        }),
        prisma.user.update({
          data: {
            friends: {
              delete: {
                id: userId,
              },
            },
          },
          where: {
            id: friendId,
          },
        }),
      ]);
    }
  );
}
