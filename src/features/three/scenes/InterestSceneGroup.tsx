import { Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils, type Group } from 'three';
import pythonLogo from '@/assets/brands/python.svg';
import type { InterestCategoryKey } from '@/types/portfolio';
import { BrandMonolith } from './BrandMonolith';

interface InterestsGroupProps {
  active: boolean;
  category: InterestCategoryKey;
  reducedMotion: boolean;
}

export function InterestsGroup({
  active,
  category,
  reducedMotion,
}: InterestsGroupProps) {
  const rootRef = useRef<Group>(null);
  const genAiRef = useRef<Group>(null);
  const aiCvRef = useRef<Group>(null);
  const dataSciRef = useRef<Group>(null);
  const progRef = useRef<Group>(null);

  useFrame((_state, delta) => {
    const root = rootRef.current;
    if (!root) return;

    const damp = Math.min(1, delta * 4.5);
    const rootScale = MathUtils.lerp(root.scale.x, active ? 1 : 0.001, damp);
    root.scale.setScalar(rootScale);
    root.visible = rootScale > 0.02;
    root.position.x = MathUtils.lerp(root.position.x, active ? 2.15 : 3.5, damp);
    root.position.y = MathUtils.lerp(root.position.y, active ? 0 : -0.5, damp);

    if (!active) return;

    const groups: [Group | null, InterestCategoryKey, number][] = [
      [genAiRef.current, 'generative-ai', 0.24],
      [aiCvRef.current, 'ai-cv', -0.2],
      [dataSciRef.current, 'data-science', 0.22],
      [progRef.current, 'programming', -0.26],
    ];

    for (const [grp, key, rotSpeed] of groups) {
      if (!grp) continue;
      const isTarget = category === key;
      const s = MathUtils.lerp(grp.scale.x, isTarget ? 1 : 0.001, damp);
      grp.scale.setScalar(s);
      grp.visible = s > 0.02;
      if (!reducedMotion && isTarget) {
        grp.rotation.y += delta * rotSpeed;
      }
    }
  });

  return (
    <group ref={rootRef}>
      <Float speed={reducedMotion ? 0 : 1.4} floatIntensity={reducedMotion ? 0 : 0.28}>
        {/* A. Generative AI: Neural Brain Hemispheres + Vector DB Nodes + RAG Orbit */}
        <group ref={genAiRef}>
          <mesh position={[-0.36, 0.08, 0]} scale={[0.78, 0.95, 0.85]}>
            <icosahedronGeometry args={[0.72, 1]} />
            <meshStandardMaterial
              color="#1e1b4b"
              emissive="#a855f7"
              emissiveIntensity={0.7}
              wireframe
            />
          </mesh>
          <mesh position={[0.36, 0.08, 0]} scale={[0.78, 0.95, 0.85]}>
            <icosahedronGeometry args={[0.72, 1]} />
            <meshStandardMaterial
              color="#083344"
              emissive="#22d3ee"
              emissiveIntensity={0.7}
              wireframe
            />
          </mesh>
          <mesh scale={0.34}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#38bdf8" emissive="#22d3ee" emissiveIntensity={1.0} />
          </mesh>
          {/* Connected Vector Database Nodes */}
          {[
            [-1.35, 0.75, 0.2],
            [1.35, 0.65, -0.2],
            [-1.2, -0.8, -0.25],
            [1.25, -0.75, 0.25],
          ].map((pos, idx) => (
            <mesh key={idx} position={pos as [number, number, number]}>
              <octahedronGeometry args={[0.2, 0]} />
              <meshStandardMaterial
                color={idx % 2 === 0 ? '#22d3ee' : '#c084fc'}
                emissive={idx % 2 === 0 ? '#0891b2' : '#7e22ce'}
                emissiveIntensity={0.85}
              />
            </mesh>
          ))}
          <mesh rotation={[Math.PI / 2.2, 0.2, 0]}>
            <torusGeometry args={[1.55, 0.018, 16, 72]} />
            <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.8} />
          </mesh>
        </group>

        {/* B. AI & Computer Vision: Detection Frame + Pose Estimation Skeleton */}
        <group ref={aiCvRef}>
          <mesh>
            <boxGeometry args={[1.85, 2.05, 1.05]} />
            <meshStandardMaterial color="#22d3ee" wireframe />
          </mesh>
          {/* Pose Estimation Joint Nodes */}
          {[
            [0, 0.65, 0],     // head
            [0, 0.3, 0],      // neck/chest
            [-0.42, 0.28, 0], // left shoulder
            [0.42, 0.28, 0],  // right shoulder
            [-0.58, -0.1, 0.15], // left hand
            [0.58, -0.1, 0.15],  // right hand
            [0, -0.22, 0],    // pelvis
            [-0.28, -0.78, 0], // left foot
            [0.28, -0.78, 0],  // right foot
          ].map((pos, idx) => (
            <mesh key={idx} position={pos as [number, number, number]}>
              <sphereGeometry args={[idx === 0 ? 0.14 : 0.09, 16, 16]} />
              <meshStandardMaterial
                color={idx === 0 ? '#38bdf8' : '#a855f7'}
                emissive={idx === 0 ? '#0284c7' : '#7e22ce'}
                emissiveIntensity={0.9}
              />
            </mesh>
          ))}
          {/* Torso & Limb Connectors */}
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.56, 8]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0, 0.29, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.022, 0.022, 0.84, 8]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[-0.14, -0.5, 0]} rotation={[0, 0, -0.35]}>
            <cylinderGeometry args={[0.022, 0.022, 0.62, 8]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0.14, -0.5, 0]} rotation={[0, 0, 0.35]}>
            <cylinderGeometry args={[0.022, 0.022, 0.62, 8]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
          </mesh>
        </group>

        {/* C. Data & Analytics: Floating Dashboard Plane + Statistical Bars */}
        <group ref={dataSciRef}>
          <mesh position={[0, 0, -0.25]} rotation={[-0.1, 0, 0]}>
            <boxGeometry args={[2.1, 1.45, 0.05]} />
            <meshStandardMaterial
              color="#0f172a"
              emissive="#1e3a8a"
              emissiveIntensity={0.45}
              metalness={0.75}
              roughness={0.22}
            />
          </mesh>
          <mesh position={[0, 0, -0.25]} rotation={[-0.1, 0, 0]}>
            <boxGeometry args={[2.12, 1.47, 0.06]} />
            <meshStandardMaterial color="#38bdf8" wireframe />
          </mesh>
          {[
            { x: -0.68, h: 0.45, color: '#38bdf8' },
            { x: -0.24, h: 0.92, color: '#22d3ee' },
            { x: 0.2, h: 0.68, color: '#818cf8' },
            { x: 0.64, h: 1.15, color: '#a855f7' },
          ].map((bar) => (
            <mesh key={bar.x} position={[bar.x, -0.45 + bar.h / 2, 0.1]}>
              <boxGeometry args={[0.26, bar.h, 0.22]} />
              <meshStandardMaterial
                color={bar.color}
                emissive={bar.color}
                emissiveIntensity={0.7}
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>
          ))}
        </group>

        {/* D. Programming: Official Python Emblem + Connected OOPs Object Cubes */}
        <group ref={progRef}>
          <BrandMonolith
            logoUrl={pythonLogo}
            position={[0, 0.45, 0.15]}
            width={1.35}
            height={1.05}
            frameColor="#3b82f6"
            plateBackground="rgba(10, 18, 38, 0.85)"
          />
          {[
            [-1.1, -0.75, 0],
            [0, -0.75, 0.15],
            [1.1, -0.75, 0],
          ].map((pos, idx) => (
            <mesh key={idx} position={pos as [number, number, number]}>
              <boxGeometry args={[0.38, 0.38, 0.38]} />
              <meshStandardMaterial
                color="#0f172a"
                emissive={idx === 1 ? '#a855f7' : '#22d3ee'}
                emissiveIntensity={0.7}
                metalness={0.75}
                roughness={0.22}
              />
            </mesh>
          ))}
        </group>
      </Float>
    </group>
  );
}
