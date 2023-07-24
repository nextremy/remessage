import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../server/src/index";

export const trpc = createTRPCProxyClient<AppRouter>({
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
