import { Tab } from "@headlessui/react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "../../hooks/use-session";
import { AddFriendButton } from "./add-friend.button";
import { ChatsList } from "./chats-list";
import { FriendRequestsButton } from "./friend-requests-button";
import { FriendsList } from "./friends-list";
import { useStreamData } from "./use-stream-data";

export function AppLayout() {
  const { pathname } = useLocation();
  const session = useSession();
  useStreamData();

  if (!session) return <Navigate replace to="/login" />;
  return (
    <div className="flex h-screen divide-x divide-gray-300">
      <div
        className={`w-full flex-shrink-0 md:max-w-sm ${
          pathname !== "/" ? "hidden md:block" : ""
        }`}
      >
        <Tab.Group>
          <Tab.List className="grid h-14 auto-cols-fr grid-flow-col">
            <Tab className="border-b-2 border-transparent bg-gray-100 font-semibold text-gray-600 duration-200 ui-selected:border-blue-700 ui-selected:text-blue-700">
              Chats
            </Tab>
            <Tab className="border-b-2 border-transparent bg-gray-100 font-semibold text-gray-600 duration-200 ui-selected:border-blue-700 ui-selected:text-blue-700">
              Friends
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <ChatsList />
            </Tab.Panel>
            <Tab.Panel className="flex flex-col gap-2 py-2">
              <AddFriendButton />
              <FriendRequestsButton />
              <FriendsList />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      <Outlet />
    </div>
  );
}
