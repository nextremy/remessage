import { Tab } from "@headlessui/react";
import { trpc } from "../trpc";

export function RootLayout() {
  return (
    <div className="flex h-screen flex-col">
      <Profile />
      <Tabs />
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

function Tabs() {
  return (
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
        <Tab.Panel></Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}
