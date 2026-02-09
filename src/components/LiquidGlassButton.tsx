import type { ReactNode } from "react";

interface LiquidGlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const LiquidGlassButton = ({ children, onClick, className = "" }: LiquidGlassButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 ${className}`}
      style={{
        padding: "1rem 2.5rem",
        borderRadius: "40px",
        fontSize: "1.125rem",
        fontWeight: 600,
        color: "white",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -1px 1px rgba(255, 255, 255, 0.3)",
      }}
    >
      {children}
    </button>
  );
};

export default LiquidGlassButton;
