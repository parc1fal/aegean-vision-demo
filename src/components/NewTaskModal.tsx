import { useState } from "react";

const commands = [
  "Book a flight to Rome under $200",
  "Find and compare hotel prices in Tokyo",
  "Monitor 10 websites for price changes",
];

interface NewTaskModalProps {
  visible: boolean;
  onSelect: (command: string) => void;
  onClose: () => void;
}

const NewTaskModal = ({ visible, onSelect, onClose }: NewTaskModalProps) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleClick = (idx: number) => {
    setSelected(idx);
    setTimeout(() => {
      onSelect(commands[idx]);
      setSelected(null);
    }, 400);
  };

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
      onClick={handleBackdrop}
    >
      <div
        className="flex flex-col gap-5 items-center transition-all duration-300"
        style={{
          transform: visible ? "scale(1)" : "scale(0.95)",
          opacity: visible ? 1 : 0,
        }}
      >
        <h3 className="text-2xl font-bold text-white mb-2">Add a new task</h3>
        <p className="text-white/60 mb-4">Pick a task for the new agent.</p>
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
            style={{ transitionDuration: "400ms", background: "rgba(255,255,255,0.95)" }}
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NewTaskModal;
