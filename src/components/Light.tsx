import { useSpring, animated } from "@react-spring/three";
import React, { useEffect, useRef } from "react";
import { PointLightProps, useFrame } from "react-three-fiber";
import { PointLight } from "three";
import { useLevelStore } from "../stores/levelStore";

export default function Light(props: PointLightProps) {
  const ref = useRef<PointLight>();
  const [{ intensity }, set] = useSpring(() => ({
    config: { tension: 100, friction: 15 },
    intensity: useLevelStore.getState().loading ? 0 : 1,
  }));
  useEffect(() => {
    const unsub = useLevelStore.subscribe(
      (state) => {
        if (state === true) set({ intensity: 0 });
        if (state === false) set({ intensity: 1 });
      },
      (state) => state.loading
    );
    return () => unsub();
  }, []);
  return <animated.pointLight ref={ref} {...props} intensity={intensity} />;
}
