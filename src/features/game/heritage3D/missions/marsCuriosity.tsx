import { useMemo } from "react";
import type { ArtifactProps } from "./shared";
import { getCalibrationTargetTexture } from "../textures";

export function MarsDrillHoles3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const liftY = explode * 0.15;

  return (
    <group scale={scale} position={[0, liftY, 0]}>
      {/* Grey Lakebed Mudstone Bedrock Outcrop */}
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.95, 0.12, 0.8]} />
        <meshStandardMaterial
          color="#78716c"
          roughness={0.92}
          metalness={0.1}
          wireframe={wireframe}
        />
      </mesh>

      {/* Drill Hole 1 (Deep borehole + pulverized grey cuttings ring) */}
      <group position={[-0.15 - explode * 0.1, 0.125, 0]}>
        {/* Grey tailings powder halo */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.04, 0.14, 16]} />
          <meshStandardMaterial
            color="#cbd5e1"
            roughness={0.95}
            metalness={0.05}
            wireframe={wireframe}
          />
        </mesh>
        {/* Cylindrical Borehole recess */}
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.1, 16]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.95}
            metalness={0.1}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* Drill Hole 2 */}
      <group position={[0.15 + explode * 0.1, 0.125, -0.05]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.04, 0.14, 16]} />
          <meshStandardMaterial
            color="#cbd5e1"
            roughness={0.95}
            metalness={0.05}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.1, 16]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.95}
            metalness={0.1}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* 5-point ChemCam Laser Plasma Scorch Marks */}
      {[-0.08, -0.04, 0, 0.04, 0.08].map((lx, idx) => (
        <mesh key={idx} position={[lx, 0.122, 0.22]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.008, 8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} wireframe={wireframe} />
        </mesh>
      ))}
    </group>
  );
}

export function MarsCalibrationTarget3D({
  explode = 0,
  wireframe = false,
  scale = 1,
}: ArtifactProps) {
  const calibTex = useMemo(() => getCalibrationTargetTexture(), []);
  const gnomonY = explode * 0.35;

  return (
    <group scale={scale}>
      {/* Anodized Aluminum Mounting Bracket */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.55, 0.55, 0.05]} />
        <meshStandardMaterial
          color="#475569"
          metalness={0.8}
          roughness={0.3}
          wireframe={wireframe}
        />
      </mesh>

      {/* Color and Metric Target Face */}
      <mesh position={[0, 0.25, 0.03]}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial
          map={calibTex}
          roughness={0.5}
          metalness={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* Center Sundial Gnomon Pin */}
      <mesh position={[0, 0.25, 0.12 + gnomonY]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.008, 0.015, 0.16, 12]} />
        <meshStandardMaterial
          color="#e5b842"
          metalness={0.9}
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* 1909 VDB Lincoln Wheat Penny Replica */}
      <group position={[0.16, 0.09, 0.035]} rotation={[0, 0, 0.2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.006, 16]} />
          <meshStandardMaterial
            color="#b45309"
            metalness={0.88}
            roughness={0.35}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </group>
  );
}

export function SkyCraneDescentStage3D({
  explode = 0,
  wireframe = false,
  scale = 1,
}: ArtifactProps) {
  const spread = explode * 0.35;

  return (
    <group scale={scale}>
      {/* Impact Debris Crater Berm */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[0.5, 1.4, 24]} />
        <meshStandardMaterial
          color="#7f1d1d"
          roughness={0.96}
          metalness={0.05}
          wireframe={wireframe}
        />
      </mesh>

      {/* Charred Spherical Titanium Propellant Tanks */}
      <mesh position={[-0.25 - spread, 0.18, -0.1]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color="#334155"
          metalness={0.85}
          roughness={0.3}
          wireframe={wireframe}
        />
      </mesh>
      <mesh position={[0.3 + spread, 0.16, 0.15]} castShadow>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial
          color="#475569"
          metalness={0.85}
          roughness={0.3}
          wireframe={wireframe}
        />
      </mesh>

      {/* Canted Mars Lander Descent Rocket Engines (MLE Nozzles) */}
      <mesh position={[0, 0.14 + explode * 0.2, 0.28]} rotation={[0.4, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.16, 0.28, 12]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.9}
          roughness={0.25}
          wireframe={wireframe}
        />
      </mesh>

      {/* Twisted Carbon Composite Tubular Truss Structure */}
      <mesh position={[-0.05, 0.12, 0]} rotation={[0.3, 0.6, -0.2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.85, 8]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.8}
          roughness={0.3}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

export function CuriosityRover3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const mastY = explode * 0.45;
  const armX = -explode * 0.4;
  const wheelSpread = explode * 0.25;

  const wheels: [number, number, number][] = [
    [-0.85 - wheelSpread, 0.25, 0.75 + wheelSpread],
    [0.0, 0.25, 0.85 + wheelSpread],
    [0.85 + wheelSpread, 0.25, 0.75 + wheelSpread],
    [-0.85 - wheelSpread, 0.25, -0.75 - wheelSpread],
    [0.0, 0.25, -0.85 - wheelSpread],
    [0.85 + wheelSpread, 0.25, -0.75 - wheelSpread],
  ];

  return (
    <group scale={scale}>
      {/* 1. Main Chassis (Warm Electronics Box - White Thermal Coating) */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.45, 1.05]} />
        <meshStandardMaterial
          color="#f1f5f9"
          roughness={0.45}
          metalness={0.65}
          wireframe={wireframe}
        />
      </mesh>
      {/* Top Deck Equipment Cover Plate */}
      <mesh position={[0, 0.78, 0]}>
        <boxGeometry args={[1.5, 0.03, 0.98]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.8}
          roughness={0.3}
          wireframe={wireframe}
        />
      </mesh>

      {/* 2. Rocker-Bogie Suspension System */}
      <group position={[0, 0.42, 0]}>
        {/* Left Rocker Arm */}
        <mesh position={[0, 0, 0.58]} rotation={[0, 0, -0.05]}>
          <boxGeometry args={[1.7, 0.06, 0.06]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.9}
            roughness={0.25}
            wireframe={wireframe}
          />
        </mesh>
        {/* Right Rocker Arm */}
        <mesh position={[0, 0, -0.58]} rotation={[0, 0, -0.05]}>
          <boxGeometry args={[1.7, 0.06, 0.06]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.9}
            roughness={0.25}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* 3. Six Cleated Machined Aluminum Wheels */}
      {wheels.map(([wx, wy, wz], idx) => (
        <group key={idx} position={[wx, wy, wz]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.26, 0.26, 0.22, 18]} />
            <meshStandardMaterial
              color="#64748b"
              metalness={0.92}
              roughness={0.22}
              wireframe={wireframe}
            />
          </mesh>
          {/* Wheel Hub & Motor Drive Housing */}
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 0.24, 12]} />
            <meshStandardMaterial
              color="#334155"
              metalness={0.95}
              roughness={0.15}
              wireframe={wireframe}
            />
          </mesh>
          {/* Chevron Traction Cleat Rings */}
          <mesh position={[0, 0.06, 0]}>
            <ringGeometry args={[0.261, 0.275, 16]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.9}
              roughness={0.3}
              wireframe={wireframe}
            />
          </mesh>
          <mesh position={[0, -0.06, 0]}>
            <ringGeometry args={[0.261, 0.275, 16]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.9}
              roughness={0.3}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      ))}

      {/* 4. Remote Sensing Mast (RSM) with ChemCam & Mastcam */}
      <group position={[0.55, 0.78 + mastY, 0.32]}>
        {/* Vertical Titanium Mast Column */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.035, 1.1, 12]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.9}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
        {/* ChemCam Laser Head Housing */}
        <group position={[0, 1.15, 0]} castShadow>
          <mesh>
            <boxGeometry args={[0.22, 0.18, 0.24]} />
            <meshStandardMaterial
              color="#1e293b"
              metalness={0.85}
              roughness={0.25}
              wireframe={wireframe}
            />
          </mesh>
          {/* ChemCam Telescope Optical Lens */}
          <mesh position={[0.115, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.03, 16]} />
            <meshStandardMaterial
              color="#0284c7"
              metalness={0.95}
              roughness={0.1}
              wireframe={wireframe}
            />
          </mesh>
          {/* Dual Stereo Mastcam Eyes */}
          <mesh position={[0.115, -0.05, 0.07]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.02, 12]} />
            <meshStandardMaterial
              color="#38bdf8"
              metalness={0.9}
              roughness={0.1}
              wireframe={wireframe}
            />
          </mesh>
          <mesh position={[0.115, -0.05, -0.07]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.02, 12]} />
            <meshStandardMaterial
              color="#38bdf8"
              metalness={0.9}
              roughness={0.1}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      </group>

      {/* 5. Rear MMRTG Nuclear Power Generator */}
      <group position={[-0.88, 0.72 + explode * 0.3, 0]} rotation={[0, 0, -0.45]} castShadow>
        {/* Main Cylindrical Generator Core */}
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 0.55, 16]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.88}
            roughness={0.28}
            wireframe={wireframe}
          />
        </mesh>
        {/* Radiator Cooling Fins (8 Radial Fins) */}
        {[0, 45, 90, 135].map((deg) => (
          <mesh key={deg} rotation={[0, (deg * Math.PI) / 180, 0]}>
            <boxGeometry args={[0.42, 0.5, 0.015]} />
            <meshStandardMaterial
              color="#1e293b"
              metalness={0.85}
              roughness={0.35}
              wireframe={wireframe}
            />
          </mesh>
        ))}
      </group>

      {/* 6. 5-DOF Front Robotic Arm with Drill & Sensor Turret */}
      <group position={[0.78 + armX, 0.55, -0.28]}>
        {/* Shoulder Joint */}
        <mesh castShadow>
          <sphereGeometry args={[0.065, 12, 12]} />
          <meshStandardMaterial
            color="#475569"
            metalness={0.9}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
        {/* Upper Arm Boom */}
        <mesh position={[0.25, -0.05, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.028, 0.028, 0.55, 8]} />
          <meshStandardMaterial
            color="#cbd5e1"
            metalness={0.88}
            roughness={0.25}
            wireframe={wireframe}
          />
        </mesh>
        {/* Forearm Boom */}
        <mesh position={[0.55, -0.22, 0.1]} rotation={[0, 0.4, -0.5]}>
          <cylinderGeometry args={[0.024, 0.024, 0.52, 8]} />
          <meshStandardMaterial
            color="#cbd5e1"
            metalness={0.88}
            roughness={0.25}
            wireframe={wireframe}
          />
        </mesh>
        {/* 30kg Sensor & Coring Drill Turret Head */}
        <group position={[0.78, -0.35, 0.22]} castShadow>
          <mesh>
            <cylinderGeometry args={[0.14, 0.14, 0.28, 12]} />
            <meshStandardMaterial
              color="#1e293b"
              metalness={0.9}
              roughness={0.2}
              wireframe={wireframe}
            />
          </mesh>
          {/* Rotary Percussive Drill Bit */}
          <mesh position={[0.16, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.025, 0.24, 8]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.98}
              roughness={0.15}
              wireframe={wireframe}
            />
          </mesh>
          {/* APXS Spectrometer Sensor Window */}
          <mesh position={[0, -0.145, 0]}>
            <circleGeometry args={[0.045, 12]} />
            <meshStandardMaterial
              color="#f59e0b"
              metalness={0.8}
              roughness={0.3}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      </group>

      {/* 7. Steerable High-Gain Hexagonal Dish Antenna */}
      <group position={[-0.45, 0.85 + explode * 0.25, 0.35]} rotation={[0.4, 0.3, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.03, 6]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.92}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.008, 0.012, 0.18, 8]} />
          <meshStandardMaterial
            color="#eab308"
            metalness={0.95}
            roughness={0.15}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* 8. Hazcams & UHF Rod Antenna */}
      <mesh position={[0.82, 0.42, 0.22]}>
        <boxGeometry args={[0.04, 0.04, 0.1]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.8}
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>
      <mesh position={[-0.6, 0.98, -0.38]}>
        <cylinderGeometry args={[0.006, 0.006, 0.4, 8]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.9}
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

export function YellowknifeBayFeature3D({
  explode = 0,
  wireframe = false,
  scale = 1,
}: ArtifactProps) {
  const lift = explode * 0.2;

  return (
    <group scale={scale} position={[0, lift, 0]}>
      {/* Sheepbed Lakebed Mudstone Sedimentary Bedrock Slab */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.22, 1.4]} />
        <meshStandardMaterial
          color="#78716c"
          roughness={0.92}
          metalness={0.08}
          wireframe={wireframe}
        />
      </mesh>

      {/* Layered Step Outcrop Ledge */}
      <mesh position={[0.25, 0.25, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.15, 0.8]} />
        <meshStandardMaterial
          color="#64748b"
          roughness={0.95}
          metalness={0.05}
          wireframe={wireframe}
        />
      </mesh>

      {/* Brilliant White Calcium Sulfate Mineral Fracture Veins (Gypsum / Bassanite) */}
      <mesh position={[-0.2, 0.235, 0.15]} rotation={[-Math.PI / 2, 0, 0.35]}>
        <planeGeometry args={[1.4, 0.028]} />
        <meshStandardMaterial
          color="#f8fafc"
          roughness={0.4}
          metalness={0.2}
          wireframe={wireframe}
        />
      </mesh>
      <mesh position={[0.1, 0.236, -0.1]} rotation={[-Math.PI / 2, 0, -0.6]}>
        <planeGeometry args={[1.1, 0.022]} />
        <meshStandardMaterial
          color="#f8fafc"
          roughness={0.4}
          metalness={0.2}
          wireframe={wireframe}
        />
      </mesh>
      <mesh position={[-0.45, 0.237, -0.3]} rotation={[-Math.PI / 2, 0, 0.8]}>
        <planeGeometry args={[0.7, 0.018]} />
        <meshStandardMaterial
          color="#f8fafc"
          roughness={0.4}
          metalness={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* John Klein Drill Site Hole + Grey Pulverized Tailings Powder Halo */}
      <group position={[0.35, 0.33, 0.18]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.045, 0.16, 16]} />
          <meshStandardMaterial
            color="#cbd5e1"
            roughness={0.96}
            metalness={0.04}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.12, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

export function MountSharpFeature3D({ explode = 0, wireframe = false, scale = 1 }: ArtifactProps) {
  const lift = explode * 0.2;

  return (
    <group scale={scale} position={[0, lift, 0]}>
      {/* Gale Crater Floor Terrain Base with Iron-Oxide Weathering */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[2.2, 0.1, 1.8]} />
        <meshStandardMaterial
          color="#451a03"
          roughness={0.96}
          metalness={0.04}
          wireframe={wireframe}
        />
      </mesh>

      {/* Murray Formation: Lower Stratified Mudstone Escarpment */}
      <group position={[-0.1, 0.22, 0.05]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.24, 1.4]} />
          <meshStandardMaterial
            color="#78350f"
            roughness={0.92}
            metalness={0.06}
            wireframe={wireframe}
          />
        </mesh>
        {/* Layered Sedimentary Bench Terraces */}
        <mesh position={[0.2, 0.08, 0.35]} castShadow>
          <boxGeometry args={[1.2, 0.08, 0.6]} />
          <meshStandardMaterial
            color="#92400e"
            roughness={0.94}
            metalness={0.05}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[-0.25, 0.08, -0.3]} castShadow>
          <boxGeometry args={[1.0, 0.07, 0.55]} />
          <meshStandardMaterial
            color="#b45309"
            roughness={0.94}
            metalness={0.05}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* Vera Rubin Ridge: Distinctive Hematite-Rich Dark Red Ledge */}
      <group position={[0.05, 0.48, -0.1]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0.15, -0.05]} castShadow receiveShadow>
          <boxGeometry args={[1.35, 0.26, 0.95]} />
          <meshStandardMaterial
            color="#881337"
            roughness={0.88}
            metalness={0.15}
            wireframe={wireframe}
          />
        </mesh>
        {/* Jagged Promontory Cliff Edge */}
        <mesh position={[0.42, 0.1, 0.15]} rotation={[0, 0.3, 0.1]} castShadow>
          <dodecahedronGeometry args={[0.32, 0]} />
          <meshStandardMaterial
            color="#701a75"
            roughness={0.86}
            metalness={0.16}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* Clay-Bearing Unit & Sulfate Valley Fissure (Gediz Vallis Channel) */}
      <mesh position={[-0.32, 0.36, 0.3]} rotation={[0.2, 0.5, 0]}>
        <boxGeometry args={[0.22, 0.12, 1.3]} />
        <meshStandardMaterial
          color="#3f3f46"
          roughness={0.95}
          metalness={0.08}
          wireframe={wireframe}
        />
      </mesh>

      {/* Upper Aeolis Mons Summit Peak (Wind-Carved Yardang Spire) */}
      <group position={[0.12, 0.82, -0.15]}>
        <mesh rotation={[0.1, 0.4, -0.1]} castShadow>
          <dodecahedronGeometry args={[0.55, 1]} />
          <meshStandardMaterial
            color="#d97706"
            roughness={0.9}
            metalness={0.08}
            wireframe={wireframe}
          />
        </mesh>
        {/* Wind-sculpted Fluted Fin */}
        <mesh position={[0.15, 0.28, 0]} rotation={[0.2, -0.3, 0.2]} castShadow>
          <dodecahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial color="#b45309" roughness={0.92} wireframe={wireframe} />
        </mesh>
      </group>

      {/* Scattered Dark Basalt Talus Boulders at Base */}
      {(
        [
          [-0.75, 0.14, 0.6],
          [-0.55, 0.12, -0.65],
          [0.72, 0.15, 0.55],
          [0.85, 0.12, -0.4],
          [0.2, 0.13, 0.72],
        ] as const
      ).map(([bx, by, bz], idx) => (
        <mesh key={idx} position={[bx, by, bz]} rotation={[idx * 0.4, idx * 0.7, 0]} castShadow>
          <dodecahedronGeometry args={[0.08 + (idx % 3) * 0.03, 0]} />
          <meshStandardMaterial
            color="#27272a"
            roughness={0.9}
            metalness={0.15}
            wireframe={wireframe}
          />
        </mesh>
      ))}
    </group>
  );
}
