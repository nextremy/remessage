import { trpc } from "../trpc";

export function FriendsRoute() {
  const friendListQuery = trpc.friend.list.useQuery();

  if (!friendListQuery.data) return null;
  return (
    <ul className="p-4">
      {friendListQuery.data.map((friend) => (
        <li className="font-medium" key={friend.id}>
          {friend.username}
        </li>
      ))}
    </ul>
  );
}
