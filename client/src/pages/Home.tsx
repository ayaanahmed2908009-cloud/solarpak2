import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import KeyStats from "@/components/KeyStats";

import CrisisSection from "@/components/CrisisSection";
import UnifiedImpactSection from "@/components/UnifiedImpactSection";
import FloatingTestimonials from "@/components/FloatingTestimonials";
import PakistanWeatherWidget from "@/components/PakistanWeatherWidget";

import EnhancedSolutionSection from "@/components/EnhancedSolutionSection";
import ProjectsSection from "@/components/ProjectsSection";
import CulturalDonationExperience from "@/components/CulturalDonationExperience";
import TestimonialsSection from "@/components/TestimonialsSection";
import TrustRoadmapSection from "@/components/TrustRoadmapSection";
import DonationSection from "@/components/DonationSection";
import MonthlyImpactSection from "@/components/MonthlyImpactSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import { SEOOptimizedContent, SEOFAQSection } from "@/components/SEOOptimizedContent";
import { SEOBlogContent, SEOLocationContent } from "@/components/SEOBlogContent";
import { useState, useEffect, useRef } from "react";
import { ChevronUp, Sun, Zap, Users, ThermometerSun, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  // State to control the visibility of the back-to-top button
  const [showBackToTop, setShowBackToTop] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Handle scroll event to show/hide back-to-top button
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <SEOOptimizedContent 
      title="SolarPak - Solar Energy Donations for Pakistan | Bringing Light to Families"
      description="Help Pakistani families access clean solar energy. Donate to install solar panels, provide 24/7 electricity, and transform lives in Pakistan. 8 families already empowered with sustainable energy solutions."
      keywords={["solar energy Pakistan", "solar panels donation", "Pakistan electricity crisis", "renewable energy charity", "sustainable energy Pakistan", "solar installation Pakistan", "clean energy donation"]}
    >
      <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden">
        <Navbar />
        <main ref={mainRef} className="relative w-full">
        {/* Mobile Hero - Original Design */}
        <section className="md:hidden snap-section">
          <HeroBanner />
        </section>

        {/* Desktop Split-Screen Hero Section - Enhanced */}
        <section className="hidden md:block relative h-screen w-full overflow-hidden">
          <div className="flex h-full">
            {/* Left Half - Enhanced Emotional Content */}
            <div className="w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center relative overflow-hidden">
              {/* Animated starfield background */}
              <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      opacity: Math.random() * 0.5 + 0.2
                    }}
                  />
                ))}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-400/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
              </div>
              
              <div className="relative z-10 text-center text-white max-w-2xl px-12">
                {/* Emotional hook */}
                <p className="text-amber-400 font-medium text-lg mb-4 animate-fade-in">
                  Every 3 seconds, a family loses power in Pakistan
                </p>
                
                <div className="mb-10">
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[0.95] tracking-tight">
                    <span className="block text-white opacity-90">Transform</span>
                    <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent font-black text-6xl md:text-8xl">
                      Darkness
                    </span>
                    <span className="block text-white opacity-90">Into Hope</span>
                  </h1>
                </div>
                
                <p className="text-xl mb-8 text-slate-200 leading-relaxed max-w-xl mx-auto font-light">
                  Join us in bringing sustainable solar energy to families who have lived without reliable electricity for generations.
                </p>
                
                {/* Impact counter */}
                <div className="grid grid-cols-3 gap-4 mb-10 max-w-md mx-auto">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-400">8</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Families</div>
                  </div>
                  <div className="text-center border-x border-slate-700">
                    <div className="text-3xl font-bold text-amber-400">35</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Lives Changed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-400">24/7</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Power Access</div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <Button 
                    size="lg"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-2xl shadow-amber-500/25 transform hover:scale-105 transition-all duration-300"
                    onClick={() => window.open('https://ko-fi.com/solarpak', '_blank')}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Sun className="h-5 w-5" />
                      Light Up a Home Today
                    </span>
                  </Button>
                  <button 
                    onClick={() => document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white border border-white/20 px-6 py-3 rounded-lg font-medium transition-all hover:border-white/40"
                  >
                    See Their Stories
                  </button>
                </div>
                
                
              </div>
            </div>
            
            {/* Right Half - Enhanced Emotional Visual */}
            <div className="w-1/2 bg-gradient-to-br from-amber-50 via-white to-orange-50 relative overflow-hidden">
              {/* Warm, hopeful background */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/30 via-transparent to-orange-100/30"></div>
              
              {/* Animated sun rays */}
              <div className="absolute -top-20 -right-20 w-96 h-96">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/40 to-orange-400/40 rounded-full blur-3xl animate-pulse"></div>
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-1 h-32 bg-gradient-to-t from-yellow-400/20 to-transparent origin-bottom"
                      style={{
                        transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
                        animation: `pulse 3s ease-in-out infinite ${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Floating Energy Icons */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Lightning bolts */}
                <div className="absolute top-1/4 left-1/4 text-yellow-500 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}>
                  <Zap className="h-6 w-6 opacity-60" />
                </div>
                <div className="absolute top-3/4 right-1/4 text-yellow-500 animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}}>
                  <Zap className="h-5 w-5 opacity-40" />
                </div>
                <div className="absolute top-1/2 left-1/6 text-yellow-500 animate-bounce" style={{animationDelay: '2s', animationDuration: '3s'}}>
                  <Zap className="h-4 w-4 opacity-50" />
                </div>
                
                {/* Energy particles */}
                <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
                <div className="absolute top-2/3 right-1/6 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '2.5s'}}></div>
              </div>

              {/* Geometric Patterns */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Hexagonal patterns */}
                <div className="absolute top-1/4 right-1/4 opacity-20">
                  <svg width="40" height="40" viewBox="0 0 40 40" className="animate-spin" style={{animationDuration: '20s'}}>
                    <polygon points="20,5 32,12.5 32,27.5 20,35 8,27.5 8,12.5" 
                             stroke="#10b981" strokeWidth="2" fill="none" />
                  </svg>
                </div>
                <div className="absolute bottom-1/4 left-1/6 opacity-15">
                  <svg width="30" height="30" viewBox="0 0 30 30" className="animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}>
                    <polygon points="15,3.75 24,9.375 24,20.625 15,26.25 6,20.625 6,9.375" 
                             stroke="#3b82f6" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
                
                {/* Circuit-like lines */}
                <div className="absolute top-1/2 left-1/8 w-16 h-0.5 bg-gradient-to-r from-green-400 to-transparent opacity-30 animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/8 w-12 h-0.5 bg-gradient-to-l from-blue-400 to-transparent opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>

              {/* Enhanced Light Rays & Particles */}
              <div className="absolute inset-0">
                {/* Moving light particles */}
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-300 rounded-full opacity-60"
                    style={{
                      top: `${20 + i * 10}%`,
                      left: `${10 + i * 15}%`,
                      animation: `float 4s ease-in-out infinite ${i * 0.5}s`
                    }}
                  ></div>
                ))}
              </div>

              {/* Simple House Illustrations */}
              <div className="absolute bottom-20 left-8 opacity-40">
                <div className="relative">
                  {/* House shape */}
                  <div className="w-8 h-6 bg-gray-600 relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-3 border-transparent border-b-gray-700"></div>
                    {/* Power indicator */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-20 right-12 opacity-30">
                <div className="relative">
                  {/* Another house */}
                  <div className="w-6 h-5 bg-gray-600 relative">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-b-2 border-transparent border-b-gray-700"></div>
                    {/* Power indicator */}
                    <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  </div>
                </div>
              </div>

              {/* Central emotional image/story */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative max-w-lg px-8">
                  {/* Story card */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-500">
                    <div className="mb-6">
                      {/* Visual representation of impact */}
                      <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden">
                        {/* Before/After split */}
                        <div className="absolute inset-0 flex">
                          <div className="w-1/2 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-gray-600 text-6xl mb-2">🌑</div>
                              <p className="text-gray-500 text-xs uppercase tracking-wider">Before</p>
                            </div>
                          </div>
                          <div className="w-1/2 bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-white text-6xl mb-2 animate-pulse">☀️</div>
                              <p className="text-white text-xs uppercase tracking-wider">After</p>
                            </div>
                          </div>
                        </div>
                        {/* Divider line */}
                        <div className="absolute inset-y-0 left-1/2 w-1 bg-white/30 backdrop-blur-sm transform -translate-x-1/2"></div>
                      </div>
                    </div>
                    
                    <blockquote className="relative">
                      <p className="text-gray-700 text-lg italic leading-relaxed mb-4">
                        "My children can now study after sunset. My daughter dreams of becoming a doctor. This light gave us more than electricity - it gave us hope."
                      </p>
                      <footer className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                          A
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Amina Malik</p>
                          <p className="text-sm text-gray-500">Mother of 3, Sindh Province</p>
                        </div>
                      </footer>
                    </blockquote>
                    
                    {/* Live impact counter */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Impact so far:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-amber-500">8</span>
                          <span className="text-sm text-gray-600">families empowered</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating elements around the card */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-orange-400 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* New Emotional Story Section */}
        <section id="stories" className="relative py-24 bg-gradient-to-b from-white to-amber-50/30 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <p className="text-amber-600 font-semibold text-sm uppercase tracking-wider mb-3">Real Stories, Real Impact</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Behind Every Solar Panel,
                <span className="block text-3xl md:text-4xl mt-2 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                  There's a Family's Dream
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These aren't just statistics. They're mothers, fathers, and children whose lives have been transformed by your generosity.
              </p>
            </div>

            {/* Story Cards Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Story 1 */}
              <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-700 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-2">👨‍👩‍👧‍👦</div>
                      <p className="text-white/80 text-sm">The Rahman Family</p>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                    Powered Since 2024
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-3">From Darkness to Dreams</h3>
                  <p className="text-gray-600 mb-4">
                    "Our bakery can now operate past sunset. We've doubled our income and my son returned to school."
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold text-gray-900">Karachi, Sindh</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Lives Changed</p>
                      <p className="font-semibold text-amber-600">5 family members</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story 2 */}
              <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="aspect-video bg-gradient-to-br from-indigo-900 to-purple-700 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-2">👩‍⚕️</div>
                      <p className="text-white/80 text-sm">Dr. Fatima's Clinic</p>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                    Powered Since 2024
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Healing in the Light</h3>
                  <p className="text-gray-600 mb-4">
                    "Now I can store vaccines and operate medical equipment. We're saving lives every day."
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold text-gray-900">Rural Punjab</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Community Impact</p>
                      <p className="font-semibold text-amber-600">200+ patients/month</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story 3 */}
              <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="aspect-video bg-gradient-to-br from-emerald-900 to-teal-700 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-2">📚</div>
                      <p className="text-white/80 text-sm">Village School</p>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                    Powered Since 2024
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Education Illuminated</h3>
                  <p className="text-gray-600 mb-4">
                    "45 children can now attend evening classes. Test scores improved by 60% with proper lighting."
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold text-gray-900">Balochistan</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Students Helped</p>
                      <p className="font-semibold text-amber-600">45 children</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4">Your Donation Can Write the Next Story</h3>
                <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                  Join us in bringing light to more families. Every contribution, no matter the size, creates lasting change.
                </p>
                <Button 
                  size="lg"
                  className="bg-white text-amber-600 hover:bg-gray-100 shadow-xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => window.open('https://ko-fi.com/solarpak', '_blank')}
                >
                  Be Part of Their Journey
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Crisis Section - Immediate impact after hero */}
        <section id="problem" className="snap-section">
          <CrisisSection />
        </section>
        

        
        {/* Impact Timeline Section */}
        <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-amber-600 font-semibold text-sm uppercase tracking-wider mb-3">The Journey of Change</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Every Donation Creates a
                <span className="block text-3xl md:text-4xl mt-2 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                  Ripple Effect of Hope
                </span>
              </h2>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-amber-400 to-orange-500"></div>
              
              {/* Timeline Items */}
              <div className="space-y-12">
                {/* Day 1 */}
                <div className="relative flex items-center justify-between">
                  <div className="w-5/12 text-right pr-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Day 1</h3>
                    <p className="text-gray-600">Your donation arrives. A family is selected based on urgent need.</p>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white border-4 border-amber-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="w-5/12 pl-8">
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                      <p className="text-sm font-semibold text-amber-800">Immediate Impact</p>
                      <p className="text-xs text-amber-600 mt-1">Hope is kindled</p>
                    </div>
                  </div>
                </div>

                {/* Week 1 */}
                <div className="relative flex items-center justify-between">
                  <div className="w-5/12 text-right pr-8">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-sm font-semibold text-blue-800">Installation Begins</p>
                      <p className="text-xs text-blue-600 mt-1">Professional setup starts</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white border-4 border-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="w-5/12 pl-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Week 1</h3>
                    <p className="text-gray-600">Solar panels arrive. Installation team visits the family.</p>
                  </div>
                </div>

                {/* Month 1 */}
                <div className="relative flex items-center justify-between">
                  <div className="w-5/12 text-right pr-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Month 1</h3>
                    <p className="text-gray-600">First full month with electricity. Children study at night for the first time.</p>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white border-4 border-green-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="w-5/12 pl-8">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-sm font-semibold text-green-800">Life Transformed</p>
                      <p className="text-xs text-green-600 mt-1">24/7 power achieved</p>
                    </div>
                  </div>
                </div>

                {/* Year 1 */}
                <div className="relative flex items-center justify-between">
                  <div className="w-5/12 text-right pr-8">
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <p className="text-sm font-semibold text-purple-800">Lasting Change</p>
                      <p className="text-xs text-purple-600 mt-1">Generation impact begins</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white border-4 border-purple-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  </div>
                  <div className="w-5/12 pl-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Year 1+</h3>
                    <p className="text-gray-600">Family income increases 40%. Children's education improves. Health outcomes better.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="solution" className="snap-section">
          <EnhancedSolutionSection />
        </section>
        

        {/* Unified Impact Section - Comprehensive impact showcase */}
        <section id="impact" className="snap-section">
          <UnifiedImpactSection />
        </section>
        
        <section id="projects" className="snap-section">
          <ProjectsSection />
        </section>
        
        {/* Cultural Donation Experience - Pakistani-focused giving */}
        <section className="snap-section">
          <CulturalDonationExperience />
        </section>
        
        <section id="testimonials" className="snap-section">
          <TestimonialsSection />
        </section>
        
        <section id="trust" className="snap-section">
          <TrustRoadmapSection />
        </section>
        
        <section id="donate" className="snap-section">
          <DonationSection />
        </section>
        
        <section id="monthly" className="snap-section">
          <MonthlyImpactSection />
        </section>
        
        <section id="newsletter" className="snap-section">
          <NewsletterSection />
        </section>
        
        <Footer />
      </main>
      
      {/* Back to top button with smooth animation */}
      <button 
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 bg-primary text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 ${
            showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
          aria-label="Back to top"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      </div>
      
      {/* SEO Content Sections */}
      <SEOFAQSection />
      <SEOBlogContent />
      <SEOLocationContent />
    </SEOOptimizedContent>
  );
}
