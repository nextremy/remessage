"use client";

import "@/app/globals.css";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function AuthLayout(props: { children: ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) router.replace("/");
  }, [router]);

  return (
    <html lang="en">
      <body
        className={`${inter.className} grid h-screen place-items-center bg-gray-100 text-gray-900`}
      >
        <div className="w-full max-w-sm rounded-md border-2 border-gray-200 p-4">
          {props.children}
        </div>
      </body>
    </html>
  );
}