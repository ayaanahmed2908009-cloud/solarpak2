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
import videoBackground from "@assets/Solarpak preview website_-VEED_1756655158911.mp4";

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
        {/* Mobile Hero - Original Design (Small Mobile Only) */}
        <section className="sm:hidden snap-section">
          <HeroBanner />
        </section>

        {/* Video Background Hero Section - iPad and Desktop */}
        <section className="hidden sm:block relative w-full overflow-hidden" style={{ height: 'calc(100vh + 120px)', marginTop: '-120px' }}>
          {/* Video Background */}
          <div className="absolute inset-0 z-0" style={{ height: 'calc(100% + 120px)' }}>
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              preload="metadata"
              className="w-full object-cover transition-opacity duration-500 opacity-0"
              style={{ height: 'calc(100vh + 120px)' }}
              src={videoBackground}
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23374151;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23111827;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1' height='1' fill='url(%23grad)' /%3E%3C/svg%3E"
              disablePictureInPicture
              disableRemotePlayback
              controlsList="nodownload nofullscreen noremoteplayback"
              onError={(e) => {
                console.error('Video failed to load:', e);
                // Fallback to a dark gradient background if video fails
                const target = e.target as HTMLVideoElement;
                target.style.display = 'none';
                if (target.parentElement) {
                  target.parentElement.style.background = 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)';
                }
              }}
              onLoadStart={(e) => {
                console.log('Video started loading');
                // Optimize for mobile performance
                const video = e.target as HTMLVideoElement;
                if (window.innerWidth < 768) {
                  video.style.transform = 'scale(1.1)'; // Slight zoom for mobile crop
                }
              }}
              onCanPlay={(e) => {
                console.log('Video can play');
                const video = e.target as HTMLVideoElement;
                video.style.opacity = '1';
              }}
              onPlay={() => console.log('Video is playing')}
            >
              Your browser does not support the video tag.
            </video>
            {/* Dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Text Overlay */}
          <div className="relative z-10 flex items-center justify-center" style={{ height: '100vh', marginTop: '120px' }}>
            <div className="text-center text-white max-w-4xl px-4 sm:px-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
                <span className="block mb-2 animate-fade-in" style={{ animationDuration: '1.2s', animationDelay: '0.3s', animationFillMode: 'both' }}>Powering Communities.</span>
                <span className="block text-yellow-400 animate-fade-in" style={{ animationDuration: '1.2s', animationDelay: '0.8s', animationFillMode: 'both' }}>
                  <span className="relative inline-block">
                    Lighting Futures.
                    <span className="absolute left-0 bottom-0 h-0.5 sm:h-1 bg-gradient-to-r from-yellow-400 to-orange-500 animate-expand-width" style={{ animationDuration: '1.5s', animationDelay: '1.5s', animationFillMode: 'forwards' }}></span>
                  </span>
                </span>
              </h1>
              
              <div className="text-lg sm:text-xl md:text-2xl leading-relaxed mb-8 sm:mb-12 max-w-3xl mx-auto space-y-3 sm:space-y-4">
                <p className="px-2 sm:px-0">At SolarPak, we bring clean, affordable solar energy to families and communities across Pakistan.</p>
                <p className="px-2 sm:px-0">Every panel installed means more light for homes, more opportunity for children, and a brighter, sustainable tomorrow.</p>
                <p className="text-yellow-300 font-semibold text-xl sm:text-2xl md:text-3xl mt-6 sm:mt-8 animate-fade-in px-2 sm:px-0" style={{ animationDuration: '1.2s', animationDelay: '1.2s', animationFillMode: 'both' }}>Join us in turning sunlight into hope.</p>
                
                {/* Social Proof */}
                <div className="flex items-center justify-center mt-4 animate-fade-in" style={{ animationDuration: '1.2s', animationDelay: '1.8s', animationFillMode: 'both' }}>
                  <div className="bg-black/10 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-1">
                        <div className="w-4 h-4 bg-yellow-400/70 rounded-full"></div>
                        <div className="w-4 h-4 bg-green-400/70 rounded-full"></div>
                        <div className="w-4 h-4 bg-blue-400/70 rounded-full"></div>
                      </div>
                      <p className="text-white/60 text-xs font-medium">5+ donors</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in" style={{ animationDuration: '1.2s', animationDelay: '2.2s', animationFillMode: 'both' }}>
                <button 
                  onClick={() => window.open('https://ko-fi.com/solarpak', '_blank')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto max-w-xs sm:max-w-none"
                >
                  Donate Now
                </button>
                <button 
                  onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto max-w-xs sm:max-w-none"
                >
                  Learn More
                </button>
              </div>
              
              {/* Scroll Indicator */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer animate-fade-in" style={{ animationDuration: '1.2s', animationDelay: '2.8s', animationFillMode: 'both' }}
                   onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}>
                <div className="flex flex-col items-center text-white/80 hover:text-white transition-colors duration-300">
                  <span className="text-sm font-medium mb-2">Discover More</span>
                  <ChevronDown className="h-6 w-6 animate-pulse" />
                </div>
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
