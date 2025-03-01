import { RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-8 rounded-lg">
        <h1 className="text-9xl font-extrabold text-gray-900 mb-4">
          4<span className="text-blue-500 inline-block animate-bounce">0</span>4
        </h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">
          Oops! This page is on vacation.
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Don&apos;t worry, even pages need a break sometimes. Let&apos;s get
          you back on track.
        </p>

        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}
