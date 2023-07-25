import { useId, useState } from "react";
import { useSession } from "../../hooks/session";
import { trpc } from "../../trpc";

export function AddFriend() {
  const { userId } = useSession();
  const { mutate: createFriendRequest } = trpc.friendRequest.create.useMutation(
    { onSuccess: () => setFriendUsername("") },
  );
  const inputId = useId();
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
        htmlFor={inputId}
      >
        Friend{"'"}s username
      </label>
      <div className="mt-1 flex gap-2">
        <input
          className="h-12 grow rounded-md bg-gray-300 px-4"
          id={inputId}
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
