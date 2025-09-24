import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import KeyStats from "@/components/KeyStats";

import CrisisSection from "@/components/CrisisSection";
import UnifiedImpactSection from "@/components/UnifiedImpactSection";
import FloatingTestimonials from "@/components/FloatingTestimonials";
import PakistanWeatherWidget from "@/components/PakistanWeatherWidget";

import EnhancedSolutionSection from "@/components/EnhancedSolutionSection";
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
import videoBackground from "@assets/Solarpak preview website_-VEED_1756655158911.mp4";

export default function Home() {
  // State to control the visibility of the back-to-top button
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [connectionSpeed, setConnectionSpeed] = useState<string>('4g');
  const mainRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    
    // Detect connection speed
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection && connection.effectiveType) {
        setConnectionSpeed(connection.effectiveType);
      }
    }

    // Intersection observer for lazy loading video
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Start loading video after a small delay and if connection is decent
          const delay = connectionSpeed === 'slow-2g' || connectionSpeed === '2g' ? 2000 : 1000;
          setTimeout(() => {
            setShouldLoadVideo(true);
          }, delay);
        }
      },
      {
        threshold: 0.25,
        rootMargin: '100px'
      }
    );

    // Observe hero section when it's mounted
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    // User interaction triggers immediate video load (progressive enhancement)
    const handleUserInteraction = () => {
      setShouldLoadVideo(true);
      // Remove listeners after first interaction
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };

    // Add interaction listeners
    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('scroll', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [connectionSpeed]);



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
        {/* Hybrid Hero Section - Static Image → Video Progressive Enhancement */}
        <section ref={heroRef} className="relative w-full overflow-hidden h-screen">
          
          {/* Static Background (Instant Load) */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
            {/* Animated background pattern for immediate visual appeal */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-600/20 to-blue-600/20 animate-pulse"></div>
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '6s' }}></div>
              <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
            </div>
          </div>

          {/* Progressive Video Enhancement */}
          {shouldLoadVideo && (
            <div className="absolute inset-0 z-0">
              <video 
                ref={videoRef}
                autoPlay 
                muted 
                loop 
                playsInline
                preload="none"
                className={`w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                src={videoBackground}
                poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23374151;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23111827;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1' height='1' fill='url(%23grad)' /%3E%3C/svg%3E"
                disablePictureInPicture
                disableRemotePlayback
                controlsList="nodownload nofullscreen noremoteplayback"
                onError={(e) => {
                  console.error('Video failed to load:', e);
                  // Keep static background if video fails
                }}
                onLoadStart={() => {
                  console.log('Video loading initiated');
                }}
                onCanPlay={(e) => {
                  console.log('Video ready to play');
                  setVideoLoaded(true);
                  const video = e.target as HTMLVideoElement;
                  video.play().catch(err => console.log('Autoplay prevented:', err));
                }}
                onLoadedData={() => {
                  console.log('Video data loaded');
                }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          
          {/* Light tint for text readability - always visible */}
          <div className="absolute inset-0 bg-blue-900/30 z-10"></div>

          {/* Clean Text Overlay */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white max-w-5xl px-4 sm:px-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-[1.1] tracking-tight">
                <span className="block mb-3 font-bold text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>Powering Communities.</span>
                <span className="block text-amber-400 font-bold" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                  Lighting Futures.
                </span>
              </h1>
              
              <div className="text-lg sm:text-xl md:text-2xl leading-relaxed mb-6 sm:mb-8 max-w-4xl mx-auto space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <p className="px-2 sm:px-0 text-white font-medium leading-relaxed" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>At SolarPak, we bring clean, affordable solar energy to families and communities across Pakistan.</p>
                  <p className="px-2 sm:px-0 text-white/95 font-medium leading-relaxed" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>Every panel installed means more light for homes, more opportunity for children, and a brighter, sustainable tomorrow.</p>
                </div>
                
                <div className="mt-4 sm:mt-6">
                  <p className="text-amber-300 font-medium text-xl sm:text-2xl md:text-3xl px-2 sm:px-0 leading-tight">Join us in turning sunlight into hope.</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                <button 
                  onClick={() => window.open('https://ko-fi.com/solarpak', '_blank')}
                  className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-bold py-4 sm:py-5 px-8 sm:px-10 rounded-lg text-base sm:text-lg transition-all duration-300 w-full sm:w-auto max-w-xs sm:max-w-none shadow-lg"
                >
                  Donate Now
                </button>
                <button 
                  onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-transparent hover:bg-white/10 text-white font-medium py-4 sm:py-5 px-8 sm:px-10 rounded-lg text-base sm:text-lg transition-colors duration-300 w-full sm:w-auto max-w-xs sm:max-w-none border border-white/40 hover:border-white/60"
                >
                  Learn More
                </button>
              </div>
              
              {/* Simple Scroll Indicator */}
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  <ChevronDown className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Crisis Section - Immediate impact after hero */}
        <section id="problem" className="snap-section">
          <CrisisSection />
        </section>
        

        
        <section id="solution" className="snap-section">
          <EnhancedSolutionSection />
        </section>
        

        {/* Unified Impact Section - Comprehensive impact showcase */}
        <section id="impact" className="snap-section">
          <UnifiedImpactSection />
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
