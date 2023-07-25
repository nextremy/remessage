import { Tab } from "@headlessui/react";
import { UsersIcon } from "@heroicons/react/20/solid";
import { AddFriend } from "./add-friend";
import { AllFriendsList } from "./all-friends-list";
import { FriendRequestsList } from "./friend-requests-list";

export function FriendsRoute() {
  return (
    <Tab.Group as="div" className="grow">
      <div className="flex h-12 items-center border-b-2 border-gray-200">
        <h1 className="flex items-center gap-2 px-4 font-semibold">
          <UsersIcon className="h-5 w-5" /> Friends
        </h1>
        <Tab.List className="flex items-center gap-2 border-l-2 border-gray-200 px-4">
          <Tab className="h-8 rounded-md px-4 font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 ui-selected:bg-gray-200 ui-selected:text-gray-900">
            All
          </Tab>
          <Tab className="h-8 rounded-md px-4 font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 ui-selected:bg-gray-200 ui-selected:text-gray-900">
            Pending
          </Tab>
          <Tab className="h-8 rounded-md px-4 font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 ui-selected:bg-gray-200 ui-selected:text-gray-900">
            Add friend
          </Tab>
        </Tab.List>
      </div>
      <Tab.Panels>
        <Tab.Panel>
          <AllFriendsList />
        </Tab.Panel>
        <Tab.Panel>
          <FriendRequestsList />
        </Tab.Panel>
        <Tab.Panel>
          <AddFriend />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}
