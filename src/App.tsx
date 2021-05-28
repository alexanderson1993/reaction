import { OrbitControls } from "@react-three/drei";
import React, { Suspense } from "react";
import { Canvas, useThree } from "react-three-fiber";
import { StarsContainer } from "./components/StarsContainer";
import "./components/musicPlayer";
import { GameCanvas } from "./components/GameCanvas";
import { Title } from "./components/Title";
import Star from "./components/star";
import { Color, Vector3 } from "three";
import { Planet } from "./components/Planet";
import courseList from "./components/gameData.json";
import { useLevelStore } from "./stores/levelStore";
import CourseComplete from "./components/CourseComplete";
function CorrectLighting() {
  const { gl } = useThree();
  gl.physicallyCorrectLights = true;
  return null;
}
const Credits = () => {
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

function Score() {
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
function GameButtons() {
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
function App() {
  return (
    <>
      <Credits />
      <Score />
      <GameButtons />
      <Canvas
        camera={{
          far: 10000,
          fov: 45,
          position: new Vector3(0, 0, 8),
        }}
        concurrent
      >
        <CorrectLighting />
        <Suspense fallback={null}>
          <ambientLight intensity={0.1} />
          <CourseComplete />
          <GameCanvas />
          <StarsContainer />
          <Planet scale={[10, 10, 10]} position={[-25, -3, -20]} />
          <Star
            scale={[20, 20, 20]}
            position={[20, 5, -15]}
            color1={new Color("orange")}
            color2={new Color("red")}
          />
        </Suspense>
      </Canvas>
    </>
  );
}

export default App;
