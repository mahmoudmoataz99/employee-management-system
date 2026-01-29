import { ReactNode } from 'react';

interface DetailRowProps {
  label: string;
  value: ReactNode;
}

export function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center">
      <span className="w-40 shrink-0 text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value || '-'}</span>
    </div>
  );
}

export function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>
      <div className="divide-y divide-border">
        {children}
      </div>
    </div>
  );
}
