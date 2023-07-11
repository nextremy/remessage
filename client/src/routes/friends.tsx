import { Dialog } from "@headlessui/react";
import {
  ArrowsRightLeftIcon,
  ChatBubbleLeftIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { AppBar } from "../components/AppBar";
import { trpc } from "../trpc";

export function FriendsRoute() {
  return (
    <>
      <AppBar>
        <AppBar.Title>Friends</AppBar.Title>
      </AppBar>
      <div className="flex flex-col gap-2 py-2">
        <AddFriendButton />
        <FriendRequestsButton />
        <FriendsList />
      </div>
    </>
  );
}

function AddFriendButton() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [friendUsername, setFriendUsername] = useState("");
  const friendRequestCreateMutation = trpc.friendRequest.create.useMutation({
    onSuccess: () => setDialogOpen(false),
  });

  function sendFriendRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    friendRequestCreateMutation.mutate({ receiverUsername: friendUsername });
  }

  return (
    <>
      <button
        className="mx-2 flex h-12 items-center gap-2 rounded px-4 font-semibold text-gray-700 duration-200 hover:bg-gray-200"
        onClick={() => setDialogOpen(true)}
      >
        <UserPlusIcon className="h-5 w-5" />
        Add friend
      </button>
      <Dialog
        className="relative z-50"
        onClose={() => setDialogOpen(false)}
        open={dialogOpen}
      >
        <div className="fixed inset-0 bg-gray-950/50" />
        <div className="fixed inset-0 grid place-items-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded border border-gray-300 bg-gray-50 p-4">
            <Dialog.Title className="text-xl font-medium">
              Add friend
            </Dialog.Title>
            <Dialog.Description>
              Add a friend by their username.
            </Dialog.Description>
            <form className="flex flex-col" onSubmit={sendFriendRequest}>
              <label
                className="mt-4 text-sm font-semibold tracking-wide text-gray-700"
                htmlFor="Friend's username"
              >
                Friend{"'"}s username
              </label>
              <input
                className="mt-2 h-12 rounded bg-gray-300 px-4"
                name="Friend's username"
                onChange={(event) => setFriendUsername(event.target.value)}
                type="text"
              />
              <button
                className="mt-2 h-12 rounded bg-blue-700 font-bold text-gray-50 duration-200 hover:bg-blue-600 disabled:opacity-50"
                disabled={friendUsername === ""}
                type="submit"
              >
                Send friend request
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}

function FriendRequestsButton() {
  return (
    <Link
      className="mx-2 flex h-12 items-center gap-2 rounded px-4 font-semibold text-gray-700 duration-200 hover:bg-gray-200"
      to="/friends/requests"
    >
      <ArrowsRightLeftIcon className="h-5 w-5" />
      Friend requests
    </Link>
  );
}

function FriendsList() {
  const friendsListQuery = trpc.friend.list.useQuery();

  return (
    <ul className="flex flex-col divide-y divide-gray-300 px-4">
      {friendsListQuery.data?.map((friend) => (
        <li
          className="flex items-center justify-between p-2 font-medium"
          key={friend.id}
        >
          {friend.username}
          <div className="flex gap-2">
            <Link
              className="grid h-12 w-12 place-items-center rounded-full bg-gray-300 text-gray-700 duration-200 hover:bg-gray-400"
              to={`/chats/@${friend.id}`}
            >
              <ChatBubbleLeftIcon className="h-5 w-5" />
            </Link>
            <button className="grid h-12 w-12 place-items-center rounded-full bg-gray-300 text-gray-700 duration-200 hover:bg-gray-400">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
