import { Type } from "@fastify/type-provider-typebox";
import { randomBytes, scryptSync } from "crypto";
import { CustomFastifyInstance } from "../lib/custom-fastify-instance";
import { db } from "../prisma/client";

export default async function userRoutes(server: CustomFastifyInstance) {
  server.post(
    "/users",
    {
      schema: {
        body: Type.Object({
          username: Type.String({
            minLength: 1,
            maxLength: 16,
            pattern: "^[A-Za-z0-9_]*$",
          }),
          password: Type.String({
            minLength: 8,
            maxLength: 256,
          }),
        }),
      },
    },
    async (request, reply) => {
      const passwordSalt = randomBytes(32);
      const passwordHash = scryptSync(request.body.password, passwordSalt, 32);
      await db.user.create({
        data: {
          username: request.body.username,
          passwordHash,
          passwordSalt,
        },
      });

      return reply.code(201).send();
    },
  );
}
