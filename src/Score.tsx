import { Transition } from "@headlessui/react";
import React from "react";
import courseList from "./components/gameData.json";
import { useLevelStore } from "./stores/levelStore";

export function Score() {
  const state = useLevelStore((store) => store.state);
  const levelIndex = useLevelStore((store) => store.levelIndex);
  const courseIndex = useLevelStore((store) => store.courseIndex);
  const strokes = useLevelStore((store) => store.strokes);
  const levelCount = courseList[courseIndex ?? -1]?.levels.length;
  const par = courseList[courseIndex ?? -1]?.levels[levelIndex ?? -1]?.par;
  return (
    <Transition
      className="score transform"
      show={state === "playing" || state === "loading"}
      enter="transition-transform duration-500"
      leave="transition-transform duration-500"
      enterFrom="scale-0"
      enterTo="scale-100"
      leaveFrom="scale-100"
      leaveTo="scale-0"
    >
      <p>Strokes: {strokes?.[levelIndex ?? -1] || 0}</p>
      <p>
        Level: {(levelIndex ?? -1) + 1} / {levelCount || 0}
      </p>
      <p>Par: {par}</p>
    </Transition>
  );
}
