import { MapContainer, TileLayer } from 'react-leaflet';
import { LEBANON_CENTER, DEFAULT_ZOOM, TILE_URL, TILE_ATTRIBUTION } from '@/lib/leaflet-setup';
import StationMarker from './StationMarker';
import MapLegend from './MapLegend';
import type { MonitoringStation } from '@/types/station';

interface MapViewProps {
  stations: MonitoringStation[];
  onStationClick: (stationId: string) => void;
}

export default function MapView({ stations, onStationClick }: MapViewProps) {
  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={LEBANON_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        {stations.map(station => (
          <StationMarker
            key={station.id}
            station={station}
            onClick={onStationClick}
          />
        ))}
      </MapContainer>
      <MapLegend />
    </div>
  );
}
