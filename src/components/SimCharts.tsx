import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { SimPoint } from "@/lib/motor";

const axis = { stroke: "hsl(var(--muted-foreground))", fontSize: 10 };
const grid = "hsl(var(--border) / 0.5)";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
  color: "hsl(var(--foreground))",
};

interface Props {
  data: SimPoint[];
  torqueSpeed?: { speed: number; torque: number }[];
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-gradient-card p-4">
      <div className="mb-2 font-display text-xs uppercase tracking-widest text-muted-foreground">{title}</div>
      <div className="h-48">{children}</div>
    </div>
  );
}

export function SimCharts({ data, torqueSpeed }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <ChartCard title="Current vs Time (A)">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke={grid} strokeDasharray="3 3" />
            <XAxis dataKey="t" tickFormatter={(v) => v.toFixed(1)} {...axis} />
            <YAxis {...axis} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => v.toFixed(2)} />
            <Line type="monotone" dataKey="current" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Speed vs Time (RPM)">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke={grid} strokeDasharray="3 3" />
            <XAxis dataKey="t" tickFormatter={(v) => v.toFixed(1)} {...axis} />
            <YAxis {...axis} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => v.toFixed(0)} />
            <Line type="monotone" dataKey="speed" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={torqueSpeed ? "Torque vs Speed (steady-state)" : "Torque vs Time (%)"}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={torqueSpeed ?? data}>
            <CartesianGrid stroke={grid} strokeDasharray="3 3" />
            {torqueSpeed ? (
              <XAxis dataKey="speed" {...axis} />
            ) : (
              <XAxis dataKey="t" tickFormatter={(v) => v.toFixed(1)} {...axis} />
            )}
            <YAxis {...axis} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => v.toFixed(1)} />
            <Line type="monotone" dataKey="torque" stroke="hsl(145 80% 55%)" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
