import { Type } from "@sinclair/typebox";
import { CustomFastifyInstance } from "fastify";
import prisma from "../prisma/client";

export default async function userRoutes(fastify: CustomFastifyInstance) {
  fastify.get(
    "/user",
    {
      schema: {
        querystring: Type.Object({
          id: Type.String(),
        }),
        response: {
          200: Type.Object({
            id: Type.String(),
            username: Type.String(),
          }),
        },
      },
    },
    async (request) => {
      const { id } = request.query;

      const user = await prisma.user.findUnique({
        select: {
          id: true,
          username: true,
        },
        where: {
          id,
        },
      });
      fastify.assert(user);

      return user;
    }
  );
}
