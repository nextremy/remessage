import { Type } from "@sinclair/typebox";
import { CustomFastifyInstance } from "fastify";
import prisma from "../prisma/client";

export default async function channelRoutes(fastify: CustomFastifyInstance) {
  fastify.post(
    "/create-channel",
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
}
