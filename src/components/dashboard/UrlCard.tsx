
import React from 'react';
import { Calendar, Eye, ExternalLink, Copy, Trash2, BarChart3, Lock, Globe, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UrlData {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  lastClicked?: string;
  isPrivate: boolean;
  hasPassword: boolean;
}

interface UrlCardProps {
  url: UrlData;
  onCopy: (url: string) => void;
  onDelete: (id: string) => void;
  onTogglePrivacy: (id: string) => void;
}

export const UrlCard: React.FC<UrlCardProps> = ({ url, onCopy, onDelete, onTogglePrivacy }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {url.shortUrl}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopy(url.shortUrl)}
              className="p-1 h-6 w-6"
            >
              <Copy className="w-3 h-3" />
            </Button>
            <div className="flex gap-1">
              {url.isPrivate ? (
                <div title="Private Link">
                  <Lock className="w-4 h-4 text-orange-500" />
                </div>
              ) : (
                <div title="Public Link">
                  <Globe className="w-4 h-4 text-green-500" />
                </div>
              )}
              {url.hasPassword && (
                <div title="Password Protected">
                  <Shield className="w-4 h-4 text-red-500" />
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate mb-3">
            {url.originalUrl}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Created {formatDate(url.createdAt)}
            </span>
            {url.lastClicked && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Last clicked {formatDate(url.lastClicked)}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {url.isPrivate ? '---' : url.clicks.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">clicks</div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onTogglePrivacy(url.id)}
            >
              {url.isPrivate ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </Button>
            {!url.isPrivate && (
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-1" />
                Analytics
              </Button>
            )}
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(url.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
