import { useSession } from "../../hooks/use-session";
import { trpc } from "../../trpc";
import { ChatButton } from "./chat-button";
import { RemoveButton } from "./remove-button";

export function AllFriendsRoute() {
  const { userId } = useSession();
  const { data: friends } = trpc.friend.list.useQuery({ userId });

  if (!friends) return null;
  return (
    <div className="grow">
      <div className="flex h-16 items-center px-4">
        <h3 className="text-lg font-semibold">All friends</h3>
      </div>
      <nav>
        <ul className="flex flex-col gap-2 px-4">
          {friends.map((friend) => (
            <li
              className="flex items-center justify-between font-medium"
              key={friend.id}
            >
              {friend.username}
              <div className="flex gap-2">
                <ChatButton friendId={friend.id} />
                <RemoveButton friend={friend} />
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
