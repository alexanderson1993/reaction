import React from "react";
import { useSpring, animated } from "react-spring/three";
import {
  CubeRefractionMapping,
  SphereBufferGeometry,
  SphereGeometry,
} from "three";
import { useCubeTexture } from "@react-three/drei";

import radPosX from "./radiance/posX.jpg";
import radNegX from "./radiance/negX.jpg";
import radPosY from "./radiance/posY.jpg";
import radNegY from "./radiance/negY.jpg";
import radPosZ from "./radiance/posZ.jpg";
import radNegZ from "./radiance/negZ.jpg";
import { useLevelStore } from "../../stores/levelStore";
import { useLoadingSpring } from "../../helpers/useLoadingSpring";

const Mirror = ({
  cell,
  direction = "m",
}: {
  cell: number;
  direction: "m" | "mL" | "mR";
}) => {
  const scale = useLoadingSpring();

  const x = cell % 8;
  const y = Math.floor(cell / 8);

  const radiance = useCubeTexture(
    [radPosX, radNegX, radPosY, radNegY, radPosZ, radNegZ],
    { path: "." }
  );
  radiance.mapping = CubeRefractionMapping;
  const [geometry] = React.useMemo(() => {
    const geometry =
      direction === "m"
        ? new SphereBufferGeometry(0.7, 4, 8)
        : new SphereBufferGeometry(1, 16, 16);
    return [geometry];
  }, [direction]);
  return (
    <animated.group
      position={[
        -5 / 2 + 5 / 16 + (5 / 8) * x,
        5 / 2 - 5 / 16 - (5 / 8) * y,
        0.25,
      ]}
      scale={(scale as unknown) as [number, number, number]}
    >
      <mesh
        scale={direction === "m" ? [0.3, 0.3, 0.3] : [0.25, 0.05, 0.2]}
        rotation={
          direction === "m"
            ? [Math.PI / 2, Math.PI / 4, 0]
            : direction === "mL"
            ? [0, 0, Math.PI / 4]
            : [0, 0, -Math.PI / 4]
        }
        geometry={geometry}
      >
        <meshPhysicalMaterial
          color={0x0088ff}
          roughness={0}
          metalness={0}
          envMapIntensity={5}
          premultipliedAlpha
          envMap={radiance}
          attach="material"
          depthTest={false}
          transparent
        />
      </mesh>
    </animated.group>
  );
};

export default Mirror;
