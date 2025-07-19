import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Mail, Phone, Camera, ArrowRight, CheckCircle, Coffee } from "lucide-react";

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
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

  // Auto-advance through steps
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % roadmapSteps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section 
      ref={sectionRef}
      className="py-16 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-green-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <CheckCircle className="h-4 w-4" />
              Transparent Impact Tracking
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Journey of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">Impact</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See exactly how your donation transforms lives through our transparent three-step process
            </p>
          </div>
        </div>

        {/* Roadmap Timeline */}
        <div className="max-w-6xl mx-auto">
          {/* Desktop Timeline */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2 z-0">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 via-blue-500 to-green-500 rounded-full transition-all duration-1000 ease-in-out"
                  style={{ 
                    width: isVisible ? `${((activeStep + 1) / roadmapSteps.length) * 100}%` : '0%' 
                  }}
                ></div>
              </div>

              {/* Timeline Steps */}
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
                    {/* Step Circle */}
                    <div className={`relative w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-500 mb-4 ${
                      index <= activeStep 
                        ? 'bg-white border-green-500 shadow-lg scale-110' 
                        : 'bg-white border-gray-300'
                    }`}>
                      {step.icon}
                      
                      {index <= activeStep && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Step Info */}
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

          {/* Mobile Timeline */}
          <div className="md:hidden space-y-6">
            {roadmapSteps.map((step, index) => (
              <div 
                key={step.id}
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <Card className={`transition-all duration-500 ${
                  index <= activeStep ? 'shadow-lg border-blue-200' : 'shadow-sm border-gray-200'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
                        index <= activeStep 
                          ? 'bg-white border-green-500 shadow-lg' 
                          : 'bg-white border-gray-300'
                      }`}>
                        {step.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-blue-600">Step {step.id}</span>
                          {index <= activeStep && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
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

          {/* Active Step Detail Card */}
          <div className={`mt-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-white border-4 border-green-500 flex items-center justify-center shadow-lg">
                    {roadmapSteps[activeStep].icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-green-600">Currently Highlighted</span>
                      <ArrowRight className="h-4 w-4 text-green-600" />
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

          {/* Trust Indicators */}
          <div className={`mt-12 grid md:grid-cols-3 gap-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-white border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">100% Transparent</h4>
              <p className="text-sm text-gray-600">Every donation is tracked and documented with real photos and videos</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-white border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💚</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Direct Impact</h4>
              <p className="text-sm text-gray-600">Your donation goes directly to solar panel installations for families</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-white border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Personal Updates</h4>
              <p className="text-sm text-gray-600">Receive personalized impact reports directly to your email and phone</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className={`text-center mt-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
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