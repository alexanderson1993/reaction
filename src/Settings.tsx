import React from "react";
import { useLevelStore } from "./stores/levelStore";
import { Transition } from "@headlessui/react";

export function Settings() {
  const state = useLevelStore((store) => store.state);

  const musicVolume = useLevelStore((store) => store.musicVolume);
  const soundVolume = useLevelStore((store) => store.soundVolume);

  return (
    <Transition
      className="credits transform z-10"
      show={state === "settings"}
      enter="transition-transform duration-500"
      leave="transition-transform duration-500"
      enterFrom="translate-x-[-150%]"
      enterTo="translate-x-0"
      leaveFrom="translate-x-0"
      leaveTo="translate-x-[-150%]"
    >
      <h1 className="text-5xl">Settings</h1>
      <label className="mt-4">
        Music Volume
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          onChange={(e) => {
            useLevelStore.setState({
              musicVolume: parseFloat(e.currentTarget.value),
            });
            localStorage.setItem("music_volume", e.currentTarget.value);
          }}
          value={musicVolume}
        />
      </label>
      <label className="mt-4">
        Sound Effects Volume
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          onChange={(e) => {
            useLevelStore.setState({
              soundVolume: parseFloat(e.currentTarget.value),
            });
            localStorage.setItem("sound_volume", e.currentTarget.value);
          }}
          value={soundVolume}
        />
      </label>
      <button
        className="gradient-box mt-4"
        onClick={() => useLevelStore.getState().reset()}
      >
        Go Back
      </button>
    </Transition>
  );
}
