import { Cog6ToothIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog } from "../../components/dialog";

export function SettingsRoute() {
  return (
    <div className="grow">
      <AppBar />
      <div className="p-4">
        <LogOutButton />
      </div>
    </div>
  );
}

function AppBar() {
  return (
    <div className="flex h-12 items-center border-b-2 border-gray-200">
      <h1 className="flex items-center gap-2 px-4 font-semibold">
        <Cog6ToothIcon className="h-5 w-5" /> Settings
      </h1>
    </div>
  );
}

function LogOutButton() {
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
        className="h-10 rounded-md border-2 border-gray-300 px-4 font-bold text-gray-700 hover:bg-gray-200"
        onClick={() => setDialogOpen(true)}
      >
        Log out
      </button>
      <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen}>
        <Dialog.Title>Log out</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to log out?
        </Dialog.Description>
        <Dialog.ActionArea>
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
        </Dialog.ActionArea>
      </Dialog>
    </>
  );
}
