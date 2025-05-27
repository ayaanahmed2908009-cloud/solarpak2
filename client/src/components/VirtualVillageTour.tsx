import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, MapPin, Users, Thermometer, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface VillageScene {
  id: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  temperature: number;
  powerOutageHours: number;
  familiesAffected: number;
  location: string;
  story: string;
}

export default function VirtualVillageTour() {
  const [currentScene, setCurrentScene] = useState(0);
  const [showAfter, setShowAfter] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);

  const villages: VillageScene[] = [
    {
      id: "1",
      title: "Hassan's Family Home - Interior Sindh",
      description: "A family of 6 struggling with 16-hour daily power outages in 45°C heat",
      beforeImage: "🏠💔", // Would be actual images in production
      afterImage: "🏠✨☀️",
      temperature: 45,
      powerOutageHours: 16,
      familiesAffected: 1,
      location: "Tharparkar, Sindh",
      story: "Hassan's children couldn't study after sunset. His wife's sewing business failed without reliable power. The oppressive heat made sleep impossible without fans."
    },
    {
      id: "2", 
      title: "Village School - Rural Punjab",
      description: "150 students learning in extreme heat without electricity",
      beforeImage: "🏫🔥📚",
      afterImage: "🏫⚡📚✨",
      temperature: 42,
      powerOutageHours: 12,
      familiesAffected: 150,
      location: "Jhang, Punjab",
      story: "The village school had no electricity for fans or lights. Students fainted from heat exhaustion. Evening classes were impossible, limiting education opportunities."
    },
    {
      id: "3",
      title: "Community Health Center",
      description: "Medical clinic serving 500 families without reliable power",
      beforeImage: "🏥😰💉",
      afterImage: "🏥⚡💊✅",
      temperature: 40,
      powerOutageHours: 14,
      familiesAffected: 500,
      location: "Layyah, Punjab", 
      story: "Dr. Fatima couldn't store vaccines properly. Surgery lights failed during operations. Patients suffered in the sweltering heat without air conditioning."
    }
  ];

  const currentVillage = villages[currentScene];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentScene((prev) => (prev + 1) % villages.length);
        setShowAfter(false);
        setSliderPosition(0);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, villages.length]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSliderPosition(value);
    setShowAfter(value > 50);
  };

  const resetView = () => {
    setSliderPosition(0);
    setShowAfter(false);
  };

  return (
    <div className="py-16 bg-gradient-to-b from-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Virtual Village Experience
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Step into the lives of Pakistani families facing extreme heat and power shortages. 
            See the transformation your donations create.
          </p>
          
          <div className="flex justify-center space-x-4 mb-8">
            <Button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              {isAutoPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isAutoPlaying ? 'Pause Tour' : 'Start Auto Tour'}
            </Button>
            <Button onClick={resetView} variant="outline" size="sm" className="flex items-center">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset View
            </Button>
          </div>
        </div>

        {/* Scene Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {villages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentScene(index);
                  setIsAutoPlaying(false);
                  resetView();
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentScene 
                    ? 'bg-orange-500 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Village View */}
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              {/* Village Stats Header */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">{currentVillage.title}</h3>
                  <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{currentVillage.location}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Thermometer className="w-5 h-5 mr-1" />
                      <span className="text-2xl font-bold">{currentVillage.temperature}°C</span>
                    </div>
                    <p className="text-sm opacity-90">Extreme Heat</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="w-5 h-5 mr-1" />
                      <span className="text-2xl font-bold">{currentVillage.powerOutageHours}h</span>
                    </div>
                    <p className="text-sm opacity-90">Daily Outages</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="w-5 h-5 mr-1" />
                      <span className="text-2xl font-bold">{currentVillage.familiesAffected}</span>
                    </div>
                    <p className="text-sm opacity-90">Families Affected</p>
                  </div>
                </div>
                
                <p className="text-white/90">{currentVillage.description}</p>
              </div>

              {/* Interactive Before/After View */}
              <div className="relative bg-gray-100 h-96 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4 transition-all duration-500">
                      {showAfter ? currentVillage.afterImage : currentVillage.beforeImage}
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-lg max-w-md">
                      <h4 className="font-bold text-lg mb-2">
                        {showAfter ? "After Solar Installation ✨" : "Before Solar Power 😓"}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {showAfter 
                          ? "Reliable electricity, cool homes, thriving businesses, and bright futures!"
                          : currentVillage.story
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Overlay gradient based on condition */}
                <div className={`absolute inset-0 transition-all duration-500 ${
                  showAfter 
                    ? 'bg-gradient-to-t from-green-500/20 to-blue-500/20' 
                    : 'bg-gradient-to-t from-red-500/30 to-orange-500/30'
                }`}></div>
              </div>

              {/* Interactive Slider */}
              <div className="p-6 bg-white">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drag to see the transformation your donation creates:
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderPosition}
                      onChange={handleSliderChange}
                      className="w-full h-3 bg-gradient-to-r from-red-400 to-green-400 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Crisis</span>
                      <span>Hope</span>
                      <span>Transformation</span>
                    </div>
                  </div>
                </div>

                {/* Impact Message */}
                <div className="text-center">
                  {showAfter ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h5 className="font-bold text-green-800 mb-2">🎉 Transformation Complete!</h5>
                      <p className="text-green-700">
                        Your donation brought reliable electricity, cooling relief, and renewed hope to this community.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h5 className="font-bold text-orange-800 mb-2">💔 The Reality Today</h5>
                      <p className="text-orange-700">
                        Families are suffering in extreme heat without reliable power. Your help can change this.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Be the Change They Need</h3>
            <p className="mb-6">
              Every solar panel installation transforms lives. Your donation doesn't just provide electricity - 
              it brings dignity, opportunity, and hope to families facing Pakistan's energy crisis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                🌟 Transform a Village - $500
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                💝 Help One Family - $100
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid #3b82f6;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}