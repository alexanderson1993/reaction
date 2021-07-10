import React, { Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { StarsContainer } from "./components/StarsContainer";
import "./components/musicPlayer";
import { GameCanvas } from "./components/GameCanvas";
import Star from "./components/star";
import { Color, Vector3 } from "three";
import { Planet } from "./components/Planet";
import CourseComplete from "./components/CourseComplete";
import { GameButtons } from "./GameButtons";
import { Score } from "./Score";
import { Credits } from "./Credits";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { A11yAnnouncer, A11ySection } from "@react-three/a11y";
import { Tutorial } from "./Tutorial";
import { LevelSummary } from "./LevelSummary";

function CorrectLighting() {
  const { gl } = useThree();
  gl.physicallyCorrectLights = true;
  return null;
}

const queryClient = new QueryClient();

function User() {
  const user = useQuery("user", function getUser() {
    return fetch("/.netlify/functions/user").then((res) => res.json());
  });
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Credits />
      <Score />
      <Tutorial />
      <LevelSummary />
      <GameButtons />
      <A11yAnnouncer />
      <Canvas
        dpr={window.devicePixelRatio}
        camera={{
          far: 10000,
          fov: 45,
          position: new Vector3(0, 0, 8),
        }}
      >
        <CorrectLighting />
        <Suspense fallback={null}>
          <ambientLight intensity={0.1} />
          <CourseComplete />
          <A11ySection
            label="Game board"
            description="The game board is an 8 by 8 grid of objects, including atoms, mirrors, wormholes, and direction-changing arrows. Click on the atoms to charge them up and release their particles to create chain reactions. The level is complete when all of the atoms have been burst."
          >
            <GameCanvas />
          </A11ySection>
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
    </QueryClientProvider>
  );
}

export default App;
