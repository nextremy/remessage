import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RootLayout } from "./layouts/root";
import { DirectChat } from "./routes/direct-chat";
import { Friends } from "./routes/friends";
import { Login } from "./routes/login";
import { Register } from "./routes/register";
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
        <Router />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />} path="/">
          <Route element={<Navigate to="friends" />} index />
          <Route element={<Friends />} path="friends" />
          <Route element={<DirectChat />} path="direct-chats/:id" />
        </Route>
        <Route element={<Register />} path="/register" />
        <Route element={<Login />} path="/login" />
        <Route element={<Navigate to="/" />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}
