import { useParams } from "react-router-dom";
import { useSession } from "../../hooks/use-session";
import { trpc } from "../../trpc";

export function AppBar() {
  const { userId } = useSession();
  const { chatId } = useParams();
  const { data: chat } = trpc.chat.get.useQuery({ id: chatId! });

  if (!chat) return null;
  const otherUser = chat.users.filter((user) => user.id !== userId)[0];
  return (
    <div className="flex h-12 flex-shrink-0 items-center border-b-2 border-gray-200 px-4">
      <h1 className="font-semibold">{otherUser.username}</h1>
    </div>
  );
}
