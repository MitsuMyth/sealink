import type { MonitoringStation, WaterQualityParameters } from '@/types/station';
import { PARAMETER_CONFIG } from '@/types/station';
import { getLatestReading } from '@/data/readings';
import StatusBadge from '@/components/ui/StatusBadge';
import { getRelativeTime } from '@/lib/utils';

interface StationPopupProps {
  station: MonitoringStation;
}

const displayParams: (keyof WaterQualityParameters)[] = ['temperature', 'pH', 'dissolvedOxygen', 'turbidity'];

export default function StationPopup({ station }: StationPopupProps) {
  const reading = getLatestReading(station.id);

  return (
    <div className="min-w-[220px]">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">{station.name}</h3>
          <p className="text-xs text-gray-500">{station.location}</p>
        </div>
        <StatusBadge status={station.status} showLabel={false} />
      </div>

      {reading ? (
        <div className="grid grid-cols-2 gap-2 mt-3">
          {displayParams.map(param => {
            const config = PARAMETER_CONFIG[param];
            return (
              <div key={param} className="bg-gray-50 rounded-md p-2">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">{config.label}</p>
                <p className="text-sm font-semibold text-gray-900">
                  {reading.parameters[param]}
                  {config.unit && <span className="text-xs font-normal text-gray-500 ml-0.5">{config.unit}</span>}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-gray-400 italic mt-2">No recent data available</p>
      )}

      <p className="text-[10px] text-gray-400 mt-3">
        Last reading: {getRelativeTime(station.lastReading)}
      </p>
    </div>
  );
}
