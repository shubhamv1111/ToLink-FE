'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShortUrlData {
  originalUrl: string;
  shortCode: string;
  isPrivate: boolean;
  hasPassword: boolean;
  urlName?: string;
}

export default function ShortCodeRedirect() {
  const { shortCode } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [urlData, setUrlData] = useState<ShortUrlData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState('');
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  useEffect(() => {
    if (!shortCode) {
      setError('Invalid short code');
      setIsLoading(false);
      return;
    }

    // Simulate API call to fetch URL data
    const fetchUrlData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - in real app, this would be an API call
        const mockUrls = [
          {
            shortCode: 'fr7b2t',
            originalUrl: 'https://example.com/very-long-url-that-needs-shortening',
            isPrivate: false,
            hasPassword: false,
            urlName: 'Example Link'
          },
          {
            shortCode: 'abc123',
            originalUrl: 'https://github.com/username/repository',
            isPrivate: false,
            hasPassword: false,
            urlName: 'GitHub Repository'
          },
          {
            shortCode: 'docs42',
            originalUrl: 'https://docs.google.com/document/d/1234567890/edit',
            isPrivate: false,
            hasPassword: true,
            urlName: 'Protected Document'
          }
        ];

        const foundUrl = mockUrls.find(url => url.shortCode === shortCode);
        
        if (!foundUrl) {
          setError('Link not found');
          setIsLoading(false);
          return;
        }

        setUrlData(foundUrl);
        
        // If URL has password protection, show password form
        if (foundUrl.hasPassword) {
          setShowPasswordForm(true);
          setIsLoading(false);
          return;
        }

        // If URL is private, check authentication
        if (foundUrl.isPrivate) {
          // In real app, check if user is authenticated
          setError('This link is private and requires authentication');
          setIsLoading(false);
          return;
        }

        // Redirect to original URL
        redirectToOriginalUrl(foundUrl.originalUrl);
        
      } catch (error) {
        setError('Failed to load link');
        setIsLoading(false);
      }
    };

    fetchUrlData();
  }, [shortCode]);

  const redirectToOriginalUrl = (url: string) => {
    // Track the click (in real app, this would be an API call)
    console.log(`Redirecting to: ${url}`);
    
    // Redirect to original URL
    window.location.href = url;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordLoading(true);
    
    try {
      // Simulate password verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (password === 'demo123') {
        toast({
          title: "Access Granted",
          description: "Redirecting to the original URL...",
        });
        
        if (urlData) {
          redirectToOriginalUrl(urlData.originalUrl);
        }
      } else {
        toast({
          title: "Incorrect Password",
          description: "Please enter the correct password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify password",
        variant: "destructive",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const goHome = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="p-8 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading Link...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Redirecting you to the destination
          </p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="p-8 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Link Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error}
          </p>
          <Button onClick={goHome} className="w-full">
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  if (showPasswordForm && urlData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="p-8 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0 max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Password Required
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              This link is password protected
            </p>
            {urlData.urlName && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {urlData.urlName}
              </p>
            )}
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Enter Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter password"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={isPasswordLoading}
              className="w-full"
            >
              {isPasswordLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                'Access Link'
              )}
            </Button>
          </form>
          
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              <strong>For demo purposes:</strong> Use password "demo123"
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return null;
} 