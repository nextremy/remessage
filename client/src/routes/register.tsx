import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../trpc";

export function RegisterRoute() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const userCreateMutation = trpc.user.create.useMutation({
    onSuccess: () => navigate("/login"),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    userCreateMutation.mutate({ username, password });
  }

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm rounded p-6 shadow">
        <h1 className="text-center text-2xl font-bold">Register</h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <label
            className="mt-6 text-sm font-semibold tracking-wide text-gray-700"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="mt-2 h-12 rounded bg-gray-200 px-4"
            name="username"
            onChange={(event) => setUsername(event.target.value)}
            type="text"
          />
          <label
            className="mt-6 text-sm font-semibold tracking-wide text-gray-700"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="mt-2 h-12 rounded bg-gray-200 px-4"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
          />
          <button
            className="mt-8 h-14 rounded bg-blue-700 text-lg font-bold text-gray-50"
            type="submit"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
