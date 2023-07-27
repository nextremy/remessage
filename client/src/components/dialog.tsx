import { Dialog as HUIDialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";

export function Dialog(props: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Transition as={Fragment} show={props.open}>
      <HUIDialog
        className="fixed inset-0 grid place-items-center"
        onClose={props.onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="duration-200 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="delay-75 duration-150 ease-out"
          enterFrom="opacity-0 scale-125"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-125"
        >
          <HUIDialog.Panel className="z-50 w-full max-w-sm rounded-md border-gray-200 bg-gray-100 p-4">
            {props.children}
          </HUIDialog.Panel>
        </Transition.Child>
      </HUIDialog>
    </Transition>
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
