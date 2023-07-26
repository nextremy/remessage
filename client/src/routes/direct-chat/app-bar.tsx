import { useParams } from "react-router-dom";
import { trpc } from "../../trpc";

export function AppBar() {
  const { directChatId } = useParams();
  const { data: user } = trpc.user.get.useQuery({ userId: directChatId! });

  if (!user) return null;
  return (
    <div className="flex h-12 flex-shrink-0 items-center border-b-2 border-gray-200 px-4">
      <h1 className="font-semibold">{user.username}</h1>
    </div>
  );
}
