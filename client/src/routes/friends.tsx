import { Tab } from "@headlessui/react";
import {
  ChatBubbleLeftIcon,
  CheckIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog } from "../components/dialog";
import { useSession } from "../hooks/use-session";
import { trpc } from "../trpc";

export function FriendsRoute() {
  return (
    <Tab.Group as="div" className="grow">
      <div className="flex h-12 items-center border-b-2 border-gray-200">
        <h1 className="flex items-center gap-2 px-4 font-semibold">
          <UsersIcon className="h-5 w-5" /> Friends
        </h1>
        <Tab.List className="flex items-center gap-2 border-l-2 border-gray-200 px-4">
          <Tab className="h-8 rounded-md px-4 font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 ui-selected:bg-gray-200 ui-selected:text-gray-900">
            All
          </Tab>
          <Tab className="h-8 rounded-md px-4 font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 ui-selected:bg-gray-200 ui-selected:text-gray-900">
            Pending
          </Tab>
          <Tab className="h-8 rounded-md px-4 font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 ui-selected:bg-gray-200 ui-selected:text-gray-900">
            Add friend
          </Tab>
        </Tab.List>
      </div>
      <Tab.Panels>
        <Tab.Panel>
          <AllFriendsList />
        </Tab.Panel>
        <Tab.Panel>
          <FriendRequestsList />
        </Tab.Panel>
        <Tab.Panel>
          <AddFriend />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}

function AllFriendsList() {
  const { userId } = useSession();
  const { data: friends } = trpc.friend.list.useQuery({ userId });

  if (!friends) return null;
  return (
    <ul className="m-4">
      {friends.map((friend) => (
        <li
          className="flex h-12 items-center justify-between px-4 font-medium"
          key={friend.id}
        >
          {friend.username}
          <div className="flex gap-2">
            <ChatFriendButton friendId={friend.id} />
            <RemoveFriendButton friend={friend} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function ChatFriendButton(props: { friendId: string }) {
  const { userId } = useSession();
  const { data: chat } = trpc.directChat.get.useQuery({
    userIds: [userId, props.friendId],
  });

  if (!chat) return null;
  return (
    <Link
      className="grid h-10 w-10 place-items-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
      to={`/direct-chats/${chat.id}`}
    >
      <ChatBubbleLeftIcon className="h-5 w-5" />
    </Link>
  );
}

function RemoveFriendButton(props: {
  friend: { id: string; username: string };
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const context = trpc.useContext();
  const { mutate: deleteFriend } = trpc.friend.delete.useMutation({
    onSuccess: async () => {
      setDialogOpen(false);
      await context.friend.list.invalidate();
    },
  });
  const { userId } = useSession();

  return (
    <>
      <button
        className="grid h-10 w-10 place-items-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
        onClick={() => setDialogOpen(true)}
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
      <Dialog
        description={
          <>
            Are you sure you want to remove{" "}
            <span className="font-semibold">@{props.friend.username}</span> from
            your friends?
          </>
        }
        onClose={() => setDialogOpen(false)}
        open={dialogOpen}
        title="Remove friend"
      >
        <div className="mt-8 flex justify-end gap-2">
          <button
            className="h-10 rounded-md px-4 font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900"
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </button>
          <button
            className="h-10 rounded-md bg-red-700 px-4 font-medium text-gray-100 hover:bg-red-800"
            onClick={() => deleteFriend({ userId, friendId: props.friend.id })}
          >
            Remove
          </button>
        </div>
      </Dialog>
    </>
  );
}

function FriendRequestsList() {
  const { userId } = useSession();
  const { data: friendRequests } = trpc.friendRequest.list.useQuery({ userId });
  const context = trpc.useContext();
  const { mutate: acceptFriendRequest } = trpc.friendRequest.accept.useMutation(
    { onSuccess: () => context.friendRequest.list.invalidate() },
  );
  const { mutate: deleteFriendRequest } = trpc.friendRequest.delete.useMutation(
    { onSuccess: () => context.friendRequest.list.invalidate() },
  );

  if (!friendRequests) return null;
  return (
    <ul className="m-4">
      {friendRequests.map((friendRequest) => (
        <li
          className="flex h-12 items-center justify-between px-4 font-medium"
          key={friendRequest.id}
        >
          {friendRequest.sender.id === userId
            ? friendRequest.receiver.username
            : friendRequest.sender.username}
          <div className="flex gap-2">
            {friendRequest.sender.id === userId ? null : (
              <button
                className="grid h-10 w-10 place-items-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
                onClick={() => acceptFriendRequest({ id: friendRequest.id })}
              >
                <CheckIcon className="h-5 w-5" />
              </button>
            )}
            <button
              className="grid h-10 w-10 place-items-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
              onClick={() => deleteFriendRequest({ id: friendRequest.id })}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function AddFriend() {
  const { userId } = useSession();
  const { mutate: createFriendRequest } = trpc.friendRequest.create.useMutation(
    { onSuccess: () => setFriendUsername("") },
  );
  const friendUsernameInputId = useId();
  const [friendUsername, setFriendUsername] = useState("");

  return (
    <form
      className="p-4"
      onSubmit={(event) => {
        event.preventDefault();
        createFriendRequest({
          senderId: userId,
          receiverUsername: friendUsername,
        });
      }}
    >
      <h2 className="font-bold">Add friend</h2>
      <p>You can add another user as a friend by their username.</p>
      <label
        className="mt-4 block text-sm font-medium tracking-wide"
        htmlFor={friendUsernameInputId}
      >
        Friend{"'"}s username
      </label>
      <div className="mt-1 flex gap-2">
        <input
          className="h-12 grow rounded-md bg-gray-300 px-4"
          id={friendUsernameInputId}
          onChange={(event) => setFriendUsername(event.target.value)}
          type="text"
          value={friendUsername}
        />
        <button
          className="h-12 rounded-md bg-blue-700 px-4 font-medium text-gray-100 hover:bg-blue-800"
          type="submit"
        >
          Send friend request
        </button>
      </div>
    </form>
  );
}
