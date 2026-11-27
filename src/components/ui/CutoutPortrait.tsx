import { useEffect, useState } from 'react';

interface CutoutPortraitProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Removes connected outer white studio background via border BFS flood-fill
 * while preserving interior white details (such as shirt collar inside a suit).
 */
export function CutoutPortrait({ src, alt, className }: CutoutPortraitProps) {
  const [cutoutSrc, setCutoutSrc] = useState<string>(src);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (!w || !h) return;

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        const visited = new Uint8Array(w * h);
        const queue = new Int32Array(w * h);
        let head = 0;
        let tail = 0;

        const isOuterWhite = (idx: number) => {
          const p = idx * 4;
          const r = data[p];
          const g = data[p + 1];
          const b = data[p + 2];
          return r >= 232 && g >= 232 && b >= 232;
        };

        const enqueueIfWhite = (x: number, y: number) => {
          if (x < 0 || x >= w || y < 0 || y >= h) return;
          const idx = y * w + x;
          if (visited[idx]) return;
          if (isOuterWhite(idx)) {
            visited[idx] = 1;
            queue[tail++] = idx;
          }
        };

        for (let x = 0; x < w; x++) {
          enqueueIfWhite(x, 0);
          enqueueIfWhite(x, h - 1);
        }
        for (let y = 0; y < h; y++) {
          enqueueIfWhite(0, y);
          enqueueIfWhite(w - 1, y);
        }

        while (head < tail) {
          const idx = queue[head++];
          data[idx * 4 + 3] = 0;

          const x = idx % w;
          const y = (idx - x) / w;
          enqueueIfWhite(x + 1, y);
          enqueueIfWhite(x - 1, y);
          enqueueIfWhite(x, y + 1);
          enqueueIfWhite(x, y - 1);
        }

        // Feather 1px fringe bordering transparent background
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const idx = y * w + x;
            if (visited[idx]) continue;
            const touchesBg =
              visited[idx - 1] ||
              visited[idx + 1] ||
              visited[idx - w] ||
              visited[idx + w];
            if (touchesBg) {
              const p = idx * 4;
              const lum = (data[p] + data[p + 1] + data[p + 2]) / 3;
              if (lum > 195) {
                data[p + 3] = Math.round(data[p + 3] * 0.45);
              }
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
        const url = canvas.toDataURL('image/png');
        if (!cancelled) {
          setCutoutSrc(url);
        }
      } catch {
        // Fallback smoothly to original image
      }
    };

    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return <img src={cutoutSrc} alt={alt} className={className} />;
}
