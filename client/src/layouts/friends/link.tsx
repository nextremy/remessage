import { Link as RouterLink, useLocation } from "react-router-dom";

export function Link(props: { destination: string; text: string }) {
  const { pathname } = useLocation();

  return (
    <li>
      <RouterLink
        className={`${
          pathname.startsWith(`/friends/${props.destination}`)
            ? "bg-gray-200 text-gray-900"
            : "text-gray-700"
        } flex h-16 items-center px-8 text-lg font-medium duration-150 hover:bg-gray-200 hover:text-gray-900`}
        to={`/friends/${props.destination}`}
      >
        {props.text}
      </RouterLink>
    </li>
  );
}
