import { Type } from "@sinclair/typebox";
import { FastifyInstanceTypebox } from "fastify";
import prisma from "../prisma/client";

export default function channelRoutes(fastify: FastifyInstanceTypebox) {
  fastify.post(
    "/channels",
    {
      schema: {
        body: Type.Object({
          type: Type.Literal("direct-message"),
          participantIds: Type.Array(Type.String(), {
            minItems: 2,
            maxItems: 2,
            uniqueItems: true,
          }),
        }),
      },
    },
    async (request) => {
      const userId = request.session.id!;
      const { type, participantIds } = request.body;

      fastify.assert(participantIds.includes(userId));

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
          text: Type.String({ maxLength: 2000 }),
        }),
      },
    },
    async (request) => {
      const senderId = request.session.id!;
      const { channelId } = request.params;
      const { text } = request.body;

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

        await prisma.message.create({
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
