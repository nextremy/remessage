import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSession } from "../hooks/use-session";
import { trpc } from "../trpc";

export function DirectChatRoute() {
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
    <div className="flex h-16 flex-shrink-0 items-center border-b-2 border-gray-300 px-4">
      <h2 className="font-semibold">{user.username}</h2>
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
    <ul className="flex flex-col overflow-y-auto py-4">
      {messages.map((message) => (
        <li className="px-4 py-1 hover:bg-gray-200" key={message.id}>
          <div className="flex items-center gap-2">
            <p className="font-medium">{message.sender.username}</p>
            <p className="text-xs text-gray-700">
              {prettifyTimestamp(message.timestamp)}
            </p>
          </div>
          <p>{message.textContent}</p>
        </li>
      ))}
      <div ref={scrollTargetRef} />
    </ul>
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
    createMessage({
      textContent: input,
      senderId: session.userId,
      chatId: chatId!,
    });
    setInput("");
  }

  if (!chat) return null;
  const otherUser = chat.users.filter((user) => user.id != session.userId)[0];
  return (
    <div className="px-4 pb-4">
      <form onSubmit={handleSubmit}>
        <input
          className="h-12 w-full rounded-md bg-gray-300 px-4 placeholder:text-gray-700"
          onChange={(event) => setInput(event.target.value)}
          placeholder={`Message @${otherUser.username}`}
          type="text"
          value={input}
        />
      </form>
    </div>
  );
}
