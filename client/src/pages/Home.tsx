import Navbar from "@/components/Navbar";
import ProgramsSection from "@/components/ProgramsSection";
import YouthLeadershipSection from "@/components/YouthLeadershipSection";

import UnifiedImpactSection from "@/components/UnifiedImpactSection";
import EnhancedSolutionSection from "@/components/EnhancedSolutionSection";


import TrustRoadmapSection from "@/components/TrustRoadmapSection";
import DonationSection from "@/components/DonationSection";
import MonthlyImpactSection from "@/components/MonthlyImpactSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import ImpactLabsPreview from "@/components/ImpactLabsPreview";
import FounderQuote from "@/components/FounderQuote";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { SEOOptimizedContent, SEOFAQSection } from "@/components/SEOOptimizedContent";
import { SEOBlogContent, SEOLocationContent } from "@/components/SEOBlogContent";
import { useState, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import videoBackground from "@assets/Solarpak preview website_-VEED_1756655158911.mp4";

export default function Home() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [connectionSpeed, setConnectionSpeed] = useState<string>('4g');
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
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

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    const handleUserInteraction = () => {
      setShouldLoadVideo(true);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };

    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('scroll', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [connectionSpeed]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <SEOOptimizedContent 
      title="The World's Largest Youth Led Solar Non Profit | SolarPak Pakistan"
      description="SolarPak is the world's largest youth-led solar nonprofit, bringing clean energy to Pakistani families. Student-run organization installing solar panels and transforming lives across Pakistan through renewable energy."
      keywords={["world's largest youth led solar nonprofit", "youth led solar organization", "student run solar charity", "young leaders renewable energy", "solar energy Pakistan", "solar panels donation", "Pakistan electricity crisis", "youth-led nonprofit", "student solar initiative"]}
    >
      <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden">
        <Navbar />
        <AnnouncementBanner />
        <main className="relative w-full pt-20">
          {/* Hero Section with Video - No Tint */}
          <section ref={heroRef} className="relative w-full overflow-hidden" style={{ height: 'calc(100vh - 5rem)' }}>
            
            {/* Static Background (Instant Load) */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
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

            {/* Hero Content - No Tint Overlay */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-6">
                <div className="max-w-3xl">
                  {/* Youth Leadership Badge */}
                  <div className="inline-flex items-center bg-amber-400/20 backdrop-blur-sm border border-amber-400/40 px-6 py-3 rounded-full mb-6">
                    <span className="text-amber-300 font-bold text-sm uppercase tracking-wide" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                      🌟 World's Largest Youth-Led Solar Nonprofit
                    </span>
                  </div>
                  
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>
                    <span className="block mb-3">Powering Communities.</span>
                    <span className="block text-amber-400">Lighting Futures.</span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-white mb-4 leading-relaxed" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                    SolarPak is the world's largest youth-led solar nonprofit, bringing clean, affordable solar energy to families and communities across Pakistan.
                  </p>
                  
                  <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                    Led by passionate young leaders, we're transforming lives through renewable energy, one solar panel at a time.
                  </p>
                  
                  <button 
                    onClick={() => document.getElementById('solution')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black font-bold py-4 px-10 rounded-md text-base transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                    data-testid="button-explore-project"
                  >
                    Explore Our Project
                  </button>
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
              <button 
                onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer"
              >
                <ChevronDown className="h-8 w-8 animate-bounce" />
              </button>
            </div>
          </section>
        
        {/* Youth Leadership Section - Why We're Different */}
        <section id="youth-leadership" className="snap-section">
          <YouthLeadershipSection />
          <ProgramsSection />
        </section>
        
        

        
        <section id="solution" className="snap-section">
          <EnhancedSolutionSection />
        </section>
        

        {/* Unified Impact Section - Comprehensive impact showcase */}
        <section id="impact" className="snap-section">
          <UnifiedImpactSection />
        </section>
        
        <section className="snap-section">
          <FounderQuote />
        </section>

        <section id="impact-labs" className="snap-section">
          <ImpactLabsPreview />
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
