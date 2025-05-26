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
      <main ref={mainRef} className="relative w-full bg-white">
        {/* Hero Section with Clean White Background */}
        <section className="relative h-screen w-full bg-white flex items-center justify-center overflow-hidden">
          {/* Beautiful gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100" />
          
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-32 h-32 bg-blue-300 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-300 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-300 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center max-w-4xl px-6">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Solar Light Pakistan
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-700">
                Bringing sustainable energy to families in Pakistan through solar power
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <DonationModal 
                  suggestedAmount={100}
                  buttonText="Donate Now"
                  buttonVariant="default"
                  buttonSize="lg"
                />
                <button 
                  onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white border-2 border-blue-600 hover:bg-blue-50 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all"
                >
                  Learn More
                </button>
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
