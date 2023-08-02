import { ChatBubbleLeftIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog } from "../../components/dialog";
import { useSession } from "../../hooks/use-session";
import { trpc } from "../../trpc";

type Friend = { id: string; username: string };

export function FriendsList() {
  const { userId } = useSession();
  const { data: friends } = trpc.friend.list.useQuery({ userId });

  if (!friends) return null;
  return (
    <nav>
      <ul className="flex flex-col">
        {friends.map((friend) => (
          <li
            className="flex h-16 items-center justify-between px-4 font-medium"
            key={friend.id}
          >
            {friend.username}
            <div className="flex gap-2">
              <ChatButton friend={friend} />
              <RemoveButton friend={friend} />
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ChatButton(props: { friend: Friend }) {
  const session = useSession();
  const { data: chat } = trpc.directChat.get.useQuery({
    userIds: [session.userId, props.friend.id],
  });

  if (!chat) return null;
  return (
    <Link
      className="grid h-12 w-12 place-items-center rounded-full bg-gray-200 text-gray-600 duration-200 hover:bg-gray-300 hover:text-gray-900"
      title="Open chat"
      to={`/chats/${chat.id}`}
    >
      <ChatBubbleLeftIcon className="h-5 w-5" />
    </Link>
  );
}

function RemoveButton(props: { friend: Friend }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const context = trpc.useContext();
  const { mutate: deleteFriend } = trpc.friend.delete.useMutation({
    onSuccess: () => {
      setDialogOpen(false);
      void context.friend.list.invalidate();
    },
  });
  const session = useSession();

  return (
    <>
      <button
        className="grid h-12 w-12 place-items-center rounded-full bg-gray-200 text-gray-600 duration-200 hover:bg-gray-300 hover:text-gray-900"
        onClick={() => setDialogOpen(true)}
        title="Remove friend"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
      <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen}>
        <Dialog.Title>Remove friend</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to remove{" "}
          <span className="font-semibold">@{props.friend.username}</span> from
          your friends?
        </Dialog.Description>
        <Dialog.ActionArea>
          <button
            className="h-10 rounded-md px-4 font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900"
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </button>
          <button
            className="h-10 rounded-md bg-red-700 px-4 font-medium text-gray-100 hover:bg-red-800"
            onClick={() =>
              deleteFriend({
                userId: session.userId,
                friendId: props.friend.id,
              })
            }
          >
            Remove
          </button>
        </Dialog.ActionArea>
      </Dialog>
    </>
  );
}
