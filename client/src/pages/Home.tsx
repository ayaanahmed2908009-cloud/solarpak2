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
import { ChevronUp } from "lucide-react";
import Spline from '@splinetool/react-spline';
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
                  Solar Light
                  <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Pakistan
                  </span>
                </h1>
                <p className="text-lg md:text-xl mb-8 text-blue-100 leading-relaxed">
                  Bringing sustainable energy to families in Pakistan through solar power installations
                </p>
                <div className="flex flex-col gap-4">
                  <DonationModal 
                    suggestedAmount={100}
                    buttonText="Make a Difference"
                    buttonVariant="default"
                    buttonSize="lg"
                    fullWidth={true}
                  />
                  <button 
                    onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    Explore Our Impact
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right Half - Interactive Spline Design */}
            <div className="w-1/2 bg-white relative">
              <Spline 
                scene="https://prod.spline.design/7mLKGredueQLsGl3ceYxsfYT/scene.splinecode"
                className="w-full h-full"
                onLoad={() => console.log('3D scene loaded successfully')}
                onError={(error) => {
                  console.log('3D scene error:', error);
                  // Fallback design if Spline fails
                }}
              />
              
              {/* Fallback design overlay in case Spline doesn't load */}
              <div className="absolute inset-0 bg-gradient-to-bl from-yellow-100 via-white to-blue-100 opacity-30 pointer-events-none" />
              
              {/* Optional text overlay on the 3D side */}
              <div className="absolute bottom-8 left-8 right-8 text-center">
                <p className="text-gray-600 text-sm font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                  Interactive 3D Experience - Explore our solar solutions
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="hero" className="snap-section">
          <HeroBanner />
        </section>
        
        <section id="problem" className="snap-section">
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
