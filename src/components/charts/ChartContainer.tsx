import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  controls?: React.ReactNode;
  className?: string;
  height?: string;
}

export default function ChartContainer({
  title,
  subtitle,
  children,
  controls,
  className,
  height = 'h-72',
}: ChartContainerProps) {
  return (
    <Card className={cn('p-5', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {controls && <div className="flex items-center gap-2">{controls}</div>}
      </div>
      <div className={height}>{children}</div>
    </Card>
  );
}
