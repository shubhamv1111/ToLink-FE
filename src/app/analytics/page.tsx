'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, Globe, Clock, Users, Calendar, ArrowUp, ArrowDown, Link2, Filter, ChevronLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ReferenceArea, ReferenceLine } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { analyticsApi, linksApi } from '@/lib/api';

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

  type ClickPoint = { date: string; clicks: number };
  const [clicksPerUrl, setClicksPerUrl] = useState<Record<string, ClickPoint[]>>({});
  const [statsMeta, setStatsMeta] = useState<any | null>(null);

  const [userUrls, setUserUrls] = useState<UrlData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) return;
      
      try {
        setIsLoading(true);
        
        // Load user links
        const linksResponse = await linksApi.getList({ limit: 100 });
        const mapped: UrlData[] = linksResponse.items.map((link) => ({
          id: link.id,
          originalUrl: link.originalUrl,
          shortCode: link.shortCode,
          shortUrl: link.shortUrl,
          clicks: link.clicks,
          createdAt: link.createdAt,
          lastClicked: link.lastClicked,
          expiredAt: link.expiresAt,
          statusPeriods: [],
          isPrivate: link.isPrivate,
          hasPassword: link.hasPassword,
        }));
        setUserUrls(mapped);
        
        // Load clicks per URL data
        const range = selectedPeriod === '7days' ? '7d' : selectedPeriod === '30days' ? '30d' : '90d';
        const clicksData = await analyticsApi.getClicksPerUrl(range);
        setClicksPerUrl(clicksData.perUrl || {});
        
        // Load analytics metadata
        const overview = await analyticsApi.getOverview({ scope: 'user', range });
        setStatsMeta(overview);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [isAuthenticated, selectedPeriod]);

  const getSeriesForUrl = (urlId: string): ClickPoint[] => {
    const series = clicksPerUrl[urlId] || [];
    return [...series].sort((a, b) => a.date.localeCompare(b.date));
  };

  const getWindowedSeries = (series: ClickPoint[], days?: number): ClickPoint[] => {
    if (!series.length) return [];
    if (!days) return series;
    // select last N days by date
    return series.slice(-days);
  };

  const normalizeDateStr = (s: string): string => new Date(s + 'T00:00:00Z').toISOString().slice(0, 10);

  const isDayActiveForUrl = (dayStr: string, url?: UrlData): boolean => {
    if (!url) return false;
    const enabled = (url as any).enabled !== false;
    if (!enabled) return false;
    const day = new Date(dayStr + 'T12:00:00Z');
    const periods = (url.statusPeriods && url.statusPeriods.length > 0)
      ? url.statusPeriods
      : [{ start: url.createdAt, end: url.expiredAt }];
    return periods.some(p => {
      const s = new Date(p.start + 'T00:00:00Z');
      const e = p.end ? new Date(p.end + 'T23:59:59Z') : undefined;
      const afterStart = day.getTime() >= s.getTime();
      const beforeEnd = e ? day.getTime() <= e.getTime() : true;
      return afterStart && beforeEnd;
    });
  };

  const getLastEndedDate = (url?: UrlData): string | undefined => {
    if (!url) return undefined;
    const end = url.statusPeriods && [...url.statusPeriods].reverse().find(p => !!p.end)?.end;
    return end || url.expiredAt || undefined;
  };

  const hasFutureActivation = (url?: UrlData): boolean => {
    if (!url || !url.statusPeriods || url.statusPeriods.length === 0) return false;
    const today = new Date();
    return url.statusPeriods.some(p => new Date(p.start + 'T00:00:00Z').getTime() > today.getTime());
  };

  const getInactiveAreas = (series: ClickPoint[], url?: UrlData) => {
    if (!url || !series.length) return [] as { start: string; end: string }[];
    const periods = (url.statusPeriods && url.statusPeriods.length > 0)
      ? url.statusPeriods
      : [{ start: url.createdAt, end: url.expiredAt }];
    const data = series.map((p) => {
      const d = new Date(p.date + 'T00:00:00Z');
      const isActive = periods.some(per => {
        const s = new Date(per.start + 'T00:00:00Z');
        const e = per.end ? new Date(per.end + 'T23:59:59Z') : undefined;
        const afterStart = d.getTime() >= s.getTime();
        const beforeEnd = e ? d.getTime() <= e.getTime() : true;
        return afterStart && beforeEnd;
      });
      return { ...p, isActive } as any;
    });
    const areas: { start: string; end: string }[] = [];
    let inInactive = data.length > 0 ? !data[0].isActive : false;
    let startIdx = inInactive ? 0 : -1;
    for (let i = 1; i < data.length; i++) {
      const inactive = !data[i].isActive;
      if (!inInactive && inactive) {
        inInactive = true;
        startIdx = i - 1;
      } else if (inInactive && !inactive) {
        inInactive = false;
        const start = data[startIdx].date;
        const end = data[i - 1].date;
        areas.push({ start, end });
      }
    }
    if (inInactive) {
      areas.push({ start: data[startIdx].date, end: data[data.length - 1].date });
    }
    return areas;
  };

  const analyticsData = useMemo(() => {
    const isAllTime = selectedPeriod === 'allTime';
    const days = selectedPeriod === '7days' ? 7 : selectedPeriod === '30days' ? 30 : selectedPeriod === '90days' ? 90 : undefined;

    if (selectedUrl === 'all') {
      // Merge all URL series by date and sum clicks, enforcing per-link 30-day inactive cutoff
      const allIds = userUrls.map(u => u.id);
      const allPoints: Record<string, number> = {};
      let allDates: string[] = [];
      for (const id of allIds) {
        const url = userUrls.find(u => u.id === id);
        if (!url) continue;
        let series = getSeriesForUrl(id);
        // Apply selected window
        if (!isAllTime && days) {
          series = getWindowedSeries(series, days);
        }
        // Apply per-link 30-day cutoff after last inactive end unless future activation exists
        const lastEnded = getLastEndedDate(url);
        if (lastEnded && !hasFutureActivation(url)) {
          const cut = new Date(lastEnded + 'T00:00:00Z');
          cut.setDate(cut.getDate() + 30);
          const cutoffStr = cut.toISOString().slice(0, 10);
          series = series.filter(p => p.date <= cutoffStr);
        }
        // Cap series to last 100 days
        if (series.length > 100) {
          series = series.slice(-100);
        }
        for (const p of series) {
          allPoints[p.date] = (allPoints[p.date] || 0) + (p.clicks || 0);
        }
      }
      allDates = Object.keys(allPoints).sort();
      let merged = allDates.map(d => ({ date: d, clicks: allPoints[d] }));
      if (!isAllTime && days) {
        merged = merged.slice(-days);
      }
      // Cap to last 100 days for display
      if (merged.length > 100) {
        merged = merged.slice(-100);
      }
      const totalClicks = merged.reduce((s, p) => s + p.clicks, 0);
      const avgDailyClicks = merged.length ? Math.round(totalClicks / merged.length) : 0;
      return {
        clicksData: merged,
        totalClicks,
        uniqueVisitors: Math.round(totalClicks * (statsMeta?.uniqueVisitorsRatio ?? 0.7)),
        clickRate: statsMeta?.clickRate ?? '3.0%',
        avgDailyClicks
      };
    } else {
      const url = userUrls.find(u => u.id === selectedUrl);
      if (!url) {
        return { clicksData: [], totalClicks: 0, uniqueVisitors: 0, clickRate: '0%', avgDailyClicks: 0 } as any;
      }
      let series = getSeriesForUrl(url.id);
      if (!isAllTime && days) {
        series = getWindowedSeries(series, days);
      }
      // Enforce 30-day tracking cutoff after last inactive period end, unless a future activation is scheduled
      const lastEnded = getLastEndedDate(url);
      if (lastEnded && !hasFutureActivation(url)) {
        const cut = new Date(lastEnded + 'T00:00:00Z');
        cut.setDate(cut.getDate() + 30);
        const cutoffStr = cut.toISOString().slice(0, 10);
        series = series.filter(p => p.date <= cutoffStr);
      }
      // Cap to last 100 days for display
      if (series.length > 100) {
        series = series.slice(-100);
      }
      const totalClicks = series.reduce((s, p) => s + p.clicks, 0);
      const avgDailyClicks = series.length ? Math.round(totalClicks / series.length) : 0;
      const expiredMarker = lastEnded ? new Date(lastEnded + 'T00:00:00Z').toISOString().slice(0, 10) : (url.expiredAt ? new Date(url.expiredAt).toISOString().slice(0, 10) : undefined);
      const enriched = series.map(p => ({
        ...p,
        isActive: isDayActiveForUrl(p.date, url),
        isExpired: expiredMarker ? p.date === expiredMarker : false
      }));
      return {
        clicksData: enriched,
        totalClicks,
        uniqueVisitors: Math.round(totalClicks * (statsMeta?.uniqueVisitorsRatio ?? 0.75)),
        clickRate: statsMeta?.clickRate ?? '2.6%',
        avgDailyClicks,
        expiredMarker,
        inactiveAreas: getInactiveAreas(series, url)
      } as any;
    }
  }, [selectedPeriod, selectedUrl, userUrls, clicksPerUrl, statsMeta]);

  const getChangePercentForUrl = (urlId: string): number => {
    const series = getSeriesForUrl(urlId);
    if (series.length < 14) return 0;
    const last7 = series.slice(-7).reduce((s, p) => s + p.clicks, 0);
    const prev7 = series.slice(-14, -7).reduce((s, p) => s + p.clicks, 0);
    if (prev7 === 0) return last7 > 0 ? 100 : 0;
    const diff = last7 - prev7;
    return Math.round((diff / prev7) * 100);
  };

  // analyticsData now computed via useMemo above

  const [deviceData, setDeviceData] = useState<any[]>([]);

  type CityData = { city: string; clicks: number };
  type CountryData = { country: string; clicks: number; percentage: number; cities: CityData[] };

  const [countryData, setCountryData] = useState<CountryData[]>([]);

  const [activeCountry, setActiveCountry] = useState<CountryData | null>(null);
  const getCityBarWidth = (country: CountryData | null, clicks: number) => {
    if (!country || !country.cities || country.cities.length === 0) return '0%';
    const maxClicks = country.cities.reduce((m, c) => Math.max(m, c.clicks), 1);
    const pct = Math.round((clicks / Math.max(1, maxClicks)) * 100);
    return `${Math.min(100, pct)}%`;
  };

  const [referrerData, setReferrerData] = useState<any[]>([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await fetch('/data/analytics.json');
        const data = await res.json();
        setDeviceData(data.deviceBreakdown || []);
        setReferrerData(data.referrers || []);
        setCountryData(data.countries || []);
      } catch (e) {
        // noop
      }
    };
    loadAnalytics();
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch('/data/analytics.json');
        const data = await res.json();
        setStatsMeta(data.stats || null);
      } catch (e) {
        // noop
      }
    };
    loadStats();
  }, []);

  const stats = [
    { 
      label: 'Total Clicks', 
      value: analyticsData.totalClicks.toLocaleString(), 
      change: statsMeta?.changes?.totalClicks ?? '+0%', 
      trend: statsMeta?.changes?.totalClicksTrend ?? 'up',
      icon: <BarChart3 className="w-6 h-6" />
    },
    { 
      label: 'Unique Visitors', 
      value: analyticsData.uniqueVisitors.toLocaleString(), 
      change: statsMeta?.changes?.uniqueVisitors ?? '+0%', 
      trend: statsMeta?.changes?.uniqueVisitorsTrend ?? 'up',
      icon: <Users className="w-6 h-6" />
    },
    { 
      label: 'Click Rate', 
      value: statsMeta?.clickRate ?? analyticsData.clickRate, 
      change: statsMeta?.changes?.clickRate ?? '+0%', 
      trend: statsMeta?.changes?.clickRateTrend ?? 'up',
      icon: <TrendingUp className="w-6 h-6" />
    },
    { 
      label: 'Avg. Daily Clicks', 
      value: analyticsData.avgDailyClicks.toLocaleString(), 
      change: statsMeta?.changes?.avgDailyClicks ?? '+0%', 
      trend: statsMeta?.changes?.avgDailyClicksTrend ?? 'up',
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
                    <Line type="monotone" dataKey="clicks" stroke="#3B82F6" strokeWidth={3} dot={false} connectNulls={true} />
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
            {!activeCountry ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Countries and Regions</h3>
                </div>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {countryData.map((country) => (
                    <button
                      key={country.country}
                      type="button"
                      onClick={() => setActiveCountry(country)}
                      className="w-full flex items-center justify-between"
                    >
                      <div className="flex-1 pr-3">
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
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-3 items-center mb-4">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setActiveCountry(null)}
                      className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                  </div>
                  <div className="flex items-center justify-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                      {activeCountry.country}
                    </h3>
                  </div>
                  <div className="flex items-center justify-end">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{activeCountry.clicks} total clicks</span>
                  </div>
                </div>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {activeCountry.cities.map((city) => (
                    <div key={city.city} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{city.city}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">{city.clicks} clicks</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: getCityBarWidth(activeCountry, city.clicks) }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
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
                        {(() => {
                          const pct = getChangePercentForUrl(url.id);
                          const positive = pct >= 0;
                          return (
                            <div className={`${positive ? 'text-green-600' : 'text-red-600'} text-sm font-medium`}>
                              {positive ? '+' : ''}{pct}%
                            </div>
                          );
                        })()}
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
