
'use client'

import React from 'react';
import { Link2, Target, Shield, Zap, Users, Globe, Award, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const About = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Create short links in milliseconds with our optimized infrastructure"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security measures"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Detailed Analytics",
      description: "Track clicks, locations, and user behavior with comprehensive analytics"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global CDN",
      description: "Fast redirects worldwide with our distributed network"
    }
  ];

  const stats = [
    { number: "1M+", label: "Links Created" },
    { number: "50M+", label: "Clicks Tracked" },
    { number: "10K+", label: "Happy Users" },
    { number: "99.9%", label: "Uptime" }
  ];

  const team = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      description: "Serial entrepreneur with 10+ years in tech"
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      description: "Former Google engineer, expert in scalable systems"
    },
    {
      name: "Mike Rodriguez",
      role: "Lead Designer",
      description: "Award-winning designer focused on user experience"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            About ToLink
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Making the Web More Accessible
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We're on a mission to simplify URL sharing and make the internet more connected. 
            ToLink transforms long, complex URLs into short, memorable links that are easy to share and track.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="max-w-4xl mx-auto p-8 mb-20 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              To democratize URL shortening by providing a fast, secure, and user-friendly platform 
              that empowers individuals and businesses to share links more effectively while gaining 
              valuable insights into their audience.
            </p>
          </div>
        </Card>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Why Choose ToLink?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-0 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Meet the Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="p-6 text-center backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-0 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300">{member.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Company Values */}
        <Card className="max-w-4xl mx-auto p-8 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Award className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Excellence</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">We strive for perfection in everything we do</p>
            </div>
            <div className="text-center">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Trust</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Your privacy and security are our top priorities</p>
            </div>
            <div className="text-center">
              <Heart className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Community</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">We believe in building meaningful connections</p>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default About;
