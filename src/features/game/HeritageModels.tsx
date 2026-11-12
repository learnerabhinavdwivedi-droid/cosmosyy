import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

function useFlagTexture() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // 13 stripes (red and white)
    const stripeHeight = canvas.height / 13;
    for (let i = 0; i < 13; i++) {
      ctx.fillStyle = i % 2 === 0 ? "#B22234" : "#FFFFFF";
      ctx.fillRect(0, i * stripeHeight, canvas.width, stripeHeight);
    }

    // Blue canton
    const cantonWidth = canvas.width * 0.42;
    const cantonHeight = stripeHeight * 7;
    ctx.fillStyle = "#3C3B6E";
    ctx.fillRect(0, 0, cantonWidth, cantonHeight);

    // Stars grid
    ctx.fillStyle = "#FFFFFF";
    const rows = 5;
    const cols = 6;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = 16 + c * ((cantonWidth - 32) / (cols - 1));
        const y = 14 + r * ((cantonHeight - 28) / (rows - 1));
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

export function USFlagModel({
  playerName = "Commander",
  isPlanted = false,
}: {
  playerName?: string;
  isPlanted?: boolean;
}) {
  const flagTex = useFlagTexture();
  const clothRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (clothRef.current) {
      const t = Date.now() * 0.002;
      clothRef.current.rotation.y = Math.sin(t * 0.5) * 0.05;
    }
  });

  return (
    <group scale={isPlanted ? 1.1 : 1} name={`Flag-${playerName}`}>
      {/* Vertical Mast */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.025, 2.2, 16]} />
        <meshStandardMaterial color="#D8D8D8" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Gold Finial on top */}
      <mesh position={[0, 2.22, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Horizontal Spreader Rod */}
      <mesh position={[0.42, 2.18, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.85, 12]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.85} roughness={0.3} />
      </mesh>

      {/* Flag Cloth with authentic texture */}
      <mesh ref={clothRef} position={[0.43, 1.88, 0]} castShadow>
        <planeGeometry args={[0.85, 0.55, 8, 4]} />
        <meshStandardMaterial
          map={flagTex ?? undefined}
          color={flagTex ? "#FFFFFF" : "#B22234"}
          roughness={0.6}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ground Base / Soil Mounting Collar */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.1, 0.14, 0.08, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Commemorative Plaque */}
      <group position={[0, 0.45, 0.03]} rotation={[-0.1, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.22, 0.12, 0.015]} />
          <meshStandardMaterial color="#C5A059" metalness={0.8} roughness={0.25} />
        </mesh>
        {isPlanted && (
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[0.2, 0.1]} />
            <meshBasicMaterial color="#332211" />
          </mesh>
        )}
      </group>
    </group>
  );
}

export function LRRRModel() {
  return (
    <group position={[0, 0.35, 0]} rotation={[0.25, -0.4, 0]}>
      {/* White Pallet Box */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.65, 0.2, 0.65]} />
        <meshStandardMaterial color="#EEEEEE" roughness={0.35} metalness={0.2} />
      </mesh>

      {/* Corner Cube Quartz Retroreflector Array (10x10 prisms grid) */}
      <mesh position={[0, 0.105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.52, 0.52]} />
        <meshStandardMaterial
          color="#EAF6FF"
          metalness={0.95}
          roughness={0.05}
          envMapIntensity={2.0}
        />
      </mesh>

      {/* Reflector Grid Trim */}
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[0.54, 0.02, 0.54]} />
        <meshStandardMaterial color="#778899" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Sun Compass Gnomon */}
      <mesh position={[0.26, 0.15, 0.26]}>
        <cylinderGeometry args={[0.008, 0.008, 0.18, 8]} />
        <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Tripod Leveling Legs */}
      <group position={[0, -0.1, 0]}>
        <mesh position={[0.25, -0.15, 0.25]} rotation={[0.3, 0, -0.3]}>
          <cylinderGeometry args={[0.015, 0.02, 0.35, 8]} />
          <meshStandardMaterial color="#BBBBBB" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[-0.25, -0.15, 0.25]} rotation={[0.3, 0, 0.3]}>
          <cylinderGeometry args={[0.015, 0.02, 0.35, 8]} />
          <meshStandardMaterial color="#BBBBBB" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.15, -0.3]} rotation={[-0.4, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.02, 0.35, 8]} />
          <meshStandardMaterial color="#BBBBBB" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

export function PSEPModel() {
  return (
    <group position={[0, 0, 0]}>
      {/* Central Electronics Box with Gold Kapton thermal blanket */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[0.55, 0.35, 0.45]} />
        <meshStandardMaterial color="#FFD700" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Left Solar Array Wing */}
      <mesh position={[-0.55, 0.3, 0]} rotation={[0, 0, 0.15]} castShadow>
        <boxGeometry args={[0.55, 0.02, 0.38]} />
        <meshStandardMaterial color="#1a2b4c" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Right Solar Array Wing */}
      <mesh position={[0.55, 0.3, 0]} rotation={[0, 0, -0.15]} castShadow>
        <boxGeometry args={[0.55, 0.02, 0.38]} />
        <meshStandardMaterial color="#1a2b4c" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Helical Omnidirectional Telemetry Antenna */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.55, 8]} />
        <meshStandardMaterial color="#D8D8D8" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Passive Seismometer Sensor Dome */}
      <mesh position={[0.65, 0.1, 0.4]} castShadow>
        <sphereGeometry args={[0.16, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Connecting Ribbon Cable */}
      <mesh position={[0.35, 0.015, 0.2]} rotation={[-Math.PI / 2, 0, -0.5]}>
        <planeGeometry args={[0.06, 0.6]} />
        <meshStandardMaterial color="#AA8833" roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function ALSEPModel() {
  return (
    <group position={[0, 0, 0]}>
      {/* Central Station Body */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.65, 0.45, 0.6]} />
        <meshStandardMaterial color="#E8E8E8" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Sunshield / Thermal Louvers top */}
      <mesh position={[0, 0.54, 0]}>
        <boxGeometry args={[0.7, 0.03, 0.65]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0.2} roughness={0.3} />
      </mesh>

      {/* SNAP-27 RTG (Radioisotope Thermoelectric Generator) */}
      <group position={[0.75, 0.22, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.42, 16]} />
          <meshStandardMaterial color="#4A4A4A" metalness={0.8} roughness={0.4} />
        </mesh>
        {/* RTG Cooling Fins */}
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[0.34, 0.38, 0.02]} />
          <meshStandardMaterial color="#333333" metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh rotation={[0, -Math.PI / 4, 0]}>
          <boxGeometry args={[0.34, 0.38, 0.02]} />
          <meshStandardMaterial color="#333333" metalness={0.85} roughness={0.3} />
        </mesh>
      </group>

      {/* Helical Antenna Mast */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.012, 0.015, 0.65, 8]} />
        <meshStandardMaterial color="#D0D0D0" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

export function LRVRoverModel() {
  return (
    <group position={[0, 0.45, 0]} scale={0.75}>
      {/* Chassis Frame */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.4, 0.12, 2.2]} />
        <meshStandardMaterial color="#9E9E9E" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Two Folded Crew Seats */}
      <group position={[-0.32, 0.35, -0.2]}>
        <mesh>
          <boxGeometry args={[0.42, 0.5, 0.08]} />
          <meshStandardMaterial color="#D87A2B" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.2, 0.2]}>
          <boxGeometry args={[0.42, 0.08, 0.38]} />
          <meshStandardMaterial color="#D87A2B" roughness={0.7} />
        </mesh>
      </group>
      <group position={[0.32, 0.35, -0.2]}>
        <mesh>
          <boxGeometry args={[0.42, 0.5, 0.08]} />
          <meshStandardMaterial color="#D87A2B" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.2, 0.2]}>
          <boxGeometry args={[0.42, 0.08, 0.38]} />
          <meshStandardMaterial color="#D87A2B" roughness={0.7} />
        </mesh>
      </group>

      {/* Center T-Handle Joystick Controller */}
      <mesh position={[0, 0.28, 0.1]}>
        <cylinderGeometry args={[0.02, 0.02, 0.35, 8]} />
        <meshStandardMaterial color="#222222" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 4 Wire-Mesh Wheels with Fenders */}
      {[
        [-0.85, -0.1, 0.85],
        [0.85, -0.1, 0.85],
        [-0.85, -0.1, -0.85],
        [0.85, -0.1, -0.85],
      ].map((pos, idx) => (
        <group key={idx} position={pos as [number, number, number]}>
          {/* Wheel Hub & Wire Mesh Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.22, 20]} />
            <meshStandardMaterial
              color="#A0A0A0"
              wireframe
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          {/* Orange/White Fender */}
          <mesh position={[0, 0.24, 0]}>
            <boxGeometry args={[0.26, 0.05, 0.55]} />
            <meshStandardMaterial color="#CC5500" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* High-Gain Parabolic Mesh Antenna Mast */}
      <group position={[0.45, 0.7, 0.9]}>
        <mesh>
          <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.8} />
        </mesh>
        {/* Parabolic Mesh Dish */}
        <mesh position={[0, 0.45, 0]} rotation={[0.6, 0, 0]}>
          <sphereGeometry args={[0.35, 16, 12, 0, Math.PI * 2, 0, Math.PI / 3]} />
          <meshStandardMaterial
            color="#FFD700"
            wireframe
            metalness={0.9}
            roughness={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Front Color TV Camera */}
      <mesh position={[-0.45, 0.4, 0.95]}>
        <boxGeometry args={[0.18, 0.16, 0.24]} />
        <meshStandardMaterial color="#D9A84E" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function Surveyor3Model() {
  return (
    <group position={[0, 0, 0]} scale={0.8}>
      {/* Triangular Tubular Spaceframe Base */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.75, 0.8, 3]} />
        <meshStandardMaterial color="#C8C8C8" metalness={0.8} roughness={0.25} wireframe />
      </mesh>

      {/* 3 Outrigger Landing Legs with Round Footpads */}
      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => (
        <group key={idx} rotation={[0, angle, 0]}>
          <mesh position={[0.7, 0.25, 0]} rotation={[0, 0, -0.6]}>
            <cylinderGeometry args={[0.02, 0.025, 0.85, 8]} />
            <meshStandardMaterial color="#B0B0B0" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Footpad */}
          <mesh position={[1.05, 0.04, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
            <meshStandardMaterial color="#707070" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Top Solar Panel Mast */}
      <group position={[0, 1.25, 0]}>
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
          <meshStandardMaterial color="#A0A0A0" metalness={0.8} />
        </mesh>
        {/* Rectangular Solar Panel */}
        <mesh position={[0, 0.35, 0.15]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.55, 0.4, 0.02]} />
          <meshStandardMaterial color="#1a2b4c" metalness={0.6} roughness={0.2} />
        </mesh>
      </group>

      {/* TV Camera Cylinder Turret */}
      <mesh position={[0.2, 0.8, 0.2]} rotation={[0.3, 0.4, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.35, 12]} />
        <meshStandardMaterial color="#E0E0E0" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Soil Mechanics Surface Sampler Scoop Arm */}
      <group position={[-0.2, 0.4, 0.3]} rotation={[0.5, -0.3, 0]}>
        <mesh position={[0, -0.3, 0.2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
          <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Scoop Bucket */}
        <mesh position={[0, -0.65, 0.4]}>
          <boxGeometry args={[0.08, 0.06, 0.12]} />
          <meshStandardMaterial color="#555555" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

export function TVCameraModel() {
  return (
    <group position={[0, 0, 0]}>
      {/* Westinghouse Camera Body */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.22, 0.18, 0.32]} />
        <meshStandardMaterial color="#E8E8E8" metalness={0.5} roughness={0.35} />
      </mesh>

      {/* Camera Lens Barrel */}
      <mesh position={[0, 0.8, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
        <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Tripod Legs */}
      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => (
        <group key={idx} rotation={[0, angle, 0]}>
          <mesh position={[0.22, 0.38, 0]} rotation={[0, 0, -0.32]}>
            <cylinderGeometry args={[0.012, 0.015, 0.85, 8]} />
            <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function SWCModel() {
  return (
    <group position={[0, 0, 0]}>
      {/* Telescopic Staff */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.02, 1.4, 12]} />
        <meshStandardMaterial color="#D8D8D8" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Horizontal Crossbar */}
      <mesh position={[0.25, 1.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.01, 0.01, 0.55, 8]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} />
      </mesh>

      {/* Shiny Aluminum Foil Sheet (traps noble gas solar wind ions) */}
      <mesh position={[0.25, 0.75, 0]} castShadow>
        <planeGeometry args={[0.45, 1.1]} />
        <meshStandardMaterial
          color="#F0F8FF"
          metalness={0.95}
          roughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export function SBandAntennaModel() {
  return (
    <group position={[0, 0, 0]}>
      {/* Tripod Stand Base */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.0, 8]} />
        <meshStandardMaterial color="#999999" metalness={0.8} />
      </mesh>
      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => (
        <group key={idx} rotation={[0, angle, 0]}>
          <mesh position={[0.4, 0.25, 0]} rotation={[0, 0, -0.6]}>
            <cylinderGeometry args={[0.015, 0.02, 0.6, 8]} />
            <meshStandardMaterial color="#888888" metalness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Large 3-meter Parabolic Mesh Dish (pointed toward Earth) */}
      <group position={[0, 1.3, 0]} rotation={[0.4, -0.5, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[1.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.8]} />
          <meshStandardMaterial
            color="#FFD700"
            wireframe
            metalness={0.9}
            roughness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Central Feed Horn */}
        <mesh position={[0, 0, 0.45]}>
          <cylinderGeometry args={[0.03, 0.06, 0.25, 12]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

export function METModel() {
  return (
    <group position={[0, 0.35, 0]} scale={0.85}>
      {/* Tubular Chassis Frame */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.7, 0.08, 0.9]} />
        <meshStandardMaterial color="#AAAAAA" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Two Pneumatic Tires */}
      <mesh position={[-0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.12, 16]} />
        <meshStandardMaterial color="#222222" roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.12, 16]} />
        <meshStandardMaterial color="#222222" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Equipment Containers / Tool Trays */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.55, 0.25, 0.7]} />
        <meshStandardMaterial color="#D0D0D0" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Pull Handle Bar */}
      <mesh position={[0, 0.35, 0.75]} rotation={[-0.4, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
        <meshStandardMaterial color="#BBBBBB" metalness={0.8} />
      </mesh>
    </group>
  );
}

export function GenericArtifactModel({ name }: { name?: string }) {
  return (
    <group position={[0, 0.2, 0]} name={name ?? "Artifact"}>
      {/* Multi-layer insulation instrument box */}
      <mesh castShadow>
        <boxGeometry args={[0.4, 0.35, 0.4]} />
        <meshStandardMaterial color="#FFD700" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Scientific sensor probe */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.02, 0.04, 0.25, 8]} />
        <meshStandardMaterial color="#CCCCCC" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Telemetry beacon cap */}
      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshBasicMaterial color="#00D4FF" />
      </mesh>
    </group>
  );
}

export function HeritageModel({
  id,
  playerName = "Commander",
}: {
  id: string;
  playerName?: string;
}) {
  switch (id) {
    case "flag":
      return <USFlagModel playerName={playerName} />;
    case "lrrr":
      return <LRRRModel />;
    case "psep":
      return <PSEPModel />;
    case "alsep":
      return <ALSEPModel />;
    case "lrv":
      return <LRVRoverModel />;
    case "surveyor-3":
      return <Surveyor3Model />;
    case "tv-camera":
    case "uv-camera":
      return <TVCameraModel />;
    case "swc":
      return <SWCModel />;
    case "s-band-antenna":
      return <SBandAntennaModel />;
    case "hand-tool-carrier":
    case "met":
      return <METModel />;
    default:
      return <GenericArtifactModel name={id} />;
  }
}
