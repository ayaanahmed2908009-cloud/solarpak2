import { useState, useEffect, useRef } from "react";
import { Zap, Heart, Globe, Clock } from "lucide-react";

export default function InteractiveImpactCounter() {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    livesImpacted: 0,
    energyGenerated: 0,
    co2Prevented: 0,
    hoursOfPower: 0
  });

  const sectionRef = useRef<HTMLDivElement>(null);

  const finalNumbers = {
    livesImpacted: 15,
    energyGenerated: 45,
    co2Prevented: 56.7,
    hoursOfPower: 3
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const animateCounters = () => {
    const duration = 2500; // 2.5 seconds 
    const steps = 50;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounters({
        livesImpacted: Math.floor(finalNumbers.livesImpacted * progress),
        energyGenerated: Math.floor(finalNumbers.energyGenerated * progress),
        co2Prevented: Math.round(finalNumbers.co2Prevented * progress * 10) / 10,
        hoursOfPower: Math.floor(finalNumbers.hoursOfPower * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(finalNumbers);
      }
    }, stepDuration);
  };

  return (
    <div ref={sectionRef} className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Real-Time Global Impact
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Every second, our solar installations across Pakistan are creating positive change. 
            Watch these numbers grow as communities transform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Lives Impacted */}
          <div className="group">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-500 transform hover:scale-105 border border-white/20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-400 to-pink-500 rounded-full mb-6 group-hover:rotate-12 transition-transform duration-300">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2 font-mono">
                {counters.livesImpacted.toLocaleString()}
              </div>
              <div className="text-purple-200 font-medium">Lives Transformed</div>
              <div className="text-sm text-purple-300 mt-2">+2 families this week</div>
            </div>
          </div>

          {/* Energy Generated */}
          <div className="group">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-500 transform hover:scale-105 border border-white/20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 group-hover:rotate-12 transition-transform duration-300">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2 font-mono">
                {counters.energyGenerated.toLocaleString()}
              </div>
              <div className="text-purple-200 font-medium">kWh Generated</div>
              <div className="text-sm text-purple-300 mt-2">+3 kWh today</div>
            </div>
          </div>

          {/* CO2 Prevented */}
          <div className="group">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-500 transform hover:scale-105 border border-white/20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 group-hover:rotate-12 transition-transform duration-300">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2 font-mono">
                {counters.co2Prevented.toFixed(1)}
              </div>
              <div className="text-purple-200 font-medium">kg CO₂ Prevented</div>
              <div className="text-sm text-purple-300 mt-2">Saving our planet</div>
            </div>
          </div>

          {/* Hours of Power */}
          <div className="group">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-500 transform hover:scale-105 border border-white/20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full mb-6 group-hover:rotate-12 transition-transform duration-300">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2 font-mono">
                {counters.hoursOfPower.toLocaleString()}
              </div>
              <div className="text-purple-200 font-medium">Hours of Reliable Power</div>
              <div className="text-sm text-purple-300 mt-2">Lighting up homes</div>
            </div>
          </div>
        </div>

        {/* Solar Panel Progress Goal */}
        <div className="mt-16 bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-white mb-2">🎯 Our Solar Panel Goal</h3>
            <p className="text-purple-200 text-lg">Working toward 100 solar panels across Pakistan</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white font-semibold">Progress: 3 / 100 panels</span>
              <span className="text-purple-200">3%</span>
            </div>
            
            <div className="bg-white/20 rounded-full h-4 mb-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-2000 ease-out relative"
                style={{ width: '3%' }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-purple-100 text-lg font-medium">We'll get there soon! 🚀</p>
              <p className="text-purple-300 text-sm mt-1">Every donation brings us closer to transforming 100 communities</p>
            </div>
          </div>
        </div>

        {/* Global Stats Bar */}
        <div className="mt-16 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">🌍 Global Solar Revolution</h3>
              <p className="text-purple-200">Your donations are part of a worldwide movement</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">67°C</div>
                <div className="text-sm text-purple-300">Peak temp recorded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">18h</div>
                <div className="text-sm text-purple-300">Max daily outages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-sm text-purple-300">Solar-powered homes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}