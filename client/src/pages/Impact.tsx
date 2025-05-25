import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImpactMap from "@/components/ImpactMap";

export default function Impact() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Animation effect
  useEffect(() => {
    // Slight delay for entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className={`max-w-5xl mx-auto transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">Impact Visualization</span>
                <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl mb-6">
                  <span className="gradient-text">Our Solar Impact Map</span>
                </h1>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  Explore our solar panel installations across Sindh province in Pakistan. 
                  See where we've brought sustainable electricity to families and the measurable impact of each project.
                </p>
              </div>
              
              <div className="mb-16 animate-fade-in" 
                style={{ animationDuration: '1s', animationDelay: '0.3s', animationFillMode: 'both' }}>
                <ImpactMap />
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 animate-fade-in"
                  style={{ animationDuration: '1s', animationDelay: '0.6s', animationFillMode: 'both' }}>
                  <h2 className="font-heading font-bold text-2xl mb-4">Real-Time Impact</h2>
                  <p className="text-gray-600 mb-6">
                    Our solar installations provide immediate relief to families experiencing electricity shortages. 
                    Each solar panel system installed provides:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-1 rounded-full mr-3 mt-1">
                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Up to 8-12 hours of electricity per day during outages</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-1 rounded-full mr-3 mt-1">
                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Power for essential appliances like fans, lights, and refrigerators</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-1 rounded-full mr-3 mt-1">
                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Significant reduction in monthly electricity bills</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary/10 p-1 rounded-full mr-3 mt-1">
                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Elimination of harmful diesel generator emissions</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 animate-fade-in"
                  style={{ animationDuration: '1s', animationDelay: '0.9s', animationFillMode: 'both' }}>
                  <h2 className="font-heading font-bold text-2xl mb-4">Future Expansion</h2>
                  <p className="text-gray-600 mb-6">
                    With your continued support, we plan to expand our solar installations to more villages across Pakistan:
                  </p>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-1">Phase 1: Sindh Province</h3>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: "65%" }}></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">65% complete - 90 families powered</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-1">Phase 2: Punjab Province</h3>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: "25%" }}></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">25% complete - 35 families powered</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-1">Phase 3: Balochistan Province</h3>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: "10%" }}></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">10% complete - 15 families powered</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-8">
                <a 
                  href="#donate" 
                  className="btn-glow bg-primary hover:bg-primary/90 text-white font-heading font-semibold px-8 py-4 rounded-md text-center inline-flex items-center transition-all duration-300 transform hover:scale-105 text-lg shadow-lg"
                >
                  <span>Help Us Expand</span>
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}