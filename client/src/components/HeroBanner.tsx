import { Sun, Zap, Users, ThermometerSun } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeroBanner() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="relative bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 overflow-hidden animated-bg">
      {/* Floating solar panels and sun decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 opacity-20 animate-pulse" style={{ animationDuration: '4s' }}>
          <Sun size={80} className="text-yellow-300" />
        </div>
        <div className="absolute bottom-1/2 right-1/4 opacity-20 animate-pulse" style={{ animationDuration: '7s' }}>
          <Sun size={60} className="text-yellow-300" />
        </div>
        <div className="absolute top-1/3 right-1/5 opacity-10 animate-pulse" style={{ animationDuration: '5s' }}>
          <Zap size={50} className="text-yellow-400" />
        </div>
      </div>
      
      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900 opacity-70"></div>
      
      {/* Parallax effect on the content */}
      <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40 relative z-10 text-white"
        style={{ 
          transform: `translateY(${scrollPosition * 0.2}px)`,
          opacity: Math.max(1 - scrollPosition / 700, 0.2) 
        }}>
        <div className="max-w-3xl">
          <div className="flex items-center mb-4">
            <Sun className="h-8 w-8 mr-2 text-yellow-400" />
            <span className="text-lg font-semibold uppercase tracking-wider">SolarPak Initiative</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            <span className="block">Bringing Light to</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-yellow-400 font-extrabold">
              Pakistan
            </span>
            <span className="block">Through Solar Power</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Help us combat electricity shortages and improve lives by funding solar panel installations for families across Pakistan.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <a 
              href="#donate" 
              className="bg-primary hover:bg-primary/90 text-white font-heading font-semibold px-8 py-4 rounded-md text-center transition-all duration-300 transform hover:scale-105 text-lg shadow-lg"
            >
              Make a Donation
            </a>
            <a 
              href="#problem" 
              className="bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20 text-white font-heading font-semibold px-8 py-4 rounded-md text-center transition-all duration-300 text-lg border border-white border-opacity-40 hover:border-opacity-60"
            >
              Learn More
            </a>
          </div>
          
          {/* Key stats indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/20 backdrop-blur-sm rounded-lg p-5 border border-white/10">
            <div className="text-center">
              <ThermometerSun className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
              <p className="text-sm font-medium text-gray-200">Average Temp</p>
              <p className="text-xl font-bold text-white">35°C</p>
            </div>
            <div className="text-center">
              <Zap className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
              <p className="text-sm font-medium text-gray-200">Daily Outages</p>
              <p className="text-xl font-bold text-white">12 hrs</p>
            </div>
            <div className="text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
              <p className="text-sm font-medium text-gray-200">People Affected</p>
              <p className="text-xl font-bold text-white">210M+</p>
            </div>
            <div className="text-center">
              <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
              <p className="text-sm font-medium text-gray-200">Solar Potential</p>
              <p className="text-xl font-bold text-white">High</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Image with enhanced styling */}
      <div className="absolute right-0 bottom-0 hidden lg:block lg:w-2/5 h-full">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1627859284229-27d646b18a5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
          alt="Solar panels on a rooftop in Pakistan" 
          className="object-cover h-full w-full"
          style={{ 
            transform: `translateY(${scrollPosition * 0.05}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        />
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
