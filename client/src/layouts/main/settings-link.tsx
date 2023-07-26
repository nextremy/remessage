import { Cog6ToothIcon } from "@heroicons/react/20/solid";
import { Link, useLocation } from "react-router-dom";

export function SettingsLink() {
  const { pathname } = useLocation();

  return (
    <Link
      className={`${
        pathname.startsWith("settings") ? "brightness-90" : ""
      } grid h-10 w-10 place-items-center rounded-full bg-gray-300 hover:brightness-90`}
      to="settings"
    >
      <Cog6ToothIcon className="h-5 w-5" />
    </Link>
  );
}
