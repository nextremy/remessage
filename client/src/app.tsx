import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWSClient, httpBatchLink, splitLink, wsLink } from "@trpc/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthLayout } from "./layouts/auth";
import { ChatsLayout } from "./layouts/chats";
import { MainLayout } from "./layouts/main";
import { DirectChatRoute } from "./routes/direct-chat";
import { FriendsRoute } from "./routes/friends";
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
            <Route element={<MainLayout />}>
              <Route element={<ChatsLayout />} path="chats">
                <Route element={<DirectChatRoute />} path="direct/:chatId" />
              </Route>
              <Route element={<Navigate to="friends" />} index />
              <Route element={<FriendsRoute />} path="friends" />
              <Route element={<SettingsRoute />} path="settings" />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
