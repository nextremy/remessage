"use client";

import { Dialog } from "@/components/dialog";
import { useSession } from "@/hooks/use-session";
import { trpc } from "@/trpc";
import { Tab } from "@headlessui/react";
import { ChatBubbleLeftIcon, UserPlusIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useId, useState } from "react";

export default function AppLayout(props: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex divide-x-2 divide-gray-200">
      <div
        className={`h-screen flex-shrink-0 grow md:max-w-sm ${
          pathname !== "/" ? "hidden md:block" : ""
        }`}
      >
        <Tab.Group>
          <Tab.List className="grid auto-cols-fr grid-flow-col">
            <Tab className="h-16 border-b-4 border-transparent bg-gray-100 font-semibold text-gray-600 duration-200 hover:text-gray-900 hover:brightness-95 ui-selected:border-blue-700 ui-selected:text-gray-900 ui-selected:brightness-95">
              Chats
            </Tab>
            <Tab className="h-16 border-b-4 border-transparent bg-gray-100 font-semibold text-gray-600 duration-200 hover:text-gray-900 hover:brightness-95 ui-selected:border-blue-700 ui-selected:text-gray-900 ui-selected:brightness-95">
              Friends
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <ChatsList />
            </Tab.Panel>
            <Tab.Panel className="flex flex-col p-4">
              <AddFriendButton />
              <FriendsList />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      <div>{props.children}</div>
    </div>
  );
}

function ChatsList() {
  const session = useSession();
  const { data: chats } = trpc.chat.list.useQuery(
    { userId: session?.userId || "" },
    { enabled: session !== null },
  );

  return (
    <nav>
      <ul>
        {chats?.map((chat) => {
          const user = chat.users.filter(
            (user) => user.id !== session?.userId,
          )[0];
          return (
            <li key={chat.id}>
              <Link
                className="flex h-16 items-center rounded-md bg-gray-100 px-4 font-medium duration-200 hover:brightness-95"
                href={`/chats?id=${chat.id}`}
              >
                {user.username}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function AddFriendButton() {
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

function FriendsList() {
  const session = useSession();
  const { data: friends } = trpc.friend.list.useQuery(
    { userId: session?.userId || "" },
    { enabled: session !== null },
  );

  return (
    <nav>
      <ul>
        {friends?.map((friend) => (
          <FriendsListItem key={friend.id} friend={friend} />
        ))}
      </ul>
    </nav>
  );
}

function FriendsListItem(props: { friend: { username: string; id: string } }) {
  const session = useSession();
  const { data: chat } = trpc.directChat.get.useQuery(
    { userIds: [session?.userId || "", props.friend.id] },
    { enabled: session !== null },
  );

  return (
    <li className="flex h-16 items-center justify-between font-medium">
      {props.friend.username}
      <div className="flex gap-2">
        {chat ? (
          <Link
            href={`/chats?id=${chat.id}`}
            className="grid h-12 w-12 place-items-center rounded-full bg-gray-200 text-gray-600 duration-200 hover:text-gray-900 hover:brightness-95"
            title={`Message ${props.friend.username}`}
          >
            <ChatBubbleLeftIcon className="h-5 w-5" />
          </Link>
        ) : null}
      </div>
    </li>
  );
}
