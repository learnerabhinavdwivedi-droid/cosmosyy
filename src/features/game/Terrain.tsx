import { useMemo, forwardRef } from "react";
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

export const STLTerrain = forwardRef<
  THREE.Mesh,
  { stlPath: string; orthoPath: string }
>(function STLTerrain({ stlPath, orthoPath }, ref) {
  const geometry = useLoader(STLLoader, stlPath);
  const orthoTex = useLoader(THREE.TextureLoader, orthoPath);

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
    geo.rotateX(-Math.PI / 2);
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
      ref={ref}
      geometry={processedGeometry}
      material={material}
      receiveShadow
      position={[0, -0.5, 0]}
    />
  );
});

export const GenericTerrain = forwardRef<
  THREE.Mesh,
  { lat?: number; lon?: number }
>(function GenericTerrain({ lat, lon }, ref) {
  const moonTex = useLoader(THREE.TextureLoader, "/textures/moon-color-4k.webp");
  const elevTex = useLoader(THREE.TextureLoader, "/textures/moon-elevation-2k.png");

  const uvOffset = useMemo(() => {
    const u = ((lon ?? 0) + 180) / 360;
    const v = ((lat ?? 0) + 90) / 180;
    return [u * 4, v * 4] as const;
  }, [lat, lon]);

  const material = useMemo(() => {
    moonTex.colorSpace = THREE.SRGBColorSpace;
    moonTex.wrapS = THREE.RepeatWrapping;
    moonTex.wrapT = THREE.RepeatWrapping;
    moonTex.repeat.set(8, 8);
    moonTex.offset.set(uvOffset[0], uvOffset[1]);

    elevTex.wrapS = THREE.RepeatWrapping;
    elevTex.wrapT = THREE.RepeatWrapping;
    elevTex.repeat.set(4, 4);
    elevTex.offset.set(uvOffset[0] * 0.5, uvOffset[1] * 0.5);

    return new THREE.MeshStandardMaterial({
      map: moonTex,
      displacementMap: elevTex,
      displacementScale: 3.5,
      roughness: 0.98,
      metalness: 0.0,
    });
  }, [moonTex, elevTex, uvOffset]);

  return (
    <mesh
      ref={ref}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.5, 0]}
      receiveShadow
    >
      <planeGeometry args={[200, 200, 256, 256]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
});

export const Terrain = forwardRef<
  THREE.Mesh,
  {
    stlPath?: string | null;
    orthoPath?: string | null;
    lat?: number;
    lon?: number;
  }
>(function Terrain({ stlPath, orthoPath, lat, lon }, ref) {
  if (stlPath && orthoPath) {
    return <STLTerrain ref={ref} stlPath={stlPath} orthoPath={orthoPath} />;
  }
  return <GenericTerrain ref={ref} lat={lat} lon={lon} />;
});

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
