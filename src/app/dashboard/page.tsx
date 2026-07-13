'use client'

import React, { useState, useEffect } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { linksApi, CreateLinkRequest } from '@/lib/api';

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
  urlName?: string;
  password?: string;
  activationAt?: string;
  expiresAt?: string;
  enabled?: boolean;
}

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [urls, setUrls] = useState<UrlData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const loadLinks = async () => {
    try {
      setIsLoadingData(true);
      const response = await linksApi.getList({
        sort: '-createdAt',
        limit: 100,
      });
      
      const mapped: UrlData[] = response.items.map((link) => ({
        id: link.id,
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        shortUrl: link.shortUrl,
        clicks: link.clicks,
        createdAt: link.createdAt,
        lastClicked: link.lastClicked,
        isPrivate: link.isPrivate,
        hasPassword: link.hasPassword,
        urlName: link.urlName,
        activationAt: link.activationAt,
        expiresAt: link.expiresAt,
        enabled: link.enabled,
      }));
      setUrls(mapped);
    } catch (error: any) {
      toast({
        title: "Error Loading Links",
        description: error?.message || "Failed to load your links",
        variant: "destructive",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadLinks();
    }
  }, [isAuthenticated]);

  // Check authentication
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking auth
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isExpired = (u: UrlData) => !!u.expiresAt && new Date() > new Date(u.expiresAt);
  const isPreActivation = (u: UrlData) => !!u.activationAt && new Date() < new Date(u.activationAt);
  const isEnabled = (u: UrlData) => u.enabled !== false;
  const isActive = (u: UrlData) => isEnabled(u) && !isPreActivation(u) && !isExpired(u);

  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
  const totalUrls = urls.length;
  const avgClicks = urls.length > 0 ? Math.round(totalClicks / urls.length) : 0;

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

  const deleteUrl = async (id: string) => {
    try {
      await linksApi.delete(id);
      setUrls(urls.filter(url => url.id !== id));
      toast({
        title: "URL Deleted",
        description: "The short URL has been removed from your dashboard",
      });
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error?.message || "Failed to delete the link",
        variant: "destructive",
      });
    }
  };

  const editUrl = async (id: string, updatedData: any) => {
    try {
      const updatePayload: Record<string, unknown> = {};
      if (updatedData.urlName?.trim()) updatePayload.urlName = updatedData.urlName.trim();
      if (updatedData.originalUrl !== undefined) updatePayload.originalUrl = updatedData.originalUrl;
      if (updatedData.customAlias?.trim()) updatePayload.customAlias = updatedData.customAlias.trim();
      if (updatedData.enabled !== undefined) updatePayload.enabled = updatedData.enabled;
      if (updatedData.activationAt !== undefined) updatePayload.activationAt = updatedData.activationAt;
      if (updatedData.expiresAt !== undefined) updatePayload.expiresAt = updatedData.expiresAt;
      if (updatedData.clearActivationAt) updatePayload.clearActivationAt = true;
      if (updatedData.clearExpiresAt) updatePayload.clearExpiresAt = true;
      if (updatedData.hasPassword !== undefined) updatePayload.hasPassword = updatedData.hasPassword;
      if (updatedData.password !== undefined) updatePayload.password = updatedData.password;

      await linksApi.update(id, updatePayload);
      
      // Refresh the link data from backend
      await loadLinks();
      
      toast({
        title: "URL Updated",
        description: "The link has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error?.message || "Failed to update the link",
        variant: "destructive",
      });
    }
  };

  const createLink = async (linkData: any) => {
    try {
      const createPayload: CreateLinkRequest = {
        originalUrl: linkData.originalUrl,
        isPrivate: linkData.isPrivate,
        hasPassword: linkData.hasPassword,
      };
      if (linkData.urlName?.trim()) createPayload.urlName = linkData.urlName.trim();
      if (linkData.customAlias?.trim()) createPayload.customAlias = linkData.customAlias.trim();
      if (linkData.password) createPayload.password = linkData.password;
      if (linkData.activationAt) createPayload.activationAt = linkData.activationAt;
      if (linkData.expiresAt) createPayload.expiresAt = linkData.expiresAt;

      await linksApi.create(createPayload);
      
      // Refresh the links list
      await loadLinks();
      
      toast({
        title: "Link Created",
        description: "Your short link has been created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error?.message || "Failed to create the link",
        variant: "destructive",
      });
    }
  };

  const filteredUrls = urls.filter(url => {
    const matchesSearch = url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         url.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (url.urlName && url.urlName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (selectedFilter === 'active') return matchesSearch && isActive(url);
    if (selectedFilter === 'expired') return matchesSearch && isExpired(url);
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
              onEdit={editUrl}
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
