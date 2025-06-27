
'use client'

import React from 'react';
import { 
  Zap, 
  Shield, 
  BarChart3, 
  QrCode, 
  Lock, 
  Globe, 
  Clock, 
  Users, 
  Download,
  Eye,
  Link2,
  Smartphone
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const Features = () => {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      title: "Lightning Fast",
      description: "Shorten URLs instantly with our optimized platform. Get your links ready in milliseconds.",
      category: "Performance"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Enterprise Security",
      description: "Your links are protected with enterprise-grade security and SSL encryption.",
      category: "Security"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: "Advanced Analytics",
      description: "Track clicks, analyze traffic sources, and understand your audience with detailed insights.",
      category: "Analytics"
    },
    {
      icon: <QrCode className="w-8 h-8 text-indigo-600" />,
      title: "QR Code Generation",
      description: "Automatically generate QR codes for all your shortened links for easy mobile sharing.",
      category: "Tools"
    },
    {
      icon: <Lock className="w-8 h-8 text-red-600" />,
      title: "Password Protection",
      description: "Secure your links with passwords to control who can access your content.",
      category: "Security"
    },
    {
      icon: <Globe className="w-8 h-8 text-cyan-600" />,
      title: "Global CDN",
      description: "Fast redirects worldwide with our global content delivery network.",
      category: "Performance"
    },
    {
      icon: <Clock className="w-8 h-8 text-orange-600" />,
      title: "Link Expiration",
      description: "Set expiration dates for your links to automatically disable them after a certain time.",
      category: "Management"
    },
    {
      icon: <Users className="w-8 h-8 text-pink-600" />,
      title: "Team Collaboration",
      description: "Share and manage links with your team members with role-based access control.",
      category: "Collaboration"
    },
    {
      icon: <Download className="w-8 h-8 text-teal-600" />,
      title: "Bulk Operations",
      description: "Upload CSV files to create multiple short links at once and export your data.",
      category: "Tools"
    },
    {
      icon: <Eye className="w-8 h-8 text-yellow-600" />,
      title: "Private Links",
      description: "Create private links that are hidden from public analytics and search engines.",
      category: "Privacy"
    },
    {
      icon: <Link2 className="w-8 h-8 text-slate-600" />,
      title: "Custom Aliases",
      description: "Create memorable custom aliases for your links instead of random characters.",
      category: "Customization"
    },
    {
      icon: <Smartphone className="w-8 h-8 text-emerald-600" />,
      title: "Mobile Optimized",
      description: "Fully responsive design that works perfectly on all devices and screen sizes.",
      category: "Accessibility"
    }
  ];

  const categories = ['All', 'Performance', 'Security', 'Analytics', 'Tools', 'Management', 'Collaboration', 'Privacy', 'Customization', 'Accessibility'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredFeatures = selectedCategory === 'All' 
    ? features 
    : features.filter(feature => feature.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Powerful Features
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Everything You Need
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
            Discover all the powerful features that make ToLink the ultimate URL shortening platform for individuals and businesses.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="text-sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredFeatures.map((feature, index) => (
            <Card key={index} className="p-8 text-center backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {feature.description}
              </p>
              <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                {feature.category}
              </span>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-4xl mx-auto p-12 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust ToLink for their URL shortening needs. 
              Start creating powerful short links today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Start Shortening URLs
              </Button>
              <Button variant="outline" size="lg">
                View Pricing
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Features;
