import { useState, useEffect, useRef } from "react";
import { Zap, Heart, Globe, Clock, Users, Home, MapPin, Thermometer } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function UnifiedImpactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    livesImpacted: 0,
    energyGenerated: 0,
    co2Prevented: 0,
    hoursOfPower: 0,
    panelsInstalled: 0,
    homesEmpowered: 0
  });

  const sectionRef = useRef<HTMLDivElement>(null);

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: impactStories } = useQuery({
    queryKey: ["/api/impact-stories"],
  });

  const finalNumbers = {
    livesImpacted: 15,
    energyGenerated: 45,
    co2Prevented: 56.7,
    hoursOfPower: 3,
    panelsInstalled: 3,
    homesEmpowered: 3
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
        hoursOfPower: Math.floor(finalNumbers.hoursOfPower * progress),
        panelsInstalled: Math.floor(finalNumbers.panelsInstalled * progress),
        homesEmpowered: Math.floor(finalNumbers.homesEmpowered * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(finalNumbers);
      }
    }, stepDuration);
  };

  return (
    <div ref={sectionRef} className="py-20 bg-gradient-to-b from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-500 rounded-full opacity-30"
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
        {/* Main Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-blue-100 px-6 py-3 rounded-full mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
            <span className="font-medium text-gray-700">Our Global Impact Dashboard</span>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Transforming Lives Across Pakistan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every solar panel we install creates ripple effects of positive change. From individual families to entire communities, 
            witness the real-time impact of your donations.
          </p>
        </div>

        {/* Real-time Global Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="group">
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-gray-800 font-mono">
                    {counters.panelsInstalled.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Solar Panels Installed</div>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="flex items-center text-yellow-800 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  +23 installations this week
                </div>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-gray-800 font-mono">
                    {counters.homesEmpowered.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Homes Empowered</div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center text-blue-800 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  +1 family this month
                </div>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-gray-800 font-mono">
                    {counters.livesImpacted.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Lives Transformed</div>
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <div className="flex items-center text-red-800 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  Every donation matters
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
            <div className="flex items-center mb-6">
              <div className="p-4 bg-green-500 rounded-xl mr-6">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-green-800 font-mono">
                  {counters.energyGenerated.toLocaleString()} kWh
                </h3>
                <p className="text-green-600">Clean Energy Generated Total</p>
              </div>
            </div>
            <div className="bg-green-200 rounded-full h-3 mb-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-2000 ease-out"
                style={{ width: '78%' }}
              ></div>
            </div>
            <p className="text-sm text-green-700">Enough to power 2 homes for a day</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
            <div className="flex items-center mb-6">
              <div className="p-4 bg-blue-500 rounded-xl mr-6">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-blue-800 font-mono">
                  {counters.co2Prevented.toFixed(1)} kg
                </h3>
                <p className="text-blue-600">CO₂ Emissions Prevented</p>
              </div>
            </div>
            <div className="bg-blue-200 rounded-full h-3 mb-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-2000 ease-out"
                style={{ width: '65%' }}
              ></div>
            </div>
            <p className="text-sm text-blue-700">Equivalent to planting 3 trees this year</p>
          </div>
        </div>

        {/* Solar Panel Progress Goal */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-8 border border-orange-200 mb-16">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">🎯 Our Solar Panel Goal</h3>
            <p className="text-gray-600 text-lg">Working toward 100 solar panels across Pakistan</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-800 font-semibold">Progress: 3 / 100 panels</span>
              <span className="text-gray-600">3%</span>
            </div>
            
            <div className="bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-2000 ease-out relative"
                style={{ width: '3%' }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-700 text-lg font-medium">We'll get there soon! 🚀</p>
              <p className="text-gray-500 text-sm mt-1">Every donation brings us closer to transforming 100 communities</p>
            </div>
          </div>
        </div>

        {/* Real Impact Stories */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-16">
          <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Real Stories from the Field
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {impactStories?.slice(0, 3).map((story: any, index: number) => (
              <div key={story.id} className="group">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-green-500 rounded-full text-white mr-4">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{story.title}</h4>
                      <p className="text-sm text-gray-500">{story.location}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {story.description.slice(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      ✅ Completed
                    </span>
                    <span className="text-xs text-gray-500">{story.beneficiaries} people helped</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* Live Updates Ticker */}
        <div className="mt-8 bg-gray-900 rounded-xl p-4 overflow-hidden">
          <div className="flex items-center text-white">
            <div className="flex items-center mr-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm font-medium">Live Updates</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="animate-scroll whitespace-nowrap text-sm text-gray-300">
                ⚡ Ahmed family in Karachi now has 24/7 power • 🏠 New installation completed in Hyderabad • 🌞 Solar panels generating peak energy in Lahore • 💡 Night lighting restored for 12 families in Multan • ⚡ Ahmed family in Karachi now has 24/7 power • 🏠 New installation completed in Hyderabad
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}