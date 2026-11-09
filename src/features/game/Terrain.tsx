import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import * as THREE from "three";

function generatePlanarUVs(geo: THREE.BufferGeometry) {
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;
  const count = pos.count;
  const uvs = new Float32Array(count * 2);

  const bbox = new THREE.Box3().setFromBufferAttribute(pos);
  const sizeX = bbox.max.x - bbox.min.x || 1;
  const sizeZ = bbox.max.z - bbox.min.z || 1;

  for (let i = 0; i < count; i++) {
    uvs[i * 2] = (pos.getX(i) - bbox.min.x) / sizeX;
    uvs[i * 2 + 1] = (pos.getZ(i) - bbox.min.z) / sizeZ;
  }

  geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
}

export function Terrain() {
  const geometry = useLoader(STLLoader, "/terrain/apollo11-site.stl");
  const orthoTex = useLoader(
    THREE.TextureLoader,
    "/terrain/apollo11-ortho-4k.webp",
  );

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

    const targetSize = 200;
    const s = targetSize / maxDim;
    geo.scale(s, s * 0.5, s);

    // STL is Z-up, rotate to Y-up
    geo.rotateX(-Math.PI / 2);

    // Generate UVs after final transform for orthophoto mapping
    generatePlanarUVs(geo);

    return geo;
  }, [geometry]);

  const material = useMemo(() => {
    orthoTex.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshStandardMaterial({
      map: orthoTex,
      roughness: 0.95,
      metalness: 0.0,
    });
  }, [orthoTex]);

  return (
    <mesh
      geometry={processedGeometry}
      material={material}
      receiveShadow
      position={[0, -0.5, 0]}
    />
  );
}

export function GroundPlane() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1, 0]}
      receiveShadow
    >
      <planeGeometry args={[2000, 2000]} />
      <meshStandardMaterial color="#3a3a3a" roughness={0.98} metalness={0} />
    </mesh>
  );
}
