import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import KeyStats from "@/components/KeyStats";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import ImpactSection from "@/components/ImpactSection";
import ProjectsSection from "@/components/ProjectsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import DonationSection from "@/components/DonationSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import { useState, useEffect, useRef } from "react";
import { ChevronUp } from "lucide-react";

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
    <div className="min-h-screen text-gray-800 overflow-x-hidden">
      <Navbar />
      <main ref={mainRef} className="snap-container">
        {/* Each section is now a snap section and will take up the full viewport */}
        <div className="snap-section">
          <HeroBanner />
        </div>
        
        <div className="snap-section">
          <ProblemSection />
        </div>
        
        <div className="snap-section">
          <SolutionSection />
        </div>
        
        <div className="snap-section">
          <ImpactSection />
        </div>
        
        <div className="snap-section">
          <ProjectsSection />
        </div>
        
        <div className="snap-section">
          <TestimonialsSection />
        </div>
        
        <div className="snap-section">
          <DonationSection />
        </div>
        
        <div className="snap-section">
          <NewsletterSection />
        </div>
        
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
