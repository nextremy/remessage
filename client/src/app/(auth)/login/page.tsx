"use client";

import { trpc } from "@/trpc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const usernameId = useId();
  const [password, setPassword] = useState("");
  const passwordId = useId();
  const router = useRouter();

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        try {
          const { userId, token } = await trpc.auth.login.mutate({
            username,
            password,
          });
          localStorage.setItem("userId", userId);
          localStorage.setItem("token", token);
          router.push("/");
        } catch (error) {}
      }}
    >
      <h1 className="text-center text-xl font-bold">Log in</h1>
      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-semibold tracking-wide"
          htmlFor={usernameId}
        >
          Username
        </label>
        <input
          className="h-12 rounded-md bg-gray-300 px-4"
          id={usernameId}
          onChange={(event) => setUsername(event.target.value)}
          type="text"
          value={username}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-semibold tracking-wide"
          htmlFor={passwordId}
        >
          Password
        </label>
        <input
          className="h-12 rounded-md bg-gray-300 px-4"
          id={passwordId}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          value={password}
        />
      </div>
      <button
        className="mt-4 h-16 rounded-md bg-blue-700 text-lg font-bold text-gray-100 duration-200 hover:bg-blue-800"
        type="submit"
      >
        Log in
      </button>
      <p>
        Don{"'"}t have an account?{" "}
        <Link className="text-blue-700" href="/register">
          Register for one here.
        </Link>
      </p>
    </form>
  );
}
