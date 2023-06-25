import { Type } from "@fastify/type-provider-typebox";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { AppInstance } from "../lib/app-instance";
import { db } from "../database/client";

export default async function (app: AppInstance) {
  app.post(
    "/login",
    {
      schema: {
        body: Type.Object({
          username: Type.String(),
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
        where: { username: request.body.username },
      });

      app.assert(user);
      const requestPasswordHash = scryptSync(
        request.body.password,
        user.passwordSalt,
        32,
      );
      const passwordHashesMatch = timingSafeEqual(
        requestPasswordHash,
        user.passwordHash,
      );
      app.assert(passwordHashesMatch);

      let sessionId = user.sessionId;
      if (sessionId === null) {
        sessionId = randomBytes(32).toString("hex");
        await db.user.update({
          data: { sessionId },
          where: { id: user.id },
        });
      }
      return reply.setCookie("sessionId", sessionId).send();
    },
  );
}
