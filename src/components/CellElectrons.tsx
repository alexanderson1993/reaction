import * as React from "react";
import {
  Color,
  Curve,
  InstancedMesh,
  Object3D,
  TubeBufferGeometry,
  Vector3,
} from "three";
import alphamap from "./Atom/alphamap.jpg";
import { useFrame } from "react-three-fiber";
import { useTexture } from "@react-three/drei";
import { CellItem, useLevelStore } from "../stores/levelStore";

class CustomCurve extends Curve<Vector3> {
  getPoint = function (t: number) {
    var tx = (t - 0.5) * 2;
    var ty = Math.sqrt(1 - Math.pow((t - 0.5) * 2, 2));
    var tz = 0;
    return new Vector3(tx, ty, tz);
  };
}
const electronCount = 64 * 4;

const path = new CustomCurve();
const geometry = new TubeBufferGeometry(path, 20, 0.1, 8, false);
const tempObject = new Object3D();
const tempColor = new Color();
const fullSize = new Vector3(0.2, 0.2, 0.2);
const zeroSize = new Vector3();

function easeInOutSine(x: number): number {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

export function CellElectrons() {
  const ref = React.useRef<InstancedMesh>();
  const interpolateRef = React.useRef(0);

  useFrame((state) => {
    const levelState = useLevelStore.getState().state;

    const time = state.clock.getElapsedTime();
    const interpolateScale = 0.05;
    if (levelState === "playing") {
      interpolateRef.current = Math.min(
        1,
        interpolateRef.current + interpolateScale
      );
    } else {
      interpolateRef.current = Math.max(
        0,
        interpolateRef.current - interpolateScale
      );
    }

    if (!ref.current) return;
    for (let i = 0; i < electronCount; i++) {
      const cell = Math.floor(i / 4);
      const offset = i % 4;
      const cellState = useLevelStore.getState().currentLevel?.[
        cell
      ] as CellItem;
      let scaleValue = interpolateRef.current;

      // Show or hide based on the cell state
      scaleValue = 0;
      if (cellState === "1" && offset === 0) scaleValue = 1;
      if (["2", "u", "d", "l", "r"].includes(cellState) && offset <= 1)
        scaleValue = 1;
      if (cellState === "3" && offset <= 2) scaleValue = 1;
      if (["4", "b", "e"].includes(cellState)) scaleValue = 1;

      if (cellState === "1" && offset === 0) {
        ref.current.setColorAt(i, tempColor.setHex(0x4e1e94));
      } else if (cellState === "b") {
        ref.current.setColorAt(i, tempColor.setHex(0x361685));
      } else if (cellState === "e") {
        ref.current.setColorAt(i, tempColor.setHex(0xffff00));
      } else if (["u", "d", "l", "r"].includes(cellState)) {
        ref.current.setColorAt(i, tempColor.setHex(0x0088ff));
      } else {
        ref.current.setColorAt(i, tempColor.setColorName("orange"));
      }
      const x = cell % 8;
      const y = Math.floor(cell / 8);
      tempObject.position.set(
        -5 / 2 + 5 / 16 + (5 / 8) * x,
        5 / 2 - 5 / 16 - (5 / 8) * y,
        0.25
      );

      tempObject.rotation.x = offset * 17 + cell * 17;
      tempObject.rotation.y = 1 * time + cell * 17 + offset * 13;
      tempObject.rotation.z =
        10 * time * (offset / 4 + 1) + cell * 17 + offset * 13;

      tempObject.scale.lerpVectors(
        zeroSize,
        fullSize,
        easeInOutSine(scaleValue)
      );
      tempObject.updateMatrix();
      ref.current.setMatrixAt(i, tempObject.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) {
      ref.current.instanceColor.needsUpdate = true;
    }
  });
  const texture = useTexture(alphamap);

  const color = "orange";
  const intensity = 1;
  return (
    <instancedMesh
      ref={ref}
      args={[null, null, electronCount] as any}
      geometry={geometry}
    >
      <meshBasicMaterial
        attach="material"
        transparent
        alphaMap={texture}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
