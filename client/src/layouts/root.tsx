import { Dialog, Tab } from "@headlessui/react";
import { ArrowsRightLeftIcon, UserPlusIcon } from "@heroicons/react/20/solid";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { FormEvent, useState } from "react";
import { trpc } from "../trpc";

export function RootLayout() {
  return (
    <div className="flex h-screen flex-col">
      <Profile />
      <Tab.Group>
        <Tab.List className="grid h-12 auto-cols-fr grid-flow-col border-b-2 border-gray-200">
          <Tab className="flex justify-center">
            <div className="ui-selected:border-blue-700 ui-selected:text-blue-700 flex h-full items-center gap-2 border-b-2 border-transparent text-lg font-medium text-gray-700">
              Chats
            </div>
          </Tab>
          <Tab className="flex justify-center">
            <div className="ui-selected:border-blue-700 ui-selected:text-blue-700 flex h-full items-center gap-2 border-b-2 border-transparent text-lg font-medium text-gray-700">
              Friends
            </div>
          </Tab>
        </Tab.List>
        <Tab.Panels className="grow">
          <Tab.Panel></Tab.Panel>
          <Tab.Panel className="flex flex-col">
            <AddFriendButton />
            <FriendRequestsButton />
            <FriendsList />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

function Profile() {
  const userGetQuery = trpc.user.get.useQuery(
    { userId: localStorage.getItem("userId") ?? "" },
    { enabled: localStorage.getItem("userId") !== undefined },
  );

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="h-8 w-8 rounded-full bg-blue-500" />
      <p className="text-lg font-medium">
        {userGetQuery.data ? userGetQuery.data.username : null}
      </p>
    </div>
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
        className="m-2 flex h-12 items-center gap-2 rounded px-4 font-semibold text-gray-700 shadow"
        onClick={() => setDialogOpen(true)}
      >
        <UserPlusIcon className="h-5 w-5" onClick={() => setDialogOpen(true)} />
        Add friend
      </button>
      <Dialog
        className="relative z-50"
        onClose={() => setDialogOpen(false)}
        open={dialogOpen}
      >
        <div className="fixed inset-0 bg-gray-950/50" />
        <div className="fixed inset-0 grid place-items-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded bg-gray-50 p-4">
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
                className="mt-2 h-12 rounded bg-gray-200 px-4"
                name="Friend's username"
                onChange={(event) => setFriendUsername(event.target.value)}
                type="text"
              />
              <button
                className="mt-2 h-12 rounded bg-blue-700 font-bold text-gray-50"
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const friendRequestListQuery = trpc.friendRequest.list.useQuery();
  const friendRequestAcceptMutation = trpc.friendRequest.accept.useMutation();
  const friendRequestDeleteMutation = trpc.friendRequest.delete.useMutation();

  return (
    <>
      <button
        className="m-2 flex h-12 items-center gap-2 rounded px-4 font-semibold text-gray-700 shadow"
        onClick={() => setDialogOpen(true)}
      >
        <ArrowsRightLeftIcon className="h-5 w-5" />
        Friend requests
      </button>
      <Dialog
        className="relative z-50"
        onClose={() => setDialogOpen(false)}
        open={dialogOpen}
      >
        <div className="fixed inset-0 bg-gray-950/50" />
        <div className="fixed inset-0 grid place-items-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded bg-gray-50 p-4">
            <Dialog.Title className="text-xl font-medium">
              Friend requests
            </Dialog.Title>
            {friendRequestListQuery.data ? (
              <ul className="mt-4 flex flex-col gap-2">
                {friendRequestListQuery.data.length === 0 ? (
                  <p>No pending friend requests.</p>
                ) : null}
                {friendRequestListQuery.data.map((friendRequest) => (
                  <li key={friendRequest.id}>
                    {(() => {
                      const isSent = "receiver" in friendRequest;
                      const username = isSent
                        ? friendRequest.receiver.username
                        : friendRequest.sender.username;
                      return (
                        <div className="flex items-center justify-between font-medium">
                          {username}
                          <div className="flex gap-2">
                            {isSent ? null : (
                              <button
                                className="grid h-12 w-12 place-items-center rounded-full bg-gray-200 text-gray-700"
                                onClick={() =>
                                  friendRequestAcceptMutation.mutate({
                                    id: friendRequest.id,
                                  })
                                }
                              >
                                <CheckIcon className="h-6 w-6" />
                              </button>
                            )}
                            <button
                              className="grid h-12 w-12 place-items-center rounded-full bg-gray-200 text-gray-700"
                              onClick={() =>
                                friendRequestDeleteMutation.mutate({
                                  id: friendRequest.id,
                                })
                              }
                            >
                              <XMarkIcon className="h-6 w-6" />
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </li>
                ))}
              </ul>
            ) : null}
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}

function FriendsList() {
  const friendsListQuery = trpc.friend.list.useQuery();

  if (!friendsListQuery.data) return null;
  return <></>;
}
