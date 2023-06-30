import { ChatBubbleLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { AppBar } from "../components/AppBar";
import { BottomNavigation } from "../components/BottomNavigation";
import { trpc } from "../trpc";

export function FriendsRoute() {
  return (
    <div className="flex h-screen flex-col">
      <AppBar title="Friends" />
      <FriendsList />
      <BottomNavigation destination="friends" />
    </div>
  );
}

function FriendsList() {
  const navigate = useNavigate();
  const friendListQuery = trpc.friend.list.useQuery();
  const chatCreateMutation = trpc.chat.create.useMutation({
    onSuccess: (chat) => navigate(`/home/${chat.id}`),
  });

  if (!friendListQuery.data) return null;
  return (
    <ul className="grow p-4">
      {friendListQuery.data.map((friend) => (
        <li className="flex h-12 items-center justify-between" key={friend.id}>
          <span className="font-medium">{friend.username}</span>
          <button
            className="grid h-10 w-10 place-items-center rounded bg-zinc-800"
            onClick={() =>
              chatCreateMutation.mutate({
                participants: [{ userId: friend.id }],
              })
            }
          >
            <ChatBubbleLeftIcon className="h-5 w-5 text-zinc-300" />
          </button>
        </li>
      ))}
    </ul>
  );
}
