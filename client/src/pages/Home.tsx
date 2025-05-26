import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import KeyStats from "@/components/KeyStats";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import ImpactSection from "@/components/ImpactSection";
import ProjectsSection from "@/components/ProjectsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import DonationSection from "@/components/DonationSection";
import MonthlyImpactSection from "@/components/MonthlyImpactSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import { useState, useEffect, useRef } from "react";
import { ChevronUp, Sun, Zap, Users, ThermometerSun } from "lucide-react";
import DonationModal from "@/components/DonationModal";

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
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden">
      <Navbar />
      <main ref={mainRef} className="relative w-full">
        {/* Unique Split-Screen Hero Section */}
        <section className="relative h-screen w-full overflow-hidden">
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
                    onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    Learn More
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
              
              {/* Pakistan map background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <svg viewBox="0 0 400 500" className="w-80 h-96 text-gray-600">
                  <path
                    d="M80 120 C90 100, 120 90, 150 100 L180 95 C200 90, 220 95, 240 110 L260 120 C280 130, 300 140, 310 160 L320 180 C325 200, 320 220, 315 240 L310 260 C305 280, 300 300, 295 320 L290 340 C285 360, 280 380, 270 395 L250 410 C230 420, 210 415, 190 410 L170 405 C150 400, 130 395, 110 385 L90 375 C70 365, 60 345, 55 325 L50 305 C45 285, 50 265, 55 245 L60 225 C65 205, 70 185, 75 165 L80 145 Z"
                    fill="currentColor"
                    className="animate-pulse"
                    style={{animationDuration: '4s'}}
                  />
                  {/* Major cities dots */}
                  <circle cx="190" cy="180" r="3" fill="currentColor" opacity="0.6">
                    <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="220" cy="220" r="3" fill="currentColor" opacity="0.6">
                    <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" begin="0.5s"/>
                  </circle>
                  <circle cx="160" cy="260" r="3" fill="currentColor" opacity="0.6">
                    <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" begin="1s"/>
                  </circle>
                </svg>
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
          
          {/* Seamless transition with gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-white/50 to-white z-20 pointer-events-none"></div>
        </section>
        
        {/* Smooth transition container */}
        <div className="relative -mt-16 z-30">
          <div className="h-16 bg-gradient-to-b from-white/80 to-white"></div>
        </div>
        
        <section id="problem" className="snap-section relative bg-white">
          <ProblemSection />
        </section>
        
        <section id="solution" className="snap-section">
          <SolutionSection />
        </section>
        
        <section id="impact" className="snap-section">
          <ImpactSection />
        </section>
        
        <section id="projects" className="snap-section">
          <ProjectsSection />
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
