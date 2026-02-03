import type { WaterQualityParameters, WaterQualityReading } from '@/types/station';

const baseParameters: Record<string, WaterQualityParameters> = {
  'SL-001': { pH: 8.15, dissolvedOxygen: 7.2, turbidity: 1.8, temperature: 22.5, salinity: 38.2, conductivity: 52.1, chlorophyllA: 0.35, nitrate: 2.1 },
  'SL-002': { pH: 8.18, dissolvedOxygen: 7.5, turbidity: 0.9, temperature: 22.0, salinity: 38.5, conductivity: 52.5, chlorophyllA: 0.28, nitrate: 1.5 },
  'SL-003': { pH: 8.05, dissolvedOxygen: 6.8, turbidity: 3.2, temperature: 22.8, salinity: 37.8, conductivity: 51.2, chlorophyllA: 0.65, nitrate: 4.2 },
  'SL-004': { pH: 8.12, dissolvedOxygen: 7.0, turbidity: 1.5, temperature: 23.0, salinity: 38.0, conductivity: 51.8, chlorophyllA: 0.32, nitrate: 2.0 },
  'SL-005': { pH: 8.08, dissolvedOxygen: 6.5, turbidity: 2.8, temperature: 23.2, salinity: 37.5, conductivity: 51.0, chlorophyllA: 0.55, nitrate: 3.8 },
  'SL-006': { pH: 8.20, dissolvedOxygen: 7.8, turbidity: 0.6, temperature: 22.0, salinity: 38.8, conductivity: 53.0, chlorophyllA: 0.18, nitrate: 1.0 },
  'SL-007': { pH: 8.10, dissolvedOxygen: 7.1, turbidity: 1.4, temperature: 23.5, salinity: 38.1, conductivity: 51.9, chlorophyllA: 0.30, nitrate: 2.5 },
  'SL-008': { pH: 8.14, dissolvedOxygen: 7.3, turbidity: 1.0, temperature: 24.0, salinity: 38.4, conductivity: 52.3, chlorophyllA: 0.25, nitrate: 1.8 },
};

const noiseAmplitudes: Record<keyof WaterQualityParameters, number> = {
  pH: 0.08,
  dissolvedOxygen: 0.5,
  turbidity: 0.4,
  temperature: 1.5,
  salinity: 0.3,
  conductivity: 0.8,
  chlorophyllA: 0.1,
  nitrate: 0.6,
};

// Seeded pseudo-random for reproducibility
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateReadings(stationId: string, days: number): WaterQualityReading[] {
  const base = baseParameters[stationId];
  if (!base) return [];

  const readings: WaterQualityReading[] = [];
  const now = new Date();
  const startTime = new Date(now.getTime() - days * 24 * 3600000);
  let seed = stationId.charCodeAt(3) * 1000;

  for (let hour = 0; hour < days * 24; hour++) {
    const timestamp = new Date(startTime.getTime() + hour * 3600000);
    const hourOfDay = timestamp.getHours();

    // Diurnal temperature variation: peaks at 14:00
    const diurnalFactor = Math.sin(((hourOfDay - 6) / 24) * Math.PI * 2) * 0.5;

    const params: WaterQualityParameters = {
      pH: base.pH + (seededRandom(seed++) - 0.5) * noiseAmplitudes.pH * 2,
      dissolvedOxygen: base.dissolvedOxygen + (seededRandom(seed++) - 0.5) * noiseAmplitudes.dissolvedOxygen * 2 - diurnalFactor * 0.3,
      turbidity: Math.max(0.1, base.turbidity + (seededRandom(seed++) - 0.5) * noiseAmplitudes.turbidity * 2),
      temperature: base.temperature + diurnalFactor * 2 + (seededRandom(seed++) - 0.5) * noiseAmplitudes.temperature,
      salinity: base.salinity + (seededRandom(seed++) - 0.5) * noiseAmplitudes.salinity * 2,
      conductivity: base.conductivity + (seededRandom(seed++) - 0.5) * noiseAmplitudes.conductivity * 2,
      chlorophyllA: Math.max(0.01, base.chlorophyllA + (seededRandom(seed++) - 0.5) * noiseAmplitudes.chlorophyllA * 2),
      nitrate: Math.max(0.05, base.nitrate + (seededRandom(seed++) - 0.5) * noiseAmplitudes.nitrate * 2),
    };

    // Round all values
    params.pH = Math.round(params.pH * 100) / 100;
    params.dissolvedOxygen = Math.round(params.dissolvedOxygen * 10) / 10;
    params.turbidity = Math.round(params.turbidity * 10) / 10;
    params.temperature = Math.round(params.temperature * 10) / 10;
    params.salinity = Math.round(params.salinity * 10) / 10;
    params.conductivity = Math.round(params.conductivity * 10) / 10;
    params.chlorophyllA = Math.round(params.chlorophyllA * 100) / 100;
    params.nitrate = Math.round(params.nitrate * 10) / 10;

    readings.push({
      stationId,
      timestamp: timestamp.toISOString(),
      parameters: params,
    });
  }

  return readings;
}

// Generate 7 days of hourly readings for each station (keep it manageable)
const stationIds = ['SL-001', 'SL-002', 'SL-003', 'SL-004', 'SL-005', 'SL-006', 'SL-007', 'SL-008'];

export const allReadings: WaterQualityReading[] = stationIds.flatMap(id => generateReadings(id, 7));

export function getStationReadings(stationId: string): WaterQualityReading[] {
  return allReadings.filter(r => r.stationId === stationId);
}

export function getLatestReading(stationId: string): WaterQualityReading | undefined {
  const stationReadings = getStationReadings(stationId);
  return stationReadings[stationReadings.length - 1];
}

export function getReadingsInRange(stationId: string, hoursBack: number): WaterQualityReading[] {
  const cutoff = new Date(Date.now() - hoursBack * 3600000);
  return getStationReadings(stationId).filter(r => new Date(r.timestamp) >= cutoff);
}

export function getParameterTimeSeries(
  stationId: string,
  parameter: keyof WaterQualityParameters,
  hoursBack: number = 24
): { timestamp: string; value: number }[] {
  return getReadingsInRange(stationId, hoursBack).map(r => ({
    timestamp: r.timestamp,
    value: r.parameters[parameter],
  }));
}
