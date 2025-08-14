'use client'

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Globe, Clock, Users, Calendar, ArrowUp, ArrowDown, Link2, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ReferenceArea, ReferenceLine } from 'recharts';
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
  expiredAt?: string;
  statusPeriods?: { start: string; end?: string }[];
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
      statusPeriods: [
        { start: '2024-01-15' }
      ],
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
      expiredAt: '2024-01-19T16:45:00Z',
      lastClicked: '2024-01-19T16:45:00Z',
      statusPeriods: [
        { start: '2024-01-10', end: '2024-01-13' },
        { start: '2024-01-16', end: '2024-01-19' }
      ],
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
      statusPeriods: [
        { start: '2024-01-08', end: '2024-01-12' },
        { start: '2024-01-14' }
      ],
      isPrivate: false,
      hasPassword: true
    }
  ]);

  // Mock data - this would come from API based on selected URL
  // Helper to generate demo clicks data for the selected period
  const getAnalyticsData = () => {
    const isAllTime = selectedPeriod === 'allTime';
    const days = selectedPeriod === '7days' ? 7 : selectedPeriod === '30days' ? 30 : selectedPeriod === '90days' ? 90 : undefined;

    const generateClicksData = (numDays: number, baseClicks: number) => {
      const today = new Date();
      const data: { date: string; clicks: number }[] = [];
      for (let i = numDays - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        // Smooth variation so chart looks realistic and readable
        const seasonal = Math.sin(((numDays - i) / numDays) * Math.PI * 2) * 12;
        const weekly = ((numDays - i) % 7) * 2;
        const clicks = Math.max(5, Math.round(baseClicks + seasonal + weekly));
        data.push({ date: d.toISOString().slice(0, 10), clicks });
      }
      return data;
    };

    if (selectedUrl === 'all') {
      // Combine all URLs into a continuous series
      const today = new Date();
      const windowEnd = today;
      let windowStart: Date;
      if (isAllTime) {
        windowStart = new Date(Math.min(...userUrls.map(u => new Date(u.createdAt).getTime())));
      } else {
        windowStart = new Date();
        windowStart.setDate(today.getDate() - (days as number) + 1);
      }

      const diffDays = Math.max(1, Math.ceil((windowEnd.getTime() - windowStart.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      const clicksData: { date: string; clicks: number }[] = [];

      for (let i = 0; i < diffDays; i++) {
        const d = new Date(windowStart);
        d.setDate(windowStart.getDate() + i);
        const dayStr = d.toISOString().slice(0, 10);

        // Sum contributions from each URL depending on its active state that day
        let dayClicks = 0;
        userUrls.forEach(u => {
          const periods = (u.statusPeriods && u.statusPeriods.length > 0) ? u.statusPeriods : [{ start: u.createdAt, end: u.expiredAt }];

          // compute per-link tracking cutoff: 30 days after last active end; if still active, no cutoff (today)
          const lastEnded = [...periods].reverse().find(p => !!p.end)?.end;
          let trackingCutoff: Date | null = null;
          if (lastEnded) {
            const e = new Date(lastEnded + 'T00:00:00Z');
            const cut = new Date(e);
            cut.setDate(cut.getDate() + 30);
            trackingCutoff = cut;
          }
          const isActive = periods.some(p => {
            const s = new Date(p.start + 'T00:00:00Z');
            const e = p.end ? new Date(p.end + 'T23:59:59Z') : undefined;
            const afterStart = d.getTime() >= s.getTime();
            const beforeEnd = e ? d.getTime() <= e.getTime() : true;
            return afterStart && beforeEnd;
          });
          // skip contribution if beyond cutoff and not active anymore
          if (trackingCutoff && d.getTime() > trackingCutoff.getTime()) {
            return;
          }
          const seasonal = Math.sin(((i + 1) / diffDays) * Math.PI * 2) * 6;
          const weekly = ((i + 1) % 7) * 1.2;
          const baseActive = 14;
          const baseInactive = 4;
          dayClicks += Math.max(0, Math.round((isActive ? baseActive : baseInactive) + seasonal + weekly));
        });

        clicksData.push({ date: dayStr, clicks: dayClicks });
      }

      const totalClicks = clicksData.reduce((sum, d) => sum + d.clicks, 0);
      return {
        clicksData,
        totalClicks,
        uniqueVisitors: Math.round(totalClicks * 0.7),
        clickRate: '3.0%',
        avgDailyClicks: Math.round(totalClicks / diffDays)
      };
    } else {
      const url = userUrls.find(u => u.id === selectedUrl);
      if (!url) {
        return { clicksData: [], totalClicks: 0, uniqueVisitors: 0, clickRate: '0%', avgDailyClicks: 0 };
      }

      const periods = (url.statusPeriods && url.statusPeriods.length > 0)
        ? url.statusPeriods
        : [{ start: url.createdAt, end: url.expiredAt }];

      // Determine last active end and tracking cutoff (30 days after last end)
      const lastEnded = [...periods].reverse().find(p => !!p.end)?.end;
      const now = new Date();
      let trackingCutoff: Date | null = null;
      if (lastEnded) {
        const e = new Date(lastEnded + 'T00:00:00Z');
        const cut = new Date(e);
        cut.setDate(cut.getDate() + 30);
        trackingCutoff = cut;
      }

      // Window end is limited by tracking cutoff (if any), else today
      let windowEnd = now;
      if (trackingCutoff && trackingCutoff.getTime() < now.getTime()) {
        windowEnd = trackingCutoff;
      }
      // Window start honors selected period but not before createdAt
      const tentativeStart = isAllTime ? new Date(url.createdAt) : (() => { const d = new Date(windowEnd); d.setDate(windowEnd.getDate() - (days as number) + 1); return d; })();
      const windowStart = new Date(Math.max(tentativeStart.getTime(), new Date(url.createdAt).getTime()));

      const diffDays = Math.max(1, Math.ceil((windowEnd.getTime() - windowStart.getTime()) / (1000 * 60 * 60 * 24)) + 1);

      const data: { date: string; clicks: number; isActive: boolean; isExpired?: boolean }[] = [];
      const lastEndStr = lastEnded ? new Date(lastEnded + 'T00:00:00Z').toISOString().slice(0, 10) : (url.expiredAt ? new Date(url.expiredAt).toISOString().slice(0, 10) : undefined);

      for (let i = 0; i < diffDays; i++) {
        const d = new Date(windowStart);
        d.setDate(windowStart.getDate() + i);
        const dayStr = d.toISOString().slice(0, 10);

        // determine active on this day based on periods
        const isActive = periods.some(p => {
          const s = new Date(p.start + 'T00:00:00Z');
          const e = p.end ? new Date(p.end + 'T23:59:59Z') : undefined;
          const afterStart = d.getTime() >= s.getTime();
          const beforeEnd = e ? d.getTime() <= e.getTime() : true;
          return afterStart && beforeEnd;
        });

        const seasonal = Math.sin(((i + 1) / diffDays) * Math.PI * 2) * 10;
        const weekly = ((i + 1) % 7) * 1.5;
        const baseActive = 28;
        const baseInactive = 7;
        const clicks = Math.max(1, Math.round((isActive ? baseActive : baseInactive) + seasonal + weekly));

        data.push({
          date: dayStr,
          clicks,
          isActive,
          isExpired: lastEndStr ? dayStr === lastEndStr : false
        });
      }

      const totalClicks = data.reduce((sum, d) => sum + d.clicks, 0);
      const avgDailyClicks = Math.round(totalClicks / diffDays);

      // Build continuous colored segments (overlap the boundary point)
      return {
        clicksData: data,
        totalClicks,
        uniqueVisitors: Math.round(totalClicks * 0.75),
        clickRate: '2.6%',
        avgDailyClicks,
        expiredMarker: lastEndStr,
        inactiveAreas: (() => {
          const areas: { start: string; end: string }[] = [];
          if (data.length === 0) return areas;
          let inInactive = !data[0].isActive;
          let startIdx = inInactive ? 0 : -1;
          for (let i = 1; i < data.length; i++) {
            const inactive = !data[i].isActive;
            if (!inInactive && inactive) {
              inInactive = true;
              startIdx = i - 1; // include boundary day
            } else if (inInactive && !inactive) {
              inInactive = false;
              const start = data[startIdx].date;
              // Use the previous day's date as the end so ReferenceArea width is visible
              const end = data[i - 1].date;
              areas.push({ start, end });
            }
          }
          if (inInactive) {
            areas.push({ start: data[startIdx].date, end: data[data.length - 1].date });
          }
          return areas;
        })()
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
            <Button
              variant={selectedPeriod === 'allTime' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('allTime')}
            >
              All
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

        {/* Clicks Over Time - Full Width */}
        <Card className="p-6 mb-8 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Clicks Over Time</h3>
          <div className="overflow-x-auto">
            <div style={{ minWidth: Math.max((analyticsData.clicksData?.length || 0) * 40, 800) }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.clicksData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  {selectedUrl === 'all' ? (
                    <Tooltip labelFormatter={(value) => new Date(value as any).toLocaleDateString()} />
                  ) : (
                    <Tooltip 
                      labelFormatter={(value) => new Date(value as any).toLocaleDateString()}
                      content={({ active, payload, label }) => {
                        if (!active || !payload) return null;
                        const p = payload as any;
                        const point = (p[0] && p[0].payload) || {};
                        const isActive = !!point.isActive;
                        const isExpired = !!point.isExpired;
                        return (
                          <div className="rounded-md p-2 text-sm bg-gray-900 text-white shadow-lg">
                            <div className="font-medium mb-1">{new Date(label as any).toLocaleDateString()}</div>
                            <div>Clicks: <span className="font-semibold">{point.clicks}</span></div>
                            <div>Status: <span className="font-semibold" style={{ color: isExpired ? '#EF4444' : (isActive ? '#10B981' : '#3B82F6') }}>
                              {isExpired ? 'Expired' : (isActive ? 'Active' : 'Inactive')}
                            </span></div>
                          </div>
                        );
                      }}
                    />
                  )}
                  {selectedUrl === 'all' ? (
                    <Line type="monotone" dataKey="clicks" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6' }} connectNulls={true} />
                  ) : (
                    <>
                      {/* Inactive background shading */}
                      {(analyticsData.inactiveAreas || []).map((area: any, idx: number) => (
                        <ReferenceArea key={`ia-${idx}`} x1={area.start} x2={area.end} fill="#DBEAFE" fillOpacity={0.35} />
                      ))}
                      {/* Expiration dashed vertical line */}
                      {analyticsData.expiredMarker && (
                        <ReferenceLine x={analyticsData.expiredMarker} stroke="#EF4444" strokeDasharray="6 6" />
                      )}
                      {/* Single continuous line */}
                      <Line type="monotone" dataKey="clicks" stroke="#3B82F6" strokeWidth={3} dot={false} connectNulls={true} />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
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
          
          {/* Traffic Sources */}
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Traffic Sources</h3>
            <div className="overflow-x-auto">
              <div style={{ minWidth: 800 }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={referrerData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="clicks" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>

        {/* Geographic Data & Top URLs */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Geographic Data */}
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Countries</h3>
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
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
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
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
