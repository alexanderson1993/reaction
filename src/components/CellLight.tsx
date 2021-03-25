import * as React from "react";
import Light from "./Light";

export function CellLight({
  type,
}: {
  type: "atom" | "hole" | "copy" | string;
}) {
  const lightColor =
    type === "atom"
      ? "orange"
      : type === "hole"
      ? 0x361685
      : type === "copy"
      ? 0xffad00
      : 0x000000;
  return <Light color={lightColor} />;
}
