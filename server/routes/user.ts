import { Type } from "@sinclair/typebox";
import { randomBytes, scryptSync } from "crypto";
import { FastifyInstanceTypebox } from "fastify";
import prisma from "../prisma/client";

export default async function userRoutes(fastify: FastifyInstanceTypebox) {
  fastify.get(
    "/users/:username",
    {
      schema: {
        params: Type.Object({ username: Type.String() }),
        response: { 200: Type.Object({ username: Type.String() }) },
      },
    },
    async (request) => {
      const { username } = request.params;

      const user = await prisma.user.findUnique({
        where: { username },
        select: { username: true },
      });

      if (!user) throw fastify.httpErrors.badRequest();

      return user;
    }
  );

  fastify.post(
    "/users",
    {
      schema: {
        body: Type.Object({
          username: Type.String({
            minLength: 1,
            maxLength: 32,
            pattern: "^[A-Za-z0-9_]*$",
          }),
          password: Type.String(),
        }),
      },
    },
    async (request) => {
      const { username, password } = request.body;

      const passwordSalt = randomBytes(32);
      const passwordHash = scryptSync(password, passwordSalt, 32);
      await prisma.user.create({
        data: {
          username,
          passwordHash,
          passwordSalt,
        },
      });
    }
  );
}
