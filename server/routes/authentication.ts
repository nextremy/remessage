import { Type } from "@sinclair/typebox";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { CustomFastifyInstance } from "fastify";
import prisma from "../prisma/client";

export default async function authenticationRoutes(
  fastify: CustomFastifyInstance
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

      const user = await prisma.user.findUnique({
        select: {
          id: true,
          passwordHash: true,
          passwordSalt: true,
        },
        where: {
          username,
        },
      });
      fastify.assert(user);
      const passwordHash = scryptSync(password, user.passwordSalt, 32);
      const passwordMatches = timingSafeEqual(passwordHash, user.passwordHash);
      fastify.assert(passwordMatches);

      request.session.id = user.id;
    }
  );

  fastify.delete("/sign-out", async (request) => {
    request.session.delete();
  });
}
