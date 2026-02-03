import { Link } from 'react-router-dom';
import { Waves, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <Waves className="w-16 h-16 text-primary-200 mb-6" />
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-lg text-gray-600 mb-1">Page Not Found</p>
      <p className="text-sm text-gray-400 mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved. Return to the dashboard to continue monitoring.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-700 text-white rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}
