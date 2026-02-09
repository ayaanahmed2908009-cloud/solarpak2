import { useState } from "react";
import { Sun, Clock, Thermometer, Heart, ArrowRight, CheckCircle, Battery, Shield, Users } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function EnhancedSolutionSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const sectionRef = useScrollReveal(0.08);

  const problemSolutions = [
    {
      problem: "45°C Heat with No AC",
      solution: "24/7 Solar-Powered Cooling",
      icon: Thermometer,
      timeframe: "Immediate relief",
      impact: "Families sleep comfortably, children can focus on studies",
      problemColor: "text-red-600",
      solutionColor: "text-emerald-700",
    },
    {
      problem: "12 Hours Daily Without Power",
      solution: "Continuous Energy Supply",
      icon: Clock,
      timeframe: "24/7 power",
      impact: "Businesses operate, medical equipment works, life continues",
      problemColor: "text-red-600",
      solutionColor: "text-emerald-700",
    },
    {
      problem: "High Electricity Bills",
      solution: "Zero Energy Costs",
      icon: Battery,
      timeframe: "Savings start Day 1",
      impact: "Money saved goes to education, healthcare, and growth",
      problemColor: "text-red-600",
      solutionColor: "text-emerald-700",
    }
  ];

  const techSpecs = [
    { label: "Solar Panels", power: "300W each", lifespan: "25+ years", efficiency: "22%" },
    { label: "Battery Storage", capacity: "10kWh", backup: "3-5 days", type: "Lithium-ion" },
    { label: "Installation", time: "1 day", warranty: "10 years", maintenance: "Minimal" }
  ];

  return (
    <div ref={sectionRef} className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <span className="inline-block text-emerald-700 font-semibold text-sm uppercase tracking-widest mb-4">
            Our Solar Solution
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            From Crisis to <span className="text-emerald-700">Comfort</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We don't just install solar panels — we transform lives. Our comprehensive solution brings immediate relief from heat, 
            reliable power, and long-term energy independence to Pakistani families.
          </p>
        </div>

        <div className="mb-20">
          <div className="scroll-reveal">
            <h3 className="text-3xl font-bold text-center mb-3 text-gray-900">
              Every Problem Has Our Solution
            </h3>
            <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
              We solve the specific problems Pakistani families face every day. 
              Hover over each card to see the transformation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {problemSolutions.map((item, index) => (
              <div
                key={index}
                className={`scroll-reveal stagger-delay-${index + 1} relative group cursor-pointer`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="bg-white rounded-xl p-8 border border-gray-200 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-emerald-900/5 group-hover:border-emerald-200 group-hover:-translate-y-1">
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-50 transition-all duration-500 group-hover:scale-110">
                      <item.icon className="w-6 h-6 text-gray-500 group-hover:text-emerald-600 transition-colors duration-500" />
                    </div>
                    
                    <div className="mb-1">
                      <span className={`text-xs font-semibold uppercase tracking-wide transition-colors duration-300 ${hoveredCard === index ? item.solutionColor : item.problemColor}`}>
                        {hoveredCard === index ? "Solution" : "Problem"}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mb-1">
                      {hoveredCard === index ? item.solution : item.problem}
                    </p>
                    <span className="text-sm text-gray-500">
                      {item.timeframe}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 group-hover:bg-emerald-50/50 rounded-lg p-4 transition-colors duration-500">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.impact}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="scroll-reveal-scale">
          <div className="bg-slate-900 rounded-xl p-10 md:p-14 text-white mb-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-600/5 rounded-full blur-3xl"></div>

            <div className="text-center mb-14 relative z-10 scroll-reveal">
              <span className="inline-block text-emerald-400 font-semibold text-sm uppercase tracking-widest mb-4">
                Premium Quality
              </span>
              <h3 className="text-4xl font-bold mb-4">World-Class Technology</h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                We use only the highest quality solar equipment, designed specifically for Pakistan's challenging climate conditions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {techSpecs.map((spec, index) => (
                <div key={index} className={`scroll-reveal stagger-delay-${index + 1}`}>
                  <div className="bg-white/5 rounded-xl p-8 border border-white/10 hover:border-emerald-500/30 hover:bg-white/[0.08] transition-all duration-500 h-full">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-emerald-900/60 rounded-lg flex items-center justify-center mr-4">
                        {index === 0 && <Sun className="w-5 h-5 text-emerald-400" />}
                        {index === 1 && <Battery className="w-5 h-5 text-emerald-400" />}
                        {index === 2 && <Shield className="w-5 h-5 text-emerald-400" />}
                      </div>
                      <h4 className="text-xl font-bold text-white">{spec.label}</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-400 text-sm">Power/Capacity</span>
                        <span className="font-semibold text-white text-sm">{spec.power || spec.capacity}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-400 text-sm">Lifespan/Backup</span>
                        <span className="font-semibold text-white text-sm">{spec.lifespan || spec.backup}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-400 text-sm">Efficiency/Type</span>
                        <span className="font-semibold text-emerald-400 text-sm">{spec.efficiency || spec.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-14 relative z-10 scroll-reveal">
              <div className="inline-flex items-center bg-emerald-900/40 text-emerald-300 px-8 py-4 rounded-lg text-sm font-semibold border border-emerald-700/30">
                <Shield className="w-5 h-5 mr-3" />
                10-Year Warranty &middot; 25-Year Performance Guarantee
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <div className="scroll-reveal-left">
            <div className="bg-red-50 rounded-xl p-10 border border-red-100 h-full hover:shadow-lg hover:shadow-red-900/5 transition-all duration-500">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
                Before Solar
              </h3>
              <div className="space-y-3">
                {["Unbearable heat, no cooling", "16+ hours daily without power", "Children can't study after dark", "High electricity bills, food spoilage"].map((item, i) => (
                  <div key={i} className="flex items-center bg-white p-4 rounded-lg border border-red-100 hover:border-red-200 transition-colors duration-300">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-4 flex-shrink-0"></span>
                    <span className="font-medium text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="scroll-reveal-right">
            <div className="bg-emerald-50 rounded-xl p-10 border border-emerald-100 h-full hover:shadow-lg hover:shadow-emerald-900/5 transition-all duration-500">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></span>
                After Solar
              </h3>
              <div className="space-y-3">
                {["Cool, comfortable homes 24/7", "Reliable power day and night", "Children thrive with evening study", "Zero electricity bills, fresh food"].map((item, i) => (
                  <div key={i} className="flex items-center bg-white p-4 rounded-lg border border-emerald-100 hover:border-emerald-200 transition-colors duration-300">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mr-4 flex-shrink-0" />
                    <span className="font-medium text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-reveal-scale">
          <div className="bg-emerald-900 rounded-xl p-12 md:p-16 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 right-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-32 h-32 bg-emerald-300/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <span className="inline-block text-emerald-300 font-semibold text-sm uppercase tracking-widest mb-4">
                Transform Lives
              </span>
              
              <h3 className="text-3xl md:text-4xl font-bold mb-6">Be Part of the Solution</h3>
              
              <p className="text-lg text-emerald-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                Your donation doesn't just provide solar panels — it transforms entire families and communities. 
                Join us in bringing hope, comfort, and dignity to Pakistani families.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-6">
                <div className="flex items-center bg-white/10 px-6 py-3 rounded-lg border border-white/10 hover:bg-white/15 transition-colors duration-300">
                  <Users className="w-5 h-5 mr-3 text-emerald-300" />
                  <span className="font-medium text-sm">1 Donation = 1 Family Transformed</span>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-300 hidden md:block" />
                <div className="flex items-center bg-white/10 px-6 py-3 rounded-lg border border-white/10 hover:bg-white/15 transition-colors duration-300">
                  <Heart className="w-5 h-5 mr-3 text-emerald-300" />
                  <span className="font-medium text-sm">Immediate &amp; Lasting Impact</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
