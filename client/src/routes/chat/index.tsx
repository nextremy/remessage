import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSession } from "../../hooks/use-session";
import { trpc } from "../../trpc";

export function ChatRoute() {
  return (
    <div className="flex grow flex-col">
      <AppBar />
      <div className="grow" />
      <MessageList />
      <MessageInput />
    </div>
  );
}

function AppBar() {
  const session = useSession();
  const { chatId } = useParams();
  const { data: chat } = trpc.chat.get.useQuery({ id: chatId! });

  if (!chat) return null;
  const user = chat.users.filter((user) => user.id !== session.userId)[0];
  return (
    <div className="flex h-16 flex-shrink-0 items-center gap-2 border-b border-gray-300 md:px-4">
      <Link
        className="grid h-12 w-12 place-items-center rounded-full duration-200 hover:bg-gray-200 md:hidden"
        to="/"
      >
        <ArrowLeftIcon className="h-5 w-5" />
      </Link>
      <h2 className="text-lg font-semibold">{user.username}</h2>
    </div>
  );
}

function MessageList() {
  const { chatId } = useParams();
  const { data: messages } = trpc.message.list.useQuery({
    chatId: chatId!,
    limit: 50,
  });
  const context = trpc.useContext();
  trpc.message.stream.useSubscription(
    { chatId: chatId! },
    {
      onData: (newMessage) => {
        context.message.list.setData(
          { chatId: chatId!, limit: 50 },
          (oldMessages) => {
            if (!oldMessages) return [newMessage];
            if (
              oldMessages.some((oldMessage) => oldMessage.id === newMessage.id)
            ) {
              return oldMessages;
            }
            return [...oldMessages, newMessage].sort((message1, message2) => {
              if (message1.timestamp < message2.timestamp) return -1;
              if (message1.timestamp > message2.timestamp) return 1;
              return 0;
            });
          },
        );
      },
    },
  );
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollTargetRef.current?.scrollIntoView();
  }, [messages]);

  if (!messages) return null;
  return (
    <div className="mx-4 overflow-y-auto">
      <ul className="flex flex-col gap-4">
        {messages.map((message) => (
          <li key={message.id}>
            <div className="flex items-center gap-2">
              <p className="font-medium">{message.sender.username}</p>
              <p className="text-xs text-gray-700">
                {prettifyTimestamp(message.timestamp)}
              </p>
            </div>
            <p>{message.textContent}</p>
          </li>
        ))}
      </ul>
      <div className="h-4" />
      <div ref={scrollTargetRef} />
    </div>
  );
}

function prettifyTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  const currentDate = new Date();
  if (
    Intl.DateTimeFormat("en-us").format(date) ===
    Intl.DateTimeFormat("en-us").format(currentDate)
  ) {
    const format = Intl.DateTimeFormat("en-us", { timeStyle: "short" });
    const time = format.format(date);
    return `Today at ${time}`;
  }
  const format = Intl.DateTimeFormat("en-us", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return format.format(date);
}

function MessageInput() {
  const session = useSession();
  const { chatId } = useParams();
  const { data: chat } = trpc.chat.get.useQuery({ id: chatId! });
  const { mutate: createMessage } = trpc.message.create.useMutation();
  const [input, setInput] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInput("");
    createMessage({
      textContent: input,
      senderId: session.userId,
      chatId: chatId!,
    });
  }

  if (!chat) return null;
  const otherUser = chat.users.filter((user) => user.id != session.userId)[0];
  return (
    <form
      className="flex gap-2 border-t border-gray-300 p-2"
      onSubmit={handleSubmit}
    >
      <input
        className="h-12 w-full rounded-full bg-gray-300 px-6 placeholder:text-gray-700"
        onChange={(event) => setInput(event.target.value)}
        placeholder={`Message @${otherUser.username}`}
        type="text"
        value={input}
      />
      <button
        className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-full bg-blue-600 text-gray-100 duration-200 enabled:hover:bg-blue-500 disabled:opacity-50"
        disabled={input === ""}
        title="Send message"
        type="submit"
      >
        <PaperAirplaneIcon className="h-6 w-6" />
      </button>
    </form>
  );
}
