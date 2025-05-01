import { useState, useEffect } from "react";
import DonationForm from "./DonationForm";
import { Home, Plug, PanelTop, ShieldCheck, Sun, Battery, Zap } from "lucide-react";

export default function DonationSection() {
  const [isVisible, setIsVisible] = useState(false);

  // Add intersection observer for animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("donate");
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  return (
    <section id="donate" className="section-container bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
        <Sun className="w-64 h-64 text-primary" />
      </div>
      <div className="absolute bottom-0 left-0 opacity-5 pointer-events-none">
        <Zap className="w-40 h-40 text-primary" />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">Make a Difference</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-800 mb-4">
            <span className="gradient-text">Support Our Mission</span>
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Your donation brings light to families living without reliable electricity
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-1000 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
          }`}>
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-8 md:p-10">
                <h3 className="font-heading font-bold text-2xl md:text-3xl text-gray-800 mb-4">Make a Donation</h3>
                <p className="text-gray-600 mb-8">
                  Your contribution helps bring sustainable electricity to families in Pakistan experiencing up to 12 hours of daily blackouts.
                </p>
                
                <DonationForm />
              </div>
              
              <div className="lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
                {/* Background decor elements */}
                <div className="absolute top-0 right-0 opacity-10">
                  <Sun className="w-32 h-32" />
                </div>
                <div className="absolute bottom-0 left-0 opacity-10">
                  <Battery className="w-24 h-24" />
                </div>
                
                <div className="relative z-10">
                  <h3 className="font-heading font-bold text-2xl mb-8 flex items-center">
                    <span className="mr-2">Your Impact</span>
                    <div className="h-px flex-grow bg-white/20 ml-4"></div>
                  </h3>
                  
                  <div className="space-y-8 mb-12">
                    <div className="flex items-start transform transition-transform duration-500 hover:translate-x-2">
                      <div className="mr-5 bg-white/10 rounded-full p-3 backdrop-blur-sm">
                        <Home className="w-8 h-8 text-yellow-300" />
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-xl mb-2 text-white">$50 provides</h4>
                        <p className="text-white/80 leading-relaxed">
                          A basic solar lighting system for one room in a family home, eliminating the need for dangerous kerosene lamps
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start transform transition-transform duration-500 hover:translate-x-2">
                      <div className="mr-5 bg-white/10 rounded-full p-3 backdrop-blur-sm">
                        <Plug className="w-8 h-8 text-yellow-300" />
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-xl mb-2 text-white">$250 provides</h4>
                        <p className="text-white/80 leading-relaxed">
                          A small solar system to power basic appliances for a family, including lights, fans, and mobile charging
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start transform transition-transform duration-500 hover:translate-x-2">
                      <div className="mr-5 bg-white/10 rounded-full p-3 backdrop-blur-sm">
                        <PanelTop className="w-8 h-8 text-yellow-300" />
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-xl mb-2 text-white">$1,000 provides</h4>
                        <p className="text-white/80 leading-relaxed">
                          A complete solar system for an entire home with battery storage, powering essential appliances throughout blackouts
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/10 shadow-lg">
                  <h4 className="font-heading font-semibold text-xl mb-3 flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-2 text-yellow-300" />
                    Donation Transparency
                  </h4>
                  <p className="text-white/90 mb-4 leading-relaxed">
                    We're committed to transparency. You'll receive updates about your specific contribution, including photos of installations you helped fund.
                  </p>
                  <div className="flex items-center">
                    <div className="mr-2 bg-yellow-300/20 p-1 rounded">
                      <ShieldCheck className="w-5 h-5 text-yellow-300" />
                    </div>
                    <p className="text-sm text-white/90">Your donation is tax-deductible where applicable</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
