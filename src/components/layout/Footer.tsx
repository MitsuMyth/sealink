import { Waves } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Waves className="w-4 h-4 text-primary-700" />
            <span>&copy; {new Date().getFullYear()} Sealink. Autonomous Marine Monitoring.</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>Lebanese Coastal Waters</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>Real-time Data Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
