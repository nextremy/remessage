import { ReactNode } from "react";

export function AppBar(props: { children: ReactNode }) {
  return (
    <div className="flex h-12 items-center border-b-2 border-gray-300 px-4">
      {props.children}
    </div>
  );
}

AppBar.Title = function Title(props: { children: ReactNode }) {
  return <h1 className="font-semibold">{props.children}</h1>;
};
