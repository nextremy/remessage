import { useSession } from "../../hooks/use-session";
import { trpc } from "../../trpc";

export function useStreamData() {
  const session = useSession();
  const context = trpc.useContext();
  trpc.message.stream.useSubscription(
    { userId: session.userId },
    {
      onData: (newMessage) => {
        context.chat.list.setData({ userId: session.userId }, (chats) => {
          if (!chats) return;
          const newMessageChat = chats.find(
            (chat) => chat.id === newMessage.chatId,
          );
          if (!newMessageChat) return;
          return [
            newMessageChat,
            ...chats.filter((chat) => chat.id !== newMessage.chatId),
          ];
        });
        context.message.list.setData(
          { chatId: newMessage.chatId, limit: 50 },
          (messages) => {
            if (!messages) return [newMessage];
            if (
              messages.some((oldMessage) => oldMessage.id === newMessage.id)
            ) {
              return messages;
            }
            return [...messages, newMessage].sort((message1, message2) => {
              if (message1.timestamp < message2.timestamp) return -1;
              if (message1.timestamp > message2.timestamp) return 1;
              return 0;
            });
          },
        );
      },
    },
  );
}
