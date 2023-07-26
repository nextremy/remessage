import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../../hooks/use-session";
import { FriendsLink } from "./friends-link";
import { SettingsLink } from "./settings-link";
import { UserDisplay } from "./user-display";

export function MainLayout() {
  try {
    useSession();
  } catch (error) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen">
      <div className="flex w-80 flex-col bg-gray-200">
        <FriendsLink />
        <div className="grow" />
        <div className="flex h-16 items-center justify-between px-4">
          <UserDisplay />
          <SettingsLink />
        </div>
      </div>
      <Outlet />
    </div>
  );
}
