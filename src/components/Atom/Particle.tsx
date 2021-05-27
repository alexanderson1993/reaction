import React from "react";
import { useFrame, MouseEvent } from "react-three-fiber";
import { useSpring, animated } from "react-spring/three";
import { Color, Mesh, PointLight, SphereBufferGeometry, Vector3 } from "three";
import Light from "../Light";

const geometry = new SphereBufferGeometry(1, 16, 16);
function Particle({
  position,
  shown,
  color = "orange",
  energy = 0,
  onClick = () => {},
}: {
  position: [number, number, number];
  shown: boolean;
  color: string | number;
  energy: number;
  onClick: (e: MouseEvent) => void;
}) {
  const particleRef = React.useRef<Mesh>();
  const dampening = 40 / energy;
  const { scale, emissive } = useSpring({
    config: { tension: 500, friction: 15 },
    scale: shown ? [1, 1, 1] : [0.01, 0.01, 0.01],
    emissive: energy === 4 ? 1 : 0.1,
  });
  const { color: animatedColor } = useSpring({
    config: { clamp: true },
    color,
  });
  useFrame(() => {
    particleRef.current?.position.set(
      position[0] + (Math.random() - 0.5) / dampening,
      position[1] + (Math.random() - 0.5) / dampening,
      position[2] + (Math.random() - 0.5) / dampening
    );
  });
  return (
    <group ref={particleRef}>
      <animated.mesh
        geometry={geometry}
        scale={scale as unknown as Vector3}
        onClick={onClick}
      >
        <animated.meshStandardMaterial
          attach="material"
          emissive={animatedColor as unknown as Color}
          emissiveIntensity={emissive}
          color={animatedColor}
          transparent
        />
      </animated.mesh>
    </group>
  );
}
export default Particle;
