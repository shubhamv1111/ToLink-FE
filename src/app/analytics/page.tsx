'use client'

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Globe, Clock, Users, Calendar, ArrowUp, ArrowDown, Link2, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { generateShortUrl } from '@/lib/utils';

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

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedUrl, setSelectedUrl] = useState('all');
  const { isAuthenticated, user } = useAuth();

  // Mock user URLs data
  const [userUrls, setUserUrls] = useState<UrlData[]>([
    {
      id: '1',
      originalUrl: 'https://example.com/very-long-url-that-needs-shortening',
      shortCode: 'abc123',
      shortUrl: generateShortUrl('abc123'),
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
      shortUrl: generateShortUrl('github1'),
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
      shortUrl: generateShortUrl('docs42'),
      clicks: 432,
      createdAt: '2024-01-08T14:20:00Z',
      lastClicked: '2024-01-18T11:30:00Z',
      isPrivate: false,
      hasPassword: true
    }
  ]);

  // Mock data - this would come from API based on selected URL
  const getAnalyticsData = () => {
    if (selectedUrl === 'all') {
      // Combined data for all user URLs
      return {
        clicksData: [
          { date: '2024-01-14', clicks: 45 },
          { date: '2024-01-15', clicks: 52 },
          { date: '2024-01-16', clicks: 38 },
          { date: '2024-01-17', clicks: 67 },
          { date: '2024-01-18', clicks: 71 },
          { date: '2024-01-19', clicks: 59 },
          { date: '2024-01-20', clicks: 83 }
        ],
        totalClicks: 2847,
        uniqueVisitors: 1234,
        clickRate: '3.2%',
        avgDailyClicks: 407
      };
    } else {
      // Data for specific URL
      const url = userUrls.find(u => u.id === selectedUrl);
      return {
        clicksData: [
          { date: '2024-01-14', clicks: 15 },
          { date: '2024-01-15', clicks: 22 },
          { date: '2024-01-16', clicks: 18 },
          { date: '2024-01-17', clicks: 27 },
          { date: '2024-01-18', clicks: 31 },
          { date: '2024-01-19', clicks: 29 },
          { date: '2024-01-20', clicks: 33 }
        ],
        totalClicks: url?.clicks || 0,
        uniqueVisitors: Math.floor((url?.clicks || 0) * 0.8),
        clickRate: '2.8%',
        avgDailyClicks: Math.floor((url?.clicks || 0) / 7)
      };
    }
  };

  const analyticsData = getAnalyticsData();

  const deviceData = [
    { name: 'Desktop', value: 45, color: '#3B82F6' },
    { name: 'Mobile', value: 35, color: '#8B5CF6' },
    { name: 'Tablet', value: 20, color: '#10B981' }
  ];

  const countryData = [
    { country: 'United States', clicks: 234, percentage: 45 },
    { country: 'United Kingdom', clicks: 156, percentage: 30 },
    { country: 'Canada', clicks: 78, percentage: 15 },
    { country: 'Australia', clicks: 52, percentage: 10 }
  ];

  const referrerData = [
    { source: 'Direct', clicks: 180 },
    { source: 'Twitter', clicks: 120 },
    { source: 'Facebook', clicks: 95 },
    { source: 'LinkedIn', clicks: 60 },
    { source: 'Other', clicks: 65 }
  ];

  const stats = [
    { 
      label: 'Total Clicks', 
      value: analyticsData.totalClicks.toLocaleString(), 
      change: '+12%', 
      trend: 'up',
      icon: <BarChart3 className="w-6 h-6" />
    },
    { 
      label: 'Unique Visitors', 
      value: analyticsData.uniqueVisitors.toLocaleString(), 
      change: '+8%', 
      trend: 'up',
      icon: <Users className="w-6 h-6" />
    },
    { 
      label: 'Click Rate', 
      value: analyticsData.clickRate, 
      change: '-2%', 
      trend: 'down',
      icon: <TrendingUp className="w-6 h-6" />
    },
    { 
      label: 'Avg. Daily Clicks', 
      value: analyticsData.avgDailyClicks.toLocaleString(), 
      change: '+15%', 
      trend: 'up',
      icon: <Clock className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics</h1>
            <p className="text-gray-600 dark:text-gray-300">
              {isAuthenticated 
                ? "Track your link performance and audience insights" 
                : "Demo analytics dashboard"
              }
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            {isAuthenticated && (
              <div className="flex items-center gap-2 mr-4">
                <Filter className="w-4 h-4 text-gray-500" />
                <Select value={selectedUrl} onValueChange={setSelectedUrl}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select URL" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All URLs</SelectItem>
                    {userUrls.map((url) => (
                      <SelectItem key={url.id} value={url.id}>
                        {url.shortCode} ({url.clicks} clicks)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button
              variant={selectedPeriod === '7days' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('7days')}
            >
              7 Days
            </Button>
            <Button
              variant={selectedPeriod === '30days' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('30days')}
            >
              30 Days
            </Button>
            <Button
              variant={selectedPeriod === '90days' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('90days')}
            >
              90 Days
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                  {stat.icon}
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Clicks Over Time */}
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Clicks Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.clicksData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Device Breakdown */}
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Device Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {deviceData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{item.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Traffic Sources */}
        <Card className="p-6 mb-8 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={referrerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clicks" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Geographic Data & Top URLs */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Geographic Data */}
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Countries</h3>
            </div>
            <div className="space-y-4">
              {countryData.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{country.country}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{country.clicks} clicks</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${country.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Performing URLs */}
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isAuthenticated ? 'Your Top URLs' : 'Top Performing URLs'}
              </h3>
            </div>
            <div className="space-y-4">
              {userUrls.slice(0, 3).map((url, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{url.shortCode}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{url.clicks.toLocaleString()} clicks</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {url.isPrivate && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded">
                        Private
                      </span>
                    )}
                    {url.hasPassword && (
                      <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                        Protected
                      </span>
                    )}
                    <div className="text-green-600 text-sm font-medium">
                      +{Math.floor(Math.random() * 20) + 1}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      {/* Demo Banner - Only show when not authenticated */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border-t dark:border-gray-700">
          <div className="container mx-auto px-4 py-8">
            <Card className="p-8 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Get Your Own Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                This is a demo of our analytics dashboard. Create your account to start tracking your own link performance, 
                monitor traffic sources, and gain insights into your audience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Link2 className="w-4 h-4 mr-2" />
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/features">
                  <Button variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Analytics;
