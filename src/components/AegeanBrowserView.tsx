import { useState, useEffect, useRef } from "react";
import { Check, Loader2, Circle } from "lucide-react";

const steps = [
  { label: "Parsed search parameters", completeAt: 0 },
  { label: "Querying 8 airline databases", completeAt: 2000 },
  { label: "Filtering by price & date", completeAt: 5000 },
  { label: "Selecting best option", completeAt: 8000 },
];

const sites = ["United", "Delta", "American", "Southwest", "JetBlue", "Frontier", "Spirit", "Alaska"];

const results = [
  { airline: "Delta", price: 189, stops: "2 stops", time: "8:30 AM → 4:45 PM", date: "Feb 10" },
  { airline: "United", price: 195, stops: "Direct", time: "10:00 AM → 6:15 PM", date: "Feb 10" },
  { airline: "American", price: 199, stops: "1 stop", time: "7:15 AM → 3:30 PM", date: "Feb 10" },
];

interface AegeanBrowserViewProps {
  isActive: boolean;
}

const AegeanBrowserView = ({ isActive }: AegeanBrowserViewProps) => {
  const [elapsed, setElapsed] = useState(0);
  const [completed, setCompleted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isActive) {
      setElapsed(0);
      setCompleted(false);
      return;
    }

    const start = Date.now();
    timerRef.current = setInterval(() => {
      const ms = Date.now() - start;
      setElapsed(ms);
      if (ms >= 12000) {
        setCompleted(true);
        clearInterval(timerRef.current);
      }
    }, 100);

    return () => clearInterval(timerRef.current);
  }, [isActive]);

  const getStepState = (completeAt: number) => {
    if (elapsed >= completeAt + 1500) return "done";
    if (elapsed >= completeAt) return "loading";
    return "pending";
  };

  const formatElapsed = () => {
    const secs = Math.min(Math.floor(elapsed / 1000), 12);
    return `00:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground">Flight Booking Agent</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span className="text-sm" style={{ color: "#10b981" }}>Active</span>
          </div>
        </div>
        <span className="font-mono text-sm text-muted-foreground">Time elapsed: {formatElapsed()}</span>
      </div>

      {/* Completion banner */}
      {completed && (
        <div
          className="rounded-xl px-5 py-3 flex items-center gap-3"
          style={{ background: "rgba(16,185,129,0.1)", animation: "fadeLineIn 0.5s ease forwards" }}
        >
          <Check className="w-5 h-5" style={{ color: "#10b981" }} />
          <span className="font-semibold" style={{ color: "#10b981" }}>Completed in 12 seconds</span>
        </div>
      )}

      {/* Progress */}
      <div className="glass-solid rounded-xl p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-medium">Progress</p>
        <div className="space-y-3">
          {steps.map((step, idx) => {
            const state = getStepState(step.completeAt);
            return (
              <div
                key={idx}
                className="flex items-center gap-3 transition-opacity duration-300"
                style={{ opacity: elapsed >= step.completeAt ? 1 : 0.3 }}
              >
                {state === "done" && <Check className="w-4 h-4 shrink-0" style={{ color: "#10b981" }} />}
                {state === "loading" && <Loader2 className="w-4 h-4 shrink-0 animate-spin" style={{ color: "#5f71e3" }} />}
                {state === "pending" && <Circle className="w-4 h-4 shrink-0 text-muted-foreground/40" />}
                <span className={`text-sm ${state === "done" ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sites Searched */}
      {elapsed >= 3000 && (
        <div className="glass-solid rounded-xl p-5" style={{ animation: "fadeLineIn 0.4s ease forwards" }}>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-medium">Sites Searched</p>
          <div className="flex flex-wrap gap-2">
            {sites.map((site, idx) => (
              <span
                key={site}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(95,113,227,0.1)",
                  color: "#5f71e3",
                  opacity: elapsed >= 3000 + idx * 400 ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                {site}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {elapsed >= 6000 && (
        <div className="glass-solid rounded-xl p-5" style={{ animation: "fadeLineIn 0.4s ease forwards" }}>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-medium">Results</p>
          <div className="space-y-3">
            {results.map((r, idx) => (
              <div
                key={idx}
                className="rounded-xl p-4 flex items-center justify-between
                           transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  background: "rgba(95,113,227,0.04)",
                  border: "1px solid rgba(95,113,227,0.1)",
                  opacity: elapsed >= 6000 + idx * 800 ? 1 : 0,
                  transition: "opacity 0.4s ease, transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">{r.airline}</span>
                    <span className="text-xl font-extrabold" style={{ color: "#5f71e3" }}>${r.price}</span>
                    <span className="text-xs text-muted-foreground">({r.stops})</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{r.date} • {r.time}</p>
                </div>
                <button
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white
                             transition-all duration-200 hover:scale-105"
                  style={{ background: "#5f71e3" }}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeLineIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AegeanBrowserView;
