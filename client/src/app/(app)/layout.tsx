"use client";

import { useSession } from "@/hooks/use-session";
import { trpc } from "@/trpc";
import { Tab } from "@headlessui/react";
import { ChatBubbleLeftIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

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
            <Tab.Panel>
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
    <li className="flex h-16 items-center justify-between px-4 font-medium">
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
