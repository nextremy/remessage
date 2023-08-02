import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWSClient, httpBatchLink, splitLink, wsLink } from "@trpc/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/app";
import { AuthLayout } from "./layouts/auth";
import { ChatsLayout } from "./layouts/chats";
import { FriendsLayout } from "./layouts/friends";
import { AllFriendsRoute } from "./routes/all-friends";
import { DirectChatRoute } from "./routes/direct-chat";
import { LoginRoute } from "./routes/login";
import { RegisterRoute } from "./routes/register";
import { SettingsRoute } from "./routes/settings";
import { trpc } from "./trpc";

const wsClient = createWSClient({ url: "ws://localhost:4000" });
const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    splitLink({
      condition: (op) => op.type === "subscription",
      true: wsLink({ client: wsClient }),
      false: httpBatchLink({
        url: "http://localhost:4000",
        headers: () => {
          const token = localStorage.getItem("token");
          if (token === null) return {};
          return { Authorization: `Bearer ${token}` };
        },
      }),
    }),
  ],
});

export function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route element={<LoginRoute />} path="login" />
              <Route element={<RegisterRoute />} path="register" />
            </Route>
            <Route element={<AppLayout />}>
              <Route element={<Navigate to="chats" />} index />
              <Route element={<ChatsLayout />} path="chats">
                <Route element={<DirectChatRoute />} path="direct/:chatId" />
              </Route>
              <Route element={<FriendsLayout />} path="friends">
                <Route element={<Navigate to="all" />} index />
                <Route element={<AllFriendsRoute />} path="all" />
                <Route element={<div />} path="pending" />
                <Route element={<div />} path="add-friend" />
              </Route>
              <Route element={<SettingsRoute />} path="settings" />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
