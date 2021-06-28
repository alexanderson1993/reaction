import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Group, MathUtils, Mesh, MeshStandardMaterial } from "three";
import { GroupProps, useFrame } from "@react-three/fiber";
import Electron from "./Electron";
import { useLevelStore } from "../../stores/levelStore";

const lowEnergyMaterial2 = new MeshStandardMaterial({ color: "rebeccapurple" });
const highEnergyMaterial2 = new MeshStandardMaterial({
  color: "goldenrod",
  emissive: "yellow",
  emissiveIntensity: 1,
});
const midEnergyMaterial2 = new MeshStandardMaterial({
  color: "red",
  emissive: "#ff2800",
  emissiveIntensity: 0.5,
});
const energyLevels = { 1: 1, 2: 3, 3: 7, 4: 15 };
export default function Atom({
  cell,
  size = 4,
  type = "atom",
}: {
  cell: number;
  size?: number;
  type?: "atom" | "hole" | "copy";
}) {
  const group = useRef<Group>();
  const { nodes, materials } = useGLTF("/atom.glb") as any;
  let theta = useRef(Math.random() * 100);
  useFrame(() => {
    const r = 5 * Math.sin(MathUtils.degToRad((theta.current += 0.1)));
    group.current && group.current.rotation.set(r, r, r);

    let energy = type === "hole" ? 1 : size;
    const dampening = 40 / energy;
    (group.current?.children as Mesh[])?.forEach((particle, index) => {
      if (type === "hole" || type === "copy") {
        particle.visible = true;
        if (type === "hole") {
          particle.material =
            index % 2 === 0 ? materials["Low Energy 1"] : lowEnergyMaterial2;
        }
        if (type === "copy") {
          particle.material =
            index % 2 === 0 ? materials["High Energy 2"] : highEnergyMaterial2;
        }
      } else if (index <= energyLevels[size as 1 | 2 | 3 | 4]) {
        particle.visible = true;
        if (size === 1) {
          particle.material =
            index % 2 === 0
              ? materials["Low Energy 1"]
              : materials["Low Energy 2"];
        }
        if (size === 2) {
          particle.material =
            index === 1 || index === 0
              ? materials["Low Energy 3"]
              : materials["Low Energy 2"];
        }
        if (size === 3) {
          particle.material = [0, 1, 3, 4].includes(index)
            ? midEnergyMaterial2
            : materials["High energy 1"];
        }
        if (size === 4) {
          particle.material =
            index % 2 === 0
              ? materials["High energy 1"]
              : materials["High Energy 2"];
        }
      } else {
        particle.visible = false;
      }

      if (!particle.userData.originalPosition) {
        particle.userData.originalPosition = {
          x: particle.position.x,
          y: particle.position.y,
          z: particle.position.z,
        };
      }
      const { x, y, z } = particle.userData.originalPosition;
      particle.position.set(
        x + (Math.random() - 0.5) / dampening,
        y + (Math.random() - 0.5) / dampening,
        z + (Math.random() - 0.5) / dampening
      );
    });
  });
  const orangeColor =
    type === "atom" ? 0xffa500 : type === "hole" ? 0x361685 : 0xffad00;

  return (
    <group
      dispose={null}
      onPointerOver={() =>
        type === "atom" && (document.body.style.cursor = "pointer")
      }
      onPointerOut={() => type === "atom" && (document.body.style.cursor = "")}
      onPointerDown={(e) => {
        if (type === "atom") {
          e.stopPropagation();
          useLevelStore.getState().incrementStrokes();
          useLevelStore.getState().bumpAtom(cell);
        }
      }}
    >
      <group ref={group} scale={[0.07, 0.07, 0.07]} dispose={null}>
        <mesh
          geometry={(nodes.Atom_11 as Mesh).geometry}
          material={materials["Low Energy 1"]}
          position={[0, 0, -1]}
        />
        <mesh
          geometry={(nodes.Atom_12 as Mesh).geometry}
          material={materials["Low Energy 2"]}
          position={[0, 0, 1]}
        />
        <mesh
          geometry={(nodes.Atom_21 as Mesh).geometry}
          material={materials["Low Energy 3"]}
          position={[-1.25, 0, 0]}
        />
        <mesh
          geometry={(nodes.Atom_22 as Mesh).geometry}
          material={materials["Low Energy 3"]}
          position={[1.25, 0, 0]}
        />
        <mesh
          geometry={(nodes.Atom_31 as Mesh).geometry}
          material={materials["Mid Energy 1"]}
          position={[-0.75, -1, 0]}
        />
        <mesh
          geometry={(nodes.Atom_32 as Mesh).geometry}
          material={materials["Mid Energy 1"]}
          position={[0.75, 1, 0]}
        />
        <mesh
          geometry={(nodes.Atom_33 as Mesh).geometry}
          material={materials["Mid Energy 1"]}
          position={[-0.75, 1, 0]}
        />
        <mesh
          geometry={(nodes.Atom_34 as Mesh).geometry}
          material={materials["Mid Energy 1"]}
          position={[0.75, -1, 0]}
        />
        <mesh
          geometry={(nodes.Atom_41 as Mesh).geometry}
          material={materials["High energy 1"]}
          position={[0.5, -0.75, 1]}
        />
        <mesh
          geometry={(nodes.Atom_42 as Mesh).geometry}
          material={materials["High Energy 2"]}
          position={[-0.5, -0.75, 1]}
        />
        <mesh
          geometry={(nodes.Atom_43 as Mesh).geometry}
          material={materials["High Energy 2"]}
          position={[0.5, 0.75, 1]}
        />
        <mesh
          geometry={(nodes.Atom_44 as Mesh).geometry}
          material={materials["High energy 1"]}
          position={[-0.5, 0.75, 1]}
        />
        <mesh
          geometry={(nodes.Atom_48 as Mesh).geometry}
          material={materials["High energy 1"]}
          position={[0.5, -0.75, -1]}
        />
        <mesh
          geometry={(nodes.Atom_47 as Mesh).geometry}
          material={materials["High Energy 2"]}
          position={[-0.5, -0.75, -1]}
        />
        <mesh
          geometry={(nodes.Atom_46 as Mesh).geometry}
          material={materials["High Energy 2"]}
          position={[0.5, 0.75, -1]}
        />
        <mesh
          geometry={(nodes.Atom_45 as Mesh).geometry}
          material={materials["High energy 1"]}
          position={[-0.5, 0.75, -1]}
        />
      </group>
      <Electron
        shown={size !== 0}
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
    </group>
  );
}

useGLTF.preload("/atom.glb");
