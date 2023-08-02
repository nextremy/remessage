"use client";

import { trpc } from "@/trpc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { mutate: login } = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      router.replace("/");
    },
  });
  const [username, setUsername] = useState("");
  const usernameInputId = useId();
  const [password, setPassword] = useState("");
  const passwordInputId = useId();

  return (
    <>
      <h1 className="text-center text-xl font-bold">Log in</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          login({ username, password });
        }}
      >
        <label
          htmlFor={usernameInputId}
          className="mt-4 block text-sm font-semibold tracking-wide"
        >
          Username
        </label>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="mt-1 block h-12 w-full rounded-md bg-gray-300 px-4"
          type="text"
          id={usernameInputId}
        />
        <label
          className="mt-4 block text-sm font-semibold tracking-wide"
          htmlFor={passwordInputId}
        >
          Password
        </label>
        <input
          value={password}
          className="mt-1 block h-12 w-full rounded-md bg-gray-300 px-4"
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          id={passwordInputId}
        />
        <button
          className="mt-6 h-16 w-full rounded-md bg-orange-700 px-4 text-lg font-bold text-gray-100 duration-200 hover:brightness-110"
          type="submit"
        >
          Log in
        </button>
        <p className="mt-4 text-center">
          Don{"'"}t have an account?{" "}
          <Link href="/register" className="text-blue-700">
            Register here.
          </Link>
        </p>
      </form>
    </>
  );
}
