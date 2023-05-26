import { Prisma } from "@prisma/client";
import { Type } from "@sinclair/typebox";
import { randomBytes, scryptSync } from "crypto";
import { FastifyInstanceTypebox } from "fastify";
import prisma from "../prisma/client";

export default async function userRoutes(fastify: FastifyInstanceTypebox) {
  fastify.get(
    "/users/:id",
    {
      schema: {
        params: Type.Object({
          id: Type.Number(),
        }),
        response: {
          "200": Type.Object({
            id: Type.Number(),
            username: Type.Optional(Type.String()),
          }),
        },
      },
    },
    async (request) => {
      const user = await prisma.user.findUnique({
        where: {
          id: request.params.id,
        },
        select: {
          id: true,
          username: true,
        },
      });

      if (!user) {
        throw fastify.httpErrors.notFound("User not found");
      }

      return {
        id: user.id,
        username:
          request.params.id === request.session.id ? user.username : undefined,
      };
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
      try {
        const passwordSalt = randomBytes(32);
        await prisma.user.create({
          data: {
            username: request.body.username,
            passwordHash: scryptSync(request.body.password, passwordSalt, 32),
            passwordSalt,
          },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          throw fastify.httpErrors.conflict("Username not available");
        }

        throw fastify.httpErrors.internalServerError();
      }
    }
  );
}
