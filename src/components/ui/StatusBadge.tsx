interface StatusBadgeProps {
  status: 'pending' | 'active' | 'on_leave' | 'terminated' | 'resigned';
}

const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'bg-info/10 text-info border-info/20',
  },
  active: {
    label: 'Active',
    className: 'bg-success/10 text-success border-success/20',
  },
  on_leave: {
    label: 'On Leave',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  terminated: {
    label: 'Terminated',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  resigned: {
    label: 'Resigned',
    className: 'bg-muted text-muted-foreground border-border',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
