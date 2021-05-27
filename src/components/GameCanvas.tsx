import * as React from "react";
import { useSpring } from "@react-spring/core";
import { animated } from "@react-spring/three";
import { Suspense } from "react";
import { Vector3 } from "three";
import { useLevelStore } from "../stores/levelStore";
import { Cell } from "./Cell";
import { Particles } from "./Particles";
import Plane from "./Plane";
import { useLoadingSpring } from "../helpers/useLoadingSpring";
import { CellElectrons } from "./CellElectrons";
import { useFrame } from "react-three-fiber";

export const GameCanvas = () => {
  const playing = ["loading", "playing"].includes(
    useLevelStore.getState().state
  );
  const [{ position, scale: groupScale }, set] = useSpring(() => ({
    config: { precision: 0.001 },
    position: playing ? [0, 0.5, 0] : [0, 0, -200],
    scale: playing ? [1, 1, 1] : [0.00001, 0.00001, 0.00001],
    onRest: () => useLevelStore.getState().loadLevel(),
  }));

  React.useEffect(() => {
    const unsub = useLevelStore.subscribe(
      (state) => {
        if (state === "playing" || state === "loading")
          set({ position: [0, 0.5, 0], scale: [1, 1, 1] });
        else {
          set({ position: [0, 0, -200], scale: [0.00001, 0.00001, 0.00001] });
        }
      },
      (state) => state.state
    );
    return () => unsub();
  }, []);
  const scale = useLoadingSpring();

  useFrame(() => {
    useLevelStore.getState().update();
  });
  return (
    <>
      {/* <pointLight color="white" intensity={1} position={[10, 10, 10]} /> */}
      <animated.group
        rotation={[-0.5, 0, 0]}
        position={position as unknown as Vector3}
        scale={groupScale as unknown as Vector3}
      >
        <Plane />
        {Array.from({ length: 64 }).map((_, cell) => (
          <Suspense key={`cell-${cell}`} fallback={null}>
            <Cell cell={cell} scale={scale} />
          </Suspense>
        ))}
        <Particles scale={scale} />
        {/* <CellElectrons /> */}
      </animated.group>
    </>
  );
};
