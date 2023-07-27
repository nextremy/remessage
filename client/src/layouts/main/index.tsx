import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "../../hooks/use-session";
import { trpc } from "../../trpc";
import { FriendsLink } from "./friends-link";
import { SettingsLink } from "./settings-link";
import { UserDisplay } from "./user-display";

export function MainLayout() {
  try {
    useSession();
  } catch (error) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen">
      <div className="flex w-80 flex-shrink-0 flex-col bg-gray-200">
        <FriendsLink />
        <ChatList />
        <div className="grow" />
        <div className="flex h-16 items-center justify-between px-4">
          <UserDisplay />
          <SettingsLink />
        </div>
      </div>
      <Outlet />
    </div>
  );
}

function ChatList() {
  const session = useSession();
  const { data: chats } = trpc.chat.list.useQuery({ userId: session.userId });

  if (!chats) return null;
  return (
    <div className="px-4">
      <h2 className="font-semibold">Chats</h2>
      <ul className="mt-1 flex flex-col gap-1">
        {chats.map((chat) => (
          <ChatLink chat={chat} key={chat.id}></ChatLink>
        ))}
      </ul>
    </div>
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

  const otherUser = props.chat.users.filter(
    (user) => user.id !== session.userId,
  )[0];
  return (
    <li>
      <Link
        className={`${
          pathname.startsWith(`/direct-chats/${props.chat.id}`)
            ? "bg-gray-300 text-gray-900"
            : "text-gray-700"
        } flex h-12 items-center rounded-md px-4 font-medium hover:bg-gray-300`}
        to={`/direct-chats/${props.chat.id}`}
      >
        {otherUser.username}
      </Link>
    </li>
  );
}
