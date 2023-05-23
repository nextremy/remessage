import { Type } from "@sinclair/typebox";
import { scryptSync, timingSafeEqual } from "crypto";
import { FastifyInstanceTypebox } from "fastify";
import prisma from "../prisma/client";

export default async function authenticationRoutes(
  fastify: FastifyInstanceTypebox
) {
  fastify.post(
    "/login",
    {
      schema: {
        body: Type.Object({
          username: Type.String(),
          password: Type.String(),
        }),
      },
    },
    async (request) => {
      const user = await prisma.user.findUnique({
        where: {
          username: request.body.username,
        },
      });

      if (
        !user ||
        !timingSafeEqual(
          scryptSync(request.body.password, user.passwordSalt, 32),
          user.passwordHash
        )
      ) {
        throw fastify.httpErrors.unauthorized("Invalid username or password");
      }

      request.session.id = user.id;
    }
  );

  fastify.post("/logout", async (request) => {
    request.session.delete();
  });
}
