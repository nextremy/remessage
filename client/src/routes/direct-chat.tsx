import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { FormEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { AppBar } from "../components/AppBar";
import { trpc } from "../trpc";

export function DirectChat() {
  const { id } = useParams();
  if (id === undefined) {
    throw new Error();
  }

  return (
    <div className="flex h-full flex-col">
      <AppBar_ userId={id} />
      <MessageList userId={id} />
      <MessageInput userId={id} />
    </div>
  );
}

function AppBar_(props: { userId: string }) {
  const user = trpc.user.get.useQuery({ userId: props.userId });

  return (
    <AppBar>
      <AppBar.Title>{user.data?.username ?? ""}</AppBar.Title>
    </AppBar>
  );
}

function MessageList(props: { userId: string }) {
  const directMessageListQuery = trpc.directMessage.list.useQuery({
    userIds: [localStorage.getItem("userId") ?? "", props.userId],
    limit: 50,
  });

  return (
    <ul className="flex grow flex-col justify-end gap-2 px-4">
      {directMessageListQuery.data?.map((message) => (
        <li className="flex flex-col" key={message.id}>
          <div className="flex items-center gap-2">
            <p className="font-medium">{message.sender.username}</p>
            <time
              className="text-xs text-gray-700"
              dateTime={message.timestamp}
            >
              {message.timestamp}
            </time>
          </div>
          <p>{message.textContent}</p>
        </li>
      ))}
    </ul>
  );
}

function MessageInput(props: { userId: string }) {
  const [input, setInput] = useState("");
  const directMessageCreateMutation = trpc.directMessage.create.useMutation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    directMessageCreateMutation.mutate({
      textContent: input,
      senderId: localStorage.getItem("userId") ?? "",
      receiverId: props.userId,
    });
    setInput("");
  }

  return (
    <form className="flex gap-2 p-4" onSubmit={handleSubmit}>
      <input
        className="h-12 grow rounded-full bg-gray-300 px-4"
        onChange={(event) => setInput(event.target.value)}
        type="text"
        value={input}
      />
      {input && (
        <button
          className="grid h-12 w-12 place-items-center rounded-full bg-blue-700 text-gray-100"
          type="submit"
        >
          <PaperAirplaneIcon className="h-6 w-6" />
        </button>
      )}
    </form>
  );
}
