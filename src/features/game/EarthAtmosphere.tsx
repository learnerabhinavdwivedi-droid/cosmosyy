import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

interface EarthAtmosphereProps {
  radius?: number;
  position?: [number, number, number] | THREE.Vector3;
  rotationSpeed?: number;
}

export function EarthAtmosphere({
  radius = 5,
  position = [0, 0, 0],
  rotationSpeed = 0.05,
}: EarthAtmosphereProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const tex = useLoader(THREE.TextureLoader, "/textures/earth.jpg");

  useFrame((_, dt) => {
    if (earthRef.current) earthRef.current.rotation.y += dt * rotationSpeed;
  });

  const posArray: [number, number, number] =
    position instanceof THREE.Vector3 ? [position.x, position.y, position.z] : position;

  return (
    <group position={posArray}>
      {/* Earth Body */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial map={tex} roughness={0.75} metalness={0.1} />
      </mesh>

      {/* Atmospheric Rim Glow */}
      <mesh scale={[1.06, 1.06, 1.06]}>
        <sphereGeometry args={[radius, 64, 64]} />
        <shaderMaterial
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
              gl_FragColor = vec4(0.24, 0.65, 1.0, 1.0) * intensity * 1.6;
            }
          `}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
