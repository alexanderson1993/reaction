import React from "react";
import { Stars } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Mesh } from "three";

const bgColor = new Color(0x040210);
export const StarsContainer = () => {
  let z = Math.random() * 10;
  const rotationAmount = 0.0002;
  const starsRef = useRef<Mesh>();
  useFrame(({ scene }) => {
    scene.background = bgColor;
    const rz = (z += rotationAmount);
    const ry = Math.sin((z += rotationAmount / 10));
    starsRef.current && starsRef.current.rotation.set(0, ry, rz);
  });
  return <Stars ref={starsRef} saturation={1} radius={250} />;
};
