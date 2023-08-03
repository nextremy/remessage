import { UserPlusIcon } from "@heroicons/react/20/solid";
import { useId, useState } from "react";
import { Button } from "../../components/button";
import { Dialog } from "../../components/dialog";
import { useSession } from "../../hooks/use-session";
import { trpc } from "../../trpc";

export function AddFriendButton() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const friendUsernameInputId = useId();
  const [friendUsername, setFriendUsername] = useState("");
  const session = useSession();
  const { mutate: sendFriendRequest } = trpc.friendRequest.create.useMutation();

  return (
    <>
      <Button
        className="mx-2"
        intent="secondary"
        onClick={() => setDialogOpen(true)}
      >
        <UserPlusIcon className="h-5 w-5" /> Add friend
      </Button>
      <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen}>
        <Dialog.Title>Add friend</Dialog.Title>
        <Dialog.Description>
          You can add another user as a friend by their username.
        </Dialog.Description>
        <form
          className="mt-4 flex flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            sendFriendRequest({
              senderId: session.userId,
              receiverUsername: friendUsername,
            });
            setFriendUsername("");
          }}
        >
          <label
            className="text-sm font-semibold tracking-wide"
            htmlFor={friendUsernameInputId}
          >
            Friend{"'"}s username
          </label>
          <input
            className="mt-1 h-12 rounded-md bg-gray-300 px-4"
            id={friendUsernameInputId}
            onChange={(event) => setFriendUsername(event.target.value)}
            type="text"
            value={friendUsername}
          />
          <Button className="mt-2" intent="primary" type="submit">
            Send friend request
          </Button>
        </form>
      </Dialog>
    </>
  );
}
