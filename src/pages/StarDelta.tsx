import { useCallback, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SimControls } from "@/components/SimControls";
import { SimCharts } from "@/components/SimCharts";
import { Metric } from "@/components/Metric";
import { MotorVisual } from "@/components/MotorVisual";
import { useSimulation } from "@/hooks/useSimulation";
import { starDeltaStep, torqueSpeedCurve } from "@/lib/motor";
import { useMotorConfig } from "@/contexts/MotorConfigContext";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export default function StarDeltaPage() {
  const { config, ratedCurrent, ratedSpeed } = useMotorConfig();
  const [switchAt, setSwitchAt] = useState(2.5);
  const step = useCallback((t: number) => starDeltaStep(t, switchAt, config), [switchAt, config]);
  const sim = useSimulation({ step, maxSeconds: 6 });
  const ts = useMemo(() => torqueSpeedCurve(1, 1, 60, config), [config]);

  const phase = sim.current.t < switchAt ? "STAR (Y)" : "DELTA (Δ)";

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Module 02"
        title="Star-Delta Starter"
        subtitle="Starts the motor in star (Y) configuration where each winding sees only 1/√3 of line voltage — reducing starting current and torque to roughly 1/3. After acceleration, switches to delta (Δ) for full voltage operation."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <MotorVisual speed={sim.current.speed} running={sim.running} label={phase} />
          <SimControls running={sim.running} onStart={sim.start} onStop={sim.stop} onReset={sim.reset} />
          <div className="rounded-xl border border-border bg-gradient-card p-4 space-y-3">
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Switch to Delta at</Label>
              <div className="flex items-center gap-3 mt-2">
                <Slider value={[switchAt]} onValueChange={(v) => setSwitchAt(v[0])} min={1} max={5} step={0.1} />
                <span className="font-display text-sm w-14 text-right text-primary">{switchAt.toFixed(1)}s</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Watch the brief current surge when the contactor switches from Y to Δ — voltage triples across each winding.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 content-start">
          <Metric label="Current" value={sim.current.current} unit="A" max={ratedCurrent * 8} current={sim.current.current} tone="warning" />
          <Metric label="Speed" value={sim.current.speed} unit="RPM" max={ratedSpeed * 1.05} current={sim.current.speed} />
          <Metric label="Torque" value={sim.current.torque} unit="%" max={200} current={sim.current.torque} tone="success" />
          <Metric label="Phase" value={phase} />
          <Metric label="Time" value={sim.current.t} unit="s" />
          <Metric label="Status" value={sim.running ? "RUNNING" : "IDLE"} />
        </div>
      </div>

      <SimCharts data={sim.data} torqueSpeed={ts} />
    </div>
  );
}
