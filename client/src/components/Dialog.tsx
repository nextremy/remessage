import { Dialog as HUIDialog } from "@headlessui/react";
import { ReactNode } from "react";

export function Dialog(props: {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <HUIDialog
      className="relative z-50"
      onClose={props.onClose}
      open={props.open}
    >
      <div className="fixed inset-0 bg-gray-900/50" />
      <div className="fixed inset-0 grid place-items-center">
        <HUIDialog.Panel className="w-full max-w-sm rounded-md bg-gray-100 p-4">
          {props.children}
        </HUIDialog.Panel>
      </div>
    </HUIDialog>
  );
}

Dialog.Title = function Title(props: { children: ReactNode }) {
  return (
    <HUIDialog.Title className="text-lg font-bold">
      {props.children}
    </HUIDialog.Title>
  );
};

Dialog.Description = function Description(props: { children: ReactNode }) {
  return <HUIDialog.Description>{props.children}</HUIDialog.Description>;
};
