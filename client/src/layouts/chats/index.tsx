import { Outlet } from "react-router-dom";
import { Chats } from "./chats";

export function ChatsLayout() {
  return (
    <>
      <div className="flex w-80 flex-shrink-0 flex-col">
        <h1 className="flex items-center p-4 text-xl font-semibold">Chats</h1>
        <Chats />
      </div>
      <Outlet />
    </>
  );
}
