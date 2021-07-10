import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { useLevelStore } from "./stores/levelStore";

export function GameButtons() {
  const state = useLevelStore((store) => store.state);
  const [showDialog, setShowDialog] = React.useState(false);
  const restartButton = React.useRef<HTMLButtonElement>(null);
  function close() {
    setShowDialog(false);
  }
  return (
    <>
      <Transition show={showDialog} as={Fragment}>
        <Dialog
          initialFocus={restartButton}
          onClose={close}
          className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="bg-black bg-opacity-70 rounded-xl max-w-sm mx-auto border-2 border-white border-opacity-20 shadow-lg px-6 py-8 z-10">
              <Dialog.Title className="text-[#e97639] font-bold text-4xl text-center mb-4">
                Are you sure you want to go back?
              </Dialog.Title>

              <Dialog.Description className="text-2xl">
                You will lose your progress on this course.
              </Dialog.Description>

              <div className="modal-buttons">
                <button className="gradient-box" onClick={close}>
                  Cancel
                </button>
                <button
                  className="gradient-box"
                  onClick={() => {
                    useLevelStore.getState().reset();
                    setShowDialog(false);
                  }}
                  ref={restartButton}
                >
                  Go Back
                </button>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
      <Transition
        className="game-buttons transform"
        show={["playing", "loading", "levelSummary", "summary"].includes(state)}
        enter="transition-transform duration-500"
        leave="transition-transform duration-500"
        enterFrom="scale-0"
        enterTo="scale-100"
        leaveFrom="scale-100"
        leaveTo="scale-0"
      >
        {["playing", "loading", "levelSummary"].includes(state) && (
          <button
            className={`gradient-box go-back`}
            onClick={() => useLevelStore.getState().restartLevel()}
          >
            Restart Level
          </button>
        )}
        <button
          className={`gradient-box go-back`}
          onClick={() => {
            if (state === "summary") useLevelStore.getState().reset();
            else setShowDialog(true);
          }}
        >
          Go Back
        </button>
      </Transition>
    </>
  );
}
