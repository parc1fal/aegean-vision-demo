import { useState, useEffect, useRef } from "react";

const lines = [
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
];

interface CurrentToolsViewProps {
  isActive: boolean;
}

const CurrentToolsView = ({ isActive }: CurrentToolsViewProps) => {
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

    // Line animations
    lines.forEach((line, idx) => {
      const t = setTimeout(() => setVisibleLines(idx + 1), line.delay);
      lineTimers.current.push(t);
    });

    // Timer
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev >= 480) {
          setFailed(true);
          clearInterval(timerRef.current);
          return 480;
        }
        return prev + 1;
      });
    }, 35);

    return () => {
      lineTimers.current.forEach(clearTimeout);
      lineTimers.current = [];
      clearInterval(timerRef.current);
    };
  }, [isActive]);

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
          {lines.slice(0, visibleLines).map((line, idx) => (
            <div
              key={idx}
              style={{ color: line.color, opacity: 0, animation: "fadeLineIn 0.3s ease forwards" }}
            >
              {line.text || "\u00A0"}
            </div>
          ))}
          {visibleLines > 0 && visibleLines < lines.length && (
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
