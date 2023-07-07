import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { trpc } from "../trpc";
import { getButtonClassName } from "../styles/button";

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
      <form
        className="flex w-full max-w-sm flex-col rounded border border-gray-300 p-6"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center text-2xl font-bold">Register</h1>
        <label
          className="mt-6 text-sm font-semibold tracking-wide text-gray-700"
          htmlFor="username"
        >
          Username
        </label>
        <input
          className="mt-2 h-12 rounded bg-gray-300 px-4"
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
          className="mt-2 h-12 rounded bg-gray-300 px-4"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          type="password"
        />
        <button
          className={`mt-8 h-16 ${getButtonClassName("primary")}`}
          disabled={username === "" || password === ""}
          type="submit"
        >
          Register
        </button>
        <p className="mt-8 text-center">
          Already have an account?{" "}
          <Link className="text-blue-700" to="/login">
            Log in here
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
