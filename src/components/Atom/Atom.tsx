import * as THREE from "three";
import React, { useRef } from "react";
// A THREE.js React renderer, see: https://github.com/drcmda/react-three-fiber
import { useFrame, MouseEvent } from "react-three-fiber";
import Particle from "./Particle";
import Electron from "./Electron";
import { useSpring, animated } from "react-spring/three";
import { Group, MathUtils, Vector3 } from "three";
import Light from "../Light";
import { useLevelStore } from "../../stores/levelStore";
import { useLoadingSpring } from "../../helpers/useLoadingSpring";

const scaleInput = [0.08, 0.08, 0.08] as const;
const bump = (cell: number) => {};
function Atom({
  cell,
  size = 1,
  type = "atom",
}: {
  cell: number;
  size?: number;
  type?: "atom" | "hole" | "copy";
}) {
  const [exploded, setExploded] = React.useState(false);

  const x = cell % 8;
  const y = Math.floor(cell / 8);

  const doBump = (e: MouseEvent) => {
    if (type === "atom" && !exploded) {
      e.stopPropagation();
      if (size === 4) setExploded(true);
      bump(cell);
    }
  };
  const scale = useLoadingSpring(scaleInput);

  let group = useRef<Group>();
  let theta = Math.random() * 10;
  useFrame(() => {
    // Some things maybe shouldn't be declarative, we're in the render-loop here with full access to the instance
    const r = 5 * Math.sin(MathUtils.degToRad((theta += 0.1)));
    group.current && group.current.rotation.set(r, r, r);
  });
  const orangeColor =
    type === "atom" ? "orange" : type === "hole" ? 0x361685 : 0xffad00;
  const redOrangeColor =
    type === "atom" ? 0xff4400 : type === "hole" ? 0x24098a : 0xffcf00;
  if (type !== "atom") {
    size = 4;
  }
  return (
    <animated.group
      ref={group}
      onPointerOver={() =>
        type === "atom" && (document.body.style.cursor = "pointer")
      }
      onPointerOut={() => type === "atom" && (document.body.style.cursor = "")}
      position={[
        -5 / 2 + 5 / 16 + (5 / 8) * x,
        5 / 2 - 5 / 16 - (5 / 8) * y,
        0.25,
      ]}
      scale={(scale as unknown) as Vector3}
    >
      <Light color={orangeColor} />
      <Particle
        energy={type === "hole" ? 1 : size}
        position={[0, 1, 0]}
        shown
        color={size >= 2 ? orangeColor : "rebeccapurple"}
        onClick={doBump}
      />
      <Particle
        onClick={doBump}
        energy={type === "hole" ? 1 : size}
        position={[0, -1, 0]}
        shown
        color={orangeColor}
      />
      <Particle
        onClick={doBump}
        energy={type === "hole" ? 1 : size}
        position={[-1.25, 0, 0]}
        shown={size >= 2}
        color={redOrangeColor}
      />
      <Particle
        onClick={doBump}
        energy={type === "hole" ? 1 : size}
        position={[1.25, 0, 0]}
        shown={size >= 2}
        color={redOrangeColor}
      />

      <Particle
        onClick={doBump}
        energy={type === "hole" ? 1 : size}
        position={[-0.75, 0, -1]}
        shown={size >= 3}
        color={orangeColor}
      />
      <Particle
        onClick={doBump}
        energy={type === "hole" ? 1 : size}
        position={[0.75, 0, 1]}
        shown={size >= 3}
        color={redOrangeColor}
      />
      <Particle
        onClick={doBump}
        energy={type === "hole" ? 1 : size}
        position={[-0.75, 0, 1]}
        shown={size >= 3}
        color={orangeColor}
      />
      <Particle
        onClick={doBump}
        energy={type === "hole" ? 1 : size}
        position={[0.75, 0, -1]}
        shown={size >= 3}
        color={redOrangeColor}
      />

      <Particle
        onClick={doBump}
        energy={type === "hole" ? 1 : size}
        position={[-0.5, -1, -0.75]}
        shown={size >= 4}
        color={orangeColor}
      />
      <Particle
        onClick={doBump}
        energy={type === "hole" ? 1 : size}
        position={[0.5, -1, 0.75]}
        shown={size >= 4}
        color={orangeColor}
      />
      <Particle
        onClick={doBump}
        energy={type === "hole" ? 1 : size}
        position={[-0.5, -1, 0.75]}
        shown={size >= 4}
        color={redOrangeColor}
      />
      <Particle
        onClick={doBump}
        energy={type === "hole" ? 1 : size}
        position={[0.5, -1, -0.75]}
        shown={size >= 4}
        color={redOrangeColor}
      />
      <Particle
        onClick={doBump}
        energy={type === "hole" ? 1 : size}
        position={[-0.5, 1, -0.75]}
        shown={size >= 4}
        color={orangeColor}
      />
      <Particle
        onClick={doBump}
        energy={type === "hole" ? 1 : size}
        position={[0.5, 1, 0.75]}
        shown={size >= 4}
        color={orangeColor}
      />
      <Particle
        onClick={doBump}
        energy={type === "hole" ? 1 : size}
        position={[-0.5, 1, 0.75]}
        shown={size >= 4}
        color={redOrangeColor}
      />
      <Particle
        onClick={doBump}
        energy={type === "hole" ? 1 : size}
        position={[0.5, 1, -0.75]}
        shown={size >= 4}
        color={redOrangeColor}
      />
      <Electron
        shown
        color={size >= 2 ? orangeColor : 0x4e1e94}
        intensity={size}
      />
      <Electron
        shown={size >= 2}
        offset={0.1}
        intensity={size}
        color={orangeColor}
      />
      <Electron
        shown={size >= 3}
        offset={0.2}
        intensity={size}
        color={orangeColor}
      />
      <Electron
        shown={size >= 4}
        offset={0.3}
        intensity={size}
        color={orangeColor}
      />
    </animated.group>
  );
}

export default Atom;
