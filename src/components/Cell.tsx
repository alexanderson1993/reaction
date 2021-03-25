import React from "react";
import { Vector3 } from "three";
import { useLoadingSpring } from "../helpers/useLoadingSpring";
import { useLevelStore } from "../stores/levelStore";
import Arrow from "./Arrow";
import Atom from "./Atom/Atom";
import { CellLight } from "./CellLight";
import Mirror from "./Mirror";
import Wormhole from "./Wormhole";

export const Cell = ({ cell }: { cell: number }) => {
  const selector = React.useCallback(
    (state) => (state.currentLevel ? state.currentLevel[cell] : null),
    [cell]
  );
  const object = useLevelStore(selector);
  const scale = useLoadingSpring();
  const x = cell % 8;
  const y = Math.floor(cell / 8);
  return (
    <group
      position={[
        -5 / 2 + 5 / 16 + (5 / 8) * x,
        5 / 2 - 5 / 16 - (5 / 8) * y,
        0.25,
      ]}
      scale={(scale as unknown) as Vector3}
    >
      <CellLight
        type={
          ["1", "2", "3", "4", "p"].includes(object)
            ? "atom"
            : object === "b"
            ? "hole"
            : object === "e"
            ? "copy"
            : ""
        }
      />
    </group>
  );

  if (!object) return null;
  if ("!@#$%^&*()".includes(object)) {
    return <Wormhole cell={cell} object={object} />;
  }
  switch (object) {
    case "1":
    case "2":
    case "3":
    case "4":
    case "p":
      return (
        <Atom cell={cell} size={parseInt(object === "p" ? 0 : object, 10)} />
      );
    case "b":
      return <Atom cell={cell} type="hole" />;
    case "e":
      return <Atom cell={cell} type="copy" />;
    case "d":
    case "l":
    case "u":
    case "r":
      return <Arrow cell={cell} direction={object} />;
    case "m":
    case "R":
    case "L":
      return <Mirror cell={cell} direction={object} />;
    case "-":
      return null;
    default:
      return null;
  }
};
