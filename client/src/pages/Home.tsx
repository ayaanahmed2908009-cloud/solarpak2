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
import DonationSection from "@/components/DonationSection";
import MonthlyImpactSection from "@/components/MonthlyImpactSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import { useState, useEffect, useRef } from "react";
import { ChevronUp, Sun, Zap, Users, ThermometerSun, ChevronDown } from "lucide-react";
import DonationModal from "@/components/DonationModal";

export default function Home() {
  // State to control the visibility of the back-to-top button
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [displayedSubtext, setDisplayedSubtext] = useState("");
  const [showScrollPrompt, setShowScrollPrompt] = useState(false);
  const [hasTriggeredAnimation, setHasTriggeredAnimation] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const interactiveSectionRef = useRef<HTMLElement>(null);
  
  const mainText = "Are you ready to see the reality for many in Pakistan today?";
  const subText = "Scroll down to learn more";

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

  // Scroll-triggered typewriter effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggeredAnimation) {
            setHasTriggeredAnimation(true);
            
            // Reset states
            setDisplayedText("");
            setDisplayedSubtext("");
            setShowScrollPrompt(false);
            
            // Start main text typing animation
            let currentIndex = 0;
            const typingInterval = setInterval(() => {
              if (currentIndex <= mainText.length) {
                setDisplayedText(mainText.slice(0, currentIndex));
                currentIndex++;
              } else {
                clearInterval(typingInterval);
                
                // Start subtext typing after main text is complete
                setTimeout(() => {
                  let subtextIndex = 0;
                  const subtextInterval = setInterval(() => {
                    if (subtextIndex <= subText.length) {
                      setDisplayedSubtext(subText.slice(0, subtextIndex));
                      subtextIndex++;
                    } else {
                      clearInterval(subtextInterval);
                      // Show scroll prompt after subtext is complete
                      setTimeout(() => setShowScrollPrompt(true), 500);
                    }
                  }, 60); // Slightly faster for subtext
                }, 800);
              }
            }, 80); // Typing speed for main text
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the section is visible
        rootMargin: '0px'
      }
    );

    if (interactiveSectionRef.current) {
      observer.observe(interactiveSectionRef.current);
    }

    return () => {
      if (interactiveSectionRef.current) {
        observer.unobserve(interactiveSectionRef.current);
      }
    };
  }, [hasTriggeredAnimation, mainText, subText]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden">
      <Navbar />
      <main ref={mainRef} className="relative w-full">
        {/* Mobile Hero - Original Design */}
        <section className="md:hidden snap-section">
          <HeroBanner />
        </section>

        {/* Desktop Split-Screen Hero Section */}
        <section className="hidden md:block relative h-screen w-full overflow-hidden">
          <div className="flex h-full">
            {/* Left Half - Content */}
            <div className="w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-400/20 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10 text-center text-white max-w-lg px-8">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  <span className="block text-shadow-lg">Bringing Light to</span>
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-extrabold">
                    Pakistan
                  </span>
                  <span className="block text-shadow-lg">Through Solar Power</span>
                </h1>
                
                <p className="text-lg md:text-xl mb-8 text-blue-100 leading-relaxed opacity-90">
                  Help us combat electricity shortages and improve lives by funding solar panel installations for families across Pakistan.
                </p>
                
                <div className="flex flex-col gap-4 mb-8">
                  <DonationModal 
                    suggestedAmount={100}
                    buttonText="Make a Donation"
                    buttonVariant="default"
                    buttonSize="lg"
                    fullWidth={true}
                  />
                  <button 
                    onClick={() => document.getElementById('interactive-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    See the Reality
                  </button>
                </div>
                
                {/* Key stats indicators */}
                <div className="grid grid-cols-2 gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-center">
                    <ThermometerSun className="h-5 w-5 mx-auto mb-1 text-yellow-400" />
                    <p className="text-xs font-medium text-gray-200">Average Temp</p>
                    <p className="text-lg font-bold text-white">35°C</p>
                  </div>
                  <div className="text-center">
                    <Zap className="h-5 w-5 mx-auto mb-1 text-yellow-400" />
                    <p className="text-xs font-medium text-gray-200">Daily Outages</p>
                    <p className="text-lg font-bold text-white">12 hrs</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-5 w-5 mx-auto mb-1 text-yellow-400" />
                    <p className="text-xs font-medium text-gray-200">People Affected</p>
                    <p className="text-lg font-bold text-white">210M+</p>
                  </div>
                  <div className="text-center">
                    <Sun className="h-5 w-5 mx-auto mb-1 text-yellow-400" />
                    <p className="text-xs font-medium text-gray-200">Solar Potential</p>
                    <p className="text-lg font-bold text-white">High</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Half - Beautiful Visual Design */}
            <div className="w-1/2 bg-gradient-to-bl from-yellow-50 via-white to-blue-50 relative overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute inset-0">
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
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

              {/* Solar panel illustration using CSS */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Solar panel grid */}
                  <div className="grid grid-cols-3 gap-2 transform rotate-12">
                    {[...Array(9)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-16 h-24 bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg shadow-lg border-2 border-blue-700"
                        style={{
                          animation: `fadeIn 0.5s ease-in-out ${i * 0.1}s forwards`,
                          opacity: 0
                        }}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-blue-600/50 to-transparent rounded-md"></div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Sun rays */}
                  <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full animate-pulse shadow-2xl shadow-yellow-400/50">
                      <div className="absolute inset-0 bg-yellow-300 rounded-full animate-ping"></div>
                    </div>
                    {/* Rays */}
                    {[...Array(8)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute top-1/2 left-1/2 w-1 bg-yellow-400 origin-bottom"
                        style={{
                          height: '40px',
                          transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                          animation: `pulse 2s infinite ${i * 0.25}s`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Interactive text overlay */}
              <div className="absolute bottom-8 left-8 right-8 text-center">
                <p className="text-gray-700 font-semibold bg-white/90 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg">
                  ☀️ Solar Energy Solutions for Pakistan
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Interactive Typewriter Section */}
        <section ref={interactiveSectionRef} id="interactive-section" className="min-h-screen flex items-center justify-center bg-white relative">
          <div className="text-center max-w-4xl mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight min-h-[200px] flex items-center justify-center">
              <span className="border-r-2 border-gray-900 pr-1 animate-pulse">
                {displayedText}
              </span>
            </h1>
            
            {displayedSubtext && (
              <p className="text-xl md:text-2xl text-gray-600 mb-12">
                <span className="border-r-2 border-gray-600 pr-1 animate-pulse">
                  {displayedSubtext}
                </span>
              </p>
            )}
            
            {showScrollPrompt && (
              <button 
                onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex flex-col items-center mx-auto animate-bounce opacity-0 animate-fade-in-delayed"
              >
                <ChevronDown className="w-8 h-8 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
            )}
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
  );
}
