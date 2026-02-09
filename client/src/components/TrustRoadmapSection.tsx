import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Mail, Phone, Camera, ArrowRight, CheckCircle, Coffee } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  detail: string;
}

const roadmapSteps: RoadmapStep[] = [
  {
    id: 1,
    title: "Make Your Donation",
    description: "Support Pakistani families through our Ko-fi donation platform",
    icon: <span className="text-3xl">☕</span>,
    detail: "Choose your donation amount and complete the secure payment through Ko-fi. Your contribution directly funds solar panel installations for families in need."
  },
  {
    id: 2,
    title: "Share Your Contact Details",
    description: "We'll request your email and phone number through Ko-fi",
    icon: <span className="text-3xl">📧</span>,
    detail: "After your donation, we'll reach out through Ko-fi to collect your contact information so we can send you personalized impact updates."
  },
  {
    id: 3,
    title: "Receive Impact Updates",
    description: "Get photos and videos of your direct impact via email and SMS",
    icon: <span className="text-3xl">📸</span>,
    detail: "Watch your donation transform lives! Receive real photos and videos showing the solar panels being installed and the families they're helping."
  }
];

export default function TrustRoadmapSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useScrollReveal(0.1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % roadmapSteps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section 
      ref={(el) => {
        (sectionRef as any).current = el;
        if (scrollRef.current === null && el) {
          (scrollRef as any).current = el;
        }
      }}
      className="py-16 bg-white relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 scroll-reveal">
          <span className="inline-block text-emerald-700 font-semibold text-sm uppercase tracking-widest mb-4">
            Transparent Impact Tracking
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Journey of <span className="text-emerald-700">Impact</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See exactly how your donation transforms lives through our transparent three-step process
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="hidden md:block scroll-reveal">
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2 z-0">
                <div 
                  className="h-full bg-emerald-600 rounded-full transition-all duration-1000 ease-in-out"
                  style={{ 
                    width: isVisible ? `${((activeStep + 1) / roadmapSteps.length) * 100}%` : '0%' 
                  }}
                ></div>
              </div>

              <div className="relative flex justify-between items-center z-10">
                {roadmapSteps.map((step, index) => (
                  <div 
                    key={step.id}
                    className={`flex flex-col items-center cursor-pointer transition-all duration-700 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                    onClick={() => setActiveStep(index)}
                  >
                    <div className={`relative w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-500 mb-4 ${
                      index <= activeStep 
                        ? 'bg-white border-emerald-500 shadow-lg shadow-emerald-100 scale-110' 
                        : 'bg-white border-gray-300 hover:border-gray-400'
                    }`}>
                      {step.icon}
                      
                      {index <= activeStep && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="text-center max-w-64">
                      <h3 className={`font-bold text-lg mb-2 transition-colors duration-300 ${
                        index <= activeStep ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-sm transition-colors duration-300 ${
                        index <= activeStep ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:hidden space-y-6">
            {roadmapSteps.map((step, index) => (
              <div 
                key={step.id}
                className={`scroll-reveal stagger-delay-${index + 1}`}
              >
                <Card className={`transition-all duration-500 ${
                  index <= activeStep ? 'shadow-lg border-emerald-200' : 'shadow-sm border-gray-200'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
                        index <= activeStep 
                          ? 'bg-white border-emerald-500 shadow-lg' 
                          : 'bg-white border-gray-300'
                      }`}>
                        {step.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-emerald-700">Step {step.id}</span>
                          {index <= activeStep && (
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                          )}
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-gray-900">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="mt-12 scroll-reveal-scale">
            <Card className="bg-emerald-50 border-emerald-200 shadow-sm hover:shadow-md transition-all duration-500">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-white border-4 border-emerald-500 flex items-center justify-center shadow-lg">
                    {roadmapSteps[activeStep].icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-emerald-600">Currently Highlighted</span>
                      <ArrowRight className="h-4 w-4 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {roadmapSteps[activeStep].title}
                    </h3>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {roadmapSteps[activeStep].detail}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { emoji: "✅", title: "100% Transparent", desc: "Every donation is tracked and documented with real photos and videos" },
              { emoji: "💚", title: "Direct Impact", desc: "Your donation goes directly to solar panel installations for families" },
              { emoji: "📱", title: "Personal Updates", desc: "Receive personalized impact reports directly to your email and phone" },
            ].map((item, i) => (
              <div key={i} className={`scroll-reveal stagger-delay-${i + 1}`}>
                <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-100 transition-all duration-500 hover:-translate-y-1 h-full">
                  <div className="w-12 h-12 bg-white border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">{item.emoji}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 scroll-reveal">
            <Button 
              size="lg" 
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/20"
              onClick={() => window.open('https://ko-fi.com/solarpak', '_blank')}
            >
              Start Your Impact Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-gray-500 mt-3">
              Secure donation processing through Ko-fi
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
