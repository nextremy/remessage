import { HomeIcon, UserIcon, UsersIcon } from "@heroicons/react/24/solid";
import { Link, Outlet, useLocation } from "react-router-dom";

export function RootLayout() {
  const location = useLocation();
  const currentTab = getCurrentTab(location.pathname);

  const headerTitle = {
    home: "Home",
    friends: "Friends",
    profile: "Profile",
  }[currentTab];
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex h-16 items-center gap-2 px-4">
        <h1 className="text-lg font-semibold">{headerTitle}</h1>
      </div>
      <div className="grow">
        <Outlet />
      </div>
      <nav className="grid h-16 auto-cols-fr grid-flow-col border-t border-zinc-800">
        <Link
          className={`flex flex-col items-center justify-center ${
            currentTab === "home" ? "text-blue-500" : "text-zinc-500"
          }`}
          to="home"
        >
          <HomeIcon className="h-6 w-6" />
          <span className="text-sm">Home</span>
        </Link>
        <Link
          className={`flex flex-col items-center justify-center ${
            currentTab === "friends" ? "text-blue-500" : "text-zinc-500"
          }`}
          to="friends"
        >
          <UsersIcon className="h-6 w-6" />
          <span className="text-sm">Friends</span>
        </Link>
        <Link
          className={`flex flex-col items-center justify-center ${
            currentTab === "profile" ? "text-blue-500" : "text-zinc-500"
          }`}
          to="profile"
        >
          <UserIcon className="h-6 w-6" />
          <span className="text-sm">Profile</span>
        </Link>
      </nav>
    </div>
  );
}

function getCurrentTab(pathname: string) {
  if (pathname.startsWith("/friends")) return "friends";
  if (pathname.startsWith("/profile")) return "profile";
  return "home";
}
