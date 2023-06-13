import { Type } from "@sinclair/typebox";
import { CustomFastifyInstance } from "fastify";
import prisma from "../prisma/client";

export default async function messageRoutes(fastify: CustomFastifyInstance) {
  fastify.get(
    "/messages",
    {
      schema: {
        querystring: Type.Object({
          channelId: Type.String(),
          limit: Type.Integer({
            default: 50,
            minimum: 1,
            maximum: 100,
          }),
        }),
        response: {
          200: Type.Array(
            Type.Object({
              id: Type.String(),
              timestamp: Type.Date(),
              text: Type.String(),
              senderId: Type.String(),
              channelId: Type.String(),
            })
          ),
        },
      },
    },
    async (request) => {
      const { id: sessionId } = request.session;
      const { channelId, limit } = request.query;

      const messages = await prisma.message.findMany({
        select: {
          id: true,
          timestamp: true,
          text: true,
          senderId: true,
          channelId: true,
        },
        where: {
          channel: {
            id: channelId,
            participants: {
              some: {
                id: sessionId,
              },
            },
          },
        },
        orderBy: {
          timestamp: "asc",
        },
        take: limit,
      });

      return messages;
    }
  );

  fastify.post(
    "/send-message",
    {
      schema: {
        body: Type.Object({
          text: Type.String({
            maxLength: 2000,
          }),
          senderId: Type.String(),
          channelId: Type.String(),
        }),
      },
    },
    async (request) => {
      const { text, senderId, channelId } = request.body;
      fastify.assert(senderId === request.session.id);

      await prisma.$transaction(async (tx) => {
        const channel = await tx.channel.findUnique({
          select: {
            participants: {
              where: {
                id: senderId,
              },
            },
          },
          where: {
            id: channelId,
          },
        });
        fastify.assert(channel);
        fastify.assert(channel.participants.length === 1);

        await tx.message.create({
          data: {
            text,
            senderId,
            channelId,
          },
        });
      });
    }
  );
}
