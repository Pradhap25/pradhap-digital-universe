import { useSvgTexture } from '../utils/useSvgTexture';

interface BrandMonolithProps {
  logoUrl: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  frameColor?: string;
  plateBackground?: string | null;
}

/**
 * Crisp 3D metallic glass monolith displaying an official SVG brand asset
 * with subtle depth and rim highlights.
 */
export function BrandMonolith({
  logoUrl,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 2.4,
  height = 0.95,
  frameColor = '#22d3ee',
  plateBackground = null,
}: BrandMonolithProps) {
  const texture = useSvgTexture(logoUrl, {
    width: 1024,
    height: Math.round(1024 * (height / width)),
    plateBackground,
    paddingRatio: 0.12,
  });

  if (!texture) {
    return null;
  }

  return (
    <group position={position} rotation={rotation}>
      {/* Sleek metallic backing slab */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[width + 0.14, height + 0.14, 0.08]} />
        <meshStandardMaterial
          color="#0a1226"
          emissive={frameColor}
          emissiveIntensity={0.22}
          metalness={0.85}
          roughness={0.24}
        />
      </mesh>

      {/* Thin luminous rim border */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[width + 0.16, height + 0.16, 0.09]} />
        <meshStandardMaterial color={frameColor} wireframe />
      </mesh>

      {/* Official brand artwork plane */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} transparent />
      </mesh>
    </group>
  );
}
