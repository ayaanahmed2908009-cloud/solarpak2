import { useState, useEffect, useRef } from "react";
import { Zap, Sun, Clock, Thermometer, Heart, ArrowRight, CheckCircle, Battery, Shield, Lightbulb, Users } from "lucide-react";

export default function EnhancedSolutionSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const problemSolutions = [
    {
      problem: "45°C Heat with No AC",
      solution: "24/7 Solar-Powered Cooling",
      icon: Thermometer,
      beforeIcon: "🔥",
      afterIcon: "❄️",
      timeframe: "Immediate relief",
      impact: "Families sleep comfortably, children can focus on studies",
      color: "from-red-500 to-orange-500"
    },
    {
      problem: "12 Hours Daily Without Power",
      solution: "Continuous Energy Supply",
      icon: Clock,
      beforeIcon: "⚫",
      afterIcon: "💡",
      timeframe: "24/7 power",
      impact: "Businesses operate, medical equipment works, life continues",
      color: "from-blue-500 to-purple-600"
    },
    {
      problem: "High Electricity Bills",
      solution: "Zero Energy Costs",
      icon: Battery,
      beforeIcon: "💸",
      afterIcon: "💰",
      timeframe: "Savings start Day 1",
      impact: "Money saved goes to education, healthcare, and growth",
      color: "from-green-500 to-emerald-600"
    }
  ];

  const techSpecs = [
    { label: "Solar Panels", power: "300W each", lifespan: "25+ years", efficiency: "22%" },
    { label: "Battery Storage", capacity: "10kWh", backup: "3-5 days", type: "Lithium-ion" },
    { label: "Installation", time: "1 day", warranty: "10 years", maintenance: "Minimal" }
  ];

  return (
    <div ref={sectionRef} className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-blue-100 px-8 py-4 rounded-full mb-8 shadow-lg border border-green-200/50">
            <Sun className="w-6 h-6 text-green-600 mr-3 animate-pulse" />
            <span className="font-bold text-gray-700 text-lg">⚡ Our Solar Solution</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent drop-shadow-sm">
            From Crisis to Comfort
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-5xl mx-auto leading-relaxed font-medium">
            We don't just install solar panels—we transform lives. Our comprehensive solution brings immediate relief from heat, 
            reliable power, and long-term energy independence to Pakistani families.
          </p>
        </div>

        {/* Problem → Solution Transformation */}
        <div className="mb-16">
          <h3 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
            Every Problem Has Our Solution
          </h3>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto text-lg">
            We don't just install solar panels—we solve the specific problems Pakistani families face every day. 
            Hover over each card to see the transformation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {problemSolutions.map((item, index) => (
              <div
                key={index}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 transition-all duration-500 transform group-hover:scale-105 group-hover:shadow-2xl hover:-translate-y-2 overflow-hidden relative">
                  {/* Enhanced background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-15 transition-opacity duration-500 rounded-3xl`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                  
                  <div className="relative z-10">
                    {/* Enhanced icon and emoji transition */}
                    <div className="flex items-center justify-center mb-8">
                      <div className="relative">
                        <div className="text-7xl transition-all duration-500 group-hover:scale-110 filter drop-shadow-lg">
                          {hoveredCard === index ? item.afterIcon : item.beforeIcon}
                        </div>
                        <div className="absolute inset-0 text-7xl transition-all duration-500 group-hover:scale-110 animate-pulse opacity-0 group-hover:opacity-20">
                          {hoveredCard === index ? item.afterIcon : item.beforeIcon}
                        </div>
                      </div>
                    </div>
                    
                    {/* Problem/Solution text */}
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-bold text-red-600 mb-2 group-hover:text-green-600 transition-colors duration-300">
                        {hoveredCard === index ? "SOLVED:" : "PROBLEM:"}
                      </h4>
                      <p className="text-lg font-semibold text-gray-800 mb-2">
                        {hoveredCard === index ? item.solution : item.problem}
                      </p>
                      <div className="text-sm text-blue-600 font-medium">
                        {item.timeframe}
                      </div>
                    </div>
                    
                    {/* Enhanced impact description */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 group-hover:from-green-50 group-hover:to-blue-50 rounded-xl p-5 transition-all duration-300 border border-gray-100 group-hover:border-green-200 shadow-sm">
                      <p className="text-base text-gray-700 group-hover:text-green-800 transition-colors duration-300 font-medium leading-relaxed">
                        {item.impact}
                      </p>
                    </div>
                    
                    {/* Transformation arrow */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Technical Excellence */}
        <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 rounded-3xl p-10 md:p-12 text-white mb-20 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-8 left-8 w-32 h-32 border-2 border-white/30 rounded-full animate-pulse"></div>
            <div className="absolute bottom-8 right-8 w-20 h-20 border border-blue-300/50 rounded-full animate-ping"></div>
            <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-yellow-400/30 rounded-full blur-sm"></div>
            <div className="absolute top-1/4 right-1/3 w-4 h-4 bg-green-400/30 rounded-full blur-sm animate-pulse"></div>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-white/20">
                <Shield className="w-5 h-5 text-yellow-300 mr-3" />
                <span className="font-bold text-yellow-300">Premium Quality</span>
              </div>
              <h3 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent drop-shadow-lg">World-Class Technology</h3>
              <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed font-medium">
                We use only the highest quality solar equipment, designed specifically for Pakistan's challenging climate conditions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {techSpecs.map((spec, index) => (
                <div key={index} className="group bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/30 hover:border-white/50 transition-all duration-300 hover:bg-white/20 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      {index === 0 && <Sun className="w-6 h-6 text-white" />}
                      {index === 1 && <Battery className="w-6 h-6 text-white" />}
                      {index === 2 && <Shield className="w-6 h-6 text-white" />}
                    </div>
                    <h4 className="text-2xl font-bold text-yellow-300 group-hover:text-yellow-200 transition-colors duration-300">{spec.label}</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg group-hover:bg-white/15 transition-colors duration-300">
                      <span className="text-white/90 font-medium">Power/Capacity:</span>
                      <span className="font-bold text-yellow-300">{spec.power || spec.capacity}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg group-hover:bg-white/15 transition-colors duration-300">
                      <span className="text-white/90 font-medium">Lifespan/Backup:</span>
                      <span className="font-bold text-blue-300">{spec.lifespan || spec.backup}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg group-hover:bg-white/15 transition-colors duration-300">
                      <span className="text-white/90 font-medium">Efficiency/Type:</span>
                      <span className="font-bold text-green-300">{spec.efficiency || spec.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-16">
              <div className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-10 py-5 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-green-400/30">
                <Shield className="w-7 h-7 mr-4 animate-pulse" />
                <span>10-Year Warranty • 25-Year Performance Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Before & After Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Enhanced Before */}
          <div className="bg-gradient-to-br from-red-100 via-red-50 to-orange-100 rounded-3xl p-10 border-2 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-16 h-16 bg-red-400/20 rounded-full blur-xl"></div>
            <h3 className="text-3xl font-bold text-red-800 mb-8 flex items-center">
              <span className="w-4 h-4 bg-red-500 rounded-full mr-4 animate-pulse"></span>
              Before Solar
            </h3>
            <div className="space-y-5">
              <div className="flex items-center text-red-800 bg-red-50 p-4 rounded-xl border border-red-200">
                <span className="text-3xl mr-4 filter drop-shadow-sm">🔥</span>
                <span className="font-semibold text-lg">Unbearable heat, no cooling</span>
              </div>
              <div className="flex items-center text-red-800 bg-red-50 p-4 rounded-xl border border-red-200">
                <span className="text-3xl mr-4 filter drop-shadow-sm">⚡</span>
                <span className="font-semibold text-lg">16+ hours daily without power</span>
              </div>
              <div className="flex items-center text-red-800 bg-red-50 p-4 rounded-xl border border-red-200">
                <span className="text-3xl mr-4 filter drop-shadow-sm">📚</span>
                <span className="font-semibold text-lg">Children can't study after dark</span>
              </div>
              <div className="flex items-center text-red-800 bg-red-50 p-4 rounded-xl border border-red-200">
                <span className="text-3xl mr-4 filter drop-shadow-sm">💸</span>
                <span className="font-semibold text-lg">High electricity bills, food spoilage</span>
              </div>
            </div>
          </div>

          {/* Enhanced After */}
          <div className="bg-gradient-to-br from-green-100 via-green-50 to-blue-100 rounded-3xl p-10 border-2 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-16 h-16 bg-green-400/20 rounded-full blur-xl"></div>
            <h3 className="text-3xl font-bold text-green-800 mb-8 flex items-center">
              <span className="w-4 h-4 bg-green-500 rounded-full mr-4 animate-pulse"></span>
              After Solar
            </h3>
            <div className="space-y-5">
              <div className="flex items-center text-green-800 bg-green-50 p-4 rounded-xl border border-green-200 hover:bg-green-100 transition-colors duration-300">
                <CheckCircle className="w-7 h-7 text-green-600 mr-4 animate-pulse" />
                <span className="font-semibold text-lg">Cool, comfortable homes 24/7</span>
              </div>
              <div className="flex items-center text-green-800 bg-green-50 p-4 rounded-xl border border-green-200 hover:bg-green-100 transition-colors duration-300">
                <CheckCircle className="w-7 h-7 text-green-600 mr-4 animate-pulse" />
                <span className="font-semibold text-lg">Reliable power day and night</span>
              </div>
              <div className="flex items-center text-green-800 bg-green-50 p-4 rounded-xl border border-green-200 hover:bg-green-100 transition-colors duration-300">
                <CheckCircle className="w-7 h-7 text-green-600 mr-4 animate-pulse" />
                <span className="font-semibold text-lg">Children thrive with evening study</span>
              </div>
              <div className="flex items-center text-green-800 bg-green-50 p-4 rounded-xl border border-green-200 hover:bg-green-100 transition-colors duration-300">
                <CheckCircle className="w-7 h-7 text-green-600 mr-4 animate-pulse" />
                <span className="font-semibold text-lg">Zero electricity bills, fresh food</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-12 md:p-16 text-white text-center relative overflow-hidden shadow-2xl">
          {/* Background animation effects */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-8 left-8 w-24 h-24 bg-white/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-8 right-8 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-green-400/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center bg-white/15 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/30">
              <Heart className="w-5 h-5 text-yellow-300 mr-3 animate-pulse" />
              <span className="font-bold text-yellow-300">✨ TRANSFORM LIVES</span>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-yellow-200 drop-shadow-lg">Be Part of the Solution</h3>
            
            <p className="text-xl md:text-2xl text-white/95 mb-12 max-w-4xl mx-auto leading-relaxed font-medium" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              Your donation doesn't just provide solar panels—it transforms entire families and communities. 
              Join us in bringing hope, comfort, and dignity to Pakistani families.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-8 text-lg">
              <div className="group flex items-center bg-white/15 hover:bg-white/25 px-8 py-4 rounded-full border border-white/30 hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                <Users className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                <span className="font-semibold">1 Donation = 1 Family Transformed</span>
              </div>
              <div className="flex items-center animate-pulse">
                <ArrowRight className="w-6 h-6 mx-3 text-yellow-300" />
              </div>
              <div className="group flex items-center bg-white/15 hover:bg-white/25 px-8 py-4 rounded-full border border-white/30 hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                <Heart className="w-6 h-6 mr-3 group-hover:animate-pulse text-yellow-300" />
                <span className="font-semibold">Immediate & Lasting Impact</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}