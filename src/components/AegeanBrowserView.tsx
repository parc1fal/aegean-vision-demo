import { useState, useEffect, useRef } from "react";
import { Check, Loader2, Circle } from "lucide-react";

interface StepConfig {
  label: string;
  completeAt: number;
  params?: { label: string; value: string }[];
}

interface ResultConfig {
  name: string;
  price: string;
  match?: string;
  detail1: string;
  detail2?: string;
  action: string;
}

interface AgentConfig {
  steps: StepConfig[];
  sites: string[];
  sitesAppearAt: number;
  results: ResultConfig[];
  resultsAppearAt: number;
  resultsHeader: string;
  duration: number;
  completionText: string;
}

const agentConfigs: Record<string, AgentConfig> = {
  "Book a flight to Rome under $200": {
    steps: [
      { label: "Parsed search parameters", completeAt: 0 },
      { label: "Querying 8 airline databases", completeAt: 2000 },
      { label: "Filtering by price & date", completeAt: 5000 },
      { label: "Selecting best option", completeAt: 8000 },
    ],
    sites: ["United", "Delta", "American", "Southwest", "JetBlue", "Frontier", "Spirit", "Alaska"],
    sitesAppearAt: 3000,
    results: [
      { name: "Delta", price: "$189", detail1: "Feb 10 • 8:30 AM → 4:45 PM • 2 stops", action: "Select" },
      { name: "United", price: "$195", detail1: "Feb 10 • 10:00 AM → 6:15 PM • Direct", action: "Select" },
      { name: "American", price: "$199", detail1: "Feb 10 • 7:15 AM → 3:30 PM • 1 stop", action: "Select" },
    ],
    resultsAppearAt: 6000,
    resultsHeader: "Results",
    duration: 12000,
    completionText: "Completed in 12 seconds",
  },
  "Find and compare hotel prices in Tokyo": {
    steps: [
      {
        label: "Initializing search parameters...",
        completeAt: 0,
        params: [
          { label: "Location", value: "Tokyo, Japan" },
          { label: "Dates", value: "Next 2 weeks" },
          { label: "Rating", value: "4+ stars" },
          { label: "Amenities", value: "WiFi, Breakfast" },
        ],
      },
      { label: "Analyzing 1,243 properties...", completeAt: 2000 },
      { label: "Checking availability...", completeAt: 4000 },
      { label: "Comparing prices...", completeAt: 6000 },
      { label: "Reading reviews...", completeAt: 8000 },
    ],
    sites: ["Booking.com", "Hotels.com", "Agoda", "Expedia", "Trivago"],
    sitesAppearAt: 2000,
    results: [
      { name: "Park Hyatt Tokyo", price: "$285/night", match: "98% Match", detail1: "Shinjuku • 4.8★ (2,847 reviews) • Pool, Spa", action: "View Details" },
      { name: "The Peninsula Tokyo", price: "$310/night", match: "95% Match", detail1: "Marunouchi • 4.9★ (1,923 reviews) • Luxury", action: "View Details" },
      { name: "Andaz Tokyo", price: "$265/night", match: "92% Match", detail1: "Toranomon • 4.7★ (1,456 reviews) • Rooftop Bar", action: "View Details" },
    ],
    resultsAppearAt: 9000,
    resultsHeader: "18 hotels matched, showing top 3",
    duration: 14000,
    completionText: "Completed in 14 seconds",
  },
  "Find office space in Manhattan under $50/sqft, 2000+ sqft": {
    steps: [
      {
        label: "Initializing search parameters...",
        completeAt: 0,
        params: [
          { label: "Location", value: "Manhattan, NYC" },
          { label: "Price", value: "≤$50/sqft/year" },
          { label: "Size", value: "2,000+ sqft" },
          { label: "Type", value: "Office space" },
        ],
      },
      { label: "Analyzing 342 properties...", completeAt: 2000 },
      { label: "Filtering by budget...", completeAt: 4000 },
      { label: "Checking availability...", completeAt: 6000 },
      { label: "Calculating match scores...", completeAt: 8000 },
    ],
    sites: ["LoopNet", "CoStar", "Crexi", "Ten-X", "CommercialCafe"],
    sitesAppearAt: 2000,
    results: [
      { name: "250 Park Ave, Floor 14", price: "$48/sqft", match: "97% Match", detail1: "2,400 sqft • Midtown • Available Now", detail2: "Corner Unit • Class A Building", action: "Schedule Tour" },
      { name: "123 William St, Suite 8A", price: "$45/sqft", match: "94% Match", detail1: "2,200 sqft • Financial District", detail2: "Move-in Ready • City Views", action: "Schedule Tour" },
      { name: "Hudson Yards Tower C", price: "$50/sqft", match: "91% Match", detail1: "3,100 sqft • West Side • Class A", detail2: "Modern Fit-out • Amenities", action: "Schedule Tour" },
    ],
    resultsAppearAt: 10000,
    resultsHeader: "12 properties matched, showing top 3",
    duration: 15000,
    completionText: "Completed in 15 seconds",
  },
};

const defaultConfig = agentConfigs["Book a flight to Rome under $200"];

interface AegeanBrowserViewProps {
  isActive: boolean;
  agentLabel?: string;
  onComplete?: () => void;
  command?: string;
}

const AegeanBrowserView = ({ isActive, agentLabel, onComplete, command }: AegeanBrowserViewProps) => {
  const config = (command && agentConfigs[command]) || defaultConfig;
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
      if (ms >= config.duration) {
        setCompleted(true);
        clearInterval(timerRef.current);
        onComplete?.();
      }
    }, 100);

    return () => clearInterval(timerRef.current);
  }, [isActive, config.duration]);

  const getStepState = (completeAt: number) => {
    if (elapsed >= completeAt + 1500) return "done";
    if (elapsed >= completeAt) return "loading";
    return "pending";
  };

  const maxSecs = Math.floor(config.duration / 1000);
  const formatElapsed = () => {
    const secs = Math.min(Math.floor(elapsed / 1000), maxSecs);
    return `00:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground">{agentLabel || "Flight Booking Agent"}</h3>
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
          <span className="font-semibold" style={{ color: "#10b981" }}>
            {config.completionText}
          </span>
        </div>
      )}

      {/* Progress */}
      <div className="glass-solid rounded-xl p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-medium">Progress</p>
        <div className="space-y-3">
          {config.steps.map((step, idx) => {
            const state = getStepState(step.completeAt);
            return (
              <div key={idx}>
                <div
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
                {/* Params sub-panel */}
                {step.params && elapsed >= step.completeAt && elapsed < step.completeAt + 2000 && (
                  <div className="ml-7 mt-2 grid grid-cols-2 gap-x-6 gap-y-1" style={{ animation: "fadeLineIn 0.3s ease forwards" }}>
                    {step.params.map((p) => (
                      <div key={p.label} className="text-xs">
                        <span className="text-muted-foreground">{p.label}: </span>
                        <span className="text-foreground font-medium">{p.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sites Searched */}
      {elapsed >= config.sitesAppearAt && (
        <div className="glass-solid rounded-xl p-5" style={{ animation: "fadeLineIn 0.4s ease forwards" }}>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-medium">Sites Searched</p>
          <div className="flex flex-wrap gap-2">
            {config.sites.map((site, idx) => (
              <span
                key={site}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(95,113,227,0.1)",
                  color: "#5f71e3",
                  opacity: elapsed >= config.sitesAppearAt + idx * 400 ? 1 : 0,
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
      {elapsed >= config.resultsAppearAt && (
        <div className="glass-solid rounded-xl p-5" style={{ animation: "fadeLineIn 0.4s ease forwards" }}>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-medium">
            {config.resultsHeader}
          </p>
          <div className="space-y-3">
            {config.results.map((r, idx) => (
              <div
                key={idx}
                className="rounded-xl p-4 relative
                           transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  background: "rgba(95,113,227,0.04)",
                  border: "1px solid rgba(95,113,227,0.1)",
                  opacity: elapsed >= config.resultsAppearAt + idx * 800 ? 1 : 0,
                  transition: "opacity 0.4s ease, transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                {r.match && (
                  <span
                    className="absolute top-3 right-3 text-sm font-bold rounded-full px-2.5 py-1"
                    style={{ background: "rgba(95,113,227,0.1)", color: "#5f71e3" }}
                  >
                    {r.match}
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div className="pr-20">
                    <span className="font-bold text-foreground">{r.name}</span>
                    <div className="mt-1">
                      <span className="text-xl font-extrabold" style={{ color: "#5f71e3" }}>{r.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{r.detail1}</p>
                    {r.detail2 && <p className="text-sm text-muted-foreground">{r.detail2}</p>}
                  </div>
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white shrink-0
                               transition-all duration-200 hover:scale-105"
                    style={{ background: "#5f71e3" }}
                  >
                    {r.action}
                  </button>
                </div>
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
