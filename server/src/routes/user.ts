import { Type } from "@fastify/type-provider-typebox";
import { randomBytes, scryptSync } from "crypto";
import { AppInstance } from "../lib/app-instance";
import { db } from "../prisma/client";

export default async function (app: AppInstance) {
  app.get(
    "/users/:userId",
    {
      schema: {
        params: Type.Object({
          userId: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      const user = db.user.findUnique({
        select: {
          id: true,
          username: true,
        },
        where: {
          id: request.params.userId,
        },
      });

      if (!user) return reply.code(404).send();
      return reply.code(200).send(user);
    },
  );

  app.post(
    "/users",
    {
      schema: {
        body: Type.Object({
          username: Type.String({
            minLength: 1,
            maxLength: 16,
            pattern: "^[a-z0-9_]*$",
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

  app.post(
    "/users/:username/logins",
    {
      schema: {
        params: Type.Object({
          username: Type.String(),
        }),
        body: Type.Object({
          password: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      const user = await db.user.findUnique({
        select: {
          id: true,
          username: true,
          passwordHash: true,
          passwordSalt: true,
          sessionId: true,
        },
        where: {
          username: request.params.username,
        },
      });

      if (!user) return reply.code(400).send();

      if (user.sessionId === null) {
        const sessionId = randomBytes(32).toString("hex");
        await db.user.update({
          data: {
            sessionId,
          },
          where: {
            id: user.id,
          },
        });
        return reply.setCookie("sessionId", sessionId).send();
      }
      return reply.setCookie("sessionId", user.sessionId).send();
    },
  );
}
