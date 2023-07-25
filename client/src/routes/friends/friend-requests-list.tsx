import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useSession } from "../../hooks/session";
import { trpc } from "../../trpc";

export function FriendRequestsList() {
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
