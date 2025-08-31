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
            {/* Sophisticated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/70"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>
          </div>

          {/* Sophisticated Text Overlay */}
          <div className="relative z-10 flex items-center justify-center" style={{ height: '100vh', marginTop: '120px' }}>
            <div className="text-center text-white max-w-5xl px-4 sm:px-8">
              {/* Decorative element */}
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-8 animate-fade-in" style={{ animationDuration: '1s', animationDelay: '0.1s', animationFillMode: 'both' }}></div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-8 sm:mb-10 leading-[1.1] tracking-tight">
                <span className="block mb-3 animate-fade-in font-extralight text-white/95" style={{ animationDuration: '1.2s', animationDelay: '0.3s', animationFillMode: 'both', letterSpacing: '0.02em' }}>Powering Communities.</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 animate-fade-in font-medium" style={{ animationDuration: '1.2s', animationDelay: '0.8s', animationFillMode: 'both', letterSpacing: '0.01em' }}>
                  <span className="relative inline-block">
                    Lighting Futures.
                    <span className="absolute left-0 bottom-0 h-0.5 sm:h-1 bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 animate-expand-width shadow-lg shadow-yellow-400/20" style={{ animationDuration: '1.8s', animationDelay: '1.6s', animationFillMode: 'forwards' }}></span>
                  </span>
                </span>
              </h1>
              
              <div className="text-lg sm:text-xl md:text-2xl leading-relaxed mb-10 sm:mb-14 max-w-4xl mx-auto space-y-6 sm:space-y-8">
                <div className="space-y-4 sm:space-y-6 animate-fade-in" style={{ animationDuration: '1.2s', animationDelay: '1.1s', animationFillMode: 'both' }}>
                  <p className="px-2 sm:px-0 text-white/90 font-light leading-relaxed">At SolarPak, we bring clean, affordable solar energy to families and communities across Pakistan.</p>
                  <p className="px-2 sm:px-0 text-white/85 font-light leading-relaxed">Every panel installed means more light for homes, more opportunity for children, and a brighter, sustainable tomorrow.</p>
                </div>
                
                <div className="relative animate-fade-in" style={{ animationDuration: '1.2s', animationDelay: '1.4s', animationFillMode: 'both' }}>
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-300 to-amber-400 font-medium text-xl sm:text-2xl md:text-3xl mt-8 sm:mt-10 px-2 sm:px-0 leading-tight tracking-wide">Join us in turning sunlight into hope.</p>
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 blur-lg opacity-50 -z-10 rounded-lg"></div>
                </div>
                
                {/* Sophisticated Social Proof */}
                <div className="flex items-center justify-center mt-6 animate-fade-in" style={{ animationDuration: '1.2s', animationDelay: '1.8s', animationFillMode: 'both' }}>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shadow-lg shadow-black/20">
                    <div className="flex items-center space-x-3">
                      <div className="flex -space-x-1.5">
                        <div className="w-5 h-5 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full ring-2 ring-white/20 shadow-md"></div>
                        <div className="w-5 h-5 bg-gradient-to-br from-green-300 to-green-500 rounded-full ring-2 ring-white/20 shadow-md"></div>
                        <div className="w-5 h-5 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full ring-2 ring-white/20 shadow-md"></div>
                      </div>
                      <p className="text-white/80 text-sm font-medium tracking-wide">5+ donors</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in" style={{ animationDuration: '1.2s', animationDelay: '2.2s', animationFillMode: 'both' }}>
                <button 
                  onClick={() => window.open('https://ko-fi.com/solarpak', '_blank')}
                  className="group relative bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-white font-semibold py-4 sm:py-5 px-8 sm:px-10 rounded-xl text-base sm:text-lg transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 shadow-2xl shadow-yellow-500/25 hover:shadow-yellow-400/40 w-full sm:w-auto max-w-xs sm:max-w-none backdrop-blur-sm border border-yellow-400/20"
                >
                  <span className="relative z-10">Donate Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </button>
                <button 
                  onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold py-4 sm:py-5 px-8 sm:px-10 rounded-xl text-base sm:text-lg transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 shadow-2xl shadow-black/20 hover:shadow-black/30 w-full sm:w-auto max-w-xs sm:max-w-none border border-white/20 hover:border-white/30"
                >
                  <span className="relative z-10">Learn More</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </button>
              </div>
              
              {/* Sophisticated Scroll Indicator */}
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer animate-fade-in" style={{ animationDuration: '1.2s', animationDelay: '2.8s', animationFillMode: 'both' }}
                   onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}>
                <div className="group flex flex-col items-center text-white/70 hover:text-white transition-all duration-500">
                  <div className="bg-white/5 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 group-hover:border-white/20 transition-all duration-300 shadow-lg">
                    <span className="text-sm font-light tracking-wider">Discover More</span>
                  </div>
                  <ChevronDown className="h-5 w-5 mt-2 group-hover:translate-y-1 transition-transform duration-300" />
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
