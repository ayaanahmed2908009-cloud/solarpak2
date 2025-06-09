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
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-blue-100 px-6 py-3 rounded-full mb-6">
            <Sun className="w-5 h-5 text-green-600 mr-3" />
            <span className="font-semibold text-gray-700">Our Solar Solution</span>
          </div>
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            From Crisis to Comfort
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
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
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 transition-all duration-500 transform group-hover:scale-105 group-hover:shadow-2xl overflow-hidden relative">
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
                  
                  <div className="relative z-10">
                    {/* Icon and emoji transition */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="text-6xl transition-all duration-500 group-hover:scale-110">
                        {hoveredCard === index ? item.afterIcon : item.beforeIcon}
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
                    
                    {/* Impact description */}
                    <div className="bg-gray-50 group-hover:bg-green-50 rounded-xl p-4 transition-colors duration-300">
                      <p className="text-sm text-gray-600 group-hover:text-green-700 transition-colors duration-300">
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

        {/* Technical Excellence */}
        <div className="bg-gradient-to-br from-slate-800 to-blue-900 rounded-3xl p-8 text-white mb-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-8 left-8 w-24 h-24 border border-white rounded-full"></div>
            <div className="absolute bottom-8 right-8 w-16 h-16 border border-white rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold mb-4">World-Class Technology</h3>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                We use only the highest quality solar equipment, designed specifically for Pakistan's challenging climate conditions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {techSpecs.map((spec, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h4 className="text-2xl font-bold mb-4 text-yellow-300">{spec.label}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="opacity-90">Power/Capacity:</span>
                      <span className="font-semibold">{spec.power || spec.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-90">Lifespan/Backup:</span>
                      <span className="font-semibold">{spec.lifespan || spec.backup}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-90">Efficiency/Type:</span>
                      <span className="font-semibold">{spec.efficiency || spec.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <div className="inline-flex items-center bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold">
                <Shield className="w-6 h-6 mr-3" />
                <span>10-Year Warranty • 25-Year Performance Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Before & After Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Before */}
          <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl p-8 border border-red-200">
            <h3 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
              Before Solar
            </h3>
            <div className="space-y-4">
              <div className="flex items-center text-red-700">
                <span className="text-2xl mr-3">🔥</span>
                <span>Unbearable heat, no cooling</span>
              </div>
              <div className="flex items-center text-red-700">
                <span className="text-2xl mr-3">⚡</span>
                <span>16+ hours daily without power</span>
              </div>
              <div className="flex items-center text-red-700">
                <span className="text-2xl mr-3">📚</span>
                <span>Children can't study after dark</span>
              </div>
              <div className="flex items-center text-red-700">
                <span className="text-2xl mr-3">💸</span>
                <span>High electricity bills, food spoilage</span>
              </div>
            </div>
          </div>

          {/* After */}
          <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-8 border border-green-200">
            <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              After Solar
            </h3>
            <div className="space-y-4">
              <div className="flex items-center text-green-700">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <span>Cool, comfortable homes 24/7</span>
              </div>
              <div className="flex items-center text-green-700">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <span>Reliable power day and night</span>
              </div>
              <div className="flex items-center text-green-700">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <span>Children thrive with evening study</span>
              </div>
              <div className="flex items-center text-green-700">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <span>Zero electricity bills, fresh food</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Be Part of the Solution</h3>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Your donation doesn't just provide solar panels—it transforms entire families and communities. 
            Join us in bringing hope, comfort, and dignity to Pakistani families.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-lg">
            <div className="flex items-center bg-white/10 px-6 py-3 rounded-full">
              <Users className="w-5 h-5 mr-2" />
              <span>1 Donation = 1 Family Transformed</span>
            </div>
            <div className="flex items-center">
              <ArrowRight className="w-5 h-5 mx-2" />
            </div>
            <div className="flex items-center bg-white/10 px-6 py-3 rounded-full">
              <Heart className="w-5 h-5 mr-2" />
              <span>Immediate & Lasting Impact</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}