import { AppBar } from "./app-bar";
import { LogOutButton } from "./log-out-button";

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
