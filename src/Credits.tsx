import React from "react";
import { Title } from "./components/Title";
import courseList from "./components/gameData.json";
import { useLevelStore } from "./stores/levelStore";

export const Credits = () => {
  const startGame = (courseIndex: number) =>
    useLevelStore.getState().loadCourse(courseIndex);
  const state = useLevelStore((store) => store.state);
  const rendered = state !== "rendering";
  return (
    <div className="html-container">
      {!rendered ? (
        <div className="loading-indicator">
          <h1>Loading...</h1>
        </div>
      ) : null}
      <div className={`course-list ${state === "courses" ? "active" : ""}`}>
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
      </div>
      <div className={`credits ${state === "credits" ? "active" : ""}`}>
        <Title />
        <h2>A game by Alex Anderson</h2>
        <small>Inspired by Big Bang Reaction by Freeverse Software</small>
        <button
          className="gradient-box start-game"
          onClick={() => useLevelStore.getState().showCourses()}
        >
          Start Game
        </button>{" "}
      </div>
    </div>
  );
};
