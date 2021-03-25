import { useSpring } from "@react-spring/three";
import { useEffect } from "react";
import { useLevelStore } from "../stores/levelStore";

export function useLoadingSpring(
  scaleInput: readonly [number, number, number] = [1, 1, 1]
) {
  const loading = useLevelStore.getState().state !== "playing";

  const [{ scale }, set] = useSpring(() => ({
    config: { tension: 100, friction: 15 },
    scale: loading ? [0.0001, 0.0001, 0.0001] : scaleInput,
  }));

  useEffect(() => {
    const unsub = useLevelStore.subscribe(
      (state) => {
        if (state !== "playing") set({ scale: [0.0001, 0.0001, 0.0001] });
        if (state === "playing") set({ scale: scaleInput });
      },
      (state) => state.state
    );
    return () => unsub();
  }, []);
  return scale;
}
