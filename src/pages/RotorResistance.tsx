import { useCallback, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SimControls } from "@/components/SimControls";
import { SimCharts } from "@/components/SimCharts";
import { Metric } from "@/components/Metric";
import { MotorVisual } from "@/components/MotorVisual";
import { useSimulation } from "@/hooks/useSimulation";
import { rotorResistanceStep, torqueSpeedCurve } from "@/lib/motor";
import { useMotorConfig } from "@/contexts/MotorConfigContext";
import { Button } from "@/components/ui/button";

const STEPS = [0, 1, 2, 3, 4];

export default function RotorResistancePage() {
  const { config, ratedCurrent, ratedSpeed } = useMotorConfig();
  const [rStep, setRStep] = useState(2);
  const step = useCallback((t: number) => rotorResistanceStep(t, rStep, config), [rStep, config]);
  const sim = useSimulation({ step, maxSeconds: 8 });
  const ts = useMemo(() => torqueSpeedCurve(1, 1 + rStep * 0.6, 60, config), [rStep, config]);

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Module 05"
        title="Rotor Resistance Control"
        subtitle="Used with slip-ring (wound-rotor) motors. External resistance is added to the rotor circuit, increasing starting torque while reducing starting current. Resistance is cut out in steps as the motor accelerates."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <MotorVisual speed={sim.current.speed} running={sim.running} label={`R-STEP ${rStep}`} />
          <SimControls running={sim.running} onStart={sim.start} onStop={sim.stop} onReset={sim.reset} />
          <div className="rounded-xl border border-border bg-gradient-card p-4 space-y-3">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Resistance Step</div>
            <div className="flex gap-2 flex-wrap">
              {STEPS.map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={rStep === s ? "default" : "outline"}
                  onClick={() => setRStep(s)}
                  className={rStep === s ? "bg-gradient-primary text-primary-foreground" : ""}
                >
                  R{s}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Higher resistance = higher starting torque & lower current, but reduced efficiency at speed. Notice how the torque-speed curve shifts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 content-start">
          <Metric label="Current" value={sim.current.current} unit="A" max={ratedCurrent * 8} current={sim.current.current} />
          <Metric label="Speed" value={sim.current.speed} unit="RPM" max={ratedSpeed * 1.05} current={sim.current.speed} />
          <Metric label="Torque" value={sim.current.torque} unit="%" max={250} current={sim.current.torque} tone="success" />
          <Metric label="R-step" value={rStep} />
          <Metric label="Effective R" value={`${(1 + rStep * 0.6).toFixed(2)}×`} />
          <Metric label="Status" value={sim.running ? "RUNNING" : "IDLE"} />
        </div>
      </div>

      <SimCharts data={sim.data} torqueSpeed={ts} />
    </div>
  );
}
