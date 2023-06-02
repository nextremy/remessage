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
            Type.Object({ id: Type.String(), username: Type.String() })
          ),
        },
      },
    },
    async (request) => {
      const userId = request.session.id;

      const friendships = await prisma.friendship.findMany({
        select: {
          friend1: { select: { id: true, username: true } },
          friend2: { select: { id: true, username: true } },
        },
        where: { OR: [{ friend1Id: userId, friend2Id: userId }] },
      });
      const friends = friendships.map((friendship) => {
        const { friend1, friend2 } = friendship;
        return friend1.id === userId ? friend2 : friend1;
      });

      return friends;
    }
  );

  fastify.post(
    "/remove-friend",
    { schema: { body: Type.Object({ friendId: Type.String() }) } },
    async (request) => {
      const userId = request.session.id!;
      const { friendId } = request.body;

      const [friend1Id, friend2Id] = [userId, friendId].sort();
      await prisma.friendship.delete({
        where: { friend1Id_friend2Id: { friend1Id, friend2Id } },
      });
    }
  );
}
