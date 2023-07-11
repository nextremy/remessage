import { Tab } from "@headlessui/react";
import { ChatBubbleLeftIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { AppBar } from "../components/AppBar";
import { trpc } from "../trpc";

export function Friends() {
  return (
    <Tab.Group>
      <AppBar>
        <AppBar.Title>Friends</AppBar.Title>
        <Tab.List className="ml-4 flex h-8 gap-2 border-l border-gray-300 pl-4">
          <Tab className="ui-selected:bg-gray-200 ui-selected:text-gray-900 rounded-md px-4 font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900">
            List
          </Tab>
          <Tab className="ui-selected:bg-gray-200 ui-selected:text-gray-900 rounded-md px-4 font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900">
            Pending
          </Tab>
          <Tab className="ui-selected:bg-gray-200 ui-selected:text-gray-900 rounded-md px-4 font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900">
            Add friend
          </Tab>
        </Tab.List>
      </AppBar>
      <Tab.Panels className="flex flex-col gap-2 py-2">
        <Tab.Panel>
          <ListFriends />
        </Tab.Panel>
        <Tab.Panel></Tab.Panel>
        <Tab.Panel></Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}

function ListFriends() {
  const friendsListQuery = trpc.friend.list.useQuery();

  return (
    <ul className="flex flex-col divide-y divide-gray-300 px-4">
      {friendsListQuery.data?.map((friend) => (
        <li
          className="flex items-center justify-between p-2 font-medium"
          key={friend.id}
        >
          {friend.username}
          <div className="flex gap-2">
            <Link
              className="grid h-12 w-12 place-items-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
              to={`/direct-chats/${friend.id}`}
            >
              <ChatBubbleLeftIcon className="h-5 w-5" />
            </Link>
            <button className="grid h-12 w-12 place-items-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
