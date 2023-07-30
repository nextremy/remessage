import { Link, Outlet, useLocation } from "react-router-dom";
import { useSession } from "../hooks/use-session";
import { trpc } from "../trpc";

export function ChatsLayout() {
  return (
    <>
      <div className="w-80 flex-shrink-0 bg-gray-200">
        <ChatList />
      </div>
      <Outlet />
    </>
  );
}

function ChatList() {
  const session = useSession();
  const { data: chats } = trpc.chat.list.useQuery({ userId: session.userId });

  if (!chats) return null;
  return (
    <>
      <h2 className="flex items-center p-4 text-xl font-semibold">Chats</h2>
      <ul>
        {chats.map((chat) => (
          <ChatLink chat={chat} key={chat.id}></ChatLink>
        ))}
      </ul>
    </>
  );
}

function ChatLink(props: {
  chat: {
    id: string;
    type: string;
    lastNotificationTimestamp: string;
    users: { username: string; id: string }[];
  };
}) {
  const session = useSession();
  const { pathname } = useLocation();

  const user = props.chat.users.filter((user) => user.id !== session.userId)[0];
  return (
    <li>
      <Link
        className={`${
          pathname.startsWith(`/chats/direct/${props.chat.id}`)
            ? "bg-gray-300 text-gray-900"
            : "text-gray-700"
        } flex h-16 items-center px-4 font-medium duration-150 hover:bg-gray-300 hover:text-gray-900`}
        to={`/chats/direct/${props.chat.id}`}
      >
        {user.username}
      </Link>
    </li>
  );
}
