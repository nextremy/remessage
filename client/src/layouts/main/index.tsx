import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../../hooks/session";
import { FriendsLink } from "./friends-link";

export function MainLayout() {
  try {
    useSession();
  } catch (error) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen">
      <div className="w-80 bg-gray-200 p-4">
        <FriendsLink />
      </div>
      <Outlet />
    </div>
  );
}
