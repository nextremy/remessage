import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Remessage",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <Providers>
      <html lang="en">
        <body className={`bg-gray-100 text-gray-900 ${inter.className}`}>
          {props.children}
        </body>
      </html>
    </Providers>
  );
}
