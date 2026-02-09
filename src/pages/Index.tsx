import { useState, useRef } from "react";
import GradientBackground from "@/components/GradientBackground";
import HeroContent from "@/components/HeroContent";
import CommandSelection from "@/components/CommandSelection";
import BrowserDemo from "@/components/BrowserDemo";

type Section = "hero" | "commands" | "demo";

const Index = () => {
  const [section, setSection] = useState<Section>("hero");
  const [selectedCommand, setSelectedCommand] = useState("");
  const [transitioning, setTransitioning] = useState(false);

  const transition = (to: Section) => {
    setTransitioning(true);
    setTimeout(() => {
      setSection(to);
      setTransitioning(false);
    }, 600);
  };

  const handleCta = () => transition("commands");

  const handleCommandSelect = (cmd: string) => {
    setSelectedCommand(cmd);
    transition("demo");
  };

  const handleReset = () => {
    setSelectedCommand("");
    transition("commands");
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className={`transition-opacity duration-600 ease-in-out ${transitioning ? "opacity-0" : "opacity-100"}`}
        style={{ transitionDuration: "600ms" }}
      >
        {section === "hero" && (
          <section className="relative w-full h-screen">
            <GradientBackground />
            <HeroContent onCtaClick={handleCta} />
          </section>
        )}

        {section === "commands" && <CommandSelection onSelect={handleCommandSelect} />}

        {section === "demo" && <BrowserDemo command={selectedCommand} onReset={handleReset} />}
      </div>
    </div>
  );
};

export default Index;
