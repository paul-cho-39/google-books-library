import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import CalendarWrapper from "./calendarWrapper";
import { BackButton } from "./backButton";

interface CalendarModalProps {
  isLoading: boolean;
  skipSubmit: () => void;
  submitWithDates: () => void;
  modalTitle: string;
  className: string;
  children?: React.ReactNode;
}

const CalendarModal = ({
  isLoading,
  skipSubmit,
  submitWithDates,
  modalTitle,
  className,
  children,
}: CalendarModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  function handleSubmit() {
    // shouldSkipDate ? skipSubmit() :
    submitWithDates();
    setIsOpen(false);
  }

  function handleSkipSubmit() {
    skipSubmit();
    setIsOpen(false);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <button type="button" onClick={openModal} className={className}>
        Finished
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-600"
            enterFrom="-translate-y-7 opacity-20 "
            enterTo="opacity-100 translate-y-0"
            leave="ease-in-out duration-800"
            leaveFrom="-translate-y-0 opacity-100"
            leaveTo="opacity-0 translate-y-14"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-1 top-12 overflow-y-scroll">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-600"
                enterFrom="-translate-y-7 opacity-20 "
                enterTo="opacity-100 translate-y-0"
                leave="ease-in-out duration-800"
                leaveFrom="-translate-y-1 opacity-100"
                leaveTo="opacity-0 translate-y-14"
              >
                <Dialog.Panel className="overflow-y-auto w-full h-auto max-w-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    <BackButton onClick={closeModal} />
                    Do you remember when you finished the book?
                  </Dialog.Title>
                  <div className="mt-8">
                    {children}
                    <CalendarWrapper
                      isLoading={isLoading}
                      skipSubmit={handleSkipSubmit}
                      submitWithDates={handleSubmit}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default React.memo(CalendarModal);
