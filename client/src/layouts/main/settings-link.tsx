import { Cog6ToothIcon } from "@heroicons/react/20/solid";
import { Link, useLocation } from "react-router-dom";

export function SettingsLink() {
  const { pathname } = useLocation();

  return (
    <Link
      className={`${
        pathname.startsWith("/settings")
          ? "bg-gray-300 text-gray-900"
          : "text-gray-700"
      } grid h-10 w-10 place-items-center rounded-full hover:bg-gray-300 hover:text-gray-900`}
      to="settings"
    >
      <Cog6ToothIcon className="h-5 w-5" />
    </Link>
  );
}
