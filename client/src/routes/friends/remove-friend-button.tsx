import { XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { Dialog } from "../../components/dialog";
import { useSession } from "../../hooks/session";
import { trpc } from "../../trpc";

export function RemoveFriendButton(props: {
  friend: { id: string; username: string };
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const context = trpc.useContext();
  const { mutate: deleteFriend } = trpc.friend.delete.useMutation({
    onSuccess: async () => {
      setDialogOpen(false);
      await context.friend.list.invalidate();
    },
  });
  const { userId } = useSession();

  return (
    <>
      <button
        className="grid h-10 w-10 place-items-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
        onClick={() => setDialogOpen(true)}
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
      <Dialog
        description={
          <>
            Are you sure you want to remove{" "}
            <span className="font-semibold">@{props.friend.username}</span> from
            your friends?
          </>
        }
        onClose={() => setDialogOpen(false)}
        open={dialogOpen}
        title="Remove friend"
      >
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="h-10 rounded-md px-4 font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900"
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </button>
          <button
            className="h-10 rounded-md bg-red-700 px-4 font-medium text-gray-100 hover:bg-red-800"
            onClick={() => deleteFriend({ userId, friendId: props.friend.id })}
          >
            Remove
          </button>
        </div>
      </Dialog>
    </>
  );
}
