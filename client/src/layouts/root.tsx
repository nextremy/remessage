import { Link, Outlet } from "react-router-dom";
import { trpc } from "../trpc";
import { UsersIcon } from "@heroicons/react/20/solid";

export function RootLayout() {
  return (
    <>
      <div className="flex h-screen flex-col">
        <Profile />
        <Link
          className="mx-2 mt-2 flex h-12 items-center gap-2 px-4 font-semibold text-gray-700"
          to="/friends"
        >
          <UsersIcon className="h-5 w-5" />
          Friends
        </Link>
      </div>
      <Outlet />
    </>
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
