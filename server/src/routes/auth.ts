import { Type } from "@fastify/type-provider-typebox";
import { verify } from "argon2";
import { randomBytes } from "crypto";
import { db } from "../database/client";
import { AppInstance } from "../types/AppInstance";

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
          sessionId: true,
        },
        where: {
          username: request.body.username,
        },
      });

      app.assert(user);
      app.assert(verify(user.passwordHash, request.body.password));

      let sessionId = user.sessionId;
      if (sessionId === null) {
        sessionId = randomBytes(32).toString("hex");
        await db.user.update({
          data: {
            sessionId,
          },
          where: {
            id: user.id,
          },
        });
      }
      return reply.setCookie("sessionId", sessionId).send();
    },
  );
}
