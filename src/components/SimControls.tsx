import { Play, Square, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  running: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

export function SimControls({ running, onStart, onStop, onReset }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={onStart} disabled={running} className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-[var(--glow-primary)]">
        <Play className="h-4 w-4 mr-1" /> Start
      </Button>
      <Button onClick={onStop} disabled={!running} variant="secondary">
        <Square className="h-4 w-4 mr-1" /> Stop
      </Button>
      <Button onClick={onReset} variant="outline">
        <RotateCcw className="h-4 w-4 mr-1" /> Reset
      </Button>
    </div>
  );
}
