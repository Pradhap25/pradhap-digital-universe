import { useFrame } from '@react-three/fiber';
import type { MutableRefObject } from 'react';
import { MathUtils } from 'three';

interface CameraRigProps {
  scrollProgressRef: MutableRefObject<number>;
  disabled?: boolean;
}

export function CameraRig({ scrollProgressRef, disabled = false }: CameraRigProps) {
  useFrame((state, delta) => {
    const progress = scrollProgressRef.current;
    const damp = Math.min(1, delta * 3.0);

    const baseX = Math.sin(progress * Math.PI * 1.2) * 0.35;
    const baseY = 0.08 - progress * 0.25;
    const baseZ = 6.1 - Math.sin(progress * Math.PI) * 0.35;

    const pointerX = disabled ? 0 : state.pointer.x * 0.32;
    const pointerY = disabled ? 0 : state.pointer.y * 0.2;

    state.camera.position.x = MathUtils.lerp(state.camera.position.x, baseX + pointerX, damp);
    state.camera.position.y = MathUtils.lerp(state.camera.position.y, baseY + pointerY, damp);
    state.camera.position.z = MathUtils.lerp(state.camera.position.z, baseZ, damp);
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}
