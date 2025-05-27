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
    livesImpacted: 2847,
    energyGenerated: 456789,
    co2Prevented: 234567,
    hoursOfPower: 123456,
    panelsInstalled: 847,
    homesEmpowered: 234
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
    const duration = 3000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounters({
        livesImpacted: Math.floor(finalNumbers.livesImpacted * progress),
        energyGenerated: Math.floor(finalNumbers.energyGenerated * progress),
        co2Prevented: Math.floor(finalNumbers.co2Prevented * progress),
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
                  +8 families this month
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
            <p className="text-sm text-green-700">Enough to power 1,520 homes for an entire month</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
            <div className="flex items-center mb-6">
              <div className="p-4 bg-blue-500 rounded-xl mr-6">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-blue-800 font-mono">
                  {counters.co2Prevented.toLocaleString()} kg
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
            <p className="text-sm text-blue-700">Equivalent to planting 2,847 trees this year</p>
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

        {/* Current Crisis Context */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 text-white text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div className="flex items-center justify-center">
              <Thermometer className="w-8 h-8 mr-3" />
              <div>
                <div className="text-3xl font-bold">{stats?.temperature || 42}°C</div>
                <div className="text-sm opacity-90">Current Temperature</div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Clock className="w-8 h-8 mr-3" />
              <div>
                <div className="text-3xl font-bold">{stats?.hoursWithoutPower || 14}h</div>
                <div className="text-sm opacity-90">Daily Power Outages</div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Users className="w-8 h-8 mr-3" />
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm opacity-90">Solar-Powered Homes</div>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-3">The Crisis Continues</h3>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            While we celebrate our progress, millions of Pakistani families still face extreme heat without reliable electricity. 
            Your continued support transforms lives daily.
          </p>
        </div>
      </div>
    </div>
  );
}