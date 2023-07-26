import { Cog6ToothIcon } from "@heroicons/react/20/solid";

export function AppBar() {
  return (
    <div className="flex h-12 items-center border-b-2 border-gray-200">
      <h1 className="flex items-center gap-2 px-4 font-semibold">
        <Cog6ToothIcon className="h-5 w-5" /> Settings
      </h1>
    </div>
  );
}
