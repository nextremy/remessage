import { Outlet } from "react-router-dom";
import { Link } from "./link";

export function FriendsLayout() {
  return (
    <>
      <div className="flex w-80 flex-shrink-0 flex-col">
        <h1 className="p-4 text-xl font-semibold">Friends</h1>
        <nav>
          <ul>
            <Link destination="all" text="All" />
            <Link destination="pending" text="Pending" />
            <Link destination="add-friend" text="Add friend" />
          </ul>
        </nav>
      </div>
      <Outlet />
    </>
  );
}
