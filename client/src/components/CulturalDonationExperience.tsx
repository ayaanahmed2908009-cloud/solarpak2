import { useState, useEffect } from "react";
import { Heart, Star, Moon, Sun, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import DonationModal from "@/components/DonationModal";

interface FamilyStory {
  id: string;
  name: string;
  location: string;
  story: string;
  needAmount: number;
  raisedAmount: number;
  image: string;
  culturalGreeting: string;
}

export default function CulturalDonationExperience() {
  const [selectedFamily, setSelectedFamily] = useState<FamilyStory | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showRamadanSpecial, setShowRamadanSpecial] = useState(false);

  const families: FamilyStory[] = [
    {
      id: "1",
      name: "Ahmed Family",
      location: "Interior Sindh",
      story: "Ahmed's children study by candlelight. Their small business struggles without reliable electricity. Solar panels would transform their daily life.",
      needAmount: 500,
      raisedAmount: 320,
      image: "👨‍👩‍👧‍👦",
      culturalGreeting: "السلام علیکم - Your kindness brings light to our home"
    },
    {
      id: "2", 
      name: "Fatima's Tailoring Shop",
      location: "Rural Punjab",
      story: "Fatima runs a tailoring business from home but loses customers due to power outages. Solar energy would secure her family's income.",
      needAmount: 750,
      raisedAmount: 450,
      image: "✂️",
      culturalGreeting: "آپ کا شکریہ - Thank you for believing in our dreams"
    },
    {
      id: "3",
      name: "Ali's Medical Clinic",
      location: "Balochistan",
      story: "Dr. Ali serves remote villages but equipment fails during outages. Solar power would save lives in his community clinic.",
      needAmount: 1200,
      raisedAmount: 800,
      image: "🏥",
      culturalGreeting: "بہت شکریہ - Your donation heals our community"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Check if it's Ramadan season (simulate for demo)
    const month = new Date().getMonth();
    setShowRamadanSpecial(month === 3 || month === 4); // April/May for demo

    return () => clearInterval(timer);
  }, []);

  const getPakistanTime = () => {
    const pakistanTime = new Date(currentTime.getTime() + (5 * 60 * 60 * 1000)); // UTC+5
    return pakistanTime.toLocaleTimeString('en-US', { 
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeOfDayMessage = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { message: "Good Morning! Start your day with kindness", icon: "🌅" };
    if (hour < 17) return { message: "Afternoon Blessings! Help families stay cool", icon: "☀️" };
    if (hour < 20) return { message: "Evening Peace! Light up homes after dark", icon: "🌆" };
    return { message: "Night Mercy! Bring comfort to families", icon: "🌙" };
  };

  const timeMessage = getTimeOfDayMessage();

  return (
    <div className="py-16 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
      {/* Pakistani Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '60px 60px'
             }}>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Pakistani Time and Cultural Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-green-100 px-6 py-3 rounded-full mb-6 border border-green-200">
            <span className="text-2xl mr-2">🇵🇰</span>
            <div className="text-center">
              <div className="text-sm text-green-700 font-medium">Pakistan Time</div>
              <div className="text-lg font-bold text-green-800">{getPakistanTime()}</div>
            </div>
          </div>

          <div className="flex items-center justify-center mb-6">
            <span className="text-3xl mr-3">{timeMessage.icon}</span>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {timeMessage.message}
            </h2>
          </div>

          {showRamadanSpecial && (
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-6 border border-purple-200">
              <div className="flex items-center justify-center">
                <span className="text-2xl mr-2">🌙</span>
                <div>
                  <h3 className="font-bold text-purple-800">Ramadan Mubarak Special</h3>
                  <p className="text-purple-600">Double the blessing - your donations matched this month!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Family Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {families.map((family) => {
            const progressPercentage = (family.raisedAmount / family.needAmount) * 100;
            
            return (
              <div 
                key={family.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer"
                onClick={() => setSelectedFamily(family)}
              >
                {/* Family Emoji/Image */}
                <div className="text-center mb-4">
                  <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {family.image}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{family.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center justify-center">
                    📍 {family.location}
                  </p>
                </div>

                {/* Cultural Greeting */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 mb-4 text-center">
                  <p className="text-sm text-gray-700 italic">"{family.culturalGreeting}"</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Raised</span>
                    <span className="font-medium">${family.raisedAmount} / ${family.needAmount}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{Math.round(progressPercentage)}% funded</p>
                </div>

                {/* Story Preview */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{family.story}</p>

                {/* Action Button */}
                <DonationModal 
                  buttonText="Help This Family 💝"
                  buttonVariant="default"
                  buttonSize="sm"
                  fullWidth={true}
                  suggestedAmount={family.needAmount - family.raisedAmount}
                />
              </div>
            );
          })}
        </div>

        {/* Islamic Values Section */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-emerald-800 mb-3">
              🤲 Blessed Giving - Following Islamic Values
            </h3>
            <p className="text-emerald-700 max-w-3xl mx-auto">
              "The believer is not one who eats his fill while his neighbor goes hungry" - Prophet Muhammad (PBUH)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">💝</div>
              <h4 className="font-bold text-emerald-800 mb-2">Sadaqah</h4>
              <p className="text-sm text-emerald-600">Your voluntary charity brings continuous rewards</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🌟</div>
              <h4 className="font-bold text-emerald-800 mb-2">Barakah</h4>
              <p className="text-sm text-emerald-600">Blessings multiply when you help others</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🤝</div>
              <h4 className="font-bold text-emerald-800 mb-2">Unity</h4>
              <p className="text-sm text-emerald-600">Pakistani community supporting Pakistani families</p>
            </div>
          </div>
        </div>

        {/* Quick Donation Amounts with Pakistani Context */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Impact Donations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DonationModal 
              buttonText="$25 - One Day Power"
              buttonVariant="outline"
              suggestedAmount={25}
              fullWidth={true}
            />
            <DonationModal 
              buttonText="$50 - One Week Light"
              buttonVariant="outline"
              suggestedAmount={50}
              fullWidth={true}
            />
            <DonationModal 
              buttonText="$100 - One Month Relief"
              buttonVariant="outline"
              suggestedAmount={100}
              fullWidth={true}
            />
            <DonationModal 
              buttonText="$500 - Full Solar Kit"
              buttonVariant="default"
              suggestedAmount={500}
              fullWidth={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}