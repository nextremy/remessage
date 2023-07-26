import { FormEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { useSession } from "../../hooks/session";
import { trpc } from "../../trpc";

export function MessageInput() {
  const { userId } = useSession();
  const { directChatId } = useParams();
  const { data: user } = trpc.user.get.useQuery({ userId: directChatId! });
  const { mutate: createMessage } = trpc.directMessage.create.useMutation();
  const [input, setInput] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createMessage({
      senderId: userId,
      receiverId: directChatId!,
      textContent: input,
    });
    setInput("");
  }

  if (!user) return null;
  return (
    <div className="px-4 pb-4">
      <form onSubmit={handleSubmit}>
        <input
          className="h-12 w-full rounded-md bg-gray-300 px-4 placeholder:text-gray-700"
          onChange={(event) => setInput(event.target.value)}
          placeholder={`Message @${user.username}`}
          type="text"
          value={input}
        />
      </form>
    </div>
  );
}
