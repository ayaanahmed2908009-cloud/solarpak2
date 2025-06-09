import { AlertCircle, Heart } from "lucide-react";

export default function ProblemSection() {
  return (
    <section id="problem" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-4xl md:text-5xl gradient-text mb-6">
              The Crisis
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              12+ hours of daily power outages in 35°C+ heat leaves millions without basic electricity
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 className="font-heading font-bold text-xl mb-3 text-primary">The Reality</h3>
                <p className="text-gray-700 leading-relaxed">
                  Families endure extreme heat without fans, can't refrigerate food, and children study by candlelight. 
                  Expensive diesel generators are the only alternative for those who can afford them.
                </p>
              </div>
              
              <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                <h4 className="font-semibold text-lg mb-2 text-primary">Personal Connection</h4>
                <p className="text-gray-700 italic">
                  "Experiencing 35°C+ heat without electricity during childhood visits to Pakistan inspired this mission. 
                  Solar panels transformed our family's comfort, but most can't access this solution."
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="text-3xl font-bold text-red-600 mb-2">12+</div>
                    <div className="text-sm text-gray-600">Hours without power daily</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                      <Heart className="w-8 h-8 text-orange-600" />
                    </div>
                    <div className="text-3xl font-bold text-orange-600 mb-2">35°C+</div>
                    <div className="text-sm text-gray-600">Extreme heat temperatures</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}