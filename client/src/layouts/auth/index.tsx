import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function AuthLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div className="grid h-screen place-items-center bg-gray-100 text-gray-900">
      <div className="w-full max-w-sm rounded-md border-2 border-gray-200 p-4">
        <Outlet />
      </div>
    </div>
  );
}
