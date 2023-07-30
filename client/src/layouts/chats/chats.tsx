import { useSession } from "../../hooks/use-session";
import { trpc } from "../../trpc";
import { Chat } from "./chat";

export function Chats() {
  const session = useSession();
  const { data: chats } = trpc.chat.list.useQuery({ userId: session.userId });

  if (!chats) return null;
  return (
    <ul>
      {chats.map((chat) => (
        <Chat chat={chat} key={chat.id}></Chat>
      ))}
    </ul>
  );
}
