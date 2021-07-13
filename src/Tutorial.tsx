import React, { Fragment } from "react";
import { useLevelStore } from "./stores/levelStore";
import { Dialog, Transition } from "@headlessui/react";

export function Tutorial() {
  const okayRef = React.useRef<HTMLButtonElement>(null);
  const courseIndex = useLevelStore((store) => store.courseIndex) ?? -1;
  const levelIndex = useLevelStore((store) => store.levelIndex) ?? -1;
  const tutorialOn = useLevelStore((store) => store.tutorial);
  const gameData = useLevelStore((store) => store.gameData);
  const { tutorialTitle, tutorial } = (gameData[courseIndex]?.levels?.[
    levelIndex
  ] || {}) as unknown as { tutorialTitle: string; tutorial: string };
  const showDialog = (tutorialTitle && tutorialOn) || false;
  function close() {
    useLevelStore.setState({ tutorial: false });
  }
  return (
    <Transition show={showDialog} as={Fragment}>
      <Dialog
        onClose={close}
        className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center px-2"
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
              {tutorialTitle}
            </Dialog.Title>

            <Dialog.Description className="text-2xl">
              {tutorial}
            </Dialog.Description>

            <div className="modal-buttons">
              <button className="gradient-box" ref={okayRef} onClick={close}>
                Got it.
              </button>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
