"use client";

import "@/app/globals.css";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout(props: { children: ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null) router.replace("/login");
  }, [router]);

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        {props.children}
      </body>
    </html>
  );
}
