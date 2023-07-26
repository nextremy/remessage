import { useSession } from "../../hooks/use-session";
import { trpc } from "../../trpc";

export function UserDisplay() {
  const session = useSession();
  const { data: user } = trpc.user.get.useQuery({ userId: session.userId });

  if (!user) return null;
  return <p className="font-medium">{user.username}</p>;
}
