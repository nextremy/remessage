import { UsersIcon } from "@heroicons/react/20/solid";
import { Link, Outlet, useLocation } from "react-router-dom";
import { getButtonClassName } from "../styles/button";
import { trpc } from "../trpc";

export function RootLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen divide-x divide-gray-300">
      <div
        className={`flex w-full flex-col md:block md:max-w-xs ${
          location.pathname === "/" ? "" : "hidden"
        }`}
      >
        <ProfileBar />
        <div className="px-2">
          <FriendsButton />
        </div>
      </div>
      <div className="grow">
        <Outlet />
      </div>
    </div>
  );
}

function ProfileBar() {
  const userGetQuery = trpc.user.get.useQuery(
    { userId: localStorage.getItem("userId") ?? "" },
    { enabled: localStorage.getItem("userId") !== undefined },
  );

  return (
    <p className="p-4 text-lg font-medium">
      {userGetQuery.data ? userGetQuery.data.username : null}
    </p>
  );
}

function FriendsButton() {
  return (
    <Link className={`h-12 ${getButtonClassName("text")}`} to="/friends">
      <UsersIcon className="h-5 w-5" />
      Friends
    </Link>
  );
}
