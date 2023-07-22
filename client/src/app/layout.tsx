"use client";

import "@/app/globals.css";
import { UsersIcon } from "@heroicons/react/20/solid";
import { Inter } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout(props: { children: ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null) router.replace("/login");
  }, [router]);
  const pathname = usePathname();

  return (
    <html lang="en">
      <body
        className={`${inter.className} flex h-screen items-stretch bg-gray-100 text-gray-900`}
      >
        <div className="flex w-full max-w-xs flex-col bg-gray-200 p-4">
          <Link
            className={`${
              pathname.startsWith("/friends")
                ? "bg-gray-300 text-gray-900"
                : "text-gray-700"
            } flex h-12 items-center gap-2 rounded-md px-4 font-medium hover:bg-gray-300 hover:text-gray-900`}
            href="/friends"
          >
            <UsersIcon className="h-5 w-5" />
            Friends
          </Link>
        </div>
        {props.children}
      </body>
    </html>
  );
}
