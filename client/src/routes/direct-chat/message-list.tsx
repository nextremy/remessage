import { useParams } from "react-router-dom";
import { useSession } from "../../hooks/session";
import { trpc } from "../../trpc";

export function MessageList() {
  const { userId } = useSession();
  const { directChatId: otherUserId } = useParams();
  const { data: messages } = trpc.directMessage.list.useQuery({
    userIds: [userId, otherUserId!],
    limit: 50,
  });
  const { data: otherUser } = trpc.user.get.useQuery({ userId: otherUserId! });

  if (!messages) return null;
  if (!otherUser) return null;
  return (
    <ul className="flex grow flex-col justify-end">
      {messages.map((message) => (
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
