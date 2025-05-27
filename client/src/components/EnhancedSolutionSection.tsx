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

        {/* Interactive Solution Process */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl mb-16 border border-gray-100">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">How We Transform Lives</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Process Steps */}
            <div className="space-y-6">
              {solutionSteps.map((step, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl transition-all duration-500 cursor-pointer border-2 ${
                    activeStep === index
                      ? 'bg-gradient-to-r ' + step.color + ' text-white border-transparent transform scale-105 shadow-xl'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${activeStep === index ? 'bg-white/20' : 'bg-white'}`}>
                      <step.icon className={`w-8 h-8 ${activeStep === index ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-xl font-bold mb-2 ${activeStep === index ? 'text-white' : 'text-gray-800'}`}>
                        {step.title}
                      </h4>
                      <p className={`text-sm mb-3 ${activeStep === index ? 'text-white/90' : 'text-gray-600'}`}>
                        {step.description}
                      </p>
                      <p className={`text-xs ${activeStep === index ? 'text-white/80' : 'text-gray-500'}`}>
                        {step.details}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Representation */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-transparent"></div>
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Home className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold mb-2">Pakistani Family Home</h4>
                    <p className="text-white/80">Powered by Solar Energy</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className={`bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 transition-all duration-300 ${
                          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                        style={{ transitionDelay: `${index * 200}ms` }}
                      >
                        <div className="flex items-center mb-2">
                          <benefit.icon className="w-5 h-5 text-yellow-300 mr-2" />
                          <span className="font-semibold text-sm">{benefit.text}</span>
                        </div>
                        <p className="text-xs text-white/70">{benefit.impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
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