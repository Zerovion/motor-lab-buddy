import { PageHeader } from "@/components/PageHeader";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const methods = [
  { name: "DOL", inrush: 7, torque: 100, cost: 1, efficiency: 90, control: 1 },
  { name: "Star-Delta", inrush: 2.5, torque: 33, cost: 2, efficiency: 88, control: 2 },
  { name: "Auto-TX", inrush: 4, torque: 64, cost: 4, efficiency: 87, control: 3 },
  { name: "VFD", inrush: 1.2, torque: 100, cost: 8, efficiency: 95, control: 10 },
  { name: "Rotor R", inrush: 2, torque: 200, cost: 6, efficiency: 80, control: 5 },
];

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
  color: "hsl(var(--foreground))",
};
const axis = { stroke: "hsl(var(--muted-foreground))", fontSize: 11 };
const grid = "hsl(var(--border) / 0.5)";

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-gradient-card p-4">
      <div className="mb-3 font-display text-xs uppercase tracking-widest text-muted-foreground">{title}</div>
      <div className="h-64">{children}</div>
    </div>
  );
}

const rows = [
  { method: "DOL", current: "6–8× FL", torque: "100%", cost: "Lowest", smoothness: "Harsh", best: "Small motors (<5 kW)" },
  { method: "Star-Delta", current: "~2.5× FL", torque: "~33%", cost: "Low", smoothness: "Step transition", best: "Light loads, no-load start" },
  { method: "Autotransformer", current: "~4× FL", torque: "~64%", cost: "Medium", smoothness: "Stepped taps", best: "Medium motors" },
  { method: "V/F (VFD)", current: "~1.2× FL", torque: "100%", cost: "High", smoothness: "Smoothest", best: "Modern variable speed apps" },
  { method: "Rotor Resistance", current: "~2× FL", torque: "Up to 200%", cost: "Medium-High", smoothness: "Step controlled", best: "High-inertia, slip-ring motors" },
];

export default function Comparison() {
  return (
    <div className="space-y-6">
      <PageHeader
        badge="Comparison"
        title="Starting Methods — Side by Side"
        subtitle="Quantitative and qualitative comparison of the five starting/control methods. Lower inrush and higher control come at higher cost; rotor resistance uniquely delivers very high starting torque."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Starting Inrush (× full-load current)">
          <ResponsiveContainer>
            <BarChart data={methods}>
              <CartesianGrid stroke={grid} strokeDasharray="3 3" />
              <XAxis dataKey="name" {...axis} />
              <YAxis {...axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="inrush" fill="hsl(0 84% 60%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Starting Torque (% of full-load)">
          <ResponsiveContainer>
            <BarChart data={methods}>
              <CartesianGrid stroke={grid} strokeDasharray="3 3" />
              <XAxis dataKey="name" {...axis} />
              <YAxis {...axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="torque" fill="hsl(145 80% 55%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Relative Cost (1 = cheapest)">
          <ResponsiveContainer>
            <BarChart data={methods}>
              <CartesianGrid stroke={grid} strokeDasharray="3 3" />
              <XAxis dataKey="name" {...axis} />
              <YAxis {...axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="cost" fill="hsl(38 95% 55%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Efficiency vs Control Flexibility">
          <ResponsiveContainer>
            <BarChart data={methods}>
              <CartesianGrid stroke={grid} strokeDasharray="3 3" />
              <XAxis dataKey="name" {...axis} />
              <YAxis {...axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }} />
              <Bar dataKey="efficiency" fill="hsl(200 100% 55%)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="control" fill="hsl(280 80% 60%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="rounded-xl border border-border bg-gradient-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border font-display text-xs uppercase tracking-widest text-muted-foreground">
          Quick Reference Table
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40">
              <tr className="text-left">
                {["Method", "Starting Current", "Starting Torque", "Cost", "Smoothness", "Best for"].map((h) => (
                  <th key={h} className="px-4 py-2 font-display text-[10px] uppercase tracking-widest text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.method} className="border-t border-border hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-primary">{r.method}</td>
                  <td className="px-4 py-3 text-foreground">{r.current}</td>
                  <td className="px-4 py-3 text-foreground">{r.torque}</td>
                  <td className="px-4 py-3 text-foreground">{r.cost}</td>
                  <td className="px-4 py-3 text-foreground">{r.smoothness}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
