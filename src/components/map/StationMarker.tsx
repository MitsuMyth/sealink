import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { MonitoringStation } from '@/types/station';
import { getStatusColor } from '@/lib/utils';
import StationPopup from './StationPopup';

interface StationMarkerProps {
  station: MonitoringStation;
  onClick: (stationId: string) => void;
}

function createMarkerIcon(status: MonitoringStation['status']) {
  const color = getStatusColor(status);
  const pulse = status === 'warning' ? 'marker-pulse' : '';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="flex items-center justify-center ${pulse}" style="
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: ${color};
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

export default function StationMarker({ station, onClick }: StationMarkerProps) {
  const icon = createMarkerIcon(station.status);

  return (
    <Marker
      position={[station.coordinates.lat, station.coordinates.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onClick(station.id),
      }}
    >
      <Popup maxWidth={280} closeButton={true}>
        <StationPopup station={station} />
      </Popup>
    </Marker>
  );
}
