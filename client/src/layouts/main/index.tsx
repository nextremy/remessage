import { Outlet } from "react-router-dom";
import { FriendsLink } from "./friends-link";

export function MainLayout() {
  return (
    <div className="flex h-screen">
      <div className="w-80 bg-gray-200 p-4">
        <FriendsLink />
      </div>
      <Outlet />
    </div>
  );
}
