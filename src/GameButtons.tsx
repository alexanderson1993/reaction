import React from "react";
import { useLevelStore } from "./stores/levelStore";

export function GameButtons() {
  const state = useLevelStore((store) => store.state);

  return (
    <div
      className={`game-buttons ${
        state === "loading" || state === "playing" || state === "summary"
          ? "playing"
          : ""
      }`}
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
    </div>
  );
}
