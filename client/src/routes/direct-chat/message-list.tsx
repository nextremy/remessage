import { useParams } from "react-router-dom";
import { useSession } from "../../hooks/use-session";
import { trpc } from "../../trpc";

export function MessageList() {
  const { userId } = useSession();
  const { directChatId: otherUserId } = useParams();
  const { data: messages } = trpc.directMessage.list.useQuery({
    userIds: [userId, otherUserId!],
    limit: 50,
  });
  const context = trpc.useContext();
  trpc.directMessage.stream.useSubscription(
    { userIds: [userId, otherUserId!] },
    {
      onData: (newMessage) => {
        context.directMessage.list.setData(
          { userIds: [userId, otherUserId!], limit: 50 },
          (oldMessages) => {
            if (!oldMessages) return [newMessage];
            if (
              oldMessages.some((oldMessage) => oldMessage.id === newMessage.id)
            ) {
              return oldMessages;
            }
            return [...oldMessages, newMessage];
          },
        );
      },
    },
  );
  const { data: otherUser } = trpc.user.get.useQuery({ userId: otherUserId! });

  if (!messages) return null;
  if (!otherUser) return null;
  const sortedMessages = [...messages].sort((message1, message2) => {
    if (message1.timestamp < message2.timestamp) return -1;
    if (message1.timestamp > message2.timestamp) return 1;
    return 0;
  });
  return (
    <ul className="flex flex-col overflow-y-auto p-4">
      {sortedMessages.map((message) => (
        <li key={message.id}>
          <div className="flex items-center gap-2">
            <p className="font-medium">{message.sender.username}</p>
            <p className="text-xs">{message.timestamp}</p>
          </div>
          <p>{message.textContent}</p>
        </li>
      ))}
    </ul>
  );
}
