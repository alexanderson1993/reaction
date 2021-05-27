import React from "react";
import { useLoadingSpring } from "../helpers/useLoadingSpring";
import Alpha from "./Alpha";

export const Particles = ({
  scale,
}: {
  scale: ReturnType<typeof useLoadingSpring>;
}) => {
  // Since React can't add and remove nodes very well,
  // just have a pool of 50 particles that we can use
  // at any given time.
  return (
    <>
      {Array.from({ length: 100 }).map((_, i) => (
        <Alpha key={`alpha-${i}`} index={i} scale={scale} />
      ))}
    </>
  );
};
