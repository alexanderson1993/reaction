import React from "react";
import Alpha from "./Alpha";

export const Particles = () => {
  // Since React can't add and remove nodes very well,
  // just have a pool of 50 particles that we can use
  // at any given time.
  return (
    <>
      {Array.from({ length: 50 }).map((_, i) => (
        <Alpha key={`alpha-${i}`} index={i} />
      ))}
    </>
  );
};
