"use client";

import { Dialog } from "@/components/dialog";
import { useSession } from "@/hooks/use-session";
import { trpc } from "@/trpc";
import {
  ArrowsRightLeftIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";

export function FriendRequestsButton() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <button
        className="flex h-14 w-full items-center gap-2 rounded-md bg-gray-200 px-4 font-semibold text-gray-700 duration-200 hover:brightness-95"
        onClick={() => setDialogOpen(true)}
      >
        <ArrowsRightLeftIcon className="h-5 w-5" /> Friend requests
      </button>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <div className="flex flex-col">
          <Dialog.Title>Friend requests</Dialog.Title>
          <FriendRequestsList />
          <div className="h-4" />
          <button
            className="h-12 rounded-md bg-gray-200 px-4 font-semibold duration-200 hover:brightness-95"
            onClick={() => setDialogOpen(false)}
          >
            Close
          </button>
        </div>
      </Dialog>
    </>
  );
}

function FriendRequestsList() {
  const session = useSession();
  const { data: friendRequests } = trpc.friendRequest.list.useQuery(
    { userId: session?.userId || "" },
    { enabled: session !== null },
  );

  if (friendRequests?.length === 0) {
    return (
      <p className="grid h-16 place-items-center">No pending friend requests</p>
    );
  }
  return (
    <ul>
      {friendRequests
        ? friendRequests.map((friendRequest) => (
            <FriendRequestsListItem
              friendRequest={friendRequest}
              key={friendRequest.id}
            />
          ))
        : null}
    </ul>
  );
}

function FriendRequestsListItem(props: {
  friendRequest: {
    id: string;
    sender: { username: string; id: string };
    receiver: { username: string; id: string };
  };
}) {
  const session = useSession();
  const context = trpc.useContext();
  const { mutate: acceptFriendRequest } = trpc.friendRequest.accept.useMutation(
    {
      onSuccess: () => {
        context.friend.list.invalidate();
        context.friendRequest.list.invalidate();
      },
    },
  );
  const { mutate: removeFriendRequest } = trpc.friendRequest.delete.useMutation(
    {
      onSuccess: () => context.friendRequest.list.invalidate(),
    },
  );

  const isOutgoing = session?.userId === props.friendRequest.sender.id;
  return (
    <li className="flex h-16 items-center justify-between">
      <div>
        <p className="font-medium">
          {isOutgoing
            ? props.friendRequest.receiver.username
            : props.friendRequest.sender.username}
        </p>
        <p className="text-sm font-light tracking-wide">
          {isOutgoing ? "Outgoing friend request" : "Incoming friend request"}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          className="grid h-12 w-12 place-items-center rounded-full bg-gray-200 text-gray-600 duration-200 hover:text-gray-900 hover:brightness-95"
          onClick={() => acceptFriendRequest({ id: props.friendRequest.id })}
        >
          <CheckIcon className="h-5 w-5" />
        </button>
        <button
          className="grid h-12 w-12 place-items-center rounded-full bg-gray-200 text-gray-600 duration-200 hover:text-gray-900 hover:brightness-95"
          onClick={() => removeFriendRequest({ id: props.friendRequest.id })}
          title="Remove"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </li>
  );
}
