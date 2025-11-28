import { Dialog, Transition } from "@headlessui/react";
import { Fragment, PropsWithChildren } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
}

export const Modal = ({ open, title, onClose, children }: PropsWithChildren<ModalProps>) => (
  <Transition.Root show={open} as={Fragment}>
    <Dialog as="div" className="relative z-50" onClose={onClose}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all">
              <div className="mb-4 flex items-start justify-between gap-4">
                <Dialog.Title className="text-lg font-semibold text-brand-base">{title}</Dialog.Title>
                <button
                  onClick={onClose}
                  className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold uppercase text-slate-500 hover:bg-slate-200"
                >
                  Cerrar
                </button>
              </div>
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition.Root>
);
