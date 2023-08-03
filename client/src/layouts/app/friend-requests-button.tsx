import {
  ArrowsRightLeftIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";
import { Button } from "../../components/button";
import { Dialog } from "../../components/dialog";
import { useSession } from "../../hooks/use-session";
import { trpc } from "../../trpc";

export function FriendRequestsButton() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        className="mx-2"
        intent="secondary"
        onClick={() => setDialogOpen(true)}
      >
        <ArrowsRightLeftIcon className="h-5 w-5" /> Friend requests
      </Button>
      <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen}>
        <Dialog.Title>Friend requests</Dialog.Title>
        <FriendRequestsList />
      </Dialog>
    </>
  );
}

function FriendRequestsList() {
  const session = useSession();
  const { data: friendRequests } = trpc.friendRequest.list.useQuery({
    userId: session.userId,
  });

  if (friendRequests?.length === 0) {
    return <p className="p-8 text-center">No friend requests.</p>;
  }
  return (
    <ul className="mt-4">
      {friendRequests?.map((friendRequest) => (
        <FriendRequestsListItem
          friendRequest={friendRequest}
          key={friendRequest.id}
        />
      ))}
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
  const session = useSession()!;
  const context = trpc.useContext();
  const { mutate: acceptFriendRequest } = trpc.friendRequest.accept.useMutation(
    {
      onSuccess: () => {
        void context.friend.list.invalidate();
        void context.friendRequest.list.invalidate();
      },
    },
  );
  const { mutate: removeFriendRequest } = trpc.friendRequest.delete.useMutation(
    { onSuccess: () => void context.friendRequest.list.invalidate() },
  );

  const isOutgoing = props.friendRequest.sender.id === session.userId;
  return (
    <li className="flex items-center justify-between">
      <div>
        <p className="font-medium">
          {isOutgoing
            ? props.friendRequest.receiver.username
            : props.friendRequest.sender.username}
        </p>
        <p className="text-sm tracking-wide">
          {isOutgoing ? "Outgoing friend request" : "Incoming friend request"}
        </p>
      </div>
      <div className="flex gap-2">
        {isOutgoing ? null : (
          <button
            className="grid h-12 w-12 place-items-center rounded-full bg-gray-200 text-gray-600 duration-200 hover:bg-gray-300 hover:text-gray-900"
            onClick={() => acceptFriendRequest({ id: props.friendRequest.id })}
          >
            <CheckIcon className="h-5 w-5" />
          </button>
        )}
        <button
          className="grid h-12 w-12 place-items-center rounded-full bg-gray-200 text-gray-600 duration-200 hover:bg-gray-300 hover:text-gray-900"
          onClick={() => removeFriendRequest({ id: props.friendRequest.id })}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </li>
  );
}
