import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RootLayout } from "./layouts/root";
import { ChatRoute } from "./routes/chat";
import { FriendRequestsRoute } from "./routes/friend-requests";
import { FriendsRoute } from "./routes/friends";
import { LoginRoute } from "./routes/login";
import { RegisterRoute } from "./routes/register";
import { trpc } from "./trpc";

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "http://localhost:4000",
      headers: () => {
        const token = localStorage.getItem("token");
        if (token === null) return {};
        return { Authorization: `Bearer ${token}` };
      },
    }),
  ],
});

export default function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />} path="/">
              <Route element={<Navigate to="friends" />} index />
              <Route element={<FriendsRoute />} path="friends" />
              <Route
                element={<FriendRequestsRoute />}
                path="friends/requests"
              />
              <Route element={<ChatRoute />} path="chats/:chatId" />
            </Route>
            <Route element={<RegisterRoute />} path="/register" />
            <Route element={<LoginRoute />} path="/login" />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
