import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Thermometer, Droplets, Waves, Wind } from 'lucide-react';
import MapView from '@/components/map/MapView';
import StatusBadge from '@/components/ui/StatusBadge';
import MiniSparkline from '@/components/charts/MiniSparkline';
import Card from '@/components/ui/Card';
import { stations } from '@/data/stations';
import { getLatestReading, getParameterTimeSeries } from '@/data/readings';
import { PARAMETER_CONFIG, type WaterQualityParameters } from '@/types/station';
import { getRelativeTime } from '@/lib/utils';
import { useIsDesktop } from '@/hooks/useMediaQuery';

const sidebarParams: (keyof WaterQualityParameters)[] = [
  'temperature', 'pH', 'dissolvedOxygen', 'turbidity', 'salinity', 'conductivity', 'chlorophyllA', 'nitrate'
];

const paramIcons: Partial<Record<keyof WaterQualityParameters, React.ReactNode>> = {
  temperature: <Thermometer className="w-3.5 h-3.5" />,
  dissolvedOxygen: <Droplets className="w-3.5 h-3.5" />,
  turbidity: <Waves className="w-3.5 h-3.5" />,
  salinity: <Wind className="w-3.5 h-3.5" />,
};

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get('station'));
  const isDesktop = useIsDesktop();

  useEffect(() => {
    const stationParam = searchParams.get('station');
    if (stationParam) setSelectedId(stationParam);
  }, [searchParams]);

  const selectedStation = useMemo(
    () => stations.find(s => s.id === selectedId),
    [selectedId]
  );

  const latestReading = useMemo(
    () => selectedId ? getLatestReading(selectedId) : undefined,
    [selectedId]
  );

  return (
    <div className="relative" style={{ height: 'calc(100vh - 4rem)' }}>
      <MapView stations={stations} onStationClick={setSelectedId} />

      {/* Station Detail Sidebar / Bottom Sheet */}
      <AnimatePresence>
        {selectedStation && (
          <motion.div
            initial={isDesktop ? { x: '100%' } : { y: '100%' }}
            animate={isDesktop ? { x: 0 } : { y: 0 }}
            exit={isDesktop ? { x: '100%' } : { y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`
              absolute z-[1000] bg-white shadow-xl overflow-y-auto
              ${isDesktop
                ? 'top-0 right-0 w-96 h-full border-l border-gray-100'
                : 'bottom-0 left-0 right-0 max-h-[60vh] rounded-t-2xl border-t border-gray-100'
              }
            `}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-100 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedStation.name}</h2>
                  <p className="text-xs text-gray-500">{selectedStation.location}</p>
                  <div className="mt-1.5">
                    <StatusBadge status={selectedStation.status} />
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close details"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Station Info */}
            <div className="px-5 py-4 border-b border-gray-50">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500">Depth</span>
                  <p className="font-medium text-gray-900">{selectedStation.depth}m</p>
                </div>
                <div>
                  <span className="text-gray-500">Last Reading</span>
                  <p className="font-medium text-gray-900">{getRelativeTime(selectedStation.lastReading)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Deployed</span>
                  <p className="font-medium text-gray-900">{new Date(selectedStation.deployedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">Station ID</span>
                  <p className="font-medium text-gray-900">{selectedStation.id}</p>
                </div>
              </div>
            </div>

            {/* Parameters */}
            <div className="px-5 py-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Water Quality Parameters
              </h3>
              {latestReading ? (
                <div className="space-y-3">
                  {sidebarParams.map(param => {
                    const config = PARAMETER_CONFIG[param];
                    const value = latestReading.parameters[param];
                    const sparkData = getParameterTimeSeries(selectedStation.id, param, 24).map(p => p.value);

                    return (
                      <Card key={param} className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">
                              {paramIcons[param] || <Droplets className="w-3.5 h-3.5" />}
                            </span>
                            <div>
                              <p className="text-xs text-gray-500">{config.label}</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {value}
                                {config.unit && <span className="text-xs font-normal text-gray-400 ml-0.5">{config.unit}</span>}
                              </p>
                            </div>
                          </div>
                          <MiniSparkline data={sparkData} color="#1e40af" width={60} height={24} />
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Droplets className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No recent data available</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
