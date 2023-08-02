import { ChatBubbleLeftIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { useSession } from "../../hooks/use-session";
import { trpc } from "../../trpc";

export function ChatButton(props: { friendId: string }) {
  const session = useSession();
  const { data: chat } = trpc.directChat.get.useQuery({
    userIds: [session.userId, props.friendId],
  });

  if (!chat) return null;
  return (
    <Link
      className="grid h-12 w-12 place-items-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
      to={`/chats/direct/${chat.id}`}
    >
      <ChatBubbleLeftIcon className="h-5 w-5" />
    </Link>
  );
}
