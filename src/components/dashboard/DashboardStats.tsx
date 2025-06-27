
import React from 'react';
import { Link2, BarChart3, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface DashboardStatsProps {
  totalUrls: number;
  totalClicks: number;
  avgClicks: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalUrls,
  totalClicks,
  avgClicks
}) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Total URLs</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalUrls}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
            <Link2 className="w-6 h-6" />
          </div>
        </div>
      </Card>

      <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Total Clicks</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalClicks.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
        </div>
      </Card>

      <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Avg. Clicks</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{avgClicks}</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>
      </Card>
    </div>
  );
};
