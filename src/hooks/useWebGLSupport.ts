import { useEffect, useState } from 'react';

interface WebGLCapability {
  supported: boolean;
  isLowPower: boolean;
}

export function useWebGLSupport(): WebGLCapability {
  const [capability, setCapability] = useState<WebGLCapability>({
    supported: true,
    isLowPower: false,
  });

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    let supported = false;
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ||
        canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false });
      supported = Boolean(gl);
    } catch {
      supported = false;
    }

    const hardwareConcurrency = navigator.hardwareConcurrency ?? 4;
    const isNarrowViewport = window.innerWidth < 768;
    const isLowPower = hardwareConcurrency <= 2 || isNarrowViewport;

    setCapability({ supported, isLowPower });
  }, []);

  return capability;
}
