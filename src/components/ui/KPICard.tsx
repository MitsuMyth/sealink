import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from './Card';
import { cn } from '@/lib/utils';
import type { KPIMetric } from '@/types/common';

interface KPICardProps {
  metric: KPIMetric;
  index?: number;
}

export default function KPICard({ metric, index = 0 }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof metric.value === 'number' ? metric.value : parseFloat(metric.value as string) || 0;

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(increment * step, numericValue);
      setDisplayValue(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [numericValue]);

  const TrendIcon = metric.changeDirection === 'up' ? TrendingUp
    : metric.changeDirection === 'down' ? TrendingDown : Minus;

  const trendColor = metric.changeDirection === 'up' ? 'text-green-600'
    : metric.changeDirection === 'down' ? 'text-red-600' : 'text-gray-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card hover className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">{metric.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {typeof metric.value === 'string' ? metric.value : Math.round(displayValue).toLocaleString()}
              </span>
              {metric.unit && (
                <span className="text-sm text-gray-500">{metric.unit}</span>
              )}
            </div>
            <div className={cn('mt-2 flex items-center gap-1 text-xs font-medium', trendColor)}>
              <TrendIcon className="w-3.5 h-3.5" />
              <span>{Math.abs(metric.change)}% from last period</span>
            </div>
          </div>
          {metric.sparklineData && (
            <MiniSparkline data={metric.sparklineData} color={metric.status === 'warning' ? '#eab308' : '#1e40af'} />
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 64;
  const height = 32;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
