import { cn, getStatusTextClass } from '@/lib/utils';
import type { StationStatus } from '@/types/station';
import { CheckCircle, AlertTriangle, XCircle, Wrench } from 'lucide-react';

const icons: Record<StationStatus, React.ReactNode> = {
  online: <CheckCircle className="w-3.5 h-3.5" />,
  warning: <AlertTriangle className="w-3.5 h-3.5" />,
  offline: <XCircle className="w-3.5 h-3.5" />,
  maintenance: <Wrench className="w-3.5 h-3.5" />,
};

interface StatusBadgeProps {
  status: StationStatus;
  showLabel?: boolean;
  className?: string;
}

export default function StatusBadge({ status, showLabel = true, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        getStatusTextClass(status),
        className
      )}
    >
      {icons[status]}
      {showLabel && <span className="capitalize">{status}</span>}
    </span>
  );
}
