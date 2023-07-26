import { AppBar } from "./app-bar";
import { MessageInput } from "./message-input";
import { MessageList } from "./message-list";

export function DirectChatRoute() {
  return (
    <div className="flex grow flex-col">
      <AppBar />
      <MessageList />
      <MessageInput />
    </div>
  );
}
