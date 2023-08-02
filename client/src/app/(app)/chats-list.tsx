"use client";

import { useSession } from "@/hooks/use-session";
import { trpc } from "@/trpc";
import Link from "next/link";

export function ChatsList() {
  const session = useSession();
  const { data: chats } = trpc.chat.list.useQuery(
    { userId: session?.userId || "" },
    { enabled: session !== null },
  );

  return (
    <nav>
      <ul>
        {chats?.map((chat) => {
          const user = chat.users.filter(
            (user) => user.id !== session?.userId,
          )[0];
          return (
            <li key={chat.id}>
              <Link
                className="flex h-16 items-center rounded-md bg-gray-100 px-4 font-medium duration-200 hover:brightness-95"
                href={`/chats?id=${chat.id}`}
              >
                {user.username}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
