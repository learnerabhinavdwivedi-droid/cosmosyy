import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import * as THREE from "three";

export function Terrain() {
  const geometry = useLoader(STLLoader, "/terrain/apollo11-site.stl");

  const processedGeometry = useMemo(() => {
    const geo = geometry.clone();
    geo.computeVertexNormals();
    geo.center();

    const bbox = new THREE.Box3().setFromBufferAttribute(
      geo.getAttribute("position") as THREE.BufferAttribute,
    );
    const scaleX = bbox.max.x - bbox.min.x;
    const scaleZ = bbox.max.z - bbox.min.z;
    const maxDim = Math.max(scaleX, scaleZ);

    // Scale to ~200m across for the landing site
    const targetSize = 200;
    const s = targetSize / maxDim;
    geo.scale(s, s * 0.5, s);

    // Rotate to lie flat (STL may be Z-up)
    geo.rotateX(-Math.PI / 2);

    return geo;
  }, [geometry]);

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh
        geometry={processedGeometry}
        receiveShadow
        position={[0, -0.5, 0]}
      >
        <meshStandardMaterial
          color="#6a6a6a"
          roughness={0.95}
          metalness={0.0}
        />
      </mesh>
    </RigidBody>
  );
}

// Flat fallback ground extending beyond the STL
export function GroundPlane() {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1, 0]}
        receiveShadow
      >
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#5a5a5a" roughness={0.95} metalness={0} />
      </mesh>
    </RigidBody>
  );
}
