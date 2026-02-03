import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '@/components/layout/PageLayout';
import Tabs from '@/components/ui/Tabs';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import ChartContainer from '@/components/charts/ChartContainer';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import DoughnutChart from '@/components/charts/DoughnutChart';
import { stations } from '@/data/stations';
import { getParameterTimeSeries, getLatestReading } from '@/data/readings';
import { aiInsights } from '@/data/analytics';
import { PARAMETER_CONFIG, type WaterQualityParameters } from '@/types/station';
import { STATION_COLORS } from '@/lib/chartjs-setup';
import { AlertTriangle, TrendingUp, Brain, Lightbulb, Info, AlertCircle } from 'lucide-react';

const tabs = [
  { id: 'trends', label: 'Temporal Trends' },
  { id: 'comparison', label: 'Station Comparison' },
  { id: 'insights', label: 'AI Insights' },
];

const paramOptions = Object.entries(PARAMETER_CONFIG).map(([key, cfg]) => ({
  value: key,
  label: cfg.label,
}));

const timeRangeOptions = [
  { value: '24', label: 'Last 24 Hours' },
  { value: '72', label: 'Last 3 Days' },
  { value: '168', label: 'Last 7 Days' },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('trends');
  const [parameter, setParameter] = useState<keyof WaterQualityParameters>('temperature');
  const [timeRange, setTimeRange] = useState('24');

  return (
    <PageLayout title="Analytics" subtitle="Water quality trends, comparisons, and AI-powered insights">
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'trends' && (
            <TrendsTab
              parameter={parameter}
              setParameter={setParameter}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
            />
          )}
          {activeTab === 'comparison' && (
            <ComparisonTab parameter={parameter} setParameter={setParameter} />
          )}
          {activeTab === 'insights' && <InsightsTab />}
        </motion.div>
      </AnimatePresence>
    </PageLayout>
  );
}

function TrendsTab({
  parameter,
  setParameter,
  timeRange,
  setTimeRange,
}: {
  parameter: keyof WaterQualityParameters;
  setParameter: (p: keyof WaterQualityParameters) => void;
  timeRange: string;
  setTimeRange: (t: string) => void;
}) {
  const activeStations = useMemo(
    () => stations.filter(s => s.status === 'online' || s.status === 'warning'),
    []
  );

  const chartData = useMemo(() => {
    const hours = parseInt(timeRange);
    const datasets = activeStations.map((station, i) => {
      const series = getParameterTimeSeries(station.id, parameter, hours);
      return {
        label: station.name,
        data: series.map(p => p.value),
        borderColor: STATION_COLORS[i],
      };
    });

    const firstSeries = getParameterTimeSeries(activeStations[0]?.id || 'SL-001', parameter, hours);
    const labels = firstSeries.map(p => {
      const d = new Date(p.timestamp);
      return hours <= 24
        ? `${d.getHours().toString().padStart(2, '0')}:00`
        : `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:00`;
    });

    return { labels, datasets };
  }, [parameter, timeRange, activeStations]);

  const config = PARAMETER_CONFIG[parameter];

  return (
    <ChartContainer
      title="Temporal Trends"
      subtitle={`${config.label} over time across active stations`}
      height="h-96"
      controls={
        <div className="flex items-center gap-2">
          <Select
            options={paramOptions}
            value={parameter}
            onChange={v => setParameter(v as keyof WaterQualityParameters)}
          />
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={setTimeRange}
          />
        </div>
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

function ComparisonTab({
  parameter,
  setParameter,
}: {
  parameter: keyof WaterQualityParameters;
  setParameter: (p: keyof WaterQualityParameters) => void;
}) {
  const comparisonData = useMemo(() => {
    const labels: string[] = [];
    const values: number[] = [];

    stations.forEach(station => {
      const reading = getLatestReading(station.id);
      if (reading) {
        labels.push(station.name);
        values.push(reading.parameters[parameter]);
      }
    });

    return { labels, values };
  }, [parameter]);

  const statusDistribution = useMemo(() => {
    const counts = { online: 0, warning: 0, maintenance: 0, offline: 0 };
    stations.forEach(s => counts[s.status]++);
    return counts;
  }, []);

  const config = PARAMETER_CONFIG[parameter];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <ChartContainer
          title="Station Comparison"
          subtitle={`Current ${config.label} values across all stations`}
          height="h-80"
          controls={
            <Select
              options={paramOptions}
              value={parameter}
              onChange={v => setParameter(v as keyof WaterQualityParameters)}
            />
          }
        >
          <BarChart
            labels={comparisonData.labels}
            data={comparisonData.values}
            label={config.label}
            yAxisLabel={config.unit ? `${config.label} (${config.unit})` : config.label}
          />
        </ChartContainer>
      </div>
      <ChartContainer title="Fleet Status" subtitle="Station status distribution" height="h-80">
        <DoughnutChart
          labels={['Online', 'Warning', 'Maintenance', 'Offline']}
          data={[statusDistribution.online, statusDistribution.warning, statusDistribution.maintenance, statusDistribution.offline]}
          colors={['#22c55e', '#eab308', '#9ca3af', '#ef4444']}
          centerLabel="Total"
          centerValue={stations.length.toString()}
        />
      </ChartContainer>
    </div>
  );
}

const insightIcons = {
  anomaly: AlertTriangle,
  trend: TrendingUp,
  prediction: Brain,
  recommendation: Lightbulb,
};

const severityStyles = {
  info: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Info },
  warning: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: AlertTriangle },
  critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: AlertCircle },
};

function InsightsTab() {
  return (
    <div className="space-y-4">
      {aiInsights.map((insight, i) => {
        const TypeIcon = insightIcons[insight.type];
        const severity = severityStyles[insight.severity];

        return (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="p-5">
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl ${severity.bg} flex-shrink-0`}>
                  <TypeIcon className={`w-5 h-5 ${severity.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                      <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${severity.bg} ${severity.text} border ${severity.border}`}>
                        {insight.severity}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0 mt-1">
                      {new Date(insight.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-3 leading-relaxed">{insight.description}</p>

                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-500">Stations:</span>
                      <div className="flex gap-1">
                        {insight.affectedStations.map(id => {
                          const station = stations.find(s => s.id === id);
                          return (
                            <span key={id} className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-700">
                              {station?.name || id}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div className="w-32">
                      <ProgressBar
                        value={insight.confidence * 100}
                        label="Confidence"
                        color="primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
