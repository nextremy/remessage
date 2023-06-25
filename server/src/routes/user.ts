import { Type } from "@fastify/type-provider-typebox";
import { hash } from "argon2";
import { db } from "../database/client";
import { AppInstance } from "../types/AppInstance";

export default async function (app: AppInstance) {
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
    async (request) => {
      const { username } = request.body;

      const passwordHash = await hash(request.body.password);
      await db.user.create({
        data: {
          username,
          passwordHash,
        },
      });
    },
  );

  app.get(
    "/users/:userId",
    {
      schema: {
        params: Type.Object({
          userId: Type.String(),
        }),
        response: {
          200: Type.Object({
            id: Type.String(),
            username: Type.String(),
          }),
        },
      },
    },
    async (request) => {
      const { userId } = request.params;

      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
      });
      app.assert(user);

      return {
        id: user.id,
        username: user.username,
      };
    },
  );

  app.get(
    "/users/:userId/friends",
    {
      schema: {
        params: Type.Object({
          userId: Type.String(),
        }),
        response: {
          200: Type.Array(
            Type.Object({
              id: Type.String(),
              username: Type.String(),
            }),
          ),
        },
      },
    },
    async (request) => {
      const { userId } = request.params;

      const user = await db.user.findUnique({
        include: {
          friends: true,
        },
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw {
          statusCode: 400,
        };
      }

      return user.friends.map((friend) => ({
        id: friend.id,
        username: friend.username,
      }));
    },
  );

  app.delete(
    "/users/:userId/friends/:friendId",
    {
      schema: {
        params: Type.Object({
          userId: Type.String(),
          friendId: Type.String(),
        }),
      },
    },
    async (request) => {
      const { userId, friendId } = request.params;

      await db.user.update({
        data: {
          friends: {
            delete: {
              id: friendId,
            },
          },
        },
        where: {
          id: userId,
        },
      });
    },
  );
}
