import { useParams } from "react-router-dom";
import { useSession } from "../../hooks/session";
import { trpc } from "../../trpc";

export function MessageList() {
  const { userId } = useSession();
  const { directChatId } = useParams();
  const { data: messages } = trpc.directMessage.list.useQuery({
    userIds: [userId, directChatId!],
    limit: 50,
  });

  if (!messages) return null;
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
