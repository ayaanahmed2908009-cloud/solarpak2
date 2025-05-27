import { useState, useEffect, useRef } from "react";
import { Zap, Sun, Home, Users, Lightbulb, Fan, Wifi, Heart, ArrowRight, CheckCircle } from "lucide-react";

export default function EnhancedSolutionSection() {
  const [activeStep, setActiveStep] = useState(0);
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

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % 4);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const solutionSteps = [
    {
      icon: Sun,
      title: "Solar Panel Installation",
      description: "High-efficiency solar panels designed for Pakistan's intense sunlight",
      details: "Our panels capture maximum energy even in extreme heat, providing 8-12 hours of power daily",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Zap,
      title: "Battery Storage System",
      description: "Advanced batteries store energy for nighttime and cloudy days",
      details: "Lithium-ion technology ensures families have power 24/7, even during grid outages",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Home,
      title: "Smart Home Integration",
      description: "Intelligent power management for optimal energy distribution",
      details: "Automatic switching between solar, battery, and grid power for maximum efficiency",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: Heart,
      title: "Life Transformation",
      description: "Immediate relief and long-term empowerment for families",
      details: "Children can study at night, businesses can operate, and families can live with dignity",
      color: "from-red-500 to-pink-600"
    }
  ];

  const benefits = [
    { icon: Fan, text: "Cool homes with AC & fans", impact: "Comfortable living in 45°C heat" },
    { icon: Lightbulb, text: "24/7 lighting for all rooms", impact: "Children can study after dark" },
    { icon: Wifi, text: "Reliable internet & devices", impact: "Connection to opportunities" },
    { icon: Home, text: "Refrigeration for food", impact: "Healthier meals & less waste" }
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

        {/* Cost Breakdown & Donation Impact */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl mb-16 border border-gray-100">
          <h3 className="text-3xl font-bold text-center mb-4 text-gray-800">See Exactly Where Your Money Goes</h3>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Complete transparency. Every dollar makes a direct impact. Click to see how much each component costs and what it provides.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solutionSteps.map((step, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl transition-all duration-500 cursor-pointer border-2 group hover:scale-105 ${
                  activeStep === index
                    ? 'bg-gradient-to-br ' + step.color + ' text-white border-transparent shadow-2xl scale-105'
                    : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:shadow-lg'
                }`}
                onClick={() => setActiveStep(index)}
              >
                <div className="text-center">
                  <div className={`p-4 rounded-xl mx-auto mb-4 w-fit ${activeStep === index ? 'bg-white/20' : 'bg-white group-hover:bg-blue-50'}`}>
                    <step.icon className={`w-10 h-10 ${activeStep === index ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}`} />
                  </div>
                  
                  <h4 className={`text-xl font-bold mb-3 ${activeStep === index ? 'text-white' : 'text-gray-800'}`}>
                    {step.title}
                  </h4>
                  
                  <div className={`text-3xl font-bold mb-2 ${activeStep === index ? 'text-white' : 'text-blue-600'}`}>
                    ${index === 0 ? '150' : index === 1 ? '200' : index === 2 ? '100' : '50'}
                  </div>
                  
                  <p className={`text-sm mb-4 ${activeStep === index ? 'text-white/90' : 'text-gray-600'}`}>
                    {step.description}
                  </p>
                  
                  <div className={`text-xs font-semibold px-3 py-2 rounded-full ${
                    activeStep === index ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                  }`}>
                    Click to see impact
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Impact Details */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
            <div className="text-center">
              <h4 className="text-2xl font-bold text-gray-800 mb-3">
                {solutionSteps[activeStep].title} Impact
              </h4>
              <p className="text-lg text-gray-600 mb-4">
                {solutionSteps[activeStep].details}
              </p>
              <div className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-full font-semibold">
                <span>Total System Cost: $500 = One Family Transformed Forever</span>
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