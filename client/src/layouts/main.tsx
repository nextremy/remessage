import {
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { ReactNode } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "../hooks/use-session";

export function MainLayout() {
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
    <div className="flex w-16 flex-shrink-0 flex-col bg-gray-200 lg:w-80">
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
          ? "bg-gray-300 text-gray-900"
          : "text-gray-700"
      } flex h-16 items-center justify-center gap-4 text-xl font-medium duration-150 hover:bg-gray-300 hover:text-gray-900 lg:justify-start lg:px-4`}
      to={props.to}
    >
      <div className="h-6 w-6 flex-shrink-0">{props.icon}</div>
      <span className="hidden lg:inline">{props.text}</span>
    </Link>
  );
}
