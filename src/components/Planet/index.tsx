import React, { Suspense, useRef } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import { Color, Mesh, TextureLoader, Vector3 } from "three";
import Clouds from "./Clouds";
import Rings from "./Rings";
import texture from "./planet_textureBlueGiant.jpg";
import rings from "./rings2.png";
import clouds from "./clouds_textureSwept.png";

const Sphere: React.FC<{ texture: string; wireframe?: boolean }> = React.memo(
  ({ texture, wireframe }) => {
    const map = useLoader(TextureLoader, `${texture}`);
    const ref = useRef<Mesh>();
    useFrame(() => {
      ref.current?.rotateY(0.0005);
    });
    return (
      <mesh ref={ref}>
        <sphereBufferGeometry args={[1, 32, 32]} attach="geometry" />
        <meshPhysicalMaterial
          map={wireframe ? undefined : map}
          wireframe={wireframe}
          transparent
          attach="material"
          emissive={new Color(0xffffff)}
          emissiveMap={map}
        />
      </mesh>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps?.texture === nextProps?.texture) return true;
    return false;
  }
);

export const Planet: React.FC<{
  position?: Vector3 | [number, number, number];
  scale: Vector3 | [number, number, number];
}> = ({ position = new Vector3(), scale }) => {
  return (
    <Suspense fallback={null}>
      <group scale={scale} position={position} rotation={[0, 0, -Math.PI / 7]}>
        <Sphere texture={texture} />
        <Rings texture={rings} />
        <Clouds texture={clouds} />
      </group>
    </Suspense>
  );
};
