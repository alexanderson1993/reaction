import React, { Suspense } from "react";
import { useFrame } from "react-three-fiber";
import {
  TextureLoader,
  RepeatWrapping,
  Mesh,
  ShaderMaterial,
  Color,
  Vector3,
  AdditiveBlending,
  Group,
  Texture,
} from "three";
import LensFlare from "./lensFlare";
import { fragment, vertex } from "./shaders";
import getUniforms from "./uniforms";
import tc from "tinycolor2";

import filePath from "./textures/01_Texture.jpg";

const Star: React.FC<{
  color1?: number | Color;
  color2?: number | Color;
  size?: number;
  position?: Vector3 | [number, number, number];
  scale?: Vector3 | [number, number, number];
  noLensFlare?: boolean;
}> = ({
  color1 = 0x887922,
  color2 = 0xf6fcff,
  size,
  noLensFlare,
  ...props
}) => {
  const texture = React.useMemo(() => {
    const loader = new TextureLoader();
    const texture = loader.load(filePath);
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    return texture;
  }, [filePath]);
  const uniforms = React.useMemo(
    () => getUniforms({ map: texture, color1, color2 }),
    [color1, color2, texture]
  );
  const shader = React.useRef<Mesh>();
  const starMesh = React.useRef<Group>();

  useFrame(({ camera }) => {
    shader.current?.quaternion.copy(camera.quaternion);
    if (shader.current) {
      const mat = shader.current.material as ShaderMaterial;
      mat.uniforms.time.value += 0.008;
      mat.uniforms.color1.value = color1;
      mat.uniforms.color2.value = color2;
    }
  });
  const color = React.useMemo(() => {
    if (typeof color1 === "number") {
      const color = color1.toString(16);
      return `#${color}`;
    }
    const color = color1.toArray();
    return `rgb(${color[0] * 255},${color[1] * 255},${color[2] * 255})`;
  }, [color1]);

  return (
    <group {...props}>
      <pointLight
        intensity={1}
        decay={0.001}
        color={tc(color).brighten(90).toRgbString()}
        castShadow
      />
      <group ref={starMesh}>
        <mesh ref={shader} uuid="My star" rotation={[0.5, 0.5, 0.5]}>
          <circleBufferGeometry attach="geometry" args={[1, 64, 8]} />
          <shaderMaterial
            attach="material"
            fragmentShader={fragment}
            vertexShader={vertex}
            uniforms={uniforms}
            blending={AdditiveBlending}
            transparent
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
};

export default Star;
