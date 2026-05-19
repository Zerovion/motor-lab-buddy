import { useCallback, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SimControls } from "@/components/SimControls";
import { SimCharts } from "@/components/SimCharts";
import { Metric } from "@/components/Metric";
import { MotorVisual } from "@/components/MotorVisual";
import { useSimulation } from "@/hooks/useSimulation";
import { dolStep, torqueSpeedCurve } from "@/lib/motor";
import { useMotorConfig } from "@/contexts/MotorConfigContext";

export default function DOLPage() {
  const { config, ratedCurrent, ratedSpeed } = useMotorConfig();
  const step = useCallback((t: number) => dolStep(t, config), [config]);
  const sim = useSimulation({ step, maxSeconds: 6 });
  const ts = useMemo(() => torqueSpeedCurve(1, 1, 60, config), [config]);

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Module 01"
        title="Direct-On-Line (DOL) Starter"
        subtitle="Connects the motor directly to the supply at full voltage. Simple and cheap, but draws very high inrush current (6–8× full load) which stresses the supply network and motor windings."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <MotorVisual speed={sim.current.speed} running={sim.running} />
          <SimControls running={sim.running} onStart={sim.start} onStop={sim.stop} onReset={sim.reset} />
          <div className="rounded-xl border border-border bg-gradient-card p-4 text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">How it works:</strong> Closing the contactor applies full line voltage instantly. Inrush current spikes to ~7× rated, then decays as the rotor accelerates and back-EMF builds.
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 content-start">
          <Metric label="Current" value={sim.current.current} unit="A" max={ratedCurrent * 8} current={sim.current.current} tone="destructive" />
          <Metric label="Speed" value={sim.current.speed} unit="RPM" max={ratedSpeed * 1.05} current={sim.current.speed} />
          <Metric label="Torque" value={sim.current.torque} unit="%" max={200} current={sim.current.torque} tone="success" />
          <Metric label="Time" value={sim.current.t} unit="s" />
          <Metric label="Inrush ratio" value={(sim.current.current / ratedCurrent).toFixed(1) + "x"} />
          <Metric label="Status" value={sim.running ? "RUNNING" : "IDLE"} />
        </div>
      </div>

      <SimCharts data={sim.data} torqueSpeed={ts} />
    </div>
  );
}
