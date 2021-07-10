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
        {/* <button
          className="gradient-box mt-4"
          onClick={() => useLevelStore.getState()}
        >
          Purchase More Levels
        </button> */}
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
