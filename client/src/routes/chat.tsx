import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { trpc } from "../trpc";

export function ChatRoute() {
  return (
    <div className="flex grow flex-col">
      <MessageList />
      <MessageInput />
    </div>
  );
}

function MessageList() {
  const { chatId } = useParams();
  const messageListQuery = trpc.message.list.useQuery({
    chatId: chatId ?? "",
    limit: 50,
  });

  if (!messageListQuery.data) return null;
  return (
    <ul className="grow p-4">
      {messageListQuery.data.map((message) => (
        <li key={message.id}>{message.textContent}</li>
      ))}
    </ul>
  );
}

function MessageInput() {
  const { chatId } = useParams();
  const [message, setMessage] = useState("");
  const messageCreateMutation = trpc.message.create.useMutation();

  return (
    <div className="flex gap-2 p-2">
      <input
        className="h-12 grow rounded bg-zinc-800 px-4"
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Message"
        type="text"
      />
      {message ? (
        <button
          className="grid h-12 w-12 place-items-center rounded bg-blue-500"
          onClick={() =>
            messageCreateMutation.mutate({
              chatId: chatId ?? "",
              textContent: message,
            })
          }
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      ) : null}
    </div>
  );
}
