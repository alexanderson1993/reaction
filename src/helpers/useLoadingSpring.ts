import { useSpring } from "@react-spring/three";
import { useEffect } from "react";
import { useLevelStore } from "../stores/levelStore";

export function useLoadingSpring(
  scaleInput: readonly [number, number, number] = [1, 1, 1]
) {
  const state = useLevelStore((state) => state.state);

  const { scale } = useSpring({
    config: { tension: 100, friction: 15 },
    scale: state !== "playing" ? [0.0001, 0.0001, 0.0001] : scaleInput,
  });
  return scale;
}
