import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { trpc } from "../../trpc";

export function MessageList() {
  const { chatId } = useParams();
  const { data: messages } = trpc.message.list.useQuery({
    chatId: chatId!,
    limit: 50,
  });
  const context = trpc.useContext();
  trpc.message.stream.useSubscription(
    { chatId: chatId! },
    {
      onData: (newMessage) => {
        context.message.list.setData(
          { chatId: chatId!, limit: 50 },
          (oldMessages) => {
            if (!oldMessages) return [newMessage];
            if (
              oldMessages.some((oldMessage) => oldMessage.id === newMessage.id)
            ) {
              return oldMessages;
            }
            return [...oldMessages, newMessage].sort((message1, message2) => {
              if (message1.timestamp < message2.timestamp) return -1;
              if (message1.timestamp > message2.timestamp) return 1;
              return 0;
            });
          },
        );
      },
    },
  );
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollTargetRef.current?.scrollIntoView();
  }, [messages]);

  if (!messages) return null;
  return (
    <ul className="flex flex-col overflow-y-auto p-4">
      {messages.map((message) => (
        <li key={message.id}>
          <div className="flex items-center gap-2">
            <p className="font-medium">{message.sender.username}</p>
            <p className="text-xs">{message.timestamp}</p>
          </div>
          <p>{message.textContent}</p>
        </li>
      ))}
      <div ref={scrollTargetRef} />
    </ul>
  );
}
