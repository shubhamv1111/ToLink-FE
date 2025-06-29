import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart3, Eye, Calendar, TrendingUp } from 'lucide-react';

interface AnalyticsCardProps {
  shortCode: string;
  clickCount: number;
  createdAt: string;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  shortCode,
  clickCount,
  createdAt,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="p-6 h-full w-full flex flex-col items-stretch justify-between">
      <div className="flex items-center justify-between mb-4 w-full">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Analytics</h3>
        </div>
        <div className="text-sm text-gray-500">
          /{shortCode}
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="space-y-4 w-full">
          {/* Click Count */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Total Clicks</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">{clickCount}</span>
          </div>
          {/* Creation Date */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Created</span>
            </div>
            <span className="text-sm text-gray-600">{formatDate(createdAt)}</span>
          </div>
          {/* Status */}
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Status</span>
            </div>
            <span className="text-sm text-green-600 font-medium">Active</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t text-center w-full">
          <p className="text-xs text-gray-500">
            Detailed analytics available in dashboard
          </p>
        </div>
      </div>
    </Card>
  );
};
