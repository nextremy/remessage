import { Type } from "@sinclair/typebox";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { FastifyInstanceTypebox } from "fastify";
import prisma from "../prisma/client";

export default async function authenticationRoutes(
  fastify: FastifyInstanceTypebox
) {
  fastify.post(
    "/sign-up",
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

  fastify.post(
    "/sign-in",
    {
      schema: {
        body: Type.Object({
          username: Type.String(),
          password: Type.String(),
        }),
      },
    },
    async (request) => {
      const { username, password } = request.body;

      const user = await prisma.user.findUnique({ where: { username } });

      if (!user) throw fastify.httpErrors.badRequest();
      const passwordHash = scryptSync(password, user.passwordSalt, 32);
      const passwordMatches = timingSafeEqual(passwordHash, user.passwordHash);
      if (!passwordMatches) throw fastify.httpErrors.badRequest();

      request.session.username = user.username;
    }
  );

  fastify.delete("/sign-out", async (request) => {
    request.session.delete();
  });
}
