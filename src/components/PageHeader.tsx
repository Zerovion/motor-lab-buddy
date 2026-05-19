interface Props {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function PageHeader({ title, subtitle, badge }: Props) {
  return (
    <div className="mb-6">
      {badge && (
        <div className="inline-block mb-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-display text-[10px] uppercase tracking-widest text-primary">
          {badge}
        </div>
      )}
      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground text-glow">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground max-w-3xl">{subtitle}</p>}
    </div>
  );
}
