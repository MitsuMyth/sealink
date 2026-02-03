import PageLayout from '@/components/layout/PageLayout';
import HeroScene from '@/components/three/HeroScene';
import KPIGrid from '@/components/dashboard/KPIGrid';
import StationOverview from '@/components/dashboard/StationOverview';
import RecentAlerts from '@/components/dashboard/RecentAlerts';
import QuickChart from '@/components/dashboard/QuickChart';

export default function DashboardPage() {
  return (
    <PageLayout>
      <div className="space-y-6">
        {/* 3D Hero Scene */}
        <HeroScene />

        {/* KPI Cards */}
        <KPIGrid />

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickChart />
          <RecentAlerts />
        </div>

        {/* Station Overview */}
        <StationOverview />
      </div>
    </PageLayout>
  );
}
