import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

export function AppBar(props: { title: string }) {
  const navigate = useNavigate();

  return (
    <div className="flex h-12 items-center border-b border-gray-300">
      <button
        className="grid h-12 w-12 place-items-center"
        onClick={() => navigate(-1)}
      >
        <ArrowLeftIcon className="h-5 w-5" />
      </button>
      <h1 className="font-semibold">{props.title}</h1>
    </div>
  );
}
