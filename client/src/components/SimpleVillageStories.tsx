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

  const family = families[currentFamily];

  const nextFamily = () => {
    setCurrentFamily((prev) => (prev + 1) % families.length);
    setShowAfter(false);
  };

  const prevFamily = () => {
    setCurrentFamily((prev) => (prev - 1 + families.length) % families.length);
    setShowAfter(false);
  };

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Real Stories, Real Impact
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Meet families whose lives were transformed by solar power
        </p>
      </div>

      {/* Family Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-4">
          {families.map((f, index) => (
            <button
              key={f.id}
              onClick={() => {
                setCurrentFamily(index);
                setShowAfter(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                index === currentFamily
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Story Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Family Info Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{family.name}</h3>
              <p className="text-blue-100">{family.age} years old, {family.occupation}</p>
              <div className="flex items-center gap-4 mt-2 text-blue-100">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{family.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{family.familySize} family members</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={prevFamily}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextFamily}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Before/After Toggle */}
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setShowAfter(false)}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  !showAfter
                    ? 'bg-red-500 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Before Solar
              </button>
              <button
                onClick={() => setShowAfter(true)}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  showAfter
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                After Solar
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative">
              <img
                src={showAfter ? family.afterImage : family.beforeImage}
                alt={`${family.name} ${showAfter ? 'after' : 'before'} solar installation`}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white font-medium ${
                showAfter ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {showAfter ? 'With Solar Power' : 'Without Solar Power'}
              </div>
            </div>

            {/* Story Content */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {showAfter ? 'The Solution' : 'The Challenge'}
                </h4>
                <p className="text-gray-700">
                  {showAfter ? family.solution : family.challenge}
                </p>
              </div>

              {showAfter && (
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Impact</h4>
                  <p className="text-gray-700">{family.impact}</p>
                </div>
              )}

              {/* Monthly Cost Comparison */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-gray-900 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Monthly Electricity Cost
                    </h5>
                    <p className="text-sm text-gray-600">
                      {showAfter ? 'After solar installation' : 'Before solar installation'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${
                      showAfter ? 'text-green-600' : 'text-red-600'
                    }`}>
                      PKR {showAfter ? family.monthlyBillAfter.toLocaleString() : family.monthlyBillBefore.toLocaleString()}
                    </div>
                    {showAfter && family.monthlyBillAfter === 0 && (
                      <div className="text-sm text-green-600 font-medium">
                        Saving PKR {family.monthlyBillBefore.toLocaleString()}/month!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <p className="text-lg text-gray-600 mb-6">
          Help more families like {family.name} get access to solar power
        </p>
        <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg">
          Make a Donation
        </button>
      </div>
    </div>
  );
}