import { Tab } from "@headlessui/react";
import { ChatBubbleLeftIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AppBar } from "../components/AppBar";
import { Dialog } from "../components/Dialog";
import { trpc } from "../trpc";

export function Friends() {
  return (
    <Tab.Group>
      <AppBar>
        <AppBar.Title>Friends</AppBar.Title>
        <Tab.List className="ml-4 flex h-8 gap-2 border-l border-gray-300 pl-4">
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
      <Tab.Panels className="flex flex-col gap-2 py-2">
        <Tab.Panel>
          <FriendsList />
        </Tab.Panel>
        <Tab.Panel></Tab.Panel>
        <Tab.Panel></Tab.Panel>
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
          className="flex items-center justify-between p-2 font-medium"
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
      className="grid h-12 w-12 place-items-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
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
        className="grid h-12 w-12 place-items-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
        onClick={() => setDialogOpen(true)}
      >
        <XMarkIcon className="h-6 w-6" />
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
