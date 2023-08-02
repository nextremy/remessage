import { Tab } from "@headlessui/react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "../../hooks/use-session";
import { AddFriendButton } from "./add-friend.button";
import { ChatsList } from "./chats-list";
import { FriendsList } from "./friends-list";

export function AppLayout() {
  const { pathname } = useLocation();
  try {
    useSession();
  } catch (error) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen divide-x divide-gray-300">
      <div
        className={`w-full flex-shrink-0 md:max-w-sm ${
          pathname !== "/" ? "hidden md:block" : ""
        }`}
      >
        <Tab.Group>
          <Tab.List className="grid h-16 auto-cols-fr grid-flow-col">
            <Tab className="border-b-4 border-transparent bg-gray-100 font-semibold text-gray-600 duration-200 hover:bg-gray-200 ui-selected:border-blue-700 ui-selected:text-gray-900">
              Chats
            </Tab>
            <Tab className="border-b-4 border-transparent bg-gray-100 font-semibold text-gray-600 duration-200 hover:bg-gray-200 ui-selected:border-blue-700 ui-selected:text-gray-900">
              Friends
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <ChatsList />
            </Tab.Panel>
            <Tab.Panel className="flex flex-col py-2">
              <AddFriendButton />
              <FriendsList />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      <Outlet />
    </div>
  );
}
