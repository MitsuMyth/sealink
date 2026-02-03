import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import { useStations } from '@/hooks/useStations';
import { getLatestReading } from '@/data/readings';
import { getRelativeTime } from '@/lib/utils';
import { MapPin } from 'lucide-react';

export default function StationOverview() {
  const { stations } = useStations();
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">Monitoring Stations</h3>
        <p className="text-xs text-gray-500 mt-0.5">Click a station to view on map</p>
      </div>
      <div className="divide-y divide-gray-50">
        {stations.map((station, i) => {
          const reading = getLatestReading(station.id);
          return (
            <motion.button
              key={station.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/map?station=${station.id}`)}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{station.name}</p>
                <p className="text-xs text-gray-500">{station.location}</p>
              </div>
              <div className="text-right flex-shrink-0 hidden sm:block">
                {reading && (
                  <p className="text-sm font-medium text-gray-700">
                    {reading.parameters.temperature}°C
                  </p>
                )}
                <p className="text-[10px] text-gray-400">{getRelativeTime(station.lastReading)}</p>
              </div>
              <StatusBadge status={station.status} showLabel={false} className="flex-shrink-0" />
            </motion.button>
          );
        })}
      </div>
    </Card>
  );
}
