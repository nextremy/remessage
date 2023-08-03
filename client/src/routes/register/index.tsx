import { FormEvent, useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { trpc } from "../../trpc";

export function RegisterRoute() {
  const navigate = useNavigate();
  const { mutate: register } = trpc.user.create.useMutation({
    onSuccess: () => navigate("/login"),
  });
  const [username, setUsername] = useState("");
  const usernameId = useId();
  const [password, setPassword] = useState("");
  const passwordId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    register({ username, password });
  }

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <h1 className="text-center text-xl font-bold">Register</h1>
      <label
        className="mt-4 text-sm font-semibold tracking-wide"
        htmlFor={usernameId}
      >
        Username
      </label>
      <input
        className="mt-1 h-12 rounded-md bg-gray-300 px-4"
        id={usernameId}
        onChange={(event) => setUsername(event.target.value)}
        type="text"
        value={username}
      />
      <label
        className="mt-4 text-sm font-semibold tracking-wide"
        htmlFor={passwordId}
      >
        Password
      </label>
      <input
        className="mt-1 h-12 rounded-md bg-gray-300 px-4"
        id={passwordId}
        onChange={(event) => setPassword(event.target.value)}
        type="password"
        value={password}
      />
      <div className="h-8" />
      <Button size="lg" type="submit">
        Register
      </Button>
      <p className="mt-4">
        Already have an account?{" "}
        <Link className="text-blue-700" to="/login">
          Log in here.
        </Link>
      </p>
    </form>
  );
}
