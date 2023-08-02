"use client";

import { useSession } from "@/hooks/use-session";
import { trpc } from "@/trpc";
import { ChatBubbleLeftIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export function FriendsList() {
  const session = useSession();
  const { data: friends } = trpc.friend.list.useQuery(
    { userId: session?.userId || "" },
    { enabled: session !== null },
  );

  return (
    <nav>
      <ul>
        {friends?.map((friend) => (
          <FriendsListItem key={friend.id} friend={friend} />
        ))}
      </ul>
    </nav>
  );
}

function FriendsListItem(props: { friend: { username: string; id: string } }) {
  const session = useSession();
  const { data: chat } = trpc.directChat.get.useQuery(
    { userIds: [session?.userId || "", props.friend.id] },
    { enabled: session !== null },
  );

  return (
    <li className="flex h-16 items-center justify-between font-medium">
      {props.friend.username}
      <div className="flex gap-2">
        {chat ? (
          <Link
            href={`/chats?id=${chat.id}`}
            className="grid h-12 w-12 place-items-center rounded-full bg-gray-200 text-gray-600 duration-200 hover:text-gray-900 hover:brightness-95"
            title={`Message ${props.friend.username}`}
          >
            <ChatBubbleLeftIcon className="h-5 w-5" />
          </Link>
        ) : null}
      </div>
    </li>
  );
}
