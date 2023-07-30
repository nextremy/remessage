import { Outlet } from "react-router-dom";
import { Chats } from "./chats";

export function ChatsLayout() {
  return (
    <>
      <div className="w-80 flex-shrink-0 bg-gray-200">
        <h1 className="flex h-16 items-center px-4 text-xl font-semibold">
          Chats
        </h1>
        <Chats />
      </div>
      <Outlet />
    </>
  );
}
