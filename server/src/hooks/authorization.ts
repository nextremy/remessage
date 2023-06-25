import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../database/client";

export async function verifySessionIdMatchesUserId(
  request: FastifyRequest & {
    cookies: {
      sessionId?: string;
    };
    params: {
      userId: string;
    };
  },
  reply: FastifyReply,
) {
  if (request.cookies.sessionId === undefined) {
    return reply.code(401).send();
  }
  const session = await db.session.findUnique({
    where: {
      id: request.cookies.sessionId,
    },
  });
  if (session === null) {
    return reply.code(401).send();
  }
  if (session.userId !== request.params.userId) {
    return reply.code(403).send();
  }
}
