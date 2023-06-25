import { FastifyRequest } from "fastify";
import { db } from "../database/client";

export async function getRequestSession(request: FastifyRequest) {
  if (!request.cookies.sessionId) {
    return null;
  }
  const session = await db.session.findUnique({
    where: {
      id: request.cookies.sessionId,
    },
  });
  return session;
}
