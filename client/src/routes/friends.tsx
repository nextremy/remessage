import { Tab } from "@headlessui/react";
import {
  ChatBubbleLeftIcon,
  CheckIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { FormEvent, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AppBar } from "../components/AppBar";
import { Dialog } from "../components/Dialog";
import { useSession } from "../hooks/session";
import { trpc } from "../trpc";

export function Friends() {
  return (
    <Tab.Group>
      <AppBar>
        <AppBar.Title>
          <div className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            Friends
          </div>
        </AppBar.Title>
        <Tab.List className="ml-4 flex h-8 gap-2 border-l-2 border-gray-300 pl-4">
          <Tab className="ui-selected:bg-gray-200 ui-selected:text-gray-900 rounded-md px-4 font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900">
            All
          </Tab>
          <Tab className="ui-selected:bg-gray-200 ui-selected:text-gray-900 rounded-md px-4 font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900">
            Pending
          </Tab>
          <Tab className="ui-selected:bg-gray-200 ui-selected:text-gray-900 rounded-md px-4 font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900">
            Add friend
          </Tab>
        </Tab.List>
      </AppBar>
      <Tab.Panels>
        <Tab.Panel>
          <FriendsList />
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

function FriendsList() {
  const { data: friends } = trpc.friend.list.useQuery();

  return (
    <ul className="flex flex-col divide-y divide-gray-300 px-4">
      {friends?.map((friend) => (
        <li
          className="flex h-16 items-center justify-between font-medium"
          key={friend.id}
        >
          {friend.username}
          <div className="flex gap-2">
            <MessageFriendButton friend={friend} />
            <RemoveFriendButton friend={friend} />
          </div>
        </li>
      ))}
    </ul>
  );
}

type Friend = { id: string; username: string };

function MessageFriendButton(props: { friend: Friend }) {
  return (
    <Link
      className="grid h-10 w-10 place-items-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
      to={`/direct-chats/${props.friend.id}`}
    >
      <ChatBubbleLeftIcon className="h-5 w-5" />
    </Link>
  );
}

function RemoveFriendButton(props: { friend: Friend }) {
  const userId = localStorage.getItem("userId");
  const trpcContext = trpc.useContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { mutate: deleteFriend } = trpc.friend.delete.useMutation({
    onSuccess: async () => {
      await trpcContext.friend.list.invalidate();
      setDialogOpen(false);
    },
  });

  if (userId === null) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <button
        className="grid h-10 w-10 place-items-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
        onClick={() => setDialogOpen(true)}
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
      <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen}>
        <Dialog.Title>Remove friend</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to remove{" "}
          <span className="font-semibold">{props.friend.username}</span> as a
          friend?
        </Dialog.Description>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="h-12 rounded-md px-4 hover:bg-gray-200"
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </button>
          <button
            className="h-12 rounded-md bg-blue-700 px-4 font-semibold text-gray-100 hover:bg-blue-600"
            onClick={() => deleteFriend({ userId, friendId: props.friend.id })}
          >
            Remove friend
          </button>
        </div>
      </Dialog>
    </>
  );
}

function FriendRequestsList() {
  const { data: friendRequests } = trpc.friendRequest.list.useQuery();

  return (
    <ul className="flex flex-col divide-y divide-gray-300 px-4">
      {friendRequests?.map((friendRequest) => (
        <FriendRequestListItem
          friendRequest={friendRequest}
          key={friendRequest.id}
        />
      ))}
    </ul>
  );
}

type FriendRequest = {
  id: string;
  sender: {
    username: string;
    id: string;
  };
  receiver: {
    username: string;
    id: string;
  };
};

function FriendRequestListItem(props: { friendRequest: FriendRequest }) {
  const session = useSession();
  const trpcContext = trpc.useContext();
  const { mutate: acceptFriendRequest } = trpc.friendRequest.accept.useMutation(
    {
      onSuccess: () => {
        void trpcContext.friend.list.invalidate();
        void trpcContext.friendRequest.list.invalidate();
      },
    },
  );
  const { mutate: deleteFriendRequest } = trpc.friendRequest.delete.useMutation(
    {
      onSuccess: () => {
        void trpcContext.friendRequest.list.invalidate();
      },
    },
  );

  const isReceived = session.id === props.friendRequest.receiver.id;
  return (
    <li className="flex h-16 items-center justify-between">
      <div className="flex flex-col">
        <p className="font-medium">
          {isReceived
            ? props.friendRequest.sender.username
            : props.friendRequest.receiver.username}
        </p>
        <p className="text-sm text-gray-600">
          {isReceived ? "Incoming friend request" : "Outgoing friend request"}
        </p>
      </div>
      <div className="flex gap-2">
        {isReceived ? (
          <button
            className="grid h-10 w-10 place-items-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
            onClick={() => acceptFriendRequest({ id: props.friendRequest.id })}
          >
            <CheckIcon className="h-5 w-5" />
          </button>
        ) : null}
        <button
          className="grid h-10 w-10 place-items-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
          onClick={() => deleteFriendRequest({ id: props.friendRequest.id })}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </li>
  );
}

function AddFriend() {
  const [username, setUsername] = useState("");
  const { mutate: createFriendRequest } =
    trpc.friendRequest.create.useMutation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createFriendRequest({ receiverUsername: username });
    setUsername("");
  }

  return (
    <div className="p-4">
      <h2 className="font-bold">Add friend</h2>
      <p>You can add another user as a friend by their username.</p>
      <form className="mt-4 flex h-12 gap-2" onSubmit={handleSubmit}>
        <input
          className="grow rounded-md bg-gray-300 px-4 placeholder:text-gray-700"
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Friend's username"
          type="text"
          value={username}
        />
        <button
          className="rounded-md bg-blue-700 px-4 font-semibold text-gray-100 hover:bg-blue-600"
          type="submit"
        >
          Send friend request
        </button>
      </form>
    </div>
  );
}
