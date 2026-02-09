import { useState } from "react";

const commands = [
  "Book a flight to Rome under $200",
  "Find and compare hotel prices in Tokyo",
  "Find office space in Manhattan under $50/sqft, 2000+ sqft",
];

interface CommandSelectionProps {
  onSelect: (command: string) => void;
}

const CommandSelection = ({ onSelect }: CommandSelectionProps) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleClick = (idx: number) => {
    setSelected(idx);
    setTimeout(() => onSelect(commands[idx]), 500);
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#fafbff" }}>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
        What should the agent do?
      </h2>
      <p className="text-muted-foreground mb-12 text-center">Pick a task and watch it happen.</p>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {commands.map((cmd, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            className={`glass-solid px-8 py-5 rounded-3xl text-foreground font-medium text-base
                        max-w-xs text-center cursor-pointer
                        transition-all duration-300 ease-in-out
                        hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(95,113,227,0.2)]
                        hover:border-[rgba(95,113,227,0.35)]
                        ${selected !== null && selected !== idx ? "opacity-0 scale-95 pointer-events-none" : ""}
                        ${selected === idx ? "scale-105 shadow-[0_8px_30px_rgba(95,113,227,0.3)]" : ""}
                       `}
            style={{ transitionDuration: "400ms" }}
          >
            {cmd}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CommandSelection;
