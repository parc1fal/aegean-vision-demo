import LiquidGlassButton from "./LiquidGlassButton";

interface HeroContentProps {
  onCtaClick: () => void;
}

const HeroContent = ({ onCtaClick }: HeroContentProps) => {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl md:text-7xl font-extrabold text-white text-center leading-tight tracking-tight mb-6 drop-shadow-lg">
        The Browser Built for AI Agents
      </h1>
      <p className="text-lg md:text-xl text-white/80 text-center max-w-2xl mb-12 font-light">
        Tasks complete in seconds, not minutes. Watch agents work the way they were meant to.
      </p>
      <LiquidGlassButton
        onClick={onCtaClick}
        className="hover:shadow-[0_0_40px_rgba(95,113,227,0.4)]"
      >
        See the Difference
      </LiquidGlassButton>
    </div>
  );
};

export default HeroContent;
