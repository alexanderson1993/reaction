import { Transition } from "@headlessui/react";
import React from "react";
import { useLevelStore } from "./stores/levelStore";

export function GameButtons() {
  const state = useLevelStore((store) => store.state);

  return (
    <Transition
      className="game-buttons transform"
      show={state === "loading" || state === "playing" || state === "summary"}
      enter="transition-transform duration-500"
      leave="transition-transform duration-500"
      enterFrom="scale-0"
      enterTo="scale-100"
      leaveFrom="scale-100"
      leaveTo="scale-0"
    >
      {(state === "loading" || state === "playing") && (
        <button
          className={`gradient-box go-back`}
          onClick={() => useLevelStore.getState().restartLevel()}
        >
          Restart Level
        </button>
      )}
      <button
        className={`gradient-box go-back`}
        onClick={() => useLevelStore.getState().reset()}
      >
        Go Back
      </button>
    </Transition>
  );
}
