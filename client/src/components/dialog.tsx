import { Dialog as HUIDialog } from "@headlessui/react";
import { ReactNode } from "react";

export function Dialog(props: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
}) {
  return (
    <HUIDialog
      className="fixed inset-0 grid place-items-center"
      onClose={props.onClose}
      open={props.open}
    >
      <div className="fixed inset-0 bg-gray-900/50" />
      <HUIDialog.Panel className="z-50 w-full max-w-sm rounded-md border-gray-200 bg-gray-100 p-4">
        <HUIDialog.Title className="text-xl font-bold">
          {props.title}
        </HUIDialog.Title>
        <HUIDialog.Description className="mt-4 text-gray-700">
          {props.description}
        </HUIDialog.Description>
        {props.children}
      </HUIDialog.Panel>
    </HUIDialog>
  );
}
