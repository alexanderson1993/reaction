import * as THREE from "three";
import React, { useRef } from "react";
// A THREE.js React renderer, see: https://github.com/drcmda/@react-three/fiber
import { useFrame } from "@react-three/fiber";
import Particle from "./Particle";
import Electron from "./Electron";
import { useSpring, animated } from "@react-spring/three";
import {
  Color,
  Group,
  InstancedMesh,
  MathUtils,
  Object3D,
  Vector3,
} from "three";
import Light from "../Light";
import { useLevelStore } from "../../stores/levelStore";
import { useLoadingSpring } from "../../helpers/useLoadingSpring";
import { useTexture } from "@react-three/drei";
import alphamap from "./alphamap.jpg";

const particles = [
  { position: [0, 1, 0], shown: 1 },
  { position: [-0.75, 0, -1], shown: 3 },
  {
    position: [0, -1, 0],
    shown: 1,
  },
  {
    position: [-1.25, 0, 0],
    shown: 2,
  },
  { position: [-0.75, 0, 1], shown: 3 },
  { position: [1.25, 0, 0], shown: 2 },
  { position: [0.75, 0, 1], shown: 3 },
  { position: [0.75, 0, -1], shown: 3 },
  { position: [-0.5, -1, -0.75], shown: 4 },
  { position: [-0.5, -1, 0.75], shown: 4 },
  { position: [0.5, 1, 0.75], shown: 4 },
  { position: [0.5, -1, 0.75], shown: 4 },
  { position: [0.5, -1, -0.75], shown: 4 },
  { position: [-0.5, 1, -0.75], shown: 4 },
  { position: [0.5, 1, -0.75], shown: 4 },
  { position: [-0.5, 1, 0.75], shown: 4 },
];
const tempObject = new Object3D();
const tempColor = new Color();
const bump = (cell: number) => {
  console.log("bump");
};
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
  const ref = useRef<InstancedMesh>();
  const doBump = (e: MouseEvent) => {
    if (type === "atom" && !exploded) {
      e.stopPropagation();
      if (size === 4) setExploded(true);
      bump(cell);
    }
  };

  let group = useRef<Group>();
  let theta = useRef(Math.random() * 100);
  useFrame(() => {
    // Some things maybe shouldn't be declarative, we're in the render-loop here with full access to the instance
    const r = 5 * Math.sin(MathUtils.degToRad((theta.current += 0.1)));
    group.current && group.current.rotation.set(r, r, r);
  });

  const orangeColor =
    type === "atom" ? 0xffa500 : type === "hole" ? 0x361685 : 0xffad00;
  const redOrangeColor =
    type === "atom" ? 0xff4400 : type === "hole" ? 0x24098a : 0xffcf00;
  if (type !== "atom") {
    size = 4;
  }
  useFrame(() => {
    if (!ref.current) return;
    for (let i = 0; i < 16; i++) {
      let position = particles[i].position;
      const dampening = 40 / (type === "hole" ? 1 : size);

      tempObject.position.set(
        position[0] + (Math.random() - 0.5) / dampening,
        position[1] + (Math.random() - 0.5) / dampening,
        position[2] + (Math.random() - 0.5) / dampening
      );
      const scaleValue = particles[i].shown <= size ? 1 : 0.00001;
      tempObject.scale.set(scaleValue, scaleValue, scaleValue);
      tempObject.updateMatrix();
      ref.current?.setMatrixAt(i, tempObject.matrix);
      tempColor.setHex(
        size === 1 && i === 0
          ? 0x221166
          : size === 1 && i === 2
          ? 0x402200
          : i % 2 === 0
          ? orangeColor
          : redOrangeColor
      );

      ref.current.setColorAt(i, tempColor);
    }
    if (ref.current.instanceColor) {
      ref.current.instanceColor.needsUpdate = true;
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  const map = useTexture(alphamap);
  return (
    <animated.group
      ref={group}
      onPointerOver={() =>
        type === "atom" && (document.body.style.cursor = "pointer")
      }
      onPointerOut={() => type === "atom" && (document.body.style.cursor = "")}
      onPointerDown={doBump}
      scale={[0.08, 0.08, 0.08]}
    >
      <instancedMesh ref={ref} args={[null, null, 16] as any}>
        <sphereBufferGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="white" alphaMap={map} transparent />
      </instancedMesh>
    </animated.group>
  );
}

export default Atom;
/*
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
      */
