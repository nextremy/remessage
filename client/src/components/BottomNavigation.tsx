import { HomeIcon, UserIcon, UsersIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export function BottomNavigation(props: {
  destination: "home" | "friends" | "profile";
}) {
  return (
    <nav className="grid h-16 auto-cols-fr grid-flow-col border-t border-zinc-800">
      <Link
        className={`flex flex-col items-center justify-center ${
          props.destination === "home" ? "text-blue-500" : "text-zinc-500"
        }`}
        to="/home"
      >
        <HomeIcon className="h-6 w-6" />
        <span className="text-sm">Home</span>
      </Link>
      <Link
        className={`flex flex-col items-center justify-center ${
          props.destination === "friends" ? "text-blue-500" : "text-zinc-500"
        }`}
        to="/friends"
      >
        <UsersIcon className="h-6 w-6" />
        <span className="text-sm">Friends</span>
      </Link>
      <Link
        className={`flex flex-col items-center justify-center ${
          props.destination === "profile" ? "text-blue-500" : "text-zinc-500"
        }`}
        to="/profile"
      >
        <UserIcon className="h-6 w-6" />
        <span className="text-sm">Profile</span>
      </Link>
    </nav>
  );
}
