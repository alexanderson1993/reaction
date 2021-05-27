import React from "react";
import { useFrame } from "react-three-fiber";
import { animated } from "react-spring/three";
import fade from "./fade.jpg";
import mapImg from "./map.jpg";
import { useTexture } from "@react-three/drei";
import { Color, Group, Vector3 } from "three";
import { useLevelStore } from "../../stores/levelStore";
import { useLoadingSpring } from "../../helpers/useLoadingSpring";

const Alpha = ({
  index,
  scale,
}: {
  index: number;
  scale: ReturnType<typeof useLoadingSpring>;
}) => {
  const map = useTexture(mapImg);
  const alphaMap = useTexture(fade);
  const outerGroup = React.useRef<Group>(null);
  useFrame(() => {
    if (!outerGroup.current) return;
    const particle = useLevelStore.getState().particleLocations[index];
    if (!particle) {
      outerGroup.current.position.set(50000, 50000, 50000);
      return;
    }
    outerGroup.current.visible = true;
    const [x, y, direction] = particle;
    const rotation =
      direction === "d"
        ? 0
        : direction === "r"
        ? Math.PI / 2
        : direction === "l"
        ? (3 * Math.PI) / 2
        : direction === "u"
        ? Math.PI
        : 0;
    const position = [
      -5 / 2 + 5 / 16 + (5 / 8) * x,
      5 / 2 - 5 / 16 - (5 / 8) * y,
    ];
    outerGroup.current.position.set(position[0], position[1], 0.25);
    outerGroup.current.rotation.set(0, 0, rotation);
    const scaleFactor =
      0.08 * Math.max(0, 1 - Math.max(0, x * -1, y * -1, x - 7, y - 7));
    outerGroup.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
  });
  let group = React.useRef<Group>();
  let z = 0;
  const offset = 0;
  useFrame(() => {
    const y = (z += 0.3 + offset / 2);

    group.current && group.current.rotation.set(0, y, 0);
  });

  return (
    <group ref={outerGroup}>
      <animated.group ref={group} scale={scale as unknown as Vector3}>
        <mesh>
          <sphereGeometry attach="geometry" args={[0.8, 16, 16]} />
          <animated.meshStandardMaterial
            attach="material"
            color={0x571d91}
            emissive={0x9900bb as unknown as Color}
            emissiveIntensity={1.2}
            transparent
            depthWrite={false}
          />
        </mesh>
        {/* <Light intensity={1} decay={2} color={0x440088} /> */}
        <mesh position={[0, 2.5, 0]} rotation={[Math.PI, 0, 0]}>
          <cylinderGeometry
            attach="geometry"
            args={[0.8, 0.4, 5, 16, 16, true]}
          />
          <animated.meshStandardMaterial
            attach="material"
            map={map}
            transparent
            alphaMap={alphaMap}
            emissive={0x6600bb as unknown as Color}
            emissiveIntensity={1}
            depthWrite={false}
          />
        </mesh>
      </animated.group>
    </group>
  );
};
export default Alpha;
