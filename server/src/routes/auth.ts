import { Type } from "@fastify/type-provider-typebox";
import { hash, verify } from "argon2";
import { db } from "../database/client";
import { AppInstance } from "../types/app-instance";

export default async function (app: AppInstance) {
  app.post(
    "/register",
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
    async (request) => {
      await db.user.create({
        data: {
          username: request.body.username,
          passwordHash: await hash(request.body.password),
        },
      });
    },
  );

  app.post(
    "/login",
    {
      schema: {
        body: Type.Object({
          username: Type.String(),
          password: Type.String(),
        }),
        response: {
          200: Type.Object({
            token: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const user = await db.user.findUnique({
        where: {
          username: request.body.username,
        },
      });
      if (!user || !(await verify(user.passwordHash, request.body.password))) {
        void reply.code(401);
        throw new Error();
      }
      return {
        token: app.jwt.sign({
          userId: user.id,
        }),
      };
    },
  );
}
