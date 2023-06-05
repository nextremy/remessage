import { Type } from "@sinclair/typebox";
import { FastifyInstanceTypebox } from "fastify";
import prisma from "../prisma/client";

export default async function friendshipRoutes(
  fastify: FastifyInstanceTypebox
) {
  fastify.get(
    "/friends",
    {
      schema: {
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
      const userId = request.session.id;

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

  fastify.post(
    "/remove-friend",
    {
      schema: {
        body: Type.Object({
          friendId: Type.String(),
        }),
      },
    },
    async (request) => {
      const userId = request.session.id!;
      const { friendId } = request.body;

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
