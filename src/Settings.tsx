import React, { useState } from "react";
import { useLevelStore } from "./stores/levelStore";
import { Transition } from "@headlessui/react";

export function Settings() {
  const state = useLevelStore((store) => store.state);

  const musicVolume = useLevelStore((store) => store.musicVolume);
  const soundVolume = useLevelStore((store) => store.soundVolume);
  const [price, setPrice] = useState("5");
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
      <hr className="my-4 w-16" />
      <p>You can purchase additional levels at any price (min $1).</p>
      <form
        method="POST"
        // action="/.netlify/functions/checkout"
        action="http://localhost:8888/.netlify/functions/checkout"
        className="flex flex-col"
        onSubmit={(e) => {
          if (!price) e.preventDefault();
        }}
      >
        <label className="flex flex-col">
          Name your price:
          <div className="w-[200px] bg-gray-900 bg-opacity-70 px-4 py-1 border-2 border-gray-400 flex align-center ">
            <span className="pr-1">$</span>
            <input
              className="w-full bg-transparent"
              type="number"
              name="price"
              pattern="[0-9]"
              min={1}
              value={price}
              onChange={(e) => {
                let value = parseInt(e.currentTarget.value, 10);
                if (e.currentTarget.value === "") return setPrice("");
                if (isNaN(value) || value <= 0) value = 5;
                setPrice(value.toString());
              }}
            />
          </div>
        </label>
        <button className="gradient-box mt-4" type="submit" disabled={!price}>
          Purchase
        </button>
      </form>
      <button
        className="gradient-box mt-4"
        onClick={() => useLevelStore.getState().reset()}
      >
        Go Back
      </button>
    </Transition>
  );
}
