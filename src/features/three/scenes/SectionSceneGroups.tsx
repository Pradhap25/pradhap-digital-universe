import { Float } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils, type Group, type Mesh } from 'three';
import azureLogo from '@/assets/brands/azure.svg';
import livanovaLogo from '@/assets/brands/livanova.svg';
import opencvLogo from '@/assets/brands/opencv.svg';
import powerbiLogo from '@/assets/brands/powerbi.svg';
import pythonLogo from '@/assets/brands/python.svg';
import sapLogo from '@/assets/brands/sap.svg';
import tensorflowLogo from '@/assets/brands/tensorflow.svg';
import flaskLogo from '@/assets/brands/flask.svg';
import dockerLogo from '@/assets/brands/docker.svg';
import type { SkillCategory } from '@/types/portfolio';
import type { ExperienceCompanyKey } from '../types';
import { BrandMonolith } from './BrandMonolith';

/** Smoothly scales & positions a 3D group in/out based on whether its section is active. */
function useSectionPresence(active: boolean, targetX = 2.1, targetY = 0) {
  const groupRef = useRef<Group>(null);

  useFrame((_state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const damp = Math.min(1, delta * 4.5);
    const desiredScale = active ? 1 : 0.001;
    const nextScale = MathUtils.lerp(group.scale.x, desiredScale, damp);

    group.scale.setScalar(nextScale);
    group.visible = nextScale > 0.02;
    group.position.x = MathUtils.lerp(group.position.x, active ? targetX : targetX + 1.4, damp);
    group.position.y = MathUtils.lerp(group.position.y, active ? targetY : targetY - 0.5, damp);
  });

  return groupRef;
}

export function HeroCoreGroup({
  active,
  reducedMotion,
}: {
  active: boolean;
  reducedMotion: boolean;
}) {
  const viewportWidth = useThree((state) => state.viewport.width);
  const isCompact = viewportWidth < 5.5;
  const presenceRef = useSectionPresence(active, isCompact ? 0.95 : 2.15, 0.08);
  const coreRef = useRef<Mesh>(null);

  useFrame((_state, delta) => {
    if (!active || reducedMotion || !coreRef.current) return;
    coreRef.current.rotation.y += delta * 0.14;
    coreRef.current.rotation.x += delta * 0.05;
  });

  return (
    <group ref={presenceRef}>
      <Float
        speed={reducedMotion ? 0 : 0.85}
        rotationIntensity={0}
        floatIntensity={reducedMotion ? 0 : 0.16}
      >
        <mesh ref={coreRef} scale={isCompact ? 0.78 : 1}>
          <icosahedronGeometry args={[1.05, 0]} />
          <meshStandardMaterial
            color="#0b152d"
            emissive="#1d4ed8"
            emissiveIntensity={0.28}
            metalness={0.82}
            roughness={0.22}
            flatShading
          />
        </mesh>
      </Float>
    </group>
  );
}

export function ExperienceGroup({
  active,
  company,
  reducedMotion,
}: {
  active: boolean;
  company: ExperienceCompanyKey;
  reducedMotion: boolean;
}) {
  const presenceRef = useSectionPresence(active, 2.15, 0.05);
  const livanovaRef = useRef<Group>(null);
  const sapRef = useRef<Group>(null);

  useFrame((_state, delta) => {
    if (!active) return;
    const damp = Math.min(1, delta * 5.2);
    const isLiva = company === 'livanova';

    if (livanovaRef.current) {
      const s = MathUtils.lerp(livanovaRef.current.scale.x, isLiva ? 1 : 0.001, damp);
      livanovaRef.current.scale.setScalar(s);
      livanovaRef.current.visible = s > 0.02;
      if (!reducedMotion && isLiva) {
        livanovaRef.current.rotation.y = MathUtils.lerp(
          livanovaRef.current.rotation.y,
          Math.sin(_state.clock.elapsedTime * 0.55) * 0.16,
          damp,
        );
      }
    }

    if (sapRef.current) {
      const s = MathUtils.lerp(sapRef.current.scale.x, !isLiva ? 1 : 0.001, damp);
      sapRef.current.scale.setScalar(s);
      sapRef.current.visible = s > 0.02;
      if (!reducedMotion && !isLiva) {
        sapRef.current.rotation.y = MathUtils.lerp(
          sapRef.current.rotation.y,
          Math.sin(_state.clock.elapsedTime * 0.55) * -0.16,
          damp,
        );
      }
    }
  });

  return (
    <group ref={presenceRef}>
      {/* LIVANOVA: Official LivaNova Logo + Azure Synapse Pipeline + Power Platform Nodes */}
      <group ref={livanovaRef}>
        <BrandMonolith
          logoUrl={livanovaLogo}
          position={[0, 0.55, 0.15]}
          width={2.65}
          height={0.92}
          frameColor="#a855f7"
          plateBackground="rgba(248, 250, 252, 0.94)"
        />
        <BrandMonolith
          logoUrl={azureLogo}
          position={[-0.9, -0.65, 0.25]}
          width={0.85}
          height={0.65}
          frameColor="#0ea5e9"
          plateBackground="rgba(15, 23, 42, 0.85)"
        />
        {/* Azure Synapse-inspired Data Pipeline Conduit & Workflow Nodes */}
        {[0, 0.55, 1.1].map((xPos, idx) => (
          <mesh key={xPos} position={[xPos, -0.65, 0.1]}>
            <boxGeometry args={[0.34, 0.34, 0.34]} />
            <meshStandardMaterial
              color="#0f172a"
              emissive={idx === 1 ? '#a855f7' : '#22d3ee'}
              emissiveIntensity={0.65}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        ))}
        <mesh position={[0.55, -0.65, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 1.4, 12]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* SAP LABS: Official SAP Logo + Enterprise AI/ML Data Processing Lattice */}
      <group ref={sapRef}>
        <BrandMonolith
          logoUrl={sapLogo}
          position={[0, 0.45, 0.18]}
          width={2.35}
          height={1.18}
          frameColor="#38bdf8"
        />
        {/* Clean Enterprise ML Data Processing & Deduplication Structure */}
        <mesh position={[0, -0.78, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.15, 0.022, 16, 72]} />
          <meshStandardMaterial color="#009ad9" emissive="#007fc4" emissiveIntensity={0.75} />
        </mesh>
        {[-0.85, 0, 0.85].map((xPos, idx) => (
          <mesh key={xPos} position={[xPos, -0.78, 0.1]}>
            <octahedronGeometry args={[idx === 1 ? 0.28 : 0.2, 0]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={0.75}
              metalness={0.75}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

type SkillVisualMode =
  | 'python'
  | 'sql'
  | 'vision'
  | 'neural'
  | 'genai'
  | 'analytics'
  | 'cloud'
  | 'backend';

function resolveSkillVisualMode(
  category: 'All' | SkillCategory,
  skillId: string | null,
): { mode: SkillVisualMode; fallbackLogo: string } {
  if (skillId === 'sk-python') return { mode: 'python', fallbackLogo: pythonLogo };
  if (skillId === 'sk-sql' || skillId === 'sk-mysql') return { mode: 'sql', fallbackLogo: pythonLogo };
  if (skillId === 'sk-yolov11' || skillId === 'sk-opencv' || skillId === 'sk-cv') {
    return { mode: 'vision', fallbackLogo: opencvLogo };
  }
  if (skillId === 'sk-powerbi' || skillId === 'sk-matplotlib' || skillId === 'sk-seaborn') {
    return { mode: 'analytics', fallbackLogo: powerbiLogo };
  }
  if (
    skillId === 'sk-azure' ||
    skillId === 'sk-powerapps' ||
    skillId === 'sk-powerautomate' ||
    skillId === 'sk-fabric'
  ) {
    return { mode: 'cloud', fallbackLogo: azureLogo };
  }

  switch (category) {
    case 'Programming':
      return { mode: 'python', fallbackLogo: pythonLogo };
    case 'Data Science & Analytics':
      return { mode: 'analytics', fallbackLogo: powerbiLogo };
    case 'Generative AI / LLM / RAG':
      return { mode: 'genai', fallbackLogo: pythonLogo };
    case 'Cloud & Automation':
      return { mode: 'cloud', fallbackLogo: azureLogo };
    case 'Backend & Deployment':
      return { mode: 'backend', fallbackLogo: dockerLogo };
    case 'AI / Machine Learning':
    default:
      return { mode: 'neural', fallbackLogo: tensorflowLogo };
  }
}

export function SkillsGroup({
  active,
  category,
  skillId,
  skillLogoUrl,
  reducedMotion,
}: {
  active: boolean;
  category: 'All' | SkillCategory;
  skillId: string | null;
  skillLogoUrl?: string;
  reducedMotion: boolean;
}) {
  const presenceRef = useSectionPresence(active, 2.25, 0);
  const structureRef = useRef<Group>(null);
  const { mode, fallbackLogo } = resolveSkillVisualMode(category, skillId);
  const activeLogo = skillLogoUrl ?? fallbackLogo;

  useFrame((_state, delta) => {
    if (!active || reducedMotion || !structureRef.current) return;
    structureRef.current.rotation.y += delta * 0.25;
  });

  return (
    <group ref={presenceRef}>
      {/* Authentic Technology Brand Plaque */}
      <BrandMonolith
        logoUrl={activeLogo}
        position={[0, 0.72, 0.25]}
        width={1.35}
        height={0.95}
        frameColor="#22d3ee"
        plateBackground="rgba(10, 18, 38, 0.86)"
      />

      {/* Paired 3D Technology Structure */}
      <group ref={structureRef} position={[0, -0.58, 0]} scale={0.78}>
        {mode === 'sql' ? (
          <group>
            {[-0.55, 0, 0.55].map((yPos) => (
              <mesh key={yPos} position={[0, yPos, 0]}>
                <cylinderGeometry args={[0.85, 0.85, 0.3, 32]} />
                <meshStandardMaterial
                  color="#0f172a"
                  emissive="#06b6d4"
                  emissiveIntensity={0.55}
                  metalness={0.85}
                  roughness={0.22}
                />
              </mesh>
            ))}
          </group>
        ) : mode === 'vision' ? (
          <group>
            <mesh>
              <boxGeometry args={[1.55, 1.15, 1.05]} />
              <meshStandardMaterial color="#22d3ee" wireframe />
            </mesh>
            <mesh scale={0.5}>
              <boxGeometry args={[1.1, 1.1, 1.1]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
            </mesh>
          </group>
        ) : mode === 'analytics' ? (
          <group position={[0, -0.4, 0]}>
            {[
              { x: -0.65, h: 0.65, color: '#38bdf8' },
              { x: -0.22, h: 1.25, color: '#22d3ee' },
              { x: 0.22, h: 0.9, color: '#f59e0b' },
              { x: 0.65, h: 1.5, color: '#a855f7' },
            ].map((bar) => (
              <mesh key={bar.x} position={[bar.x, bar.h / 2, 0]}>
                <boxGeometry args={[0.28, bar.h, 0.28]} />
                <meshStandardMaterial color={bar.color} emissive={bar.color} emissiveIntensity={0.55} />
              </mesh>
            ))}
          </group>
        ) : mode === 'genai' ? (
          <group>
            <mesh>
              <dodecahedronGeometry args={[0.82, 0]} />
              <meshStandardMaterial color="#a855f7" emissive="#7e22ce" emissiveIntensity={0.75} wireframe />
            </mesh>
            <mesh scale={0.45}>
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.9} />
            </mesh>
          </group>
        ) : mode === 'cloud' ? (
          <group>
            {[
              [-0.75, 0.35, 0],
              [0, 0.75, 0.2],
              [0.75, 0.25, -0.2],
              [0, -0.55, 0],
            ].map((pos, idx) => (
              <mesh key={idx} position={pos as [number, number, number]}>
                <icosahedronGeometry args={[0.28, 0]} />
                <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.75} />
              </mesh>
            ))}
          </group>
        ) : mode === 'backend' ? (
          <group>
            {[
              [-0.4, 0.4, 0],
              [0.4, 0.4, 0],
              [-0.4, -0.4, 0],
              [0.4, -0.4, 0],
            ].map((pos, idx) => (
              <mesh key={idx} position={pos as [number, number, number]}>
                <boxGeometry args={[0.55, 0.55, 0.55]} />
                <meshStandardMaterial
                  color="#0f172a"
                  emissive={idx % 2 === 0 ? '#06b6d4' : '#3b82f6'}
                  emissiveIntensity={0.6}
                />
              </mesh>
            ))}
          </group>
        ) : (
          <group>
            {[
              [-0.8, 0.5, 0],
              [-0.8, -0.5, 0],
              [0, 0.8, 0.2],
              [0, 0, -0.2],
              [0, -0.8, 0.2],
              [0.85, 0.4, 0],
              [0.85, -0.4, 0],
            ].map((pos, idx) => (
              <mesh key={idx} position={pos as [number, number, number]}>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshStandardMaterial
                  color={idx < 2 ? '#22d3ee' : idx < 5 ? '#3b82f6' : '#a855f7'}
                  emissive={idx < 2 ? '#0891b2' : idx < 5 ? '#1d4ed8' : '#7e22ce'}
                  emissiveIntensity={0.75}
                />
              </mesh>
            ))}
          </group>
        )}
      </group>
    </group>
  );
}

export function ProjectsGroup({
  active,
  projectId,
  reducedMotion,
}: {
  active: boolean;
  projectId: string;
  reducedMotion: boolean;
}) {
  const presenceRef = useSectionPresence(active, -2.15, 0);
  const objRef = useRef<Group>(null);

  useFrame((_state, delta) => {
    if (!active || reducedMotion || !objRef.current) return;
    objRef.current.rotation.y += delta * 0.22;
  });

  return (
    <group ref={presenceRef}>
      <group ref={objRef}>
        {projectId === 'proj-traffic-fine' ? (
          <group>
            <BrandMonolith
              logoUrl={opencvLogo}
              position={[0, 0.95, 0]}
              width={0.95}
              height={0.7}
              frameColor="#22d3ee"
              plateBackground="rgba(10, 18, 38, 0.85)"
            />
            <mesh position={[0, -0.2, 0]}>
              <boxGeometry args={[1.75, 1.0, 0.95]} />
              <meshStandardMaterial color="#22d3ee" wireframe />
            </mesh>
            <mesh position={[0, -0.25, 0]}>
              <boxGeometry args={[1.05, 0.5, 0.55]} />
              <meshStandardMaterial color="#0f172a" emissive="#0284c7" emissiveIntensity={0.65} />
            </mesh>
          </group>
        ) : projectId === 'proj-rag-resume' ? (
          <group>
            <BrandMonolith
              logoUrl={flaskLogo}
              position={[0, 0.95, 0]}
              width={0.95}
              height={0.7}
              frameColor="#a855f7"
              plateBackground="rgba(10, 18, 38, 0.85)"
            />
            <mesh position={[0, -0.2, 0]}>
              <icosahedronGeometry args={[0.62, 0]} />
              <meshStandardMaterial color="#a855f7" emissive="#7e22ce" emissiveIntensity={0.85} />
            </mesh>
            {[
              [1.1, 0.2, 0.25],
              [-1.0, 0.35, -0.2],
              [0.75, -0.85, -0.25],
              [-0.9, -0.75, 0.3],
            ].map((pos, idx) => (
              <mesh key={idx} position={pos as [number, number, number]}>
                <octahedronGeometry args={[0.22, 0]} />
                <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={0.75} />
              </mesh>
            ))}
          </group>
        ) : (
          <group rotation={[0.45, 0.2, -0.15]}>
            <mesh>
              <boxGeometry args={[2.1, 0.08, 1.4]} />
              <meshStandardMaterial
                color="#0f172a"
                emissive="#10b981"
                emissiveIntensity={0.45}
                metalness={0.88}
                roughness={0.18}
              />
            </mesh>
            <mesh position={[0, 0.06, 0]}>
              <boxGeometry args={[2.12, 0.04, 1.42]} />
              <meshStandardMaterial color="#34d399" wireframe />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}

export function AchievementsGroup({
  active,
  achievementId,
  reducedMotion,
}: {
  active: boolean;
  achievementId: string;
  reducedMotion: boolean;
}) {
  const presenceRef = useSectionPresence(active, 2.2, 0.1);
  const awardRef = useRef<Group>(null);

  useFrame((_state, delta) => {
    if (!active || reducedMotion || !awardRef.current) return;
    awardRef.current.rotation.y += delta * 0.38;
  });

  return (
    <group ref={presenceRef}>
      <Float speed={reducedMotion ? 0 : 1.4} floatIntensity={reducedMotion ? 0 : 0.22}>
        <group ref={awardRef}>
          {achievementId === 'ach-silambam-national' ? (
            /* Realistic Metallic Gold Medal */
            <group>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[1.05, 1.05, 0.16, 48]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  emissive="#92400e"
                  emissiveIntensity={0.35}
                  metalness={0.95}
                  roughness={0.14}
                />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.18, 0.04, 16, 64]} />
                <meshStandardMaterial
                  color="#fde68a"
                  emissive="#b45309"
                  emissiveIntensity={0.4}
                  metalness={0.92}
                  roughness={0.16}
                />
              </mesh>
            </group>
          ) : achievementId === 'ach-uyir-hackathon' ? (
            /* Uyir Road Safety Innovation Trophy */
            <group>
              <mesh position={[0, -0.7, 0]}>
                <cylinderGeometry args={[0.58, 0.72, 0.28, 24]} />
                <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.05, 0]}>
                <cylinderGeometry args={[0.68, 0.28, 1.15, 8]} />
                <meshStandardMaterial
                  color="#a855f7"
                  emissive="#6b21a8"
                  emissiveIntensity={0.6}
                  metalness={0.84}
                  roughness={0.18}
                />
              </mesh>
              <mesh rotation={[Math.PI / 2.2, 0, 0]}>
                <torusGeometry args={[1.45, 0.025, 16, 72]} />
                <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.8} />
              </mesh>
            </group>
          ) : achievementId === 'certifications' ? (
            /* Verified Certifications Crest */
            <group>
              <mesh>
                <boxGeometry args={[1.65, 1.2, 0.08]} />
                <meshStandardMaterial color="#0f172a" emissive="#0284c7" emissiveIntensity={0.45} metalness={0.8} roughness={0.2} />
              </mesh>
              <mesh>
                <boxGeometry args={[1.7, 1.25, 0.09]} />
                <meshStandardMaterial color="#22d3ee" wireframe />
              </mesh>
              <mesh position={[0.45, -0.35, 0.1]}>
                <cylinderGeometry args={[0.24, 0.24, 0.08, 24]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.16} />
              </mesh>
            </group>
          ) : (
            /* Techgium Finalist Innovation Trophy */
            <group>
              <mesh position={[0, -0.72, 0]}>
                <cylinderGeometry args={[0.6, 0.78, 0.26, 6]} />
                <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.1, 0]}>
                <coneGeometry args={[0.65, 1.25, 6]} />
                <meshStandardMaterial
                  color="#38bdf8"
                  emissive="#0284c7"
                  emissiveIntensity={0.6}
                  metalness={0.88}
                  roughness={0.16}
                />
              </mesh>
              <mesh position={[0, 0.95, 0]}>
                <octahedronGeometry args={[0.32, 0]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  emissive="#b45309"
                  emissiveIntensity={0.55}
                  metalness={0.92}
                  roughness={0.15}
                />
              </mesh>
            </group>
          )}
        </group>
      </Float>
    </group>
  );
}

export function CertificationsGroup({
  active,
  reducedMotion,
}: {
  active: boolean;
  reducedMotion: boolean;
}) {
  const presenceRef = useSectionPresence(active, -2.1, 0.05);
  const sealRef = useRef<Group>(null);

  useFrame((_state, delta) => {
    if (!active || reducedMotion || !sealRef.current) return;
    sealRef.current.rotation.y += delta * 0.24;
  });

  return (
    <group ref={presenceRef}>
      <Float speed={reducedMotion ? 0 : 1.3} floatIntensity={reducedMotion ? 0 : 0.2}>
        <group ref={sealRef}>
          <mesh>
            <boxGeometry args={[1.65, 1.2, 0.08]} />
            <meshStandardMaterial
              color="#0f172a"
              emissive="#0284c7"
              emissiveIntensity={0.45}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          <mesh>
            <boxGeometry args={[1.7, 1.25, 0.09]} />
            <meshStandardMaterial color="#22d3ee" wireframe />
          </mesh>
          <mesh position={[0.45, -0.35, 0.1]}>
            <cylinderGeometry args={[0.24, 0.24, 0.08, 24]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.16} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

export function ResearchGroup({
  active,
  reducedMotion,
}: {
  active: boolean;
  reducedMotion: boolean;
}) {
  const presenceRef = useSectionPresence(active, 2.15, 0);
  const paperRef = useRef<Group>(null);

  useFrame((_state, delta) => {
    if (!active || reducedMotion || !paperRef.current) return;
    paperRef.current.rotation.y += delta * 0.18;
  });

  return (
    <group ref={presenceRef}>
      <Float speed={reducedMotion ? 0 : 1.25} floatIntensity={reducedMotion ? 0 : 0.2}>
        <group ref={paperRef} rotation={[0.14, -0.35, 0]}>
          <mesh>
            <boxGeometry args={[1.45, 1.95, 0.05]} />
            <meshStandardMaterial
              color="#0f172a"
              emissive="#4c1d95"
              emissiveIntensity={0.4}
              metalness={0.6}
              roughness={0.28}
            />
          </mesh>
          <mesh>
            <boxGeometry args={[1.48, 1.98, 0.06]} />
            <meshStandardMaterial color="#c084fc" wireframe />
          </mesh>
          {[
            [-0.35, 0.45, 0.25],
            [0.35, 0.45, 0.25],
            [0, 0, 0.3],
            [-0.35, -0.45, 0.25],
            [0.35, -0.45, 0.25],
          ].map((pos, idx) => (
            <mesh key={idx} position={pos as [number, number, number]}>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.85} />
            </mesh>
          ))}
        </group>
      </Float>
    </group>
  );
}

export function ContactRelayGroup({
  active,
  reducedMotion,
}: {
  active: boolean;
  reducedMotion: boolean;
}) {
  const presenceRef = useSectionPresence(active, -2.1, 0);
  const relayRef = useRef<Group>(null);

  useFrame((_state, delta) => {
    if (!active || reducedMotion || !relayRef.current) return;
    relayRef.current.rotation.z += delta * 0.2;
    relayRef.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={presenceRef}>
      <group ref={relayRef}>
        <mesh>
          <octahedronGeometry args={[0.45, 0]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.85} />
        </mesh>
        {[0.95, 1.4, 1.85].map((radius, idx) => (
          <mesh key={radius} rotation={[idx * 0.45, idx * 0.35, 0]}>
            <torusGeometry args={[radius, 0.014, 16, 72]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#22d3ee' : '#3b82f6'}
              emissive={idx % 2 === 0 ? '#22d3ee' : '#3b82f6'}
              emissiveIntensity={0.65}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
