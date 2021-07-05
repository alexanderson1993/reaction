import { animated } from "@react-spring/three";
import React, { Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useLoadingSpring } from "../helpers/useLoadingSpring";
import { useLevelStore } from "../stores/levelStore";
import Arrow from "./Arrow";
import Atom from "./Atom/NewAtom";
import Mirror from "./Mirror";
import Wormhole from "./Wormhole";
import { A11y } from "@react-three/a11y";

const rowLetters = "ABCDEFGH";
const wormholeColors = [
  "Red",
  "Green",
  "Blue",
  "Yellow",
  "Magenta",
  "Cyan",
  "White",
  "Black",
  "Orange",
  "Lime",
];
const arrowDirections = { d: "Down", l: "Left", u: "Up", r: "Right" };
const mirrorDirections = { m: "Flat", R: "Right", L: "Left" };
const CellContents = ({ cell }: { cell: number }) => {
  const selector = React.useCallback(
    (state) => (state.currentLevel ? state.currentLevel[cell] : null),
    [cell]
  );
  const object = useLevelStore(selector);

  const x = cell % 8;
  const y = Math.floor(cell / 8);
  const rowLetter = rowLetters[y];
  const colNumber = x + 1;

  if (!object) return null;
  if ("!@#$%^&*()".includes(object)) {
    const wormholeColor = wormholeColors[")!@#$%^&*(".indexOf(object)];

    return (
      <A11y
        role="content"
        description={`${rowLetter} ${colNumber}: ${wormholeColor} Wormhole`}
      >
        <Wormhole cell={cell} object={object} />;
      </A11y>
    );
  }
  switch (object) {
    case "1":
    case "2":
    case "3":
    case "4":
    case "p":
      return (
        // @ts-ignore
        <A11y
          role={object === "p" ? "content" : "button"}
          description={
            object === "p"
              ? ""
              : `${rowLetter} ${colNumber}: Level ${object} Atom`
          }
          actionCall={() => {
            useLevelStore.getState().incrementStrokes();
            useLevelStore.getState().bumpAtom(cell);
          }}
        >
          <Atom cell={cell} size={parseInt(object === "p" ? 0 : object, 10)} />
        </A11y>
      );
    case "b":
      return (
        <A11y
          role="content"
          description={`${rowLetter} ${colNumber}: Black Hole`}
        >
          <Atom cell={cell} type="hole" />
        </A11y>
      );
    case "e":
      return (
        <A11y
          role="content"
          description={`${rowLetter} ${colNumber}: Duplicator`}
        >
          <Atom cell={cell} type="copy" />
        </A11y>
      );
    case "d":
    case "l":
    case "u":
    case "r":
      return (
        <A11y
          role="content"
          description={`${rowLetter} ${colNumber}: ${
            arrowDirections[object as keyof typeof arrowDirections]
          } Arrow`}
        >
          <Arrow cell={cell} />
        </A11y>
      );
    case "m":
    case "R":
    case "L":
      return (
        <A11y
          role="content"
          description={`${rowLetter} ${colNumber}: ${
            mirrorDirections[object as keyof typeof mirrorDirections]
          } Mirror`}
        >
          <Mirror cell={cell} direction={object} />
        </A11y>
      );
    case "-":
      return null;
    default:
      return null;
  }
};

export const Cell = ({
  cell,
  scale,
}: {
  cell: number;
  scale: ReturnType<typeof useLoadingSpring>;
}) => {
  const x = cell % 8;
  const y = Math.floor(cell / 8);

  return (
    <Suspense fallback={null}>
      <animated.group
        position={[
          -5 / 2 + 5 / 16 + (5 / 8) * x,
          5 / 2 - 5 / 16 - (5 / 8) * y,
          0.25,
        ]}
        scale={scale as unknown as Vector3}
      >
        <CellContents cell={cell} />
      </animated.group>
    </Suspense>
  );
};
