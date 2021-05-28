import { useSpring, animated } from "@react-spring/three";
import { Html } from "@react-three/drei";
import React, { useMemo, useRef, useLayoutEffect } from "react";
import { useLoader } from "react-three-fiber";
import { Color, FontLoader, Mesh, Vector3 } from "three";
import { useLevelStore } from "../stores/levelStore";
import courseList from "./gameData.json";

function useCenterAlign(mesh: React.MutableRefObject<Mesh | undefined>) {
  useLayoutEffect(() => {
    const size = new Vector3();
    if (mesh.current) {
      mesh.current.geometry.computeBoundingBox();
      mesh.current.geometry.boundingBox?.getSize(size);
      mesh.current.position.x = -size.x / 2;
      mesh.current.position.y = -size.y / 2;
    }
  }, []);
}
export default function CourseComplete({
  vAlign = "center",
  hAlign = "center",
  size = 1,
  color = "#000000",
}) {
  const font = useLoader(FontLoader, "/teko.json");
  const config = useMemo(
    () => ({
      font,
      size: 60,
      height: 10,
      curveSegments: 32,
      bevelEnabled: false,
    }),
    [font]
  );
  const mesh = useRef<Mesh>();
  const scoreRef = useRef<Mesh>();
  useCenterAlign(mesh);
  useCenterAlign(scoreRef);
  const scale = 0.01;
  const state = useLevelStore((state) => state.state);
  const strokes = useLevelStore((state) => state.strokes);
  const courseIndex = useLevelStore((state) => state.courseIndex);
  const totalStrokes = Object.values(strokes ?? []).reduce(
    (acc, next) => acc + next,
    0
  );
  const totalPar =
    courseList[courseIndex ?? -1]?.levels.reduce(
      (acc, next) => acc + next.par,
      0
    ) || 0;
  const { position } = useSpring({
    config: { tension: 150, friction: 50 },
    position: state !== "summary" ? [0, 1.5, 10] : [0, 1.5, 0],
  });
  return (
    <animated.group position={position as unknown as Vector3}>
      <group scale={[scale * size, scale * size, scale]}>
        <mesh ref={mesh}>
          <textGeometry args={["Course Complete", config]} />
          <meshStandardMaterial
            color={0x00aaff}
            emissive={new Color(0x0044ff)}
          />
        </mesh>
        <group position={[0, -80, 0]}>
          <mesh ref={scoreRef}>
            <textGeometry
              args={[
                `Score: ${totalStrokes}
Par: ${totalPar}`,
                {
                  font,
                  size: 45,
                  height: 10,
                  curveSegments: 32,
                  bevelEnabled: false,
                },
              ]}
            />
            <meshStandardMaterial
              color={0xffffff}
              emissive={new Color(0xffffff)}
            />
          </mesh>
        </group>

        <pointLight position={[1, 1, 100]} />
      </group>
    </animated.group>
  );
}
