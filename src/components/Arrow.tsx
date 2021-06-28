import React, { useEffect } from "react";
// A THREE.js React renderer, see: https://github.com/drcmda/@react-three/fiber
import Electron from "./Atom/Electron";
import { useSpring, animated } from "@react-spring/three";
import { Color, Vector3 } from "three";
import { useLevelStore } from "../stores/levelStore";
import { useLoadingSpring } from "../helpers/useLoadingSpring";

const scaleInput = [0.2, 0.2, 0.2] as const;
const Arrow = ({ cell }: { cell: number }) => {
  const direction = useLevelStore.getState().currentLevel?.[cell];
  const rotation =
    direction === "u"
      ? Math.PI / 2
      : direction === "d"
      ? -Math.PI / 2
      : direction === "l"
      ? Math.PI
      : 0;

  return (
    <animated.group rotation={[0, 0, rotation]} scale={[0.2, 0.2, 0.2]}>
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
    </animated.group>
  );
};

export default Arrow;
