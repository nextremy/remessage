import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthLayout } from "./layouts/auth";
import { MainLayout } from "./layouts/main";
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
              <Route element={<Navigate to="friends" />} index />
              <Route element={<div />} path="friends" />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
