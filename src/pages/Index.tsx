import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Zap, GitBranch, Sliders, Cpu, Gauge, BarChart3, ArrowRight } from "lucide-react";

const modules = [
  { to: "/dol", icon: Zap, name: "DOL Starter", desc: "Direct connection — high inrush, simple & cheap." },
  { to: "/star-delta", icon: GitBranch, name: "Star-Delta", desc: "Y → Δ transition reduces inrush to ~1/3." },
  { to: "/autotransformer", icon: Sliders, name: "Autotransformer", desc: "Tapped voltage starts. Current ∝ k, torque ∝ k²." },
  { to: "/vfd", icon: Cpu, name: "V/F Control (VFD)", desc: "Variable frequency drive — smoothest, most efficient." },
  { to: "/rotor-resistance", icon: Gauge, name: "Rotor Resistance", desc: "Slip-ring motors with external R — high starting torque." },
  { to: "/comparison", icon: BarChart3, name: "Comparison", desc: "Side-by-side comparison of all methods.", featured: true },
];

export default function Overview() {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-card p-8 md:p-12">
        <div className="absolute inset-0 bg-gradient-glow opacity-60 pointer-events-none" />
        <div className="relative">
          <PageHeader
            badge="Welcome"
            title="Induction Motor Starter Simulation Lab"
            subtitle="A hands-on, browser-based laboratory for visualizing how a 3-phase induction motor responds to different starting and speed-control techniques. Run simulations, tune parameters, and compare current, speed and torque in real time."
          />
          <div className="flex flex-wrap gap-3">
            <Link
              to="/dol"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 font-display text-sm font-bold text-primary-foreground shadow-[var(--glow-primary)] hover:shadow-[var(--glow-strong)] transition-shadow"
            >
              Launch first module <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/comparison"
              className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/5 px-5 py-2.5 font-display text-sm text-primary hover:bg-primary/10 transition"
            >
              Compare methods
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => (
          <Link
            key={m.to}
            to={m.to}
            className="group relative overflow-hidden rounded-xl border border-border bg-gradient-card p-5 transition-all hover:border-primary/60 hover:shadow-[var(--glow-primary)]"
          >
            <div className="flex items-start justify-between">
              <div className="rounded-lg bg-primary/10 p-2.5 border border-primary/30 group-hover:bg-primary/20 transition">
                <m.icon className="h-5 w-5 text-primary" />
              </div>
              {m.featured && (
                <span className="rounded-full bg-accent/20 border border-accent/40 px-2 py-0.5 text-[10px] uppercase tracking-widest text-accent font-display">
                  Pro
                </span>
              )}
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-foreground">{m.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
            <div className="mt-4 flex items-center gap-1 text-xs text-primary font-display uppercase tracking-widest">
              Open <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { k: "5", l: "Simulation Modules" },
          { k: "Real-time", l: "Charts & Metrics" },
          { k: "Educational", l: "Conceptual physics" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-border bg-gradient-card p-5 text-center">
            <div className="font-display text-3xl font-bold text-primary text-glow">{s.k}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
