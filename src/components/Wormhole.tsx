import React, { useRef } from "react";
import { useFrame } from "react-three-fiber";
import { useSpring, animated } from "react-spring/three";
import { Color, DoubleSide, Group, Mesh, Texture, Vector3 } from "three";
import { useTexture } from "@react-three/drei";

import distort1 from "./distort/distort1.jpg";
import distort2 from "./distort/distort2.jpg";
import distort3 from "./distort/distort3.jpg";
import distort4 from "./distort/distort4.jpg";
import { useLevelStore } from "../stores/levelStore";
import { useLoadingSpring } from "../helpers/useLoadingSpring";

const Cloud = ({
  map,
  i,
  color,
}: {
  map: Texture;
  i: number;
  color: Color;
}) => {
  const scaleBasis = 0.3;
  const ref = React.useRef<Mesh>();
  const random = React.useRef(Math.random() * 100);
  let theta = random.current;
  useFrame(() => {
    if (!ref.current) return;
    // Some things maybe shouldn't be declarative, we're in the render-loop here with full access to the instance
    const r = (theta += 0.03 * (i - 1.5));
    ref.current.rotation.set(0, 0, r);
    const s = Math.sin((theta * i) / 5) * (scaleBasis - 0.5) + 0.5;
    ref.current.scale.set(s, s, s);
  });

  return (
    <mesh ref={ref} position={[0, 0, i / 100 / random.current]}>
      <circleBufferGeometry attach="geometry" args={[0.5, 8]} />
      <meshBasicMaterial
        attach="material"
        transparent
        alphaMap={map}
        opacity={1}
        color={color}
        side={DoubleSide}
        // emissive={color}
        // emissiveIntensity={2}
        depthWrite={false}
      />
    </mesh>
  );
};
const colors = {
  ")": 0xff0000,
  "!": 0x00ff00,
  "@": 0x0000ff,
  "#": 0xffff00,
  $: 0xff00ff,
  "%": 0x00ffff,
  "^": 0xffffff,
  "&": 0x333333,
  "*": 0xff8800,
  "(": 0x00ff88,
};
const Wormhole = ({
  cell,
  object,
}: {
  cell: number;
  object: keyof typeof colors;
}) => {
  const color = colors[object];

  const maps = useTexture([distort1, distort2, distort3, distort4]);

  const meshRef = useRef<Group>();
  useFrame(({ camera }) => {
    meshRef.current?.quaternion.copy(camera.quaternion);
  });

  return (
    <animated.group ref={meshRef} rotation={[0.5, 0, 0]}>
      <mesh scale={[0.1, 0.1, 0.1]} renderOrder={Infinity}>
        <sphereGeometry attach="geometry" args={[1, 16, 16]} />
        <meshBasicMaterial attach="material" color={0x000000} />
      </mesh>
      {maps.map((map, i) => (
        <Cloud key={`cloud-${i}`} map={map} i={i} color={new Color(color)} />
      ))}
    </animated.group>
  );
};
export default Wormhole;
