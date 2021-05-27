import React from "react";
import { GridHelper } from "three";
import { Reflector } from "@react-three/drei";
const geoWidth = 5;

const gridHelper = new GridHelper(geoWidth, 8, 0x0088ff, 0x0088ff);
if (!Array.isArray(gridHelper.material)) {
  gridHelper.material.transparent = true;
}
const Plane = () => {
  return (
    <group>
      <primitive
        object={gridHelper}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 0.02]}
      />
      <pointLight position={[1, 1, 1.5]} intensity={2} color={0x0088ff} />;
      <mesh>
        <planeBufferGeometry args={[5, 5]} />
        <meshStandardMaterial
          metalness={0.5}
          roughness={0.8}
          transparent={false}
          color={0x00aaff}
          opacity={0.5}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export default Plane;
