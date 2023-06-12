import { FastifyInstanceTypebox } from "fastify";

export default async function websocketRoutes(fastify: FastifyInstanceTypebox) {
  fastify.get("/websocket", { websocket: true }, (connection, request) => {
    const userId = request.session.id;
    if (userId === undefined) {
      connection.socket.close();
      throw new Error();
    }
  });
}
