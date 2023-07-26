import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog } from "../../components/dialog";

export function LogOutButton() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleLogOut() {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <>
      <button
        className="h-10 rounded-md border-2 border-gray-300 bg-gray-100 px-4 font-bold text-gray-700 hover:brightness-90"
        onClick={() => setDialogOpen(true)}
      >
        Log out
      </button>
      <Dialog
        description="Are you sure you want to log out?"
        onClose={() => setDialogOpen(false)}
        open={dialogOpen}
        title="Log out"
      >
        <div className="mt-8 flex justify-end gap-2">
          <button
            className="h-10 rounded-md px-4 font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900"
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </button>
          <button
            className="h-10 rounded-md bg-red-700 px-4 font-medium text-gray-100 hover:bg-red-800"
            onClick={handleLogOut}
          >
            Log out
          </button>
        </div>
      </Dialog>
    </>
  );
}
