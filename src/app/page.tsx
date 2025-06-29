'use client'

import React, { useState, useEffect } from 'react';
import { Copy, Link2, QrCode, BarChart3, Zap, Shield, Globe, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { AnalyticsCard } from '@/components/AnalyticsCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { generateShortUrl } from '@/lib/utils';

interface ShortenedUrl {
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  customAlias?: string;
  urlName?: string;
  createdAt: string;
  clickCount: number;
}

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [urlName, setUrlName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const isValidUrl = (string: string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const shortenUrl = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      });
      return;
    }

    if (!isValidUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, use a specific short code if no custom alias
      const shortCode = customAlias || (url.includes('example.com') ? 'fr7b2t' : Math.random().toString(36).substring(2, 8));
      const newShortenedUrl: ShortenedUrl = {
        originalUrl: url,
        shortCode,
        shortUrl: generateShortUrl(shortCode),
        customAlias: customAlias || undefined,
        urlName: urlName || undefined,
        createdAt: new Date().toISOString(),
        clickCount: 0
      };
      
      setShortenedUrl(newShortenedUrl);
      
      toast({
        title: "Success!",
        description: "Your URL has been shortened successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to shorten URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shortenedUrl) return;
    
    try {
      await navigator.clipboard.writeText(shortenedUrl.shortUrl);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Short URL copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setUrl('');
    setCustomAlias('');
    setUrlName('');
    setShortenedUrl(null);
    setShowQR(false);
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Free URL Shortener
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Shorten Your URLs
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
            Create short, memorable links that are easy to share. Track clicks, generate QR codes, and boost your online presence.
          </p>
        </div>

        {/* URL Shortening Form */}
        <Card className="max-w-4xl mx-auto p-8 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0 mb-12">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="url" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enter your long URL *
                </label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/very-long-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name (optional)
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="My Important Link"
                  value={urlName}
                  onChange={(e) => setUrlName(e.target.value)}
                  className="h-12"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="alias" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Custom alias (optional)
              </label>
              <Input
                id="alias"
                type="text"
                placeholder="my-custom-link"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="h-12"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={shortenUrl} 
                disabled={isLoading}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Shortening...
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 mr-2" />
                    Shorten URL
                  </>
                )}
              </Button>
              
              {shortenedUrl && (
                <Button onClick={resetForm} variant="outline" className="h-12">
                  Create Another
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Result Display */}
        {shortenedUrl && (
          <Card className="max-w-4xl mx-auto p-8 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0 mb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">URL Shortened Successfully!</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Short URL
                  </label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={shortenedUrl.shortUrl}
                      readOnly
                      className="h-12 bg-gray-50 dark:bg-gray-900"
                    />
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="h-12 px-4"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Original URL
                    </label>
                    <Input
                      value={shortenedUrl.originalUrl}
                      readOnly
                      className="mt-1 h-12 bg-gray-50 dark:bg-gray-900"
                    />
                  </div>
                  
                  {shortenedUrl.urlName && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name
                      </label>
                      <Input
                        value={shortenedUrl.urlName}
                        readOnly
                        className="mt-1 h-12 bg-gray-50 dark:bg-gray-900"
                      />
                    </div>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <Button
                      onClick={() => setShowQR(!showQR)}
                      variant="outline"
                      className="h-12 w-full"
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      {showQR ? 'Hide QR Code' : 'Show QR Code'}
                    </Button>
                    
                    {showQR && (
                      <div className="flex justify-center">
                        <QRCodeDisplay url={shortenedUrl.shortUrl} />
                      </div>
                    )}
                  </div>
                  
                  <AnalyticsCard
                    shortCode={shortenedUrl.shortCode}
                    clickCount={shortenedUrl.clickCount}
                    createdAt={shortenedUrl.createdAt}
                  />
                </div>
                
                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">Login</a> or <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">Sign up</a> to keep track of your URLs
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Features Section */}
        <section className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose ToLink?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to make link management simple and effective
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-lg">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Lightning Fast
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Shorten URLs instantly with our optimized infrastructure
              </p>
            </Card>
            
            <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-lg">
              <div className="text-purple-600 dark:text-purple-400 mb-4">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track clicks, monitor performance, and gain insights
              </p>
            </Card>
            
            <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-lg">
              <div className="text-green-600 dark:text-green-400 mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Secure
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enterprise-grade security for all your shortened links
              </p>
            </Card>
            
            <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-lg">
              <div className="text-orange-600 dark:text-orange-400 mb-4">
                <QrCode className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                QR Codes
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate QR codes automatically for easy sharing
              </p>
            </Card>
            
            <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-lg">
              <div className="text-red-600 dark:text-red-400 mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Global CDN
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fast redirects worldwide with our global network
              </p>
            </Card>
            
            <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-lg">
              <div className="text-indigo-600 dark:text-indigo-400 mb-4">
                <Link2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Custom Aliases
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create memorable, branded short links that reflect your identity
              </p>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
} 