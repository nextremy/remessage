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
        select: { friend: { select: { id: true, username: true } } },
        where: { userId },
      });
      const friends = friendships.map((friendship) => friendship.friend);

      return friends;
    }
  );

  fastify.post(
    "/remove-friend",
    { schema: { body: Type.Object({ friendId: Type.String() }) } },
    async (request) => {
      const userId = request.session.id!;
      const { friendId } = request.body;

      await prisma.friendship.deleteMany({
        where: {
          OR: [
            { userId, friendId },
            { userId: friendId, friendId: userId },
          ],
        },
      });
    }
  );
}
