import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../trpc";

export function LoginRoute() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      navigate("/");
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loginMutation.mutate({ username, password });
  }

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm rounded bg-zinc-900 p-6">
        <h1 className="text-center text-2xl font-bold">Log in</h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <label
            className="mt-6 text-sm font-semibold tracking-wide text-zinc-300"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="mt-2 h-12 rounded bg-transparent bg-zinc-950 px-4"
            name="username"
            onChange={(event) => setUsername(event.target.value)}
            type="text"
          />
          <label
            className="mt-6 text-sm font-semibold tracking-wide text-zinc-300"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="mt-2 h-12 rounded bg-transparent bg-zinc-950 px-4"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
          />
          <button
            className="mt-8 h-14 rounded bg-blue-700 text-lg font-bold text-zinc-50 saturate-50"
            type="submit"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
