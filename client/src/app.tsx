import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RootLayout } from "./layouts/root";
import { FriendsRoute } from "./routes/friends";
import { HomeRoute } from "./routes/home";
import { LoginRoute } from "./routes/login";
import { ProfileRoute } from "./routes/profile";
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
              <Route element={<HomeRoute />} path="home" />
              <Route element={<FriendsRoute />} path="friends" />
              <Route element={<ProfileRoute />} path="profile" />
            </Route>
            <Route element={<LoginRoute />} path="/login" />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
