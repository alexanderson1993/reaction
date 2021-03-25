import React from "react";
import { useFrame, useUpdate } from "react-three-fiber";
import { animated } from "react-spring/three";
import fade from "./fade.jpg";
import mapImg from "./map.jpg";
import { useTexture } from "@react-three/drei";
import { Color, Group, Vector3 } from "three";
import Light from "../Light";
import { useLoadingSpring } from "../../helpers/useLoadingSpring";

const scaleInput = [0.1, 0.1, 0.1] as const;
const Alpha = ({ index }: { index: number }) => {
  const particle: {
    position: { x: number; y: number };
    direction: "u" | "d" | "l" | "r";
    destroyed: boolean;
  } = { position: { x: 1, y: 0 }, direction: "d", destroyed: false };
  const { position = { x: 0, y: 0 }, direction = "d", destroyed = false } =
    particle || {};
  const scale = useLoadingSpring(scaleInput);

  const map = useTexture(mapImg);
  const alphaMap = useTexture(fade);

  let outerGroup = useUpdate<Group>(
    (group) => {
      const rotation =
        direction === "d"
          ? 0
          : direction === "r"
          ? Math.PI / 2
          : direction === "l"
          ? (3 * Math.PI) / 2
          : direction === "u"
          ? Math.PI
          : 0;
      particle
        ? group.position.set(position.x, position.y, 0.25)
        : group.position.set(500, 500, 0.25);
      group.rotation.set(0, 0, rotation);
      const scaleFactor = Math.abs(
        1 -
          Math.max(
            0,
            Math.abs(position.x) / 2.5 - 1,
            Math.abs(position.y) / 2.5 - 1
          ) *
            4.7
      );
      group.scale.set(scaleFactor, scaleFactor, scaleFactor);
    },
    [position.x, position.y, destroyed, direction]
  );
  let group = React.useRef<Group>();
  let z = 0;
  const offset = 0;
  useFrame(() => {
    const y = (z += 0.3 + offset / 2);

    group.current && group.current.rotation.set(0, y, 0);
  });

  return (
    <group ref={outerGroup}>
      <animated.group ref={group} scale={(scale as unknown) as Vector3}>
        <mesh>
          <sphereGeometry attach="geometry" args={[0.8, 16, 16]} />
          <animated.meshStandardMaterial
            attach="material"
            color={0x571d91}
            emissive={(0x6600bb as unknown) as Color}
            emissiveIntensity={1}
            transparent
          />
        </mesh>
        <Light intensity={1} decay={2} color={0x440088} />
        <mesh position={[0, 2.5, 0]} rotation={[Math.PI, 0, 0]}>
          <cylinderGeometry
            attach="geometry"
            args={[0.8, 0.4, 5, 16, 16, true]}
          />
          <animated.meshStandardMaterial
            attach="material"
            map={map}
            transparent
            alphaMap={alphaMap}
            emissive={(0x6600bb as unknown) as Color}
            emissiveIntensity={1}
          />
        </mesh>
      </animated.group>
    </group>
  );
};
export default Alpha;
