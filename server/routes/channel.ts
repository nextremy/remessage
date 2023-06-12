import { Type } from "@sinclair/typebox";
import { CustomFastifyInstance } from "fastify";
import prisma from "../prisma/client";

export default function channelRoutes(fastify: CustomFastifyInstance) {
  fastify.post(
    "/channels",
    {
      schema: {
        body: Type.Object({
          type: Type.Literal("direct"),
          participantIds: Type.Array(Type.String(), {
            minItems: 2,
            maxItems: 2,
            uniqueItems: true,
          }),
        }),
      },
    },
    async (request) => {
      const { id: sessionId } = request.session;
      const { type, participantIds } = request.body;
      fastify.assert(sessionId);
      fastify.assert(participantIds.includes(sessionId));

      await prisma.channel.create({
        data: {
          type,
          participants: {
            connect: participantIds.map((participantId) => ({
              id: participantId,
            })),
          },
        },
      });
    }
  );

  fastify.post(
    "/channels/:channelId/messages",
    {
      schema: {
        params: Type.Object({
          channelId: Type.String(),
        }),
        body: Type.Object({
          text: Type.String({
            maxLength: 2000,
          }),
          senderId: Type.String(),
        }),
      },
    },
    async (request) => {
      const { channelId } = request.params;
      const { text, senderId } = request.body;
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
        fastify.assert(channel?.participants.length === 1);

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
