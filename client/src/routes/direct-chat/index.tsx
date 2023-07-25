import { MessageInput } from "./message-input";
import { MessageList } from "./message-list";

export function DirectChatRoute() {
  return (
    <div className="flex grow flex-col gap-4 p-4">
      <MessageList />
      <MessageInput />
    </div>
  );
}
