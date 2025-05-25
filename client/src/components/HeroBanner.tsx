import { Sun, Zap, Users, ThermometerSun, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function HeroBanner() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll);
    
    // Set the section height to viewport height for full-screen effect
    if (sectionRef.current) {
      setHeight(window.innerHeight);
      const resizeObserver = new ResizeObserver(() => {
        setHeight(window.innerHeight);
      });
      resizeObserver.observe(sectionRef.current);
      return () => {
        window.removeEventListener("scroll", handleScroll);
        resizeObserver.disconnect();
      };
    }
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative overflow-hidden" 
      style={{ height: height ? `${height}px` : '100vh' }}
    >
      {/* Main background image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="https://images.unsplash.com/photo-1523206489230-c012c64b2b48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
          alt="Rural village in Sindh, Pakistan" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-blue-700/70"></div>
      </div>
      
      {/* Floating solar panels and sun decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 opacity-20 floating" style={{ animationDuration: '4s' }}>
          <Sun size={80} className="text-yellow-300" />
        </div>
        <div className="absolute bottom-1/2 right-1/4 opacity-20 floating-delay-1" style={{ animationDuration: '7s' }}>
          <Sun size={60} className="text-yellow-300" />
        </div>
        <div className="absolute top-1/3 right-1/5 opacity-10 floating-delay-2" style={{ animationDuration: '5s' }}>
          <Zap size={50} className="text-yellow-400" />
        </div>
        <div className="absolute top-2/3 left-1/4 opacity-20 floating" style={{ animationDuration: '6s' }}>
          <Zap size={40} className="text-yellow-300" />
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40 relative z-10 text-white h-full flex flex-col justify-center"
        style={{ 
          transform: `translateY(${scrollPosition * 0.2}px)`,
          opacity: Math.max(1 - scrollPosition / 700, 0.2) 
        }}>
        <div className="max-w-3xl mx-auto md:mx-0">
          <div className="flex items-center mb-4 animate-fade-in" style={{ animationDuration: '1s', animationFillMode: 'both' }}>
            <Sun className="h-8 w-8 mr-2 text-yellow-400" />
            <span className="text-lg font-semibold uppercase tracking-wider">SolarPak Initiative</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight animate-fade-in"
            style={{ animationDuration: '1.2s', animationDelay: '0.2s', animationFillMode: 'both' }}>
            <span className="block text-shadow-lg">Bringing Light to</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-yellow-400 font-extrabold">
              Interior Sindh
            </span>
            <span className="block text-shadow-lg">Through Solar Power</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in" 
            style={{ animationDuration: '1.4s', animationDelay: '0.4s', animationFillMode: 'both' }}>
            Help us combat electricity shortages and improve lives by funding solar panel installations for families across rural Pakistan.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in"
            style={{ animationDuration: '1.6s', animationDelay: '0.6s', animationFillMode: 'both' }}>
            <a 
              href="#donate" 
              className="btn-glow bg-primary hover:bg-primary/90 text-white font-heading font-semibold px-8 py-4 rounded-md text-center transition-all duration-300 transform hover:scale-105 text-lg shadow-lg"
            >
              Make a Donation
            </a>
            <a 
              href="#problem" 
              className="glass-effect hover:bg-white/20 text-white font-heading font-semibold px-8 py-4 rounded-md text-center transition-all duration-300 text-lg border border-white/40 hover:border-white/60"
            >
              Learn More
            </a>
          </div>
          
          {/* Key stats indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 glass-effect rounded-lg p-5 animate-fade-in"
            style={{ animationDuration: '1.8s', animationDelay: '0.8s', animationFillMode: 'both' }}>
            <div className="text-center pulse-on-hover">
              <ThermometerSun className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
              <p className="text-sm font-medium text-gray-200">Average Temp</p>
              <p className="text-xl font-bold text-white">35°C</p>
            </div>
            <div className="text-center pulse-on-hover">
              <Zap className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
              <p className="text-sm font-medium text-gray-200">Daily Outages</p>
              <p className="text-xl font-bold text-white">12 hrs</p>
            </div>
            <div className="text-center pulse-on-hover">
              <Users className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
              <p className="text-sm font-medium text-gray-200">People Affected</p>
              <p className="text-xl font-bold text-white">210M+</p>
            </div>
            <div className="text-center pulse-on-hover">
              <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
              <p className="text-sm font-medium text-gray-200">Solar Potential</p>
              <p className="text-xl font-bold text-white">High</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white z-20 animate-bounce">
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium mb-2">Scroll Down</span>
          <ChevronDown className="h-6 w-6" />
        </div>
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 70C840 80 960 100 1080 110C1200 120 1320 120 1380 120H1440V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V120Z" 
            fill="#f8fafc"
          />
        </svg>
      </div>
    </section>
  );
}
