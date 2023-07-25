import { Tab } from "@headlessui/react";

export function FriendsRoute() {
  return (
    <Tab.Group as="div" className="grow">
      <Tab.List className="flex gap-2 border-b-2 border-gray-200 p-2">
        <Tab className="h-10 rounded-md px-4 font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 ui-selected:bg-gray-200 ui-selected:text-gray-900">
          All
        </Tab>
        <Tab className="h-10 rounded-md px-4 font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 ui-selected:bg-gray-200 ui-selected:text-gray-900">
          Pending
        </Tab>
        <Tab className="h-10 rounded-md px-4 font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 ui-selected:bg-gray-200 ui-selected:text-gray-900">
          Add friend
        </Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel></Tab.Panel>
        <Tab.Panel></Tab.Panel>
        <Tab.Panel></Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}
