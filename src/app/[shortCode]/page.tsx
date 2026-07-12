'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PublicLinkMeta {
  shortCode: string;
  status: 'active' | 'password_required' | 'not_activated' | 'expired' | 'disabled';
  hasPassword: boolean;
  urlName?: string | null;
  activationAt?: string | null;
  expiresAt?: string | null;
}

interface ShortUrlData {
  shortCode: string;
  hasPassword: boolean;
  urlName?: string;
  activationAt?: string;
  expiresAt?: string;
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
    const code = Array.isArray(shortCode) ? shortCode[0] : shortCode;

    if (!code || code === 'undefined') {
      setError('Invalid short code');
      setIsLoading(false);
      return;
    }

    const fetchUrlData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await fetch(`${API_URL}/v1/links/${code}/public-meta`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          setError(response.status === 404 ? 'Link not found' : 'Failed to load link');
          setIsLoading(false);
          return;
        }

        const data: PublicLinkMeta = await response.json();
        const foundUrl: ShortUrlData = {
          shortCode: data.shortCode,
          hasPassword: data.hasPassword,
          urlName: data.urlName ?? undefined,
          activationAt: data.activationAt ?? undefined,
          expiresAt: data.expiresAt ?? undefined,
        };

        setUrlData(foundUrl);

        switch (data.status) {
          case 'active':
            if (data.hasPassword) {
              setShowPasswordForm(true);
              setIsLoading(false);
              return;
            }
            // Backend redirect tracks clicks and resolves the destination URL
            window.location.href = `${API_URL}/r/${code}`;
            return;

          case 'password_required':
            setShowPasswordForm(true);
            setIsLoading(false);
            return;

          case 'not_activated':
            setIsLoading(false);
            router.replace(
              `/not-activated?code=${encodeURIComponent(code)}${
                data.activationAt
                  ? `&at=${encodeURIComponent(data.activationAt)}`
                  : ''
              }`,
            );
            return;

          case 'expired':
            setIsLoading(false);
            router.replace(
              `/expired?code=${encodeURIComponent(code)}${
                data.expiresAt ? `&exp=${encodeURIComponent(data.expiresAt)}` : ''
              }`,
            );
            return;

          case 'disabled':
            setError('This link is currently disabled');
            setIsLoading(false);
            return;

          default: {
            const _exhaustive: never = data.status;
            throw new Error(`Unhandled link status: ${_exhaustive}`);
          }
        }
      } catch {
        setError('Failed to load link');
        setIsLoading(false);
      }
    };

    fetchUrlData();
  }, [shortCode, router]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast({
        title: 'Password Required',
        description: 'Please enter a password',
        variant: 'destructive',
      });
      return;
    }

    setIsPasswordLoading(true);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${API_URL}/v1/links/${shortCode}/access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.redirectUrl) {
        toast({
          title: "Access Granted",
          description: "Redirecting to the original URL...",
        });
        // Use the redirectUrl returned by the backend (includes redirect token)
        window.location.href = `${API_URL}${data.redirectUrl}`;
      } else {
        toast({
          title: "Incorrect Password",
          description: data.message || "Please enter the correct password",
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
          
        </Card>
      </div>
    );
  }

  return null;
} 