import React from "react";
import { useFrame, useLoader } from "react-three-fiber";
import { FrontSide, Mesh, TextureLoader } from "three";

interface CloudsProps {
  texture: string;
}
const Clouds: React.FC<CloudsProps> = ({ texture }) => {
  const clouds = useLoader(TextureLoader, texture);
  const ref = React.useRef<Mesh>(null);

  useFrame(() => {
    ref.current?.rotateY(0.005);
  });
  return (
    <mesh ref={ref} scale={[1.01, 1.01, 1.01]}>
      <sphereBufferGeometry args={[1, 32, 32]} attach="geometry" />
      <meshLambertMaterial
        map={clouds}
        side={FrontSide}
        transparent
        opacity={0.4}
        attach="material"
      />
    </mesh>
  );
};

export default Clouds;
