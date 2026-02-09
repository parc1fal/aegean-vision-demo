import { useId, type ReactNode } from "react";

interface LiquidGlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const LiquidGlassButton = ({ children, onClick, className = "" }: LiquidGlassButtonProps) => {
  const filterId = `liquid-glass-${useId().replace(/:/g, "")}`;

  return (
    <>
      {/* SVG Filter Definition */}
      <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }} aria-hidden="true">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            {/* Generate organic noise pattern */}
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise" />

            {/* Blur the noise to create softer blobs */}
            <feGaussianBlur in="noise" stdDeviation="8" result="blurredNoise" />

            {/* Use the noise to displace the background */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurredNoise"
              scale="25"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Button with layered glass effect */}
      <div className="relative inline-block">
        <button
          onClick={onClick}
          className={`relative overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_40px_rgba(95,113,227,0.5)] active:scale-95 ${className}`}
          style={{
            padding: "1rem 2.5rem",
            borderRadius: "40px",
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          {/* Layer 1: Distorted backdrop (bottom) */}
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(8px) url(#${filterId})`,
              WebkitBackdropFilter: `blur(8px) url(#${filterId})`,
              zIndex: 0,
            }}
          />

          {/* Layer 2: Semi-transparent tint */}
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              zIndex: 1,
            }}
          />

          {/* Layer 3: Specular highlight (top edge shine) */}
          <div
            className="absolute inset-0"
            style={{
              boxShadow: `
                inset 0 1px 1px rgba(255, 255, 255, 0.6),
                inset 0 -1px 1px rgba(255, 255, 255, 0.3)
              `,
              borderRadius: "40px",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />

          {/* Layer 4: Content (top) */}
          <span
            style={{
              position: "relative",
              zIndex: 3,
            }}
          >
            {children}
          </span>
        </button>
      </div>
    </>
  );
};

export default LiquidGlassButton;
