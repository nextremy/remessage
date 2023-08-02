"use client";

import { Tab } from "@headlessui/react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { AddFriendButton } from "./add-friend-button";
import { ChatsList } from "./chats-list";
import { FriendRequestsButton } from "./friend-requests-button";
import { FriendsList } from "./friends-list";

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
            <Tab className="h-16 border-b-4 border-transparent bg-gray-100 font-semibold text-gray-600 duration-200 hover:text-gray-900 hover:brightness-95 ui-selected:border-blue-700 ui-selected:text-gray-900">
              Chats
            </Tab>
            <Tab className="h-16 border-b-4 border-transparent bg-gray-100 font-semibold text-gray-600 duration-200 hover:text-gray-900 hover:brightness-95 ui-selected:border-blue-700 ui-selected:text-gray-900">
              Friends
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <ChatsList />
            </Tab.Panel>
            <Tab.Panel className="flex flex-col gap-2 p-4">
              <AddFriendButton />
              <FriendRequestsButton />
              <FriendsList />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      <div>{props.children}</div>
    </div>
  );
}
