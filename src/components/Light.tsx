import { useSpring, animated } from "@react-spring/three";
import React, { useEffect, useRef } from "react";
import { PointLightProps, useFrame } from "@react-three/fiber";
import { PointLight } from "three";
import { useLevelStore } from "../stores/levelStore";

export default function Light(props: PointLightProps) {
  const ref = useRef<PointLight>();
  const state = useLevelStore((store) => store.state);

  const { intensity } = useSpring({
    config: { tension: 100, friction: 15 },
    intensity: state !== "playing" ? 0 : 1,
  });
  return null; //<animated.pointLight ref={ref} {...props} intensity={intensity} />;
}
