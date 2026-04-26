import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number | string;
  icon: LucideIcon;
}

export default function StatCard({ label, value, icon: Icon }: Props) {
  return (
    <div className="card-glow p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">
            {label}
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-[color:var(--color-text-primary)]">{value}</div>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--color-accent)]/15 text-[color:var(--color-accent-glow)]">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
