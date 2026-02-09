import { useState, useCallback } from "react";
import { Plus, Check } from "lucide-react";
import CurrentToolsView from "./CurrentToolsView";
import AegeanBrowserView from "./AegeanBrowserView";
import NewTaskModal from "./NewTaskModal";

const commandToLabel: Record<string, string> = {
  "Book a flight to Rome under $200": "Flight Booking Agent",
  "Find and compare hotel prices in Tokyo": "Hotel Search Agent",
  "Monitor 10 websites for price changes": "Price Monitor Agent",
};

interface Agent {
  id: string;
  command: string;
  label: string;
  status: "active" | "complete";
  isAegean: boolean;
  startTime: number;
}

interface BrowserDemoProps {
  command: string;
  onReset: () => void;
}

let agentCounter = 0;

const createAgent = (command: string): Agent => {
  agentCounter++;
  return {
    id: `agent-${agentCounter}-${Date.now()}`,
    command,
    label: commandToLabel[command] || "Agent",
    status: "active",
    isAegean: true,
    startTime: Date.now(),
  };
};

const BrowserDemo = ({ command, onReset }: BrowserDemoProps) => {
  const [agents, setAgents] = useState<Agent[]>(() => {
    const initial = createAgent(command);
    return [initial];
  });
  const [activeAgentId, setActiveAgentId] = useState<string>(agents[0].id);
  const [showModal, setShowModal] = useState(false);

  const activeAgent = agents.find((a) => a.id === activeAgentId);

  const handleNewTask = useCallback((cmd: string) => {
    const agent = createAgent(cmd);
    setAgents((prev) => [...prev, agent]);
    setActiveAgentId(agent.id);
    setShowModal(false);
  }, []);

  const handleToggle = useCallback((agentId: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, isAegean: !a.isAegean } : a))
    );
  }, []);

  const handleComplete = useCallback((agentId: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, status: "complete" } : a))
    );
  }, []);

  const handleReset = () => {
    agentCounter = 0;
    onReset();
  };

  return (
    <section className="min-h-screen flex flex-col" style={{ background: "#fafbff" }}>
      {/* Top Bar */}
      <header
        className="glass-solid h-[60px] flex items-center justify-between px-6 z-20 shrink-0"
        style={{ borderBottom: "1px solid rgba(95,113,227,0.1)" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="glass px-4 py-1.5 rounded-full text-sm font-medium text-foreground
                       hover:bg-white/30 transition-all duration-200 cursor-pointer"
            style={{ background: "rgba(95,113,227,0.08)", border: "1px solid rgba(95,113,227,0.15)" }}
          >
            ← Reset
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold
                       hover:bg-[rgba(95,113,227,0.2)] transition-all duration-200 cursor-pointer"
            style={{
              background: "rgba(95,113,227,0.15)",
              border: "1px solid rgba(95,113,227,0.25)",
              color: "#5f71e3",
            }}
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>

        {/* Toggle for active agent */}
        {activeAgent && (
          <div className="flex items-center gap-3">
            <span
              className={`text-sm font-medium cursor-pointer transition-colors duration-200
                ${!activeAgent.isAegean ? "text-foreground" : "text-muted-foreground"}`}
              onClick={() => handleToggle(activeAgent.id)}
            >
              Current Tools
            </span>
            <button
              onClick={() => handleToggle(activeAgent.id)}
              className="relative w-14 h-7 rounded-full transition-colors duration-300 cursor-pointer"
              style={{ background: activeAgent.isAegean ? "#5f71e3" : "#d1d5db" }}
            >
              <div
                className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300"
                style={{ transform: activeAgent.isAegean ? "translateX(30px)" : "translateX(2px)" }}
              />
            </button>
            <span
              className={`text-sm font-medium cursor-pointer transition-colors duration-200
                ${activeAgent.isAegean ? "text-foreground" : "text-muted-foreground"}`}
              onClick={() => handleToggle(activeAgent.id)}
            >
              Aegean Browser
            </span>
          </div>
        )}

        <div className="font-bold text-sm tracking-wider" style={{ color: "#5f71e3" }}>
          AEGEAN
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className="w-[250px] shrink-0 p-5 flex flex-col gap-3"
          style={{ background: "#fff", borderRight: "1px solid rgba(95,113,227,0.1)" }}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 font-medium">
            Agents
          </p>
          <div className="flex-1 overflow-y-auto space-y-2">
            {agents.map((agent, idx) => {
              const isSelected = agent.id === activeAgentId;
              return (
                <div
                  key={agent.id}
                  onClick={() => setActiveAgentId(agent.id)}
                  className="rounded-xl p-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: isSelected ? "rgba(95,113,227,0.08)" : "rgba(95,113,227,0.03)",
                    border: isSelected ? "2px solid #5f71e3" : "2px solid transparent",
                    boxShadow: isSelected ? "0 4px 20px rgba(95,113,227,0.15)" : "none",
                    animation: "slideInAgent 0.3s ease forwards",
                  }}
                >
                  <div className="flex items-center gap-2">
                    {agent.status === "complete" ? (
                      <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "#5f71e3" }} />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shrink-0" />
                    )}
                    <span className="font-semibold text-sm text-foreground truncate">
                      {agent.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 ml-[18px]">
                    <p className="text-xs text-muted-foreground">
                      {agent.status === "complete" ? "Complete" : "Active"}
                    </p>
                    <span className="text-[10px] text-muted-foreground/50">#{idx + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-auto pt-3">
            Click an agent to manage and control manually
          </p>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl">
            {activeAgent && (
              <div className="relative">
                <div
                  className="transition-all duration-500"
                  style={{
                    opacity: activeAgent.isAegean ? 0 : 1,
                    pointerEvents: activeAgent.isAegean ? "none" : "auto",
                    position: activeAgent.isAegean ? "absolute" : "relative",
                    inset: 0,
                  }}
                >
                  <CurrentToolsView
                    key={`current-${activeAgent.id}`}
                    isActive={!activeAgent.isAegean && activeAgent.id === activeAgentId}
                  />
                </div>
                <div
                  className="transition-all duration-500"
                  style={{
                    opacity: activeAgent.isAegean ? 1 : 0,
                    pointerEvents: activeAgent.isAegean ? "auto" : "none",
                    position: !activeAgent.isAegean ? "absolute" : "relative",
                    inset: 0,
                  }}
                >
                  <AegeanBrowserView
                    key={`aegean-${activeAgent.id}`}
                    isActive={activeAgent.isAegean && activeAgent.id === activeAgentId}
                    agentLabel={activeAgent.label}
                    onComplete={() => handleComplete(activeAgent.id)}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      <NewTaskModal
        visible={showModal}
        onSelect={handleNewTask}
        onClose={() => setShowModal(false)}
      />

      <style>{`
        @keyframes slideInAgent {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default BrowserDemo;
