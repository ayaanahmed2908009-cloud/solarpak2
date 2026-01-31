import { Thermometer, Clock, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import type { Stats } from "@shared/schema";

export default function CrisisSection() {
  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  // State for animated counters
  const [counters, setCounters] = useState({
    temperature: 0,
    hours: 0,
    people: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for triggering animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounters();
        }
      },
      {
        threshold: 0.3,
        rootMargin: '50px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const animateCounters = () => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    
    const targetTemp = stats?.temperature || 45;
    const targetHours = stats?.hoursWithoutPower || 12;
    const targetPeople = 50;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounters({
        temperature: Math.floor(targetTemp * progress),
        hours: Math.floor(targetHours * progress),
        people: Math.floor(targetPeople * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters({
          temperature: targetTemp,
          hours: targetHours,
          people: targetPeople
        });
      }
    }, stepDuration);
  };

  return (
    <div ref={sectionRef} className="py-24 bg-gradient-to-br from-blue-900 via-slate-800 to-blue-900 text-white relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs with pulsing */}
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-red-500/12 to-orange-500/12 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-amber-500/12 to-yellow-500/12 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
        
        {/* Heat wave effect - animated moving gradients */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-red-500/5 to-transparent animate-pulse" 
               style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-orange-500/5 to-transparent animate-pulse" 
               style={{ animationDuration: '10s', animationDelay: '3s' }}></div>
        </div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-red-400/20 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-gradient-to-r from-red-500/25 to-orange-500/25 backdrop-blur-md px-8 py-4 rounded-full mb-10 border border-red-400/40 animate-pulse shadow-2xl shadow-red-500/20"
               style={{ animationDuration: '3s' }}>
            <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-500 rounded-full mr-4 animate-ping"></div>
            <span className="font-bold text-base tracking-wider text-red-100">⚡ URGENT CRISIS</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-10 leading-tight">
            <span className="block text-white mb-2 animate-pulse" 
                  style={{ textShadow: '0 4px 12px rgba(0,0,0,0.7)', animationDuration: '4s' }}>
              The Reality in
            </span>
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent animate-pulse"
                  style={{ animationDuration: '5s', animationDelay: '1s' }}>
              Pakistan Today
            </span>
          </h2>
          
          <div className="max-w-5xl mx-auto">
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-6 font-medium" 
               style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              Right now, millions of Pakistani families are enduring extreme heat without reliable electricity.
            </p>
            <p className="text-lg md:text-xl text-red-300 font-semibold animate-pulse" 
               style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)', animationDuration: '6s' }}>
              This is not just a statistic—it's a daily struggle for survival.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Temperature Card with Enhanced Animations */}
          <div className="bg-gradient-to-br from-white/15 to-white/8 backdrop-blur-lg rounded-3xl p-8 border-2 border-red-400/30 hover:border-red-400/60 hover:bg-white/20 transition-all duration-700 group shadow-2xl shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-3 hover:rotate-1 relative overflow-hidden">
            {/* Heat shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
            
            <div className="flex items-start mb-8 relative z-10">
              <div className="relative p-5 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mr-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-700 shadow-2xl shadow-red-500/40">
                <Thermometer className="w-10 h-10 text-white group-hover:animate-pulse" />
                <div className="absolute -inset-2 bg-gradient-to-r from-red-400 to-red-600 rounded-2xl blur opacity-40 group-hover:opacity-70 transition-opacity duration-700 animate-pulse" style={{ animationDuration: '3s' }}></div>
              </div>
              <div>
                <div className="text-6xl font-bold text-white mb-2 tabular-nums">
                  <span className="text-red-300">{counters.temperature}</span>
                  <span className="text-4xl">°C</span>
                </div>
                <div className="text-xl text-red-300 font-bold tracking-wide animate-pulse" style={{ animationDuration: '4s' }}>
                  Extreme Heat
                </div>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed text-lg relative z-10">
              Temperatures regularly exceed 45°C, making life unbearable without cooling. 
              <span className="text-red-300 font-semibold bg-red-500/10 px-2 py-1 rounded-lg">Children cannot study, elderly suffer, and families struggle to sleep.</span>
            </p>
          </div>

          {/* Blackouts Card with Enhanced Animations */}
          <div className="bg-gradient-to-br from-white/15 to-white/8 backdrop-blur-lg rounded-3xl p-8 border-2 border-orange-400/30 hover:border-orange-400/60 hover:bg-white/20 transition-all duration-700 group shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-3 hover:rotate-1 relative overflow-hidden">
            {/* Flickering effect for power outage */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl animate-pulse" style={{ animationDuration: '2s' }}></div>
            
            <div className="flex items-start mb-8 relative z-10">
              <div className="relative p-5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mr-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-700 shadow-2xl shadow-orange-500/40">
                <Clock className="w-10 h-10 text-white group-hover:animate-spin" style={{ animationDuration: '3s' }} />
                <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl blur opacity-40 group-hover:opacity-70 transition-opacity duration-700 animate-pulse" style={{ animationDuration: '3.5s' }}></div>
              </div>
              <div>
                <div className="text-6xl font-bold text-white mb-2 tabular-nums">
                  <span className="text-orange-300">{counters.hours}</span>
                  <span className="text-4xl">h</span>
                </div>
                <div className="text-xl text-orange-300 font-bold tracking-wide animate-pulse" style={{ animationDuration: '5s' }}>
                  Daily Blackouts
                </div>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed text-lg relative z-10">
              Daily blackouts leave families without fans, lights, or refrigeration. 
              <span className="text-orange-300 font-semibold bg-orange-500/10 px-2 py-1 rounded-lg">Food spoils, businesses close, and hope fades.</span>
            </p>
          </div>

          {/* People Affected Card with Enhanced Animations */}
          <div className="bg-gradient-to-br from-white/15 to-white/8 backdrop-blur-lg rounded-3xl p-8 border-2 border-amber-400/30 hover:border-amber-400/60 hover:bg-white/20 transition-all duration-700 group shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-3 hover:rotate-1 relative overflow-hidden">
            {/* Population density effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
            
            <div className="flex items-start mb-8 relative z-10">
              <div className="relative p-5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl mr-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-700 shadow-2xl shadow-amber-500/40">
                <Users className="w-10 h-10 text-white group-hover:animate-bounce" />
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl blur opacity-40 group-hover:opacity-70 transition-opacity duration-700 animate-pulse" style={{ animationDuration: '4s' }}></div>
              </div>
              <div>
                <div className="text-6xl font-bold text-white mb-2 tabular-nums">
                  <span className="text-amber-300">{counters.people}</span>
                  <span className="text-4xl">M+</span>
                </div>
                <div className="text-xl text-amber-300 font-bold tracking-wide animate-pulse" style={{ animationDuration: '6s' }}>
                  People Affected
                </div>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed text-lg relative z-10">
              Millions of Pakistani families struggle with unreliable electricity daily. 
              <span className="text-amber-300 font-semibold bg-amber-500/10 px-2 py-1 rounded-lg">Your support can change this reality, one family at a time.</span>
            </p>
          </div>
        </div>

        {/* Enhanced Hope Section */}
        <div className="relative bg-gradient-to-br from-green-500/15 to-blue-500/15 backdrop-blur-lg rounded-3xl p-10 md:p-12 border-2 border-green-400/40 text-center shadow-2xl shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-1000 group overflow-hidden">
          {/* Enhanced hope background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/8 to-blue-500/8 rounded-3xl"></div>
          <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-yellow-400/25 to-green-400/25 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
          
          {/* Floating hope particles */}
          <div className="absolute inset-0 opacity-40">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 bg-green-400/30 rounded-full animate-bounce"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${4 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center bg-gradient-to-r from-green-500/30 to-blue-500/30 backdrop-blur-sm px-8 py-4 rounded-full mb-8 border-2 border-green-400/50 shadow-2xl animate-pulse hover:animate-none hover:scale-105 transition-all duration-500" style={{ animationDuration: '4s' }}>
              <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-green-500 rounded-full mr-4 animate-ping shadow-lg"></div>
              <span className="font-bold text-lg tracking-wide text-green-100">✨ HOPE AHEAD</span>
            </div>
            
            <h3 className="text-5xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 drop-shadow-2xl animate-pulse hover:animate-none hover:scale-105 transition-all duration-700" style={{ animationDuration: '6s' }}>
              But There Is Hope
            </h3>
            
            <p className="text-xl md:text-2xl text-white/95 max-w-5xl mx-auto leading-relaxed mb-12 font-medium animate-pulse" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.7)', animationDuration: '8s' }}>
              While we celebrate our progress, millions still need our help. 
              <span className="font-bold text-yellow-300 bg-yellow-300/15 px-3 py-2 rounded-xl border border-yellow-400/30 shadow-lg hover:bg-yellow-300/25 transition-all duration-300"> Your support doesn't just install solar panels—it restores dignity, enables education, and saves lives.</span>
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-8 text-lg">
              <div className="group flex items-center bg-gradient-to-r from-green-500/25 to-green-600/25 hover:from-green-500/40 hover:to-green-600/40 px-10 py-5 rounded-full border-2 border-green-400/40 hover:border-green-400/70 transition-all duration-500 shadow-2xl hover:shadow-green-500/30 hover:-translate-y-2 hover:rotate-1">
                <div className="w-5 h-5 bg-gradient-to-r from-green-300 to-green-500 rounded-full mr-4 group-hover:animate-ping shadow-lg"></div>
                <span className="font-semibold text-green-100">Immediate Relief</span>
              </div>
              <div className="group flex items-center bg-gradient-to-r from-blue-500/25 to-blue-600/25 hover:from-blue-500/40 hover:to-blue-600/40 px-10 py-5 rounded-full border-2 border-blue-400/40 hover:border-blue-400/70 transition-all duration-500 shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-2 hover:rotate-1">
                <div className="w-5 h-5 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full mr-4 group-hover:animate-ping shadow-lg"></div>
                <span className="font-semibold text-blue-100">Long-term Solution</span>
              </div>
              <div className="group flex items-center bg-gradient-to-r from-purple-500/25 to-purple-600/25 hover:from-purple-500/40 hover:to-purple-600/40 px-10 py-5 rounded-full border-2 border-purple-400/40 hover:border-purple-400/70 transition-all duration-500 shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-2 hover:rotate-1">
                <div className="w-5 h-5 bg-gradient-to-r from-purple-300 to-purple-500 rounded-full mr-4 group-hover:animate-ping shadow-lg"></div>
                <span className="font-semibold text-purple-100">Sustainable Future</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}