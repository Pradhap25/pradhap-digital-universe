import { Canvas } from '@react-three/fiber';
import type { MotionValue } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import { useWebGLSupport } from '@/hooks/useWebGLSupport';
import { CameraRig } from './CameraRig';
import type { UniverseVisualState } from './types';
import { UniverseScene } from './UniverseScene';

interface UniverseCanvasProps {
  scrollYProgress: MotionValue<number>;
  visualState: UniverseVisualState;
  activeSkillLogoUrl?: string;
}

export default function UniverseCanvas({
  scrollYProgress,
  visualState,
  activeSkillLogoUrl,
}: UniverseCanvasProps) {
  const scrollProgressRef = useRef(0);
  const reducedMotion = useReducedMotionPref();
  const { supported, isLowPower } = useWebGLSupport();

  useEffect(() => {
    scrollProgressRef.current = scrollYProgress.get();
    return scrollYProgress.on('change', (latest) => {
      scrollProgressRef.current = latest;
    });
  }, [scrollYProgress]);

  if (!supported || reducedMotion) {
    return null;
  }

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop="always"
      camera={{ position: [0, 0.08, 6.1], fov: 44 }}
      gl={{ antialias: !isLowPower, alpha: true, powerPreference: 'high-performance' }}
    >
      <CameraRig scrollProgressRef={scrollProgressRef} disabled={isLowPower} />
      <UniverseScene
        scrollProgressRef={scrollProgressRef}
        visualState={visualState}
        activeSkillLogoUrl={activeSkillLogoUrl}
        isLowPower={isLowPower}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  );
}
