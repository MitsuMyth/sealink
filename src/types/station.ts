export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export type StationStatus = 'online' | 'warning' | 'offline' | 'maintenance';

export interface MonitoringStation {
  id: string;
  name: string;
  location: string;
  coordinates: GeoCoordinates;
  status: StationStatus;
  lastReading: string;
  deployedDate: string;
  depth: number;
  description: string;
}

export interface WaterQualityParameters {
  pH: number;
  dissolvedOxygen: number;
  turbidity: number;
  temperature: number;
  salinity: number;
  conductivity: number;
  chlorophyllA: number;
  nitrate: number;
}

export interface WaterQualityReading {
  stationId: string;
  timestamp: string;
  parameters: WaterQualityParameters;
}

export interface ParameterThresholds {
  parameter: keyof WaterQualityParameters;
  unit: string;
  min: number;
  max: number;
  warningMin: number;
  warningMax: number;
  label: string;
}

export const PARAMETER_CONFIG: Record<keyof WaterQualityParameters, { label: string; unit: string; min: number; max: number }> = {
  pH: { label: 'pH Level', unit: '', min: 7.5, max: 8.5 },
  dissolvedOxygen: { label: 'Dissolved Oxygen', unit: 'mg/L', min: 4.0, max: 10.0 },
  turbidity: { label: 'Turbidity', unit: 'NTU', min: 0, max: 10 },
  temperature: { label: 'Temperature', unit: '°C', min: 14, max: 32 },
  salinity: { label: 'Salinity', unit: 'PSU', min: 35, max: 40 },
  conductivity: { label: 'Conductivity', unit: 'mS/cm', min: 45, max: 58 },
  chlorophyllA: { label: 'Chlorophyll-a', unit: 'µg/L', min: 0, max: 2 },
  nitrate: { label: 'Nitrate', unit: 'µmol/L', min: 0, max: 15 },
};
