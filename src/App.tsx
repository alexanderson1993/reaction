import { useSpring } from "@react-spring/core";
import { animated } from "@react-spring/three";
import { OrbitControls, useAspect, Text } from "@react-three/drei";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, Object3DNode, useFrame, useThree } from "react-three-fiber";
import { StarsContainer } from "./components/StarsContainer";
import "./components/musicPlayer";
import { GameCanvas } from "./components/GameCanvas";
import { Title } from "./components/Title";
import Star from "./components/star";
import { Color, Vector3 } from "three";
import { Planet } from "./components/Planet";
import courseList from "./components/gameData.json";
import { useLevelStore } from "./stores/levelStore";

function CorrectLighting() {
  const { gl } = useThree();
  gl.physicallyCorrectLights = true;
  const counter = useRef(0);
  useFrame(() => {
    if (counter.current > 100) return;
    if (counter.current > 60) {
      useLevelStore.getState().setRendered();
      counter.current = 5000;
    }
    counter.current += 1;
  });
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
        <button
          className="gradient-box"
          onClick={() => useLevelStore.getState().showCourses()}
        >
          Start Game
        </button>
        <div className="spacer" />
        <div className="flex-vertical">
          <small>Inspired by Big Bang Reaction by Freeverse Software</small>
          <small>Built with Three.js by Mr. Doob</small>
          <small>
            Built with React-Three-Fiber, React-Spring, and Zustand by Paul
            Henschel
          </small>
          <small>Built with Immer by Michel Weststrate</small>
          <small>Sound Effects by Alex Kontis-Carrington</small>
          <small>Music from https://filmmusic.io</small>
          <small>
            "Floating Cities" by Kevin MacLeod (https://incompetech.com)
          </small>
          <small>
            License: CC BY (http://creativecommons.org/licenses/by/4.0/)
          </small>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <>
      <Credits />
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
          <GameCanvas />
          <OrbitControls />
          <StarsContainer />
          <Planet scale={[10, 10, 10]} position={[-25, -3, -20]} />
          <Star
            scale={[20, 20, 20]}
            position={[16, 5, -5]}
            color1={new Color(0x224488)}
            color2={new Color(0xf6fcff)}
          />
        </Suspense>
      </Canvas>
    </>
  );
}

export default App;
