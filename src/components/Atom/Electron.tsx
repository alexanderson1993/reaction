import React, { useRef } from "react";
import { useFrame } from "react-three-fiber";
import { animated, useSpring } from "react-spring/three";
import {
  Color,
  Curve,
  Group,
  Object3D,
  PointLight,
  PointLightHelper,
  TubeBufferGeometry,
  TubeGeometry,
  Vector,
  Vector3,
} from "three";
import alphamap from "./alphamap.jpg";
import { useHelper, useTexture } from "@react-three/drei";
import Light from "../Light";
const Electron = ({
  shown = false,
  color = 0xffff00,
  scale = [3, 3, 3],
  offset = 0,
  intensity = 0,
}: {
  shown: boolean;
  color: number | string;
  scale?: [number, number, number];
  offset?: number;
  intensity?: number;
}) => {
  let group = useRef<Group>();
  let y = Math.random() * 10;
  let z = Math.random() * 10;
  useFrame(() => {
    const ry = (y += 0.01 + offset / 20);
    const rz = (z += 0.1 + offset / 2);
    group.current && group.current.rotation.set(offset * 10, ry, rz);
  });
  const texture = useTexture(alphamap);
  const geometry = React.useMemo(() => {
    class CustomCurve extends Curve<Vector3> {
      getPoint = function (t: number) {
        var tx = (t - 0.5) * 2;
        var ty = Math.sqrt(1 - Math.pow((t - 0.5) * 2, 2));
        var tz = 0;
        return new Vector3(tx, ty, tz);
      };
    }

    var path = new CustomCurve();
    var geometry = new TubeBufferGeometry(path, 20, 0.1, 8, false);
    return geometry;
  }, []);
  const { scale: animatedScale } = useSpring({
    config: { tension: 500, friction: 15 },
    scale: shown ? scale : [0.01, 0.01, 0.01],
  });

  return (
    <group ref={group} visible={shown}>
      <Light
        color={color}
        decay={1}
        intensity={1}
        position={[-1 * scale[0], 0, 0]}
      />
      <animated.mesh
        geometry={geometry}
        scale={(animatedScale as unknown) as Vector3}
      >
        <meshLambertMaterial
          attach="material"
          color={color}
          emissive={(color as unknown) as Color}
          emissiveIntensity={intensity}
          transparent
          alphaMap={texture}
          depthWrite={false}
        />
      </animated.mesh>
    </group>
  );
};

export default Electron;
