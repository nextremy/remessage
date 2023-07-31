import { Link, useLocation } from "react-router-dom";
import { useSession } from "../../hooks/use-session";

export function Chat(props: {
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
            ? "bg-gray-200 text-gray-900"
            : "text-gray-700"
        } flex h-16 items-center px-8 font-medium duration-150 hover:bg-gray-200 hover:text-gray-900`}
        to={`/chats/direct/${props.chat.id}`}
      >
        {user.username}
      </Link>
    </li>
  );
}
