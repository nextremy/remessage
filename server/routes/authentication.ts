import { Type } from "@sinclair/typebox";
import { scryptSync, timingSafeEqual } from "crypto";
import { FastifyInstanceTypebox } from "fastify";
import prisma from "../prisma/client";

export default async function authenticationRoutes(
  fastify: FastifyInstanceTypebox
) {
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
