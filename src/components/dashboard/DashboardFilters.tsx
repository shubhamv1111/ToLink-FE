
import React from 'react';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DashboardFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter
}) => {
  return (
    <Card className="p-6 mb-8 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search your URLs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
          >
            All
          </Button>
          <Button
            variant={selectedFilter === 'public' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('public')}
          >
            Public
          </Button>
          <Button
            variant={selectedFilter === 'private' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('private')}
          >
            Private
          </Button>
          <Button
            variant={selectedFilter === 'password-protected' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('password-protected')}
          >
            Protected
          </Button>
        </div>
      </div>
    </Card>
  );
};
