import { useEffect, useRef, useId, type ReactNode } from "react";

interface LiquidGlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  bezelWidth?: number;
  glassThickness?: number;
  specularOpacity?: number;
  className?: string;
}

const WIDTH = 256;
const HEIGHT = 80;
const SAMPLES = 127;

// Snell's law refraction
function snellRefract(incidentAngle: number, n1: number, n2: number): number {
  const sinT = (n1 / n2) * Math.sin(incidentAngle);
  if (Math.abs(sinT) >= 1) return Math.PI / 2; // total internal reflection
  return Math.asin(sinT);
}

// Convex squircle surface profile: height = (1 - (1-t)^4)^0.25
function surfaceHeight(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return Math.pow(1 - Math.pow(1 - clamped, 4), 0.25);
}

// Numerical derivative of surface
function surfaceNormal(t: number): number {
  const dt = 0.001;
  const h0 = surfaceHeight(t - dt);
  const h1 = surfaceHeight(t + dt);
  return (h1 - h0) / (2 * dt);
}

function generateDisplacementMap(
  bezelWidth: number,
  glassThickness: number
): { dataUrl: string; maxDisplacement: number } {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(WIDTH, HEIGHT);
  const data = imageData.data;

  const n1 = 1.0;
  const n2 = 1.5;

  // Pre-calculate refraction samples along one radius
  const samples: { dx: number; dy: number }[] = [];
  let maxMag = 0;

  for (let i = 0; i < SAMPLES; i++) {
    const t = i / (SAMPLES - 1); // 0 = edge, 1 = center
    const slope = surfaceNormal(t);
    const incidentAngle = Math.atan(Math.abs(slope));
    const refractedAngle = snellRefract(incidentAngle, n1, n2);
    const displacement = Math.tan(refractedAngle) * glassThickness * (1 - t);
    const direction = slope >= 0 ? 1 : -1;

    samples.push({ dx: displacement * direction, dy: 0 });
    maxMag = Math.max(maxMag, Math.abs(displacement));
  }

  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  const rx = WIDTH / 2;
  const ry = HEIGHT / 2;

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const idx = (y * WIDTH + x) * 4;

      // Normalized distance from center in ellipse space
      const nx = (x - cx) / rx;
      const ny = (y - cy) / ry;
      const ellipseDist = Math.sqrt(nx * nx + ny * ny);

      if (ellipseDist > 1) {
        // Outside button
        data[idx] = 128;
        data[idx + 1] = 128;
        data[idx + 2] = 128;
        data[idx + 3] = 255;
        continue;
      }

      // Distance from edge (0 = edge, 1 = past bezel into center)
      const pixelDistFromEdge = (1 - ellipseDist) * Math.min(rx, ry);
      const bezelT = Math.min(1, pixelDistFromEdge / bezelWidth);

      if (bezelT >= 1) {
        // Center area - no displacement
        data[idx] = 128;
        data[idx + 1] = 128;
        data[idx + 2] = 128;
        data[idx + 3] = 255;
        continue;
      }

      // Get sample index
      const sampleIdx = Math.min(SAMPLES - 1, Math.floor(bezelT * (SAMPLES - 1)));
      const sample = samples[sampleIdx];

      // Angle around button center
      const angle = Math.atan2(y - cy, x - cx);

      // Rotate displacement vector by angle
      const rotDx = sample.dx * Math.cos(angle) + sample.dy * Math.sin(angle);
      const rotDy = sample.dx * Math.sin(angle) - sample.dy * Math.cos(angle);

      // Normalize by max magnitude and encode
      const normX = maxMag > 0 ? rotDx / maxMag : 0;
      const normY = maxMag > 0 ? rotDy / maxMag : 0;

      data[idx] = Math.round(128 + normX * 127);     // R = X displacement
      data[idx + 1] = Math.round(128 + normY * 127); // G = Y displacement
      data[idx + 2] = 128;                            // B = neutral
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return { dataUrl: canvas.toDataURL(), maxDisplacement: maxMag };
}

function generateSpecularMap(
  specularOpacity: number
): string {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(WIDTH, HEIGHT);
  const data = imageData.data;

  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  const rx = WIDTH / 2;
  const ry = HEIGHT / 2;
  const lightAngle = (-60 * Math.PI) / 180;

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const idx = (y * WIDTH + x) * 4;
      const nx = (x - cx) / rx;
      const ny = (y - cy) / ry;
      const ellipseDist = Math.sqrt(nx * nx + ny * ny);

      if (ellipseDist > 1 || ellipseDist < 0.7) {
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
        data[idx + 3] = 0;
        continue;
      }

      const edgeFactor = (ellipseDist - 0.7) / 0.3;
      const angle = Math.atan2(ny, nx);
      const angleDiff = Math.abs(angle - lightAngle);
      const intensity = Math.pow(Math.max(0, Math.cos(angleDiff)), 3);
      const boosted = intensity * (1 + edgeFactor * 0.5);
      const alpha = Math.round(boosted * specularOpacity * 255);

      data[idx] = 255;
      data[idx + 1] = 255;
      data[idx + 2] = 255;
      data[idx + 3] = Math.min(255, alpha);
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

const LiquidGlassButton = ({
  children,
  onClick,
  bezelWidth = 32,
  glassThickness = 15,
  specularOpacity = 0.4,
  className = "",
}: LiquidGlassButtonProps) => {
  const reactId = useId();
  const filterId = `liquid-glass-${reactId.replace(/:/g, "")}`;
  const svgRef = useRef<SVGSVGElement>(null);
  const displacementRef = useRef<SVGFEImageElement>(null);
  const specularRef = useRef<SVGFEImageElement>(null);
  const scaleRef = useRef<SVGFEDisplacementMapElement>(null);

  useEffect(() => {
    const { dataUrl: dispUrl, maxDisplacement } = generateDisplacementMap(bezelWidth, glassThickness);
    const specUrl = generateSpecularMap(specularOpacity);

    if (displacementRef.current) {
      displacementRef.current.setAttribute("href", dispUrl);
    }
    if (specularRef.current) {
      specularRef.current.setAttribute("href", specUrl);
    }
    if (scaleRef.current) {
      scaleRef.current.setAttribute("scale", String(Math.round(maxDisplacement)));
    }
  }, [bezelWidth, glassThickness, specularOpacity]);

  return (
    <>
      <svg
        ref={svgRef}
        width="0"
        height="0"
        style={{ position: "absolute", pointerEvents: "none" }}
        aria-hidden="true"
      >
        <defs>
          <filter
            id={filterId}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              ref={displacementRef}
              href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
              result="displacementMap"
              preserveAspectRatio="none"
            />
            <feDisplacementMap
              ref={scaleRef}
              in="SourceGraphic"
              in2="displacementMap"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feImage
              ref={specularRef}
              href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
              result="specularMap"
              preserveAspectRatio="none"
            />
            <feBlend in="specularMap" in2="displaced" mode="screen" />
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>
      </svg>
      <button
        onClick={onClick}
        className={`relative cursor-pointer transition-all duration-300 ease-in-out
                    hover:scale-105 active:scale-95 ${className}`}
        style={{
          backdropFilter: `url(#${filterId}) blur(12px)`,
          WebkitBackdropFilter: `url(#${filterId}) blur(12px)`,
          background: "rgba(255, 255, 255, 0.15)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          borderRadius: "40px",
          padding: "1rem 2.5rem",
          color: "white",
          fontWeight: 600,
          fontSize: "1.125rem",
        }}
      >
        {children}
      </button>
    </>
  );
};

export default LiquidGlassButton;
