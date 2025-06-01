import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Users, Zap, DollarSign } from "lucide-react";

interface FamilyStory {
  id: string;
  name: string;
  age: number;
  occupation: string;
  location: string;
  familySize: number;
  beforeImage: string;
  afterImage: string;
  monthlyBillBefore: number;
  monthlyBillAfter: number;
  challenge: string;
  solution: string;
  impact: string;
}

const families: FamilyStory[] = [
  {
    id: "fatima",
    name: "Fatima Ahmed",
    age: 34,
    occupation: "Teacher",
    location: "Rural Sindh",
    familySize: 5,
    beforeImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop",
    monthlyBillBefore: 15000,
    monthlyBillAfter: 0,
    challenge: "Power outages for 14 hours daily. Children can't study after sunset. Generator costs PKR 500 per day.",
    solution: "Solar panels installed on rooftop providing 24/7 clean electricity for the entire household.",
    impact: "Children now study in the evening. Family saves PKR 15,000 monthly. Small business started from home."
  },
  {
    id: "hassan",
    name: "Hassan Ali",
    age: 42,
    occupation: "Farmer",
    location: "Punjab Villages",
    familySize: 6,
    beforeImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop",
    monthlyBillBefore: 12000,
    monthlyBillAfter: 0,
    challenge: "No electricity for farming equipment. Crops spoiling due to lack of irrigation pumps.",
    solution: "Solar-powered irrigation system and home electricity from a comprehensive solar setup.",
    impact: "Crop yield increased by 40%. Children have lights for homework. Family income doubled."
  },
  {
    id: "aisha",
    name: "Aisha Khan",
    age: 29,
    occupation: "Nurse",
    location: "Lahore Suburbs",
    familySize: 4,
    beforeImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop",
    monthlyBillBefore: 18000,
    monthlyBillAfter: 0,
    challenge: "High electricity bills consume 60% of income. Can't afford children's education expenses.",
    solution: "Complete solar installation eliminates electricity costs and provides energy independence.",
    impact: "Now affords children's school fees. Planning family vacation. Started education savings fund."
  }
];

export default function SimpleVillageStories() {
  const [currentFamily, setCurrentFamily] = useState(0);
  const [showAfter, setShowAfter] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const family = families[currentFamily];

  const nextFamily = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentFamily((prev) => (prev + 1) % families.length);
      setShowAfter(false);
      setIsTransitioning(false);
    }, 150);
  };

  const prevFamily = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentFamily((prev) => (prev - 1 + families.length) % families.length);
      setShowAfter(false);
      setIsTransitioning(false);
    }, 150);
  };

  const switchFamily = (index: number) => {
    if (index !== currentFamily) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentFamily(index);
        setShowAfter(false);
        setIsTransitioning(false);
      }, 150);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      {/* Header with Cuberto-style animation */}
      <div className="text-center mb-16 overflow-hidden">
        <div className="animate-slide-up">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Real Stories, Real Impact
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Meet families whose lives were transformed by solar power
          </p>
        </div>
      </div>

      {/* Enhanced Family Navigation with hover effects */}
      <div className="flex justify-center mb-12">
        <div className="flex space-x-2 bg-gray-100 rounded-2xl p-2">
          {families.map((f, index) => (
            <button
              key={f.id}
              onClick={() => switchFamily(index)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                index === currentFamily
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Story Card with Cuberto-style design */}
      <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
        isTransitioning ? 'opacity-80 scale-98' : 'opacity-100 scale-100'
      } hover:shadow-3xl`}>
        {/* Family Info Header with gradient and glassmorphism */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white p-8">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold tracking-tight">{family.name}</h3>
              <p className="text-blue-100 text-lg">{family.age} years old, {family.occupation}</p>
              <div className="flex items-center gap-6 mt-4 text-blue-100">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                  <MapPin className="w-4 h-4" />
                  <span>{family.location}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                  <Users className="w-4 h-4" />
                  <span>{family.familySize} family members</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={prevFamily}
                className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextFamily}
                className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all duration-200 hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Before/After Toggle with Cuberto-style morphing */}
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <div className="relative bg-gray-100 rounded-2xl p-2 shadow-inner">
              <div className={`absolute top-2 bottom-2 w-1/2 bg-gradient-to-r rounded-xl shadow-lg transition-all duration-500 ease-out ${
                showAfter 
                  ? 'left-1/2 from-green-500 to-emerald-600' 
                  : 'left-2 from-red-500 to-orange-600'
              }`}></div>
              <div className="relative flex">
                <button
                  onClick={() => setShowAfter(false)}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex-1 text-center ${
                    !showAfter
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Before Solar
                </button>
                <button
                  onClick={() => setShowAfter(true)}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex-1 text-center ${
                    showAfter
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  After Solar
                </button>
              </div>
            </div>
          </div>

          {/* Content with enhanced animations */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Enhanced Image Section */}
            <div className="relative group">
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <img
                  src={showAfter ? family.afterImage : family.beforeImage}
                  alt={`${family.name} ${showAfter ? 'after' : 'before'} solar installation`}
                  className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className={`absolute top-6 left-6 px-4 py-2 rounded-full text-white font-semibold backdrop-blur-sm transition-all duration-500 ${
                  showAfter ? 'bg-green-500/90' : 'bg-red-500/90'
                }`}>
                  {showAfter ? '✨ With Solar Power' : '⚡ Without Solar Power'}
                </div>
              </div>
              
              {/* Floating elements for visual interest */}
              <div className={`absolute -top-4 -right-4 w-8 h-8 rounded-full transition-all duration-500 ${
                showAfter ? 'bg-green-400' : 'bg-red-400'
              } animate-pulse`}></div>
              <div className={`absolute -bottom-4 -left-4 w-6 h-6 rounded-full transition-all duration-700 ${
                showAfter ? 'bg-green-300' : 'bg-red-300'
              } animate-pulse delay-300`}></div>
            </div>

            {/* Enhanced Story Content */}
            <div className="space-y-8">
              <div className="relative">
                <div className={`absolute -left-4 top-0 w-1 h-full rounded-full transition-all duration-500 ${
                  showAfter ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <h4 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                  showAfter ? 'text-green-800' : 'text-red-800'
                }`}>
                  {showAfter ? '✨ The Solution' : '⚡ The Challenge'}
                </h4>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {showAfter ? family.solution : family.challenge}
                </p>
              </div>

              {showAfter && (
                <div className="animate-slide-up">
                  <h4 className="text-2xl font-bold text-green-800 mb-4">🌟 Life-Changing Impact</h4>
                  <p className="text-gray-700 text-lg leading-relaxed">{family.impact}</p>
                </div>
              )}

              {/* Enhanced Monthly Cost Comparison */}
              <div className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-500 ${
                showAfter ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200' : 'bg-gradient-to-br from-red-50 to-orange-50 border border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className={`font-bold text-xl flex items-center gap-3 transition-colors duration-300 ${
                      showAfter ? 'text-green-800' : 'text-red-800'
                    }`}>
                      <DollarSign className="w-6 h-6" />
                      Monthly Electricity Cost
                    </h5>
                    <p className="text-gray-600 mt-1">
                      {showAfter ? 'After solar installation' : 'Before solar installation'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-4xl font-bold transition-all duration-500 ${
                      showAfter ? 'text-green-600' : 'text-red-600'
                    }`}>
                      PKR {showAfter ? family.monthlyBillAfter.toLocaleString() : family.monthlyBillBefore.toLocaleString()}
                    </div>
                    {showAfter && family.monthlyBillAfter === 0 && (
                      <div className="text-green-600 font-semibold mt-2 animate-pulse">
                        💰 Saving PKR {family.monthlyBillBefore.toLocaleString()}/month!
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl transition-all duration-500 ${
                  showAfter ? 'bg-green-200/50' : 'bg-red-200/50'
                }`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Call to Action with Cuberto-style design */}
      <div className="text-center mt-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-orange-50 rounded-3xl transform -rotate-1"></div>
        <div className="relative bg-white rounded-3xl p-12 shadow-2xl border border-gray-100">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Help More Families Like {family.name}
            </h3>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Every donation brings clean, reliable solar power to families who need it most. 
              Transform lives, one solar panel at a time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-10 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                <span className="relative z-10">Make a Donation</span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
              
              <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                <span className="font-medium">PKR {family.monthlyBillBefore.toLocaleString()}</span> can sponsor one family for a month
              </div>
            </div>
          </div>
          
          {/* Floating decorative elements */}
          <div className="absolute top-4 right-8 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 left-8 w-4 h-4 bg-blue-400 rounded-full animate-pulse delay-500"></div>
          <div className="absolute top-1/2 right-4 w-2 h-2 bg-green-400 rounded-full animate-pulse delay-1000"></div>
        </div>
      </div>
    </div>
  );
}