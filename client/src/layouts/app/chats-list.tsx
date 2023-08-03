import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { Link, useLocation } from "react-router-dom";
import { useSession } from "../../hooks/use-session";
import { trpc } from "../../trpc";

export function ChatsList() {
  const session = useSession();
  const { data: chats } = trpc.chat.list.useQuery({ userId: session.userId });

  if (!chats) return null;
  return (
    <ul className="flex flex-col">
      {chats.map((chat) => (
        <ChatsListItem chat={chat} key={chat.id}></ChatsListItem>
      ))}
    </ul>
  );
}

function ChatsListItem(props: {
  chat: {
    id: string;
    type: string;
    lastNotificationTimestamp: string;
    users: { username: string; id: string }[];
  };
}) {
  const session = useSession()!;
  const { pathname } = useLocation();

  const user = props.chat.users.filter((user) => user.id !== session.userId)[0];
  const isCurrentChat = pathname.startsWith(`/chats/${props.chat.id}`);
  return (
    <li>
      <Link
        className={`flex h-16 items-center justify-between px-4 font-medium duration-150 hover:bg-gray-200 hover:text-gray-900 ${
          isCurrentChat ? "bg-gray-200 text-gray-900" : "text-gray-700"
        }`}
        to={`/chats/${props.chat.id}`}
      >
        {user.username}
        <ChevronRightIcon
          className={`h-6 w-6 ${isCurrentChat ? "" : "hidden"}`}
        />
      </Link>
    </li>
  );
}
