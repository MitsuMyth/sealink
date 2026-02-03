import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const colorClasses = {
  primary: 'bg-primary-600',
  secondary: 'bg-secondary-600',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
};

export default function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  color = 'primary',
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const autoColor = percentage >= 80 ? 'success' : percentage >= 40 ? color : percentage >= 20 ? 'warning' : 'danger';

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs font-medium text-gray-600">{label}</span>}
          {showValue && <span className="text-xs font-medium text-gray-500">{percentage}%</span>}
        </div>
      )}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorClasses[autoColor])}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
