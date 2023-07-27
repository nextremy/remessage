import { FormEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { useSession } from "../../hooks/use-session";
import { trpc } from "../../trpc";

export function MessageInput() {
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
