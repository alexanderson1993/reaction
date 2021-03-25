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
      <Reflector
        resolution={2048}
        args={[geoWidth, geoWidth]}
        mirror={0.75}
        mixBlur={10}
        mixStrength={2}
        rotation={[0, 0, 0]}
        blur={[500, 500]}
        minDepthThreshold={0.3}
        maxDepthThreshold={2}
        depthScale={0.5}
        depthToBlurRatioBias={0.4}
        debug={0}
        distortion={0}
        renderOrder={-100}
      >
        {(Material, props) => (
          <Material
            color="#9f9fc5"
            metalness={0.5}
            roughness={0.8}
            {...props}
            transparent
            opacity={0.8}
            depthWrite={false}
            depthTest={false}
          />
        )}
      </Reflector>
    </group>
  );
};

export default Plane;
