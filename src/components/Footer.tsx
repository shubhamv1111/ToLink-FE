import React from 'react';
import { Link2, Twitter, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Link2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">ToLink</span>
            </div>
            <p className="text-gray-400">
              The fastest and most reliable URL shortener. Create short links, track clicks, and boost your online presence.
            </p>
            <div className="flex gap-4">
              <Link href="/coming-soon" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="/coming-soon" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="/coming-soon" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-400 hover:text-white transition-colors">Home</Link>
              <Link href="/dashboard" className="block text-gray-400 hover:text-white transition-colors">Dashboard</Link>
              <Link href="/analytics" className="block text-gray-400 hover:text-white transition-colors">Analytics</Link>
              <Link href="/coming-soon" className="block text-gray-400 hover:text-white transition-colors">API</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">Contact</Link>
              <Link href="/coming-soon" className="block text-gray-400 hover:text-white transition-colors">Blog</Link>
              <Link href="/coming-soon" className="block text-gray-400 hover:text-white transition-colors">Careers</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              <Link href="/coming-soon" className="block text-gray-400 hover:text-white transition-colors">Help Center</Link>
              <Link href="/coming-soon" className="block text-gray-400 hover:text-white transition-colors">Terms</Link>
              <Link href="/coming-soon" className="block text-gray-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="/coming-soon" className="block text-gray-400 hover:text-white transition-colors">Status</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
          <p>&copy; 2025 ToLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
