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
      <button
        onClick={onCtaClick}
        className="glass px-10 py-4 rounded-full text-white font-semibold text-lg
                   transition-all duration-300 ease-in-out
                   hover:scale-105 hover:bg-white/25 hover:shadow-[0_0_40px_rgba(95,113,227,0.4)]
                   active:scale-95 cursor-pointer"
      >
        See the Difference
      </button>
    </div>
  );
};

export default HeroContent;
