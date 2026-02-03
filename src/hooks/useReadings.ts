import { useMemo } from 'react';
import { getStationReadings, getLatestReading, getReadingsInRange, getParameterTimeSeries } from '@/data/readings';
import type { WaterQualityParameters } from '@/types/station';

export function useReadings(stationId: string | null) {
  const readings = useMemo(
    () => (stationId ? getStationReadings(stationId) : []),
    [stationId]
  );

  const latest = useMemo(
    () => (stationId ? getLatestReading(stationId) : undefined),
    [stationId]
  );

  return { readings, latest };
}

export function useTimeSeries(
  stationId: string | null,
  parameter: keyof WaterQualityParameters,
  hoursBack: number = 24
) {
  return useMemo(
    () => (stationId ? getParameterTimeSeries(stationId, parameter, hoursBack) : []),
    [stationId, parameter, hoursBack]
  );
}

export function useRangeReadings(stationId: string | null, hoursBack: number) {
  return useMemo(
    () => (stationId ? getReadingsInRange(stationId, hoursBack) : []),
    [stationId, hoursBack]
  );
}
