"use client";

import { Dialog } from "@/components/dialog";
import { useSession } from "@/hooks/use-session";
import { trpc } from "@/trpc";
import { UserPlusIcon } from "@heroicons/react/20/solid";
import { useId, useState } from "react";

export function AddFriendButton() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const friendUsernameInputId = useId();
  const [friendUsername, setFriendUsername] = useState("");
  const session = useSession();
  const { mutate: sendFriendRequest } = trpc.friendRequest.create.useMutation();

  return (
    <>
      <button
        className="flex h-14 w-full items-center gap-2 rounded-md bg-gray-200 px-4 font-semibold text-gray-700 duration-200 hover:brightness-95"
        onClick={() => setDialogOpen(true)}
      >
        <UserPlusIcon className="h-5 w-5" />
        Add friend
      </button>
      <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen}>
        <Dialog.Title>Add friend</Dialog.Title>
        <Dialog.Description>
          You can add another user as a friend by their username.
        </Dialog.Description>
        <form
          className="mt-4 flex flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            if (!session) return;
            sendFriendRequest({
              senderId: session.userId,
              receiverUsername: friendUsername,
            });
            setFriendUsername("");
          }}
        >
          <label
            htmlFor={friendUsernameInputId}
            className="text-sm font-semibold tracking-wide"
          >
            Friend{"'"}s username
          </label>
          <input
            value={friendUsername}
            onChange={(event) => setFriendUsername(event.target.value)}
            className="mt-1 h-12 rounded-md bg-gray-300 px-4"
            id={friendUsernameInputId}
            type="text"
          />
          <button
            type="submit"
            className="mt-2 h-14 rounded-md bg-blue-700 font-bold text-gray-100 duration-200 hover:brightness-95"
          >
            Send friend request
          </button>
        </form>
      </Dialog>
    </>
  );
}
