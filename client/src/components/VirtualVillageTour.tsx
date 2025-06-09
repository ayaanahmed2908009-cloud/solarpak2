import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, MapPin, Users, Thermometer, Clock, Sun, Moon, Lightbulb, Fan, Home, Star, Zap, Heart, ArrowLeft, ArrowRight, DollarSign, GraduationCap } from "lucide-react";
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
  villagerName: string;
  villagerQuote: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  solarPanelsInstalled: number;
  monthlyBillBefore: number;
  monthlyBillAfter: number;
  villagerAge: number;
  occupation: string;
  beforeConditions: string[];
  afterBenefits: string[];
  emotionalImpact: string;
  beforeSituation: string;
  afterSituation: string;
}

export default function VirtualVillageTour() {
  const [currentScene, setCurrentScene] = useState(0);
  const [showAfter, setShowAfter] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'transforming' | 'completed'>('idle');
  const [sliderPosition, setSliderPosition] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scenes: VillageScene[] = [
    {
      id: "karachi-outskirts",
      title: "Fatima's Family Transformation",
      description: "From sweltering heat to comfortable living in Karachi",
      beforeImage: "🔥😰💔",
      afterImage: "❄️😌💚",
      temperature: 45,
      powerOutageHours: 12,
      familiesAffected: 1,
      location: "Karachi, Sindh",
      story: "Meet Fatima Malik, a school teacher whose family suffered through 12-hour power outages in 45°C heat. Watch their incredible transformation.",
      villagerName: "Fatima Malik",
      villagerQuote: "My children can finally sleep peacefully at night. The fans work all day, and we don't worry about electricity bills anymore. It's like we have a new life.",
      timeOfDay: "afternoon",
      solarPanelsInstalled: 6,
      monthlyBillBefore: 15000,
      monthlyBillAfter: 0,
      villagerAge: 34,
      occupation: "School Teacher",
      beforeConditions: [
        "12 hours daily without power",
        "PKR 15,000 monthly electricity bills",
        "Children couldn't sleep in heat",
        "Teaching at home impossible",
        "Spoiled food and medicines"
      ],
      afterBenefits: [
        "24/7 reliable electricity",
        "PKR 0 monthly electricity bills",
        "Cool, comfortable home",
        "Children excel in studies",
        "Food stays fresh, medicines safe"
      ],
      emotionalImpact: "From despair to hope - Fatima's family now thrives with dignity and comfort.",
      beforeSituation: "It's 3 PM and 45°C outside. Fatima's children are crying from the heat, unable to nap. The power has been out for 8 hours straight. Their medicine is spoiling in the warm fridge, and Fatima can't prepare lessons for her students because her laptop overheats. The family huddles in one room, fanning themselves with papers, praying for electricity that may not come until evening.",
      afterSituation: "Same time, same heat outside - but inside it's wonderfully cool. The children are peacefully doing homework under bright LED lights while fans hum quietly. Fatima prepares tomorrow's lessons on her laptop, the fridge keeps medicine and food fresh, and the family enjoys quality time together in comfort. No more counting hours until power returns - it's always there when they need it."
    },
    {
      id: "rural-sindh",
      title: "Hassan's Journey to Light",
      description: "From candlelight studies to bright educational futures",
      beforeImage: "🕯️📚😢",
      afterImage: "💡📖😊",
      temperature: 45,
      powerOutageHours: 12,
      familiesAffected: 1,
      location: "Interior Sindh",
      story: "Hassan Ahmed, a farmer whose daughter studied by candlelight, now watches her dream of becoming a doctor under bright solar-powered lights.",
      villagerName: "Hassan Ahmed",
      villagerQuote: "My daughter Ayesha now studies under bright lights and dreams of becoming a doctor. Solar power didn't just give us electricity - it gave us hope for the future.",
      timeOfDay: "evening",
      solarPanelsInstalled: 4,
      monthlyBillBefore: 8000,
      monthlyBillAfter: 0,
      villagerAge: 41,
      occupation: "Farmer",
      beforeConditions: [
        "12 hours daily without power",
        "Children studied by candlelight",
        "PKR 8,000 spent on diesel generators",
        "Constant worry about fuel costs",
        "Limited evening family time"
      ],
      afterBenefits: [
        "Consistent power for evening study",
        "Bright lights for homework",
        "PKR 0 spent on fuel or electricity",
        "Money saved for education",
        "Quality family time together"
      ],
      emotionalImpact: "From educational limitations to unlimited potential - Hassan's daughter now aims for medical school.",
      beforeSituation: "It's 8 PM and Hassan's 12-year-old daughter Ayesha sits hunched over her books by a flickering candle. Her eyes strain and water from the dim light, but homework must be done. Hassan worries constantly about the diesel generator costs - PKR 200 per day just for 3 hours of power. The family goes to bed early not from tiredness, but because they can't afford to keep lights on. Dreams of education feel impossible in this darkness.",
      afterSituation: "Same evening, but now Ayesha studies under bright, steady LED lights at a proper desk. Her books and laptop (bought with money saved on diesel) are spread out comfortably. Hassan watches proudly as she practices on Khan Academy, planning her path to medical school. The house is filled with light and laughter instead of worry about fuel costs. Education is no longer a luxury - it's their reality."
    },
    {
      id: "lahore-suburbs",
      title: "Aisha's Financial Freedom",
      description: "From crushing bills to saving for the future",
      beforeImage: "💸😫📉",
      afterImage: "💰😄📈",
      temperature: 45,
      powerOutageHours: 12,
      familiesAffected: 1,
      location: "Lahore, Punjab",
      story: "Aisha Hassan, a nurse, watched 60% of her income disappear on electricity bills. Now she saves money for her children's future and family dreams.",
      villagerName: "Aisha Hassan",
      villagerQuote: "We saved enough money in just 6 months to buy new school supplies and even plan our first family trip! Solar power gave us our financial freedom back.",
      timeOfDay: "morning",
      solarPanelsInstalled: 8,
      monthlyBillBefore: 18000,
      monthlyBillAfter: 0,
      villagerAge: 29,
      occupation: "Nurse",
      beforeConditions: [
        "PKR 18,000 monthly electricity bills",
        "60% of income on power costs",
        "No money for children's extras",
        "Constant financial stress",
        "Dreams seemed impossible"
      ],
      afterBenefits: [
        "PKR 0 monthly electricity costs",
        "PKR 18,000 saved every month",
        "Money for education and trips",
        "Financial peace of mind",
        "Dreams becoming reality"
      ],
      emotionalImpact: "From financial stress to family prosperity - Aisha's family now builds their future with confidence.",
      beforeSituation: "It's the end of the month and Aisha stares at the electricity bill: PKR 18,000. Her nurse salary of PKR 30,000 barely covers this plus rent and food. Her 8-year-old son asks for new school books, but she has to say 'next month' again. The AC runs constantly in the heat, but each hour increases their debt. Aisha lies awake at night, calculating if they can afford groceries this week. Financial stress consumes every thought.",
      afterSituation: "Same month-end, but now Aisha opens an empty electricity bill - PKR 0. She transfers PKR 18,000 to her children's education fund instead. Her son not only gets new books but also art supplies he's wanted for months. The family plans their first vacation in years to northern Pakistan. Aisha sleeps peacefully, dreaming of her children's bright futures instead of worrying about bills. Freedom feels wonderful."
    }
  ];

  const currentVillage = scenes[currentScene];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSliderPosition(value);
    setShowAfter(value > 50);
  };

  const triggerTransformation = () => {
    setAnimationPhase('transforming');
    let position = 0;
    const animationInterval = setInterval(() => {
      position += 2;
      setSliderPosition(position);
      setShowAfter(position > 50);
      
      if (position >= 100) {
        clearInterval(animationInterval);
        setAnimationPhase('completed');
        setTimeout(() => setAnimationPhase('idle'), 2000);
      }
    }, 50);
  };

  const resetScene = () => {
    setSliderPosition(0);
    setShowAfter(false);
    setAnimationPhase('idle');
  };

  const nextScene = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(currentScene + 1);
      resetScene();
    }
  };

  const prevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1);
      resetScene();
    }
  };

  const startAutoPlay = () => {
    setIsAutoPlaying(true);
    intervalRef.current = setInterval(() => {
      triggerTransformation();
      setTimeout(() => {
        setCurrentScene(prev => (prev + 1) % scenes.length);
        resetScene();
      }, 8000);
    }, 10000);
  };

  const stopAutoPlay = () => {
    setIsAutoPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getTimeIcon = () => {
    switch (currentVillage.timeOfDay) {
      case 'morning': return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'afternoon': return <Sun className="w-5 h-5 text-orange-500" />;
      case 'evening': return <Sun className="w-5 h-5 text-orange-600" />;
      case 'night': return <Moon className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50 py-20 px-4 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-200/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-200/30 rounded-full blur-xl animate-pulse delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Virtual Village Experience
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Step into the homes of real Pakistani families and witness their incredible transformation from darkness to light, 
            from struggle to prosperity, from despair to hope.
          </p>
          
          {/* Auto-play Controls */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Button
              onClick={isAutoPlaying ? stopAutoPlay : startAutoPlay}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isAutoPlaying ? 'Pause Tour' : 'Start Auto Tour'}
            </Button>
            <Button onClick={triggerTransformation} variant="outline" size="lg" className="border-2">
              ✨ See Transformation
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Interactive Viewer */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-2xl">
              <CardContent className="p-8">
                {/* Village Info Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Home className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{currentVillage.title}</h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{currentVillage.location}</span>
                      </div>
                    </div>
                  </div>
                  {getTimeIcon()}
                </div>

                {/* Situation Description - Clean Separation */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before Panel */}
                  <div className={`relative p-4 bg-red-50 border-l-4 border-red-400 rounded-lg transition-all duration-500 ${showAfter ? 'opacity-70 scale-95' : 'opacity-100 scale-100'}`}>
                    <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                      <span className="text-2xl">{currentVillage.beforeImage}</span>
                      BEFORE
                    </h4>
                    <p className="text-sm text-red-800 leading-relaxed">
                      {currentVillage.beforeSituation}
                    </p>
                  </div>
                  
                  {/* After Panel with Translucent Barrier */}
                  <div className={`relative p-4 bg-green-50 border-l-4 border-green-400 rounded-lg transition-all duration-500 ${showAfter ? 'opacity-100 scale-100' : 'opacity-100 scale-95'}`}>
                    <h4 className="font-bold text-green-700 mb-2 flex items-center gap-2">
                      <span className="text-2xl">{currentVillage.afterImage}</span>
                      AFTER
                    </h4>
                    <p className="text-sm text-green-800 leading-relaxed">
                      {currentVillage.afterSituation}
                    </p>
                    
                    {/* Translucent Barrier Overlay */}
                    <div className={`absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-500 ${
                      showAfter ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}>
                      <div className="text-center p-4">
                        <div className="text-4xl mb-2">🔒</div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Slide to unlock transformation</p>
                        <p className="text-xs text-gray-600">See how life changes with solar power</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Before/After Visualization */}
                <div className="relative h-64 bg-gradient-to-r from-gray-800 to-gray-600 rounded-xl overflow-hidden mb-6">
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-500 transition-all duration-1000 ease-out"
                    style={{ 
                      clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                      opacity: showAfter ? 1 : 0
                    }}
                  />
                  
                  {/* Before State */}
                  <div className={`absolute inset-0 flex items-center justify-center text-6xl transition-all duration-500 ${showAfter ? 'opacity-30' : 'opacity-100'}`}>
                    {currentVillage.beforeImage}
                  </div>
                  
                  {/* After State */}
                  <div className={`absolute inset-0 flex items-center justify-center text-6xl transition-all duration-500 ${showAfter ? 'opacity-100' : 'opacity-0'}`}>
                    {currentVillage.afterImage}
                  </div>
                  
                  {/* Transformation Slider */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderPosition}
                      onChange={handleSliderChange}
                      className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  
                  {/* Labels */}
                  <div className="absolute top-4 left-4 bg-red-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    BEFORE
                  </div>
                  <div className="absolute top-4 right-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    AFTER
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <Thermometer className="w-6 h-6 text-red-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">{currentVillage.temperature}°C</div>
                    <div className="text-sm text-red-700">Extreme Heat</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                    <Zap className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">{currentVillage.powerOutageHours}h</div>
                    <div className="text-sm text-orange-700">Daily Outages</div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <Button 
                    onClick={prevScene} 
                    disabled={currentScene === 0}
                    variant="outline"
                    size="sm"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  <div className="flex gap-2">
                    {scenes.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentScene(index);
                          resetScene();
                        }}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentScene 
                            ? 'bg-blue-500 scale-125' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <Button 
                    onClick={nextScene} 
                    disabled={currentScene === scenes.length - 1}
                    variant="outline"
                    size="sm"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reset Button */}
            <Button onClick={resetScene} variant="outline" className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Transformation
            </Button>
          </div>

          {/* Story Panel */}
          <div className="space-y-6">
            {/* Villager Profile */}
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/50 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl text-white font-bold">
                    {currentVillage.villagerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-800">{currentVillage.villagerName}</h4>
                    <p className="text-gray-600">{currentVillage.occupation}, Age {currentVillage.villagerAge}</p>
                  </div>
                </div>
                
                <blockquote className="text-lg italic text-gray-700 border-l-4 border-blue-500 pl-4 mb-6">
                  "{currentVillage.villagerQuote}"
                </blockquote>
                
                <p className="text-gray-700 leading-relaxed">
                  {currentVillage.story}
                </p>
              </CardContent>
            </Card>

            {/* Before/After Comparison */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Before Conditions */}
              <Card className="bg-red-50/80 border-red-200">
                <CardContent className="p-6">
                  <h5 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm">!</span>
                    Before Solar
                  </h5>
                  <ul className="space-y-2">
                    {currentVillage.beforeConditions.map((condition, index) => (
                      <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                        {condition}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* After Benefits */}
              <Card className="bg-green-50/80 border-green-200">
                <CardContent className="p-6">
                  <h5 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</span>
                    After Solar
                  </h5>
                  <ul className="space-y-2">
                    {currentVillage.afterBenefits.map((benefit, index) => (
                      <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Financial Impact */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <h5 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Financial Transformation
                </h5>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-red-600">PKR {currentVillage.monthlyBillBefore.toLocaleString()}</div>
                    <div className="text-sm text-red-700">Monthly Before</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">PKR {currentVillage.monthlyBillAfter}</div>
                    <div className="text-sm text-green-700">Monthly After</div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-800">
                      PKR {(currentVillage.monthlyBillBefore * 12).toLocaleString()} saved annually!
                    </div>
                    <div className="text-sm text-yellow-700">
                      {currentVillage.solarPanelsInstalled} solar panels installed
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emotional Impact */}
            <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
              <CardContent className="p-6 text-center">
                <Heart className="w-8 h-8 text-pink-500 mx-auto mb-3" />
                <p className="text-lg font-semibold text-pink-800 italic">
                  {currentVillage.emotionalImpact}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 border-0 text-white">
            <CardContent className="p-12">
              <h3 className="text-4xl font-bold mb-6">Create Your Own Transformation Story</h3>
              <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
                Every donation creates a story like these. Join thousands of donors who are transforming lives, 
                one family at a time, one village at a time.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  <Star className="w-5 h-5 mr-2" />
                  Transform a Family Today
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Learn More About Impact
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Custom Slider Styles */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
}