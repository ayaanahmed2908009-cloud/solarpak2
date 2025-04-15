import { AlertCircle, Lightbulb, Heart } from "lucide-react";

export default function ProblemSection() {
  return (
    <section id="problem" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-800 mb-4">The Problem</h2>
          <p className="text-gray-600 text-lg">Millions in Pakistan face daily electricity shortages in extreme heat</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <h3 className="font-heading font-bold text-2xl mb-4 text-secondary">Life Without Reliable Power</h3>
            <p className="text-gray-700 mb-4">
              Across Pakistan, millions of people face up to 12+ hours of load shedding (power outages) every day. In the scorching summer months when temperatures regularly exceed 35°C (95°F), this creates unbearable living conditions.
            </p>
            <p className="text-gray-700 mb-4">
              Without electricity, families cannot run fans or air conditioning, refrigerate food, or power essential medical devices. Children struggle to study after dark, and businesses cannot operate consistently.
            </p>
            <p className="text-gray-700 mb-6">
              For many Pakistani families, expensive and polluting diesel generators are the only alternative during outages, creating both financial strain and environmental damage.
            </p>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-accent mb-4">
              <h4 className="font-heading font-semibold text-lg mb-2">Personal Experience</h4>
              <p className="text-gray-700 italic">
                "As a kid visiting Pakistan each summer, I experienced these electricity shortages firsthand. The heat was unbearable without AC in temperatures above 35°C. My family was fortunate enough to install solar panels, but most families can't afford this solution."
              </p>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1600490036275-35f5f1656861?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Family during a power outage in Pakistan" 
                className="w-full h-auto"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center mb-2">
                  <div className="text-accent mr-2">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <h4 className="font-heading font-semibold">Education Impact</h4>
                </div>
                <p className="text-sm text-gray-700">Students cannot study after sunset during power outages</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center mb-2">
                  <div className="text-accent mr-2">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h4 className="font-heading font-semibold">Health Risks</h4>
                </div>
                <p className="text-sm text-gray-700">Heat exhaustion and dehydration cases rise during outages</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
