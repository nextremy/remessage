import { ChatBubbleLeftIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { useSession } from "../../hooks/session";
import { trpc } from "../../trpc";
import { RemoveFriendButton } from "./remove-friend-button";

export function AllFriendsList() {
  const { userId } = useSession();
  const { data: friends } = trpc.friend.list.useQuery({ userId });

  if (!friends) return null;
  return (
    <ul className="m-4">
      {friends.map((friend) => (
        <li
          className="flex h-12 items-center justify-between rounded-md px-4 font-medium"
          key={friend.id}
        >
          {friend.username}
          <div className="flex gap-2">
            <Link
              className="grid h-10 w-10 place-items-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
              to={`/direct-chats/${friend.id}`}
            >
              <ChatBubbleLeftIcon className="h-5 w-5" />
            </Link>
            <RemoveFriendButton friend={friend} />
          </div>
        </li>
      ))}
    </ul>
  );
}
