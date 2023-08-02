import { ReactNode } from "react";

export default function AuthLayout(props: { children: ReactNode }) {
  return (
    <div className="grid h-screen place-items-center p-4">
      <div className="w-full max-w-sm rounded-xl border-2 border-gray-200 p-4">
        {props.children}
      </div>
    </div>
  );
}
