import { Dialog as HUIDialog } from "@headlessui/react";
import { ReactNode } from "react";

export function Dialog(props: {
  open: boolean;
  onClose: () => void;
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
        {props.children}
      </HUIDialog.Panel>
    </HUIDialog>
  );
}

Dialog.Title = function Title(props: { children: ReactNode }) {
  return (
    <HUIDialog.Title className="text-xl font-bold">
      {props.children}
    </HUIDialog.Title>
  );
};

Dialog.Description = function Description(props: { children: ReactNode }) {
  return (
    <HUIDialog.Description className="mt-2 text-gray-700">
      {props.children}
    </HUIDialog.Description>
  );
};

Dialog.ActionArea = function ActionArea(props: { children: ReactNode }) {
  return <div className="mt-8 flex justify-end gap-2">{props.children}</div>;
};
