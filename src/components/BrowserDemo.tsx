import { useState } from "react";
import CurrentToolsView from "./CurrentToolsView";
import AegeanBrowserView from "./AegeanBrowserView";

interface BrowserDemoProps {
  command: string;
  onReset: () => void;
}

const BrowserDemo = ({ command, onReset }: BrowserDemoProps) => {
  const [isAegean, setIsAegean] = useState(true);

  return (
    <section className="min-h-screen flex flex-col" style={{ background: "#fafbff" }}>
      {/* Top Bar */}
      <header className="glass-solid h-[60px] flex items-center justify-between px-6 z-20 shrink-0"
        style={{ borderBottom: "1px solid rgba(95,113,227,0.1)" }}
      >
        <button
          onClick={onReset}
          className="glass px-4 py-1.5 rounded-full text-sm font-medium text-foreground
                     hover:bg-white/30 transition-all duration-200 cursor-pointer"
          style={{ background: "rgba(95,113,227,0.08)", border: "1px solid rgba(95,113,227,0.15)" }}
        >
          ← Reset
        </button>

        {/* Toggle */}
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-medium cursor-pointer transition-colors duration-200
              ${!isAegean ? "text-foreground" : "text-muted-foreground"}`}
            onClick={() => setIsAegean(false)}
          >
            Current Tools
          </span>
          <button
            onClick={() => setIsAegean(!isAegean)}
            className="relative w-14 h-7 rounded-full transition-colors duration-300 cursor-pointer"
            style={{ background: isAegean ? "#5f71e3" : "#d1d5db" }}
          >
            <div
              className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300"
              style={{ transform: isAegean ? "translateX(30px)" : "translateX(2px)" }}
            />
          </button>
          <span
            className={`text-sm font-medium cursor-pointer transition-colors duration-200
              ${isAegean ? "text-foreground" : "text-muted-foreground"}`}
            onClick={() => setIsAegean(true)}
          >
            Aegean Browser
          </span>
        </div>

        {/* Logo placeholder */}
        <div className="font-bold text-sm tracking-wider" style={{ color: "#5f71e3" }}>
          AEGEAN
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className="w-[250px] shrink-0 p-5 flex flex-col"
          style={{ background: "#fff", borderRight: "1px solid rgba(95,113,227,0.1)" }}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-medium">Agents</p>
          <div className="rounded-xl p-3" style={{ background: "rgba(95,113,227,0.05)" }}>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              <span className="font-semibold text-sm text-foreground">Flight Booking Agent</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 ml-[18px]">Active</p>
          </div>
          <p className="text-xs text-muted-foreground mt-auto">Click an agent to manage and control manually</p>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl">
            {/* Cross-fade views */}
            <div className="relative">
              <div
                className="transition-all duration-500"
                style={{ opacity: isAegean ? 0 : 1, pointerEvents: isAegean ? "none" : "auto", position: isAegean ? "absolute" : "relative", inset: 0 }}
              >
                <CurrentToolsView isActive={!isAegean} />
              </div>
              <div
                className="transition-all duration-500"
                style={{ opacity: isAegean ? 1 : 0, pointerEvents: isAegean ? "auto" : "none", position: !isAegean ? "absolute" : "relative", inset: 0 }}
              >
                <AegeanBrowserView isActive={isAegean} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default BrowserDemo;
