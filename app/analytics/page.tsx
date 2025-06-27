
'use client'

import React, { useState } from 'react';
import { BarChart3, TrendingUp, Globe, Clock, Users, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedUrl, setSelectedUrl] = useState('all');

  // Mock data
  const clicksData = [
    { date: '2024-01-14', clicks: 45 },
    { date: '2024-01-15', clicks: 52 },
    { date: '2024-01-16', clicks: 38 },
    { date: '2024-01-17', clicks: 67 },
    { date: '2024-01-18', clicks: 71 },
    { date: '2024-01-19', clicks: 59 },
    { date: '2024-01-20', clicks: 83 }
  ];

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

  const topUrls = [
    { url: 'tolink.co/abc123', clicks: 1247, change: 12 },
    { url: 'tolink.co/github1', clicks: 89, change: -5 },
    { url: 'tolink.co/docs42', clicks: 432, change: 8 }
  ];

  const stats = [
    { 
      label: 'Total Clicks', 
      value: '2,847', 
      change: '+12%', 
      trend: 'up',
      icon: <BarChart3 className="w-6 h-6" />
    },
    { 
      label: 'Unique Visitors', 
      value: '1,234', 
      change: '+8%', 
      trend: 'up',
      icon: <Users className="w-6 h-6" />
    },
    { 
      label: 'Click Rate', 
      value: '3.2%', 
      change: '-2%', 
      trend: 'down',
      icon: <TrendingUp className="w-6 h-6" />
    },
    { 
      label: 'Avg. Daily Clicks', 
      value: '407', 
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
            <p className="text-gray-600 dark:text-gray-300">Track your link performance and audience insights</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
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
              <LineChart data={clicksData}>
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performing URLs</h3>
            </div>
            <div className="space-y-4">
              {topUrls.map((url, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{url.url}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{url.clicks.toLocaleString()} clicks</p>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    url.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {url.change > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    {Math.abs(url.change)}%
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analytics;
