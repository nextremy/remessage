import { UsersIcon } from "@heroicons/react/20/solid";
import { Link, useLocation } from "react-router-dom";

export function FriendsLink() {
  const { pathname } = useLocation();

  return (
    <Link
      className={`${
        pathname.startsWith("/friends")
          ? "bg-gray-300 text-gray-900"
          : "text-gray-700"
      } m-4 flex h-12 items-center gap-2 rounded-md px-4 font-medium hover:bg-gray-300 hover:text-gray-900`}
      to="friends"
    >
      <UsersIcon className="h-5 w-5" /> Friends
    </Link>
  );
}
