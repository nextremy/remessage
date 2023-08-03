import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../../hooks/use-session";

export function AuthLayout() {
  const session = useSession();

  if (session) return <Navigate replace to="/login" />;
  return (
    <div className="grid h-screen place-items-center bg-gray-100 text-gray-900">
      <div className="w-full max-w-sm rounded-md border-2 border-gray-200 p-4">
        <Outlet />
      </div>
    </div>
  );
}
