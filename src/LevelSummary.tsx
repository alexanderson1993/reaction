import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useLevelStore } from "./stores/levelStore";
import gameData from "./components/gameData.json";

export function LevelSummary() {
  function close() {
    useLevelStore.getState().nextLevel();
  }
  const strokes = useLevelStore(
    (store) => store.strokes?.[store.levelIndex ?? 0]
  );
  const state = useLevelStore((store) => store.state);
  const showDialog = state === "levelSummary";
  const courseIndex = useLevelStore((store) => store.courseIndex) ?? -1;
  const levelIndex = useLevelStore((store) => store.levelIndex) ?? -1;
  const { par } = gameData[courseIndex]?.levels?.[levelIndex] || {};
  return (
    <Transition show={showDialog} as={Fragment}>
      <Dialog
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
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          className="z-10 flex justify-center flex-col pointer-events-none"
        >
          <Dialog.Title className="text-[#e97639] font-bold text-6xl text-center mb-4">
            Level Complete
          </Dialog.Title>

          <Dialog.Description className="text-4xl my-8 text-center">
            <p>Score: {strokes}</p>
            <p>Par: {par}</p>
          </Dialog.Description>
          <button>Tap to Continue</button>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
