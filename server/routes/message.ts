import { Type } from "@sinclair/typebox";
import { CustomFastifyInstance } from "fastify";
import prisma from "../prisma/client";

export default async function messageRoutes(fastify: CustomFastifyInstance) {
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
