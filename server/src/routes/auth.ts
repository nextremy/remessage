import { Type } from "@fastify/type-provider-typebox";
import { verify } from "argon2";
import { randomBytes } from "crypto";
import { db } from "../database/client";
import { AppInstance } from "../types/app-instance";

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
        where: {
          username: request.body.username,
        },
      });
      app.assert(user);
      app.assert(verify(user.passwordHash, request.body.password));
      const sessionId = randomBytes(16).toString("hex");
      const expires = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
      const session = await db.session.create({
        data: {
          id: sessionId,
          expires,
          userId: user.id,
        },
      });
      reply.setCookie("sessionId", session.id, {
        expires,
      });
    },
  );

  app.post("/logout", async (request, reply) => {
    app.assert(request.cookies.sessionId !== undefined);
    await db.session.delete({
      where: {
        id: request.cookies.sessionId,
      },
    });
    reply.clearCookie("sessionId");
  });
}
