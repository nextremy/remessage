import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../../hooks/use-session";
import { FriendsLink } from "./friends-link";
import { User } from "./user";

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
        <User />
      </div>
      <Outlet />
    </div>
  );
}
