import { UsersIcon } from "@heroicons/react/20/solid";
import { Link, Outlet, useLocation } from "react-router-dom";

export function MainLayout() {
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen">
      <div className="max-w-xs grow bg-gray-200 p-4">
        <Link
          className={`${
            pathname.startsWith("/friends")
              ? "bg-gray-300 text-gray-900"
              : "text-gray-700"
          } flex h-12 items-center gap-2 rounded-md px-4 font-medium hover:bg-gray-300 hover:text-gray-900`}
          to="friends"
        >
          <UsersIcon className="h-5 w-5" /> Friends
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
