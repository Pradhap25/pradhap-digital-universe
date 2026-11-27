import { useEffect, useState } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';

interface SvgTextureOptions {
  width?: number;
  height?: number;
  plateBackground?: string | null;
  paddingRatio?: number;
}

const textureCache = new Map<string, CanvasTexture>();

/**
 * Rasterizes a bundled SVG brand asset onto an offscreen canvas and returns
 * a sharp Three.js CanvasTexture with optional luminous plate backing.
 */
export function useSvgTexture(
  src: string | undefined,
  options: SvgTextureOptions = {},
): CanvasTexture | null {
  const {
    width = 1024,
    height = 512,
    plateBackground = null,
    paddingRatio = 0.14,
  } = options;

  const cacheKey = src ? `${src}|${width}x${height}|${plateBackground ?? 'none'}|${paddingRatio}` : '';
  const [texture, setTexture] = useState<CanvasTexture | null>(() =>
    cacheKey ? textureCache.get(cacheKey) ?? null : null,
  );

  useEffect(() => {
    if (!src || !cacheKey) {
      setTexture(null);
      return;
    }

    const cached = textureCache.get(cacheKey);
    if (cached) {
      setTexture(cached);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (cancelled) return;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (plateBackground) {
        const radius = Math.min(width, height) * 0.1;
        ctx.fillStyle = plateBackground;
        ctx.beginPath();
        ctx.roundRect(0, 0, width, height, radius);
        ctx.fill();
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      const padX = width * paddingRatio;
      const padY = height * paddingRatio;
      const maxW = width - padX * 2;
      const maxH = height - padY * 2;

      const aspect = img.naturalWidth && img.naturalHeight
        ? img.naturalWidth / img.naturalHeight
        : maxW / maxH;

      let drawW = maxW;
      let drawH = drawW / aspect;
      if (drawH > maxH) {
        drawH = maxH;
        drawW = drawH * aspect;
      }

      const x = (width - drawW) / 2;
      const y = (height - drawH) / 2;
      ctx.drawImage(img, x, y, drawW, drawH);

      const tex = new CanvasTexture(canvas);
      tex.colorSpace = SRGBColorSpace;
      tex.anisotropy = 4;
      tex.needsUpdate = true;

      textureCache.set(cacheKey, tex);
      if (!cancelled) {
        setTexture(tex);
      }
    };

    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, cacheKey, width, height, plateBackground, paddingRatio]);

  return texture;
}
