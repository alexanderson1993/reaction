import React, { useEffect } from "react";
// A THREE.js React renderer, see: https://github.com/drcmda/react-three-fiber
import Electron from "./Atom/Electron";
import { useSpring, animated } from "react-spring/three";
import { Color, Vector3 } from "three";
import { useLevelStore } from "../stores/levelStore";
import { useLoadingSpring } from "../helpers/useLoadingSpring";

const scaleInput = [0.2, 0.2, 0.2] as const;
const Arrow = ({
  cell,
  direction = "r",
}: {
  cell: number;
  direction: "l" | "r" | "u" | "d";
}) => {
  const scale = useLoadingSpring(scaleInput);

  const rotation =
    direction === "u"
      ? Math.PI / 2
      : direction === "d"
      ? -Math.PI / 2
      : direction === "l"
      ? Math.PI
      : 0;

  const x = cell % 8;
  const y = Math.floor(cell / 8);

  return (
    <animated.group
      rotation={[0, 0, rotation]}
      scale={(scale as unknown) as Vector3}
      position={[
        0.05 + -5 / 2 + 5 / 16 + (5 / 8) * x,
        5 / 2 - 5 / 16 - (5 / 8) * y,
        0.25,
      ]}
    >
      <mesh
        rotation={[Math.PI / 4, 0, Math.PI / 2]}
        position={[-0.5, 0, 0]}
        scale={[0.7, 1, 0.7]}
      >
        <cylinderBufferGeometry args={[0.5, 0.5, 1, 4]} />
        <meshLambertMaterial
          attach="material"
          color={0x0066ff}
          emissive={new Color(0x0066ff)}
          emissiveIntensity={0.2}
          transparent
        />
      </mesh>
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        position={[0.5, 0, 0]}
        scale={[1, 1, 0.5]}
      >
        <cylinderBufferGeometry args={[0.75, 0, 1, 4]} />
        <meshLambertMaterial
          attach="material"
          color={0x0066ff}
          emissive={new Color(0x0066ff)}
          emissiveIntensity={0.2}
          transparent
        />
      </mesh>
      <Electron shown scale={[1, 1, 1]} color={0x0088ff} />
      <Electron shown scale={[1, 1, 1]} offset={0.2} color={0x0088ff} />
    </animated.group>
  );
};

export default Arrow;
