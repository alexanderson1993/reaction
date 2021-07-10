import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Title } from "./components/Title";
import courseList from "./components/gameData.json";
import { useLevelStore } from "./stores/levelStore";
import { Transition } from "@headlessui/react";
export const Credits = () => {
  const startGame = (courseIndex: number) =>
    useLevelStore.getState().loadCourse(courseIndex);
  const state = useLevelStore((store) => store.state);
  const rendered = state !== "rendering";
  const courseListRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (state === "courses") {
      courseListRef.current?.focus();
    }
  }, [state]);
  const musicVolume = useLevelStore((store) => store.musicVolume);
  const soundVolume = useLevelStore((store) => store.soundVolume);
  return (
    <div className="html-container">
      {!rendered ? (
        <div className="loading-indicator">
          <h1>Loading...</h1>
        </div>
      ) : null}
      <Transition
        className="credits transform"
        show={state === "credits"}
        enter="transition-transform duration-500"
        leave="transition-transform duration-500"
        enterFrom="translate-x-[-150%]"
        enterTo="translate-x-0"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-[-150%]"
      >
        <Title />
        <h2>A game by Alex Anderson</h2>
        <small>Inspired by Big Bang Reaction by Freeverse Software</small>
        <button
          className="gradient-box start-game"
          onClick={() => useLevelStore.getState().showCourses()}
        >
          Start Game
        </button>
        <button
          className="gradient-box mt-4"
          onClick={() => useLevelStore.getState().showSettings()}
        >
          Settings
        </button>
        {/* <button
          className="gradient-box mt-4"
          onClick={() => useLevelStore.getState()}
        >
          Purchase More Levels
        </button> */}
      </Transition>
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
      <Transition
        className="course-list transform"
        show={state === "courses"}
        enter="transition-transform duration-500"
        leave="transition-transform duration-500"
        enterFrom="scale-0"
        enterTo="scale-100"
        leaveFrom="scale-100"
        leaveTo="scale-0"
      >
        {courseList
          .map((course, index) => ({ ...course, courseIndex: index }))
          .sort((a, b) => {
            if (a.difficulty > b.difficulty) return 1;
            if (a.difficulty < b.difficulty) return -1;
            return 0;
          })
          .map(({ name, description, difficulty, courseIndex }, index) => (
            <div className="course-list-item" key={`course-${index}`}>
              <button className="link" onClick={() => startGame(courseIndex)}>
                <h1>{name}</h1>
              </button>
              <p>Difficulty: {Math.round(difficulty * 100)}%</p>
              <p>{description}</p>
            </div>
          ))}
      </Transition>
    </div>
  );
};
