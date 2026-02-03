import { createContext, useContext, useState, type ReactNode } from 'react';
import type { WaterQualityParameters } from '@/types/station';

interface AppState {
  selectedStationId: string | null;
  selectedParameter: keyof WaterQualityParameters;
  timeRange: number; // hours
  mobileNavOpen: boolean;
}

interface AppContextValue extends AppState {
  selectStation: (id: string | null) => void;
  setSelectedParameter: (param: keyof WaterQualityParameters) => void;
  setTimeRange: (hours: number) => void;
  toggleMobileNav: () => void;
  closeMobileNav: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [selectedParameter, setSelectedParameter] = useState<keyof WaterQualityParameters>('temperature');
  const [timeRange, setTimeRange] = useState(24);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const value: AppContextValue = {
    selectedStationId,
    selectedParameter,
    timeRange,
    mobileNavOpen,
    selectStation: setSelectedStationId,
    setSelectedParameter,
    setTimeRange,
    toggleMobileNav: () => setMobileNavOpen(prev => !prev),
    closeMobileNav: () => setMobileNavOpen(false),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
