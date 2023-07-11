import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { AppBar } from "../components/AppBar";
import { trpc } from "../trpc";

export function FriendRequestsRoute() {
  return (
    <>
      <AppBar>
        <AppBar.Title>Friends list</AppBar.Title>
      </AppBar>
      <FriendRequestList />
    </>
  );
}

function FriendRequestList() {
  const friendRequestListQuery = trpc.friendRequest.list.useQuery();

  return (
    <ul className="flex flex-col divide-y divide-gray-300 p-4">
      {friendRequestListQuery.data?.map((friendRequest) => (
        <FriendRequestListItem
          friendRequest={friendRequest}
          key={friendRequest.id}
        />
      ))}
    </ul>
  );
}

function FriendRequestListItem(props: {
  friendRequest: {
    id: string;
    sender: { username: string; id: string };
    receiver: { username: string; id: string };
  };
}) {
  const isReceived =
    props.friendRequest.receiver.id === localStorage.getItem("userId");
  const acceptFriendRequestMutation = trpc.friendRequest.accept.useMutation();
  const deleteFriendRequestMutation = trpc.friendRequest.delete.useMutation();

  return (
    <li className="flex items-center gap-2 py-2">
      <p className="grow font-medium">
        {isReceived
          ? props.friendRequest.sender.username
          : props.friendRequest.receiver.username}
      </p>
      {isReceived && (
        <button
          className="grid h-12 w-12 place-items-center rounded-full bg-gray-300"
          onClick={() =>
            acceptFriendRequestMutation.mutate({ id: props.friendRequest.id })
          }
        >
          <CheckIcon className="h-5 w-5" />
        </button>
      )}
      <button
        className="grid h-12 w-12 place-items-center rounded-full bg-gray-300"
        onClick={() =>
          deleteFriendRequestMutation.mutate({ id: props.friendRequest.id })
        }
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </li>
  );
}
