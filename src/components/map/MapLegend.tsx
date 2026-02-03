import type { StationStatus } from '@/types/station';
import { getStatusColor } from '@/lib/utils';

const statuses: { status: StationStatus; label: string }[] = [
  { status: 'online', label: 'Online' },
  { status: 'warning', label: 'Warning' },
  { status: 'maintenance', label: 'Maintenance' },
  { status: 'offline', label: 'Offline' },
];

export default function MapLegend() {
  return (
    <div className="absolute bottom-6 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-gray-100 p-3">
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Station Status</p>
      <div className="flex flex-col gap-1.5">
        {statuses.map(({ status, label }) => (
          <div key={status} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: getStatusColor(status) }}
            />
            <span className="text-xs text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
