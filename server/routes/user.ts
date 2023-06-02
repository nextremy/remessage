import { Type } from "@sinclair/typebox";
import { FastifyInstanceTypebox } from "fastify";
import prisma from "../prisma/client";

export default async function userRoutes(fastify: FastifyInstanceTypebox) {
  fastify.get(
    "/user",
    {
      schema: {
        querystring: Type.Object({ username: Type.String() }),
        response: { 200: Type.Object({ username: Type.String() }) },
      },
    },
    async (request) => {
      const { username } = request.query;

      const user = await prisma.user.findUnique({
        where: { username },
        select: { username: true },
      });

      if (!user) throw fastify.httpErrors.badRequest();

      return user;
    }
  );
}
