import { useState, useMemo } from 'react';
import ChartContainer from '@/components/charts/ChartContainer';
import LineChart from '@/components/charts/LineChart';
import Select from '@/components/ui/Select';
import { stations } from '@/data/stations';
import { getParameterTimeSeries } from '@/data/readings';
import { PARAMETER_CONFIG, type WaterQualityParameters } from '@/types/station';
import { STATION_COLORS } from '@/lib/chartjs-setup';

const paramOptions = Object.entries(PARAMETER_CONFIG).map(([key, cfg]) => ({
  value: key,
  label: cfg.label,
}));

export default function QuickChart() {
  const [parameter, setParameter] = useState<keyof WaterQualityParameters>('temperature');

  const activeStations = useMemo(
    () => stations.filter(s => s.status === 'online' || s.status === 'warning'),
    []
  );

  const chartData = useMemo(() => {
    const datasets = activeStations.map((station, i) => {
      const series = getParameterTimeSeries(station.id, parameter, 24);
      return {
        label: station.name,
        data: series.map(p => p.value),
        borderColor: STATION_COLORS[i],
      };
    });

    // Use the first station's timestamps as labels
    const firstSeries = getParameterTimeSeries(activeStations[0]?.id || 'SL-001', parameter, 24);
    const labels = firstSeries.map(p => {
      const d = new Date(p.timestamp);
      return `${d.getHours().toString().padStart(2, '0')}:00`;
    });

    return { labels, datasets };
  }, [parameter, activeStations]);

  const config = PARAMETER_CONFIG[parameter];

  return (
    <ChartContainer
      title="24-Hour Trend"
      subtitle={`${config.label} across active stations`}
      height="h-64"
      controls={
        <Select
          options={paramOptions}
          value={parameter}
          onChange={v => setParameter(v as keyof WaterQualityParameters)}
        />
      }
    >
      <LineChart
        labels={chartData.labels}
        datasets={chartData.datasets}
        yAxisLabel={config.unit ? `${config.label} (${config.unit})` : config.label}
      />
    </ChartContainer>
  );
}
