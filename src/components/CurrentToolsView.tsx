import { useState, useEffect, useRef } from "react";

interface TerminalLine {
  text: string;
  color: string;
  delay: number;
}

interface TerminalConfig {
  lines: TerminalLine[];
  failTime: number; // seconds to count up to
}

const terminalConfigs: Record<string, TerminalConfig> = {
  "Book a flight to Rome under $200": {
    failTime: 480,
    lines: [
      { text: "$ Starting flight search...", color: "#10b981", delay: 0 },
      { text: "", color: "", delay: 400 },
      { text: "Navigating to united.com", color: "#10b981", delay: 800 },
      { text: "Waiting for page load... (3.2s)", color: "#6b7280", delay: 1500 },
      { text: "Parsing HTML structure...", color: "#6b7280", delay: 2500 },
      { text: "ERROR: Rate limit exceeded", color: "#ef4444", delay: 3500 },
      { text: "Retrying... (attempt 2/5)", color: "#f59e0b", delay: 4200 },
      { text: "Navigating to delta.com", color: "#10b981", delay: 5000 },
      { text: "Waiting for JavaScript to render... (5.7s)", color: "#6b7280", delay: 6000 },
      { text: "Searching for elements...", color: "#6b7280", delay: 7500 },
      { text: "ERROR: Element not found (page structure changed)", color: "#ef4444", delay: 8500 },
      { text: "Retrying... (attempt 3/5)", color: "#f59e0b", delay: 9500 },
      { text: "Navigating to kayak.com", color: "#10b981", delay: 10500 },
      { text: "Waiting for page load... (4.1s)", color: "#6b7280", delay: 11500 },
      { text: "ERROR: CAPTCHA detected, cannot proceed", color: "#ef4444", delay: 13000 },
      { text: "Retrying... (attempt 4/5)", color: "#f59e0b", delay: 14000 },
      { text: "ERROR: Max retries exceeded", color: "#ef4444", delay: 15500 },
      { text: "", color: "", delay: 16500 },
      { text: "Process failed after 8 minutes", color: "#ef4444", delay: 17000 },
    ],
  },
  "Find and compare hotel prices in Tokyo": {
    failTime: 300,
    lines: [
      { text: "$ Starting hotel search...", color: "#10b981", delay: 0 },
      { text: "", color: "", delay: 400 },
      { text: "Navigating to booking.com", color: "#10b981", delay: 800 },
      { text: "Waiting for page load... (4.5s)", color: "#6b7280", delay: 1500 },
      { text: "ERROR: Connection refused: booking.com", color: "#ef4444", delay: 3000 },
      { text: "Retrying... (attempt 2/5)", color: "#f59e0b", delay: 3800 },
      { text: "Navigating to hotels.com", color: "#10b981", delay: 4800 },
      { text: "Waiting for JavaScript to render... (6.3s)", color: "#6b7280", delay: 5800 },
      { text: "Searching for price elements...", color: "#6b7280", delay: 7000 },
      { text: "ERROR: Dynamic content not loaded", color: "#ef4444", delay: 8200 },
      { text: "Retrying... (attempt 3/5)", color: "#f59e0b", delay: 9000 },
      { text: "Navigating to agoda.com", color: "#10b981", delay: 10000 },
      { text: "Waiting for API response... (8.1s)", color: "#6b7280", delay: 11000 },
      { text: "ERROR: Timeout on Agoda API", color: "#ef4444", delay: 13000 },
      { text: "Retrying... (attempt 4/5)", color: "#f59e0b", delay: 14000 },
      { text: "ERROR: Max retries exceeded", color: "#ef4444", delay: 15500 },
      { text: "", color: "", delay: 16500 },
      { text: "Process failed after 5 minutes", color: "#ef4444", delay: 17000 },
    ],
  },
  "Find office space in Manhattan under $50/sqft, 2000+ sqft": {
    failTime: 360,
    lines: [
      { text: "$ Starting property search...", color: "#10b981", delay: 0 },
      { text: "", color: "", delay: 400 },
      { text: "Navigating to loopnet.com", color: "#10b981", delay: 800 },
      { text: "Waiting for page load... (5.1s)", color: "#6b7280", delay: 1500 },
      { text: "Attempting to set search filters...", color: "#6b7280", delay: 3000 },
      { text: "ERROR: Query format invalid", color: "#ef4444", delay: 4000 },
      { text: "Retrying... (attempt 2/5)", color: "#f59e0b", delay: 4800 },
      { text: "Navigating to costar.com", color: "#10b981", delay: 5800 },
      { text: "Waiting for page load... (3.8s)", color: "#6b7280", delay: 6800 },
      { text: "ERROR: Authentication required - no API key", color: "#ef4444", delay: 8000 },
      { text: "Retrying... (attempt 3/5)", color: "#f59e0b", delay: 9000 },
      { text: "Navigating to crexi.com", color: "#10b981", delay: 10000 },
      { text: "Waiting for JavaScript to render... (7.2s)", color: "#6b7280", delay: 11000 },
      { text: "ERROR: No API response from LoopNet", color: "#ef4444", delay: 13000 },
      { text: "Retrying... (attempt 4/5)", color: "#f59e0b", delay: 14000 },
      { text: "ERROR: Max retries exceeded", color: "#ef4444", delay: 15500 },
      { text: "", color: "", delay: 16500 },
      { text: "No results found - process failed after 6 minutes", color: "#ef4444", delay: 17000 },
    ],
  },
};

const defaultConfig = terminalConfigs["Book a flight to Rome under $200"];

interface CurrentToolsViewProps {
  isActive: boolean;
  command?: string;
}

const CurrentToolsView = ({ isActive, command }: CurrentToolsViewProps) => {
  const config = (command && terminalConfigs[command]) || defaultConfig;
  const [visibleLines, setVisibleLines] = useState(0);
  const [timer, setTimer] = useState(0);
  const [failed, setFailed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const lineTimers = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (!isActive) {
      setVisibleLines(0);
      setTimer(0);
      setFailed(false);
      return;
    }

    config.lines.forEach((line, idx) => {
      const t = setTimeout(() => setVisibleLines(idx + 1), line.delay);
      lineTimers.current.push(t);
    });

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev >= config.failTime) {
          setFailed(true);
          clearInterval(timerRef.current);
          return config.failTime;
        }
        return prev + 1;
      });
    }, 35);

    return () => {
      lineTimers.current.forEach(clearTimeout);
      lineTimers.current = [];
      clearInterval(timerRef.current);
    };
  }, [isActive, config]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-full">
      <p className="text-muted-foreground text-sm mb-4 font-medium">Current Agent Tools</p>
      <div className="rounded-xl p-6 relative overflow-hidden" style={{ background: "#1a1d2e", minHeight: 400 }}>
        <div className="absolute top-4 right-4 font-mono text-sm" style={{ color: failed ? "#ef4444" : "#6b7280" }}>
          Time: {formatTime(timer)}
        </div>
        <div className="font-mono text-sm leading-relaxed space-y-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {config.lines.slice(0, visibleLines).map((line, idx) => (
            <div
              key={idx}
              style={{ color: line.color, opacity: 0, animation: "fadeLineIn 0.3s ease forwards" }}
            >
              {line.text || "\u00A0"}
            </div>
          ))}
          {visibleLines > 0 && visibleLines < config.lines.length && (
            <span className="terminal-cursor" />
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeLineIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CurrentToolsView;
