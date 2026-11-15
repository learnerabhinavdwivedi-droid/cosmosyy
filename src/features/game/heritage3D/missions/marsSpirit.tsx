import type { ArtifactProps } from "./shared";

export function RoverWheelTracks3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const trackSpread = explode * 0.15;

  return (
    <group scale={scale}>
      {/* Regular Left Track (Shallow red tread imprints) */}
      <mesh position={[-0.25 - trackSpread, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.18, 1.4]} />
        <meshStandardMaterial
          color="#7c2d12"
          roughness={0.96}
          metalness={0.02}
          wireframe={wireframe}
        />
      </mesh>

      {/* Right Track (Stalled wheel dug 10 cm trench exposing 90% pure opaline white silica) */}
      <mesh position={[0.25 + trackSpread, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.22, 1.4]} />
        <meshStandardMaterial
          color="#f8fafc"
          roughness={0.7}
          metalness={0.15}
          emissive="#e2e8f0"
          emissiveIntensity={0.2}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

export function BackshellParachute3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const spread = explode * 0.4;

  return (
    <group scale={scale}>
      {/* Crumpled Conical Backshell */}
      <mesh position={[-0.35 - spread, 0.22, 0]} rotation={[0.4, 0.3, 0.6]} castShadow>
        <coneGeometry args={[0.55, 0.35, 16]} />
        <meshStandardMaterial
          color="#ebe7de"
          roughness={0.65}
          metalness={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* Draped Orange-and-White Striped Nylon Parachute Canopy */}
      <mesh position={[0.45 + spread, 0.06, 0.1]} rotation={[-Math.PI / 2, 0, 0.2]} receiveShadow>
        <planeGeometry args={[1.2, 0.8, 6, 6]} />
        <meshStandardMaterial
          color="#ea580c"
          roughness={0.85}
          metalness={0.05}
          wireframe={wireframe}
        />
      </mesh>
      <mesh position={[0.55 + spread, 0.07, 0.15]} rotation={[-Math.PI / 2, 0, 0.2]}>
        <planeGeometry args={[0.4, 0.7, 4, 4]} />
        <meshStandardMaterial
          color="#f8fafc"
          roughness={0.85}
          metalness={0.05}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

export function SpiritRover3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const mastY = explode * 0.45;
  const armX = -explode * 0.35;
  const panelSpread = explode * 0.3;
  const wheelSpread = explode * 0.22;

  const wheels: [number, number, number, boolean][] = [
    [-0.65 - wheelSpread, 0.2, 0.6 + wheelSpread, false],
    [0.0, 0.2, 0.7 + wheelSpread, false],
    [0.65 + wheelSpread, 0.2, 0.6 + wheelSpread, false],
    [-0.65 - wheelSpread, 0.2, -0.6 - wheelSpread, false],
    [0.0, 0.2, -0.7 - wheelSpread, false],
    [0.65 + wheelSpread, 0.2, -0.6 - wheelSpread, true], // Jammed right-front wheel!
  ];

  return (
    <group scale={scale}>
      {/* 1. Main Chassis (Warm Electronics Box) */}
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.3, 0.7]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.75}
          roughness={0.4}
          wireframe={wireframe}
        />
      </mesh>

      {/* 2. Dust-Coated Solar Array Wings (Brownish Red Dust Layer from Gusev Storms) */}
      <group position={[0, 0.54 + panelSpread, 0]} castShadow>
        <mesh>
          <boxGeometry args={[1.05, 0.02, 0.7]} />
          <meshStandardMaterial
            color="#451a03"
            roughness={0.65}
            metalness={0.5}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0, 0, 0.52]} rotation={[0, 0, 0.04]}>
          <boxGeometry args={[0.9, 0.018, 0.38]} />
          <meshStandardMaterial
            color="#451a03"
            roughness={0.65}
            metalness={0.5}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0, 0, -0.52]} rotation={[0, 0, -0.04]}>
          <boxGeometry args={[0.9, 0.018, 0.38]} />
          <meshStandardMaterial
            color="#451a03"
            roughness={0.65}
            metalness={0.5}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* 3. Six Rocker-Bogie Aluminum Wheels (with Jammed Right-Front Wheel) */}
      {wheels.map(([wx, wy, wz, isJammed], idx) => (
        <group key={idx} position={[wx, wy, wz]} rotation={[0, isJammed ? 0.35 : 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.15, 16]} />
            <meshStandardMaterial
              color={isJammed ? "#7f1d1d" : "#64748b"}
              metalness={0.88}
              roughness={0.3}
              wireframe={wireframe}
            />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.06, 0.06, 0.17, 10]} />
            <meshStandardMaterial
              color="#334155"
              metalness={0.95}
              roughness={0.15}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      ))}

      {/* Trench of Pure Opaline White Silica Dug by the Jammed Dragging Wheel */}
      <mesh position={[0.65, 0.015, -0.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.22, 0.8]} />
        <meshStandardMaterial
          color="#f8fafc"
          emissive="#e2e8f0"
          emissiveIntensity={0.3}
          roughness={0.6}
        />
      </mesh>

      {/* 4. Pancam Mast Assembly (PMA) */}
      <group position={[0.35, 0.55 + mastY, 0.22]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.025, 0.9, 10]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.9}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
        <group position={[0, 0.92, 0]} castShadow>
          <mesh>
            <boxGeometry args={[0.12, 0.08, 0.32]} />
            <meshStandardMaterial
              color="#1e293b"
              metalness={0.85}
              roughness={0.3}
              wireframe={wireframe}
            />
          </mesh>
          <mesh position={[0.065, 0, 0.1]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.024, 0.024, 0.02, 12]} />
            <meshStandardMaterial
              color="#0284c7"
              metalness={0.9}
              roughness={0.1}
              wireframe={wireframe}
            />
          </mesh>
          <mesh position={[0.065, 0, -0.1]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.024, 0.024, 0.02, 12]} />
            <meshStandardMaterial
              color="#0284c7"
              metalness={0.9}
              roughness={0.1}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      </group>

      {/* 5. Front Instrument Deployment Device (IDD) Arm */}
      <group position={[0.55 + armX, 0.38, -0.15]}>
        <mesh position={[0.15, -0.05, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.018, 0.018, 0.4, 8]} />
          <meshStandardMaterial
            color="#cbd5e1"
            metalness={0.88}
            roughness={0.25}
            wireframe={wireframe}
          />
        </mesh>
        <group position={[0.32, -0.18, 0.05]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.16, 12]} />
            <meshStandardMaterial
              color="#1e293b"
              metalness={0.9}
              roughness={0.2}
              wireframe={wireframe}
            />
          </mesh>
          <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.035, 0.035, 0.04, 12]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.95}
              roughness={0.15}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      </group>

      {/* 6. Steerable High-Gain Parabolic Dish Antenna */}
      <group position={[-0.32, 0.62 + explode * 0.2, 0]} rotation={[0.3, 0.2, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.05, 0.06, 16]} />
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.92}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.15, 8]} />
          <meshStandardMaterial
            color="#eab308"
            metalness={0.95}
            roughness={0.15}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

export function ColumbiaHillsFeature3D({
  explode = 0,
  wireframe = false,
  scale = 1,
}: ArtifactProps) {
  const lift = explode * 0.2;

  return (
    <group scale={scale} position={[0, lift, 0]}>
      {/* Husband Hill Rocky Summit Massif */}
      <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.7, 0.28, 20]} />
        <meshStandardMaterial
          color="#78350f"
          roughness={0.94}
          metalness={0.06}
          wireframe={wireframe}
        />
      </mesh>
      {/* Layered Olivine-Rich Outcrop Slabs */}
      <mesh position={[-0.2, 0.36, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.18, 0.8]} />
        <meshStandardMaterial
          color="#854d0e"
          roughness={0.9}
          metalness={0.1}
          wireframe={wireframe}
        />
      </mesh>
      {/* Wind-Sculpted Basalt Ventifact Rocks */}
      {(
        [
          [0.35, 0.32, -0.2],
          [-0.45, 0.48, 0.15],
          [0.1, 0.49, 0.3],
        ] as [number, number, number][]
      ).map(([vx, vy, vz], idx) => (
        <mesh key={idx} position={[vx, vy, vz]} castShadow>
          <octahedronGeometry args={[0.12 + idx * 0.04, 0]} />
          <meshStandardMaterial
            color="#292524"
            roughness={0.88}
            metalness={0.15}
            wireframe={wireframe}
          />
        </mesh>
      ))}
    </group>
  );
}

export function HomePlateFeature3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const lift = explode * 0.2;

  return (
    <group scale={scale} position={[0, lift, 0]}>
      {/* Circular Plateau of Layered Volcanic Ash Tuff */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.4, 1.6, 0.3, 24]} />
        <meshStandardMaterial
          color="#a8a29e"
          roughness={0.92}
          metalness={0.05}
          wireframe={wireframe}
        />
      </mesh>
      {/* Plateau Flat Top */}
      <mesh position={[0, 0.31, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.38, 24]} />
        <meshStandardMaterial
          color="#78716c"
          roughness={0.9}
          metalness={0.08}
          wireframe={wireframe}
        />
      </mesh>

      {/* Volcanic Bomb Sag Impact Depression */}
      <group position={[-0.35, 0.32, -0.2]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.08, 0.25, 16]} />
          <meshStandardMaterial color="#44403c" roughness={0.95} wireframe={wireframe} />
        </mesh>
        {/* Dense Volcanic Projectile Rock */}
        <mesh position={[0, 0.04, 0]} castShadow>
          <dodecahedronGeometry args={[0.09, 0]} />
          <meshStandardMaterial
            color="#1c1917"
            roughness={0.9}
            metalness={0.2}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* Mounds of Knobby Opaline Silica Nodules (Hot Spring Evidence!) */}
      {(
        [
          [0.4, 0.34, 0.2],
          [0.2, 0.33, 0.4],
          [0.5, 0.33, -0.1],
        ] as [number, number, number][]
      ).map(([sx, sy, sz], idx) => (
        <mesh key={idx} position={[sx, sy, sz]} castShadow>
          <sphereGeometry args={[0.08 + idx * 0.02, 10, 10]} />
          <meshStandardMaterial
            color="#f8fafc"
            emissive="#f1f5f9"
            emissiveIntensity={0.25}
            roughness={0.5}
            metalness={0.2}
            wireframe={wireframe}
          />
        </mesh>
      ))}
    </group>
  );
}

export function BonnevilleCraterFeature3D({
  explode = 0,
  wireframe = false,
  scale = 1,
}: ArtifactProps) {
  const lift = explode * 0.2;

  return (
    <group scale={scale} position={[0, lift, 0]}>
      {/* 200m Impact Crater Ejecta Rim Berm */}
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[0.7, 1.6, 24]} />
        <meshStandardMaterial
          color="#7c2d12"
          roughness={0.96}
          metalness={0.04}
          wireframe={wireframe}
        />
      </mesh>
      {/* Crater Floor Depression */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.7, 24]} />
        <meshStandardMaterial color="#451a03" roughness={0.98} wireframe={wireframe} />
      </mesh>

      {/* Sharp Dark Basalt Ejecta Boulders along Rim Crest */}
      {(
        [
          [-0.5, 0.22, 0.7],
          [0.4, 0.25, 0.8],
          [-0.8, 0.26, -0.3],
          [0.9, 0.24, -0.2],
          [0.1, 0.26, -0.9],
        ] as [number, number, number][]
      ).map(([bx, by, bz], idx) => (
        <mesh key={idx} position={[bx, by, bz]} castShadow>
          <dodecahedronGeometry args={[0.12 + (idx % 3) * 0.04, 0]} />
          <meshStandardMaterial
            color="#1c1917"
            roughness={0.88}
            metalness={0.2}
            wireframe={wireframe}
          />
        </mesh>
      ))}

      {/* Spirit Rover Curved Track Impressions on Rim Crest */}
      <mesh position={[0, 0.16, 0.75]} rotation={[-Math.PI / 2, 0, 0.2]}>
        <planeGeometry args={[1.2, 0.16]} />
        <meshStandardMaterial color="#991b1b" roughness={0.95} wireframe={wireframe} />
      </mesh>
    </group>
  );
}
