import {
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { ReactNode } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "../../hooks/use-session";

export function AppLayout() {
  try {
    useSession();
  } catch (error) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen divide-x-2 divide-gray-300">
      <Sidebar />
      <Outlet />
    </div>
  );
}

function Sidebar() {
  return (
    <div className="flex w-20 flex-shrink-0 flex-col gap-2 p-2 lg:w-80 lg:p-4">
      <SidebarLink
        icon={<ChatBubbleLeftRightIcon />}
        text="Chats"
        to="/chats"
      />
      <SidebarLink icon={<UsersIcon />} text="Friends" to="/friends" />
      <SidebarLink icon={<Cog6ToothIcon />} text="Settings" to="/settings" />
    </div>
  );
}

function SidebarLink(props: { to: string; icon: ReactNode; text: string }) {
  const { pathname } = useLocation();

  return (
    <Link
      className={`${
        pathname.startsWith(props.to)
          ? "bg-gray-200 text-gray-900"
          : "text-gray-700"
      } flex h-16 items-center justify-center gap-4 rounded-full text-xl font-medium duration-150 hover:bg-gray-200 hover:text-gray-900 lg:justify-start lg:px-8`}
      to={props.to}
    >
      <div className="h-6 w-6 flex-shrink-0">{props.icon}</div>
      <span className="hidden lg:inline">{props.text}</span>
    </Link>
  );
}
