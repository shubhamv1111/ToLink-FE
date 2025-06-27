
'use client'

import React, { useState } from 'react';
import { Plus, Link2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { UrlCard } from '@/components/dashboard/UrlCard';
import { CreateLinkModal } from '@/components/dashboard/CreateLinkModal';

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

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toast } = useToast();

  // Mock data with privacy and password settings
  const [urls, setUrls] = useState<UrlData[]>([
    {
      id: '1',
      originalUrl: 'https://example.com/very-long-url-that-needs-shortening',
      shortCode: 'abc123',
      shortUrl: 'https://tolink.co/abc123',
      clicks: 1247,
      createdAt: '2024-01-15T10:30:00Z',
      lastClicked: '2024-01-20T14:22:00Z',
      isPrivate: false,
      hasPassword: false
    },
    {
      id: '2',
      originalUrl: 'https://github.com/username/repository-name',
      shortCode: 'github1',
      shortUrl: 'https://tolink.co/github1',
      clicks: 89,
      createdAt: '2024-01-10T09:15:00Z',
      lastClicked: '2024-01-19T16:45:00Z',
      isPrivate: true,
      hasPassword: false
    },
    {
      id: '3',
      originalUrl: 'https://docs.google.com/document/d/1234567890/edit',
      shortCode: 'docs42',
      shortUrl: 'https://tolink.co/docs42',
      clicks: 432,
      createdAt: '2024-01-08T14:20:00Z',
      lastClicked: '2024-01-18T11:30:00Z',
      isPrivate: false,
      hasPassword: true
    }
  ]);

  const publicUrls = urls.filter(url => !url.isPrivate);
  const totalClicks = publicUrls.reduce((sum, url) => sum + url.clicks, 0);
  const totalUrls = urls.length;
  const avgClicks = publicUrls.length > 0 ? Math.round(totalClicks / publicUrls.length) : 0;

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Copied!",
        description: "Short URL copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const deleteUrl = (id: string) => {
    setUrls(urls.filter(url => url.id !== id));
    toast({
      title: "URL Deleted",
      description: "The short URL has been removed from your dashboard",
    });
  };

  const togglePrivacy = (id: string) => {
    setUrls(urls.map(url => 
      url.id === id ? { ...url, isPrivate: !url.isPrivate } : url
    ));
    toast({
      title: "Privacy Updated",
      description: "Link privacy setting has been changed",
    });
  };

  const createLink = async (linkData: any) => {
    const newUrl: UrlData = {
      id: Date.now().toString(),
      originalUrl: linkData.originalUrl,
      shortCode: linkData.customAlias || Math.random().toString(36).substring(2, 8),
      shortUrl: `https://tolink.co/${linkData.customAlias || Math.random().toString(36).substring(2, 8)}`,
      clicks: 0,
      createdAt: new Date().toISOString(),
      isPrivate: linkData.isPrivate,
      hasPassword: linkData.hasPassword
    };
    
    setUrls([newUrl, ...urls]);
    toast({
      title: "Link Created",
      description: "Your new short link has been created successfully",
    });
  };

  const filteredUrls = urls.filter(url => {
    const matchesSearch = url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         url.shortCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'public') return matchesSearch && !url.isPrivate;
    if (selectedFilter === 'private') return matchesSearch && url.isPrivate;
    if (selectedFilter === 'password-protected') return matchesSearch && url.hasPassword;
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage and track your shortened URLs</p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Link
          </Button>
        </div>

        {/* Stats Cards */}
        <DashboardStats 
          totalUrls={totalUrls}
          totalClicks={totalClicks}
          avgClicks={avgClicks}
        />

        {/* Filters and Search */}
        <DashboardFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />

        {/* URLs List */}
        <div className="space-y-4">
          {filteredUrls.map((url) => (
            <UrlCard
              key={url.id}
              url={url}
              onCopy={copyToClipboard}
              onDelete={deleteUrl}
              onTogglePrivacy={togglePrivacy}
            />
          ))}
        </div>

        {filteredUrls.length === 0 && (
          <Card className="p-12 text-center backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
            <Link2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No URLs found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {searchTerm || selectedFilter !== 'all' 
                ? "Try adjusting your search or filter criteria"
                : "Create your first short URL to get started"
              }
            </p>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Link
            </Button>
          </Card>
        )}
      </main>

      <CreateLinkModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={createLink}
      />

      <Footer />
    </div>
  );
};

export default Dashboard;
