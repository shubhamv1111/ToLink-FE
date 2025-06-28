'use client'

import React from 'react';
import { Construction, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Construction className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-yellow-900">🚧</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Coming Soon
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            We're working hard to bring you something amazing!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This feature is currently under development. We'll notify you as soon as it's ready.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Development Progress</span>
            <span>75%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full w-3/4 animate-pulse"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t dark:border-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Stay tuned for updates! Follow us on social media for the latest news.
          </p>
        </div>
      </div>
    </div>
  );
} 