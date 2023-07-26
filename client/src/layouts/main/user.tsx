import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { useSession } from "../../hooks/session";
import { trpc } from "../../trpc";

export function User() {
  const session = useSession();
  const { data: user } = trpc.user.get.useQuery({ userId: session.userId });

  if (!user) return null;
  return (
    <div className="flex h-16 items-center justify-between px-4">
      <p className="font-medium">{user.username}</p>
      <button className="grid h-10 w-10 place-items-center rounded-full bg-gray-300 hover:brightness-90">
        <Cog6ToothIcon className="h-6 w-6" />
      </button>
    </div>
  );
}
