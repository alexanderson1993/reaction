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
    <div
      className={`score ${
        state === "playing" || state === "loading" ? "playing" : ""
      }`}
    >
      <p>Strokes: {strokes?.[levelIndex ?? -1] || 0}</p>
      <p>
        Level: {(levelIndex ?? -1) + 1} / {levelCount || 0}
      </p>
      <p>Par: {par}</p>
    </div>
  );
}
