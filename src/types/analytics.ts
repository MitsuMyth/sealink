import type { WaterQualityParameters } from './station';

export interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
}

export interface TimeSeriesDataset {
  stationId: string;
  parameter: keyof WaterQualityParameters;
  data: TimeSeriesDataPoint[];
}

export interface StationComparison {
  parameter: keyof WaterQualityParameters;
  stations: {
    stationId: string;
    stationName: string;
    currentValue: number;
    average: number;
    trend: 'rising' | 'stable' | 'declining';
  }[];
}

export interface AIInsight {
  id: string;
  type: 'anomaly' | 'trend' | 'prediction' | 'recommendation';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  affectedStations: string[];
  parameter: string;
  timestamp: string;
  confidence: number;
}
