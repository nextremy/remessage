import { SocketStream } from "@fastify/websocket";
import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { FastifyInstanceTypebox } from "fastify";
import prisma from "../prisma/client";

const MessageSchema = Type.Object({
  receiverId: Type.String(),
  textContent: Type.String({ maxLength: 2000 }),
});
const MessageTypeCheck = TypeCompiler.Compile(MessageSchema);

export default async function websocketRoutes(fastify: FastifyInstanceTypebox) {
  const clientsById = new Map<string, SocketStream>();

  fastify.get("/websocket", { websocket: true }, (connection, request) => {
    const userId = request.session.id;
    if (userId === undefined) {
      connection.socket.close();
      throw new Error();
    }

    connection.socket.on("open", () => {
      clientsById.set(userId, connection);
    });

    connection.socket.on("close", () => {
      clientsById.delete(userId);
    });

    connection.socket.on("message", async (message) => {
      const senderConnection = connection;
      const senderId = userId;
      const parsedMessage = JSON.parse(message.toString());
      if (!MessageTypeCheck.Check(parsedMessage)) return;
      const { receiverId, textContent } = parsedMessage;

      const sender = await prisma.user.findUnique({
        select: {
          friends: {
            where: {
              id: receiverId,
            },
          },
        },
        where: {
          id: senderId,
        },
      });
      const senderIsFriendOfReceiver = sender?.friends.length !== 1;
      if (!senderIsFriendOfReceiver) return;

      await prisma.directMessage.create({
        data: {
          senderId,
          receiverId,
        },
      });
      const receiverConnection = clientsById.get(receiverId);
      receiverConnection?.socket.send(textContent);
      senderConnection.socket.send(textContent);
    });
  });
}
