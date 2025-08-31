import { useState, useEffect, useRef } from "react";
import { Zap, Heart, Globe, Clock, Users, Home, MapPin, Thermometer, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Import videos
import video1 from "@assets/mid_1756658713398.mp4";
import video2 from "@assets/vidddd_1756658722814.mp4";
import video3 from "@assets/Solarpak preview website _1756658752398.mp4";
import video4 from "@assets/solarpaskk_1756658773087.mp4";
import video5 from "@assets/solarpak3_1756658787729.mp4";
import video6 from "@assets/solarpak2_1756658812429.mp4";

export default function UnifiedImpactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    livesImpacted: 0,
    energyGenerated: 0,
    co2Prevented: 0,
    hoursOfPower: 0,
    panelsInstalled: 0,
    homesEmpowered: 0
  });
  
  // Video carousel state
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const videos = [
    { src: video1, title: "Solar Installation Process" },
    { src: video2, title: "Community Impact" },
    { src: video3, title: "Website Preview" },
    { src: video4, title: "Family Testimonial" },
    { src: video5, title: "Energy Independence" },
    { src: video6, title: "Project Completion" }
  ];

  const sectionRef = useRef<HTMLDivElement>(null);

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: impactStories } = useQuery({
    queryKey: ["/api/impact-stories"],
  });

  const finalNumbers = {
    livesImpacted: 35,
    energyGenerated: 90,
    co2Prevented: 120,
    hoursOfPower: 3,
    panelsInstalled: 8,
    homesEmpowered: 8
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounters();
        }
      },
      { 
        threshold: [0.05, 0.2],
        rootMargin: '100px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Stronger fallback for mobile devices - trigger animation after 1 second
    const fallbackTimer = setTimeout(() => {
      if (!isVisible) {
        setIsVisible(true);
        animateCounters();
      }
    }, 1000);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [isVisible]);

  // Additional effect to immediately set final numbers on mobile if needed
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      const mobileTimer = setTimeout(() => {
        if (!isVisible) {
          setCounters(finalNumbers);
          setIsVisible(true);
        }
      }, 500);

      return () => clearTimeout(mobileTimer);
    }
  }, []);

  const animateCounters = () => {
    const duration = 2500; // 2.5 seconds
    const steps = 50;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounters({
        livesImpacted: Math.floor(finalNumbers.livesImpacted * progress),
        energyGenerated: Math.floor(finalNumbers.energyGenerated * progress),
        co2Prevented: Math.round(finalNumbers.co2Prevented * progress * 10) / 10,
        hoursOfPower: Math.floor(finalNumbers.hoursOfPower * progress),
        panelsInstalled: Math.floor(finalNumbers.panelsInstalled * progress),
        homesEmpowered: Math.floor(finalNumbers.homesEmpowered * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(finalNumbers);
      }
    }, stepDuration);
  };

  // Auto-play video carousel
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const autoPlayTimer = setInterval(() => {
      setCurrentVideo(prev => prev === videos.length - 1 ? 0 : prev + 1);
    }, 8000); // Change video every 8 seconds

    return () => clearInterval(autoPlayTimer);
  }, [isAutoPlay, currentVideo]);

  return (
    <div ref={sectionRef} className="py-12 md:py-20 bg-gradient-to-b from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-500 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-blue-100 px-4 md:px-6 py-2 md:py-3 rounded-full mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
            <span className="font-medium text-gray-700 text-sm md:text-base">Our Global Impact Dashboard</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Transforming Lives Across Pakistan
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Every solar panel we install creates ripple effects of positive change. From individual families to entire communities, 
            witness the real-time impact of your donations.
          </p>
        </div>

        {/* Real-time Global Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          <div className="group">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl md:text-4xl font-bold text-gray-800 font-mono">
                    {counters.panelsInstalled.toLocaleString()}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">Solar Panels Installed</div>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="flex items-center text-yellow-800 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  +4 panels this month
                </div>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl md:text-4xl font-bold text-gray-800 font-mono">
                    {counters.homesEmpowered.toLocaleString()}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">Homes Empowered</div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center text-blue-800 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  +4 families this month
                </div>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl md:text-4xl font-bold text-gray-800 font-mono">
                    {counters.livesImpacted.toLocaleString()}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">Lives Transformed</div>
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <div className="flex items-center text-red-800 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  Every donation matters
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 md:p-8 border border-green-200">
            <div className="flex items-center mb-6">
              <div className="p-4 bg-green-500 rounded-xl mr-6">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-3xl font-bold text-green-800 font-mono">
                  {counters.energyGenerated.toLocaleString()} kWh
                </h3>
                <p className="text-sm md:text-base text-green-600">Clean Energy Generated Total</p>
              </div>
            </div>
            <div className="bg-green-200 rounded-full h-3 mb-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-2000 ease-out"
                style={{ width: '78%' }}
              ></div>
            </div>
            <p className="text-sm text-green-700">Enough to power 30 homes for a day</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 md:p-8 border border-blue-200">
            <div className="flex items-center mb-6">
              <div className="p-4 bg-blue-500 rounded-xl mr-6">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-3xl font-bold text-blue-800 font-mono">
                  {counters.co2Prevented.toFixed(1)} kg
                </h3>
                <p className="text-sm md:text-base text-blue-600">CO₂ Emissions Prevented</p>
              </div>
            </div>
            <div className="bg-blue-200 rounded-full h-3 mb-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-2000 ease-out"
                style={{ width: '65%' }}
              ></div>
            </div>
            <p className="text-sm text-blue-700">Equivalent to planting 6 trees this year</p>
          </div>
        </div>

        {/* Solar Panel Progress Goal */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-8 border border-orange-200 mb-16">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">🎯 Our Solar Panel Goal</h3>
            <p className="text-gray-600 text-lg">Working toward 100 solar panels across Pakistan</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-800 font-semibold">Progress: 8 / 100 panels</span>
              <span className="text-gray-600">8%</span>
            </div>
            
            <div className="bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-2000 ease-out relative"
                style={{ width: '8%' }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-700 text-lg font-medium">We'll get there soon! 🚀</p>
              <p className="text-gray-500 text-sm mt-1">Every donation brings us closer to transforming 100 communities</p>
            </div>
          </div>
        </div>

        {/* Floating Video Carousel */}
        <div className="relative mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-green-100 px-6 py-3 rounded-full mb-8 shadow-lg border border-blue-200/50">
              <Play className="w-5 h-5 text-blue-600 mr-3 animate-pulse" />
              <span className="font-bold text-gray-700">🎥 Impact Videos</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6 drop-shadow-sm">
              See Our Impact in Action
            </h3>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
              Watch real stories from families we've helped across Pakistan
            </p>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            {/* Floating video container with enhanced shadows */}
            <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-green-50/30 rounded-3xl p-8 md:p-10 shadow-2xl hover:shadow-3xl border-2 border-white/50 overflow-hidden backdrop-blur-sm transform hover:-translate-y-2 transition-all duration-500">
              {/* Enhanced background glow effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/8 to-green-500/8 rounded-3xl"></div>
              <div className="absolute top-4 left-4 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-4 right-4 w-24 h-24 bg-green-400/10 rounded-full blur-xl animate-pulse"></div>
              
              <div className="relative z-10">
                {/* Video display */}
                <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-xl">
                  <video
                    ref={videoRef}
                    key={currentVideo}
                    className="w-full h-full object-cover transition-opacity duration-500"
                    autoPlay={isPlaying}
                    muted
                    loop={false}
                    playsInline
                    onLoadedData={() => {
                      if (videoRef.current && isPlaying) {
                        videoRef.current.play();
                      }
                    }}
                    onEnded={() => {
                      if (isAutoPlay) {
                        setCurrentVideo(prev => prev === videos.length - 1 ? 0 : prev + 1);
                      }
                    }}
                  >
                    <source src={videos[currentVideo].src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Video overlay controls */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                    <button
                      onClick={() => {
                        setIsPlaying(!isPlaying);
                        if (videoRef.current) {
                          isPlaying ? videoRef.current.pause() : videoRef.current.play();
                        }
                      }}
                      className="bg-white/90 hover:bg-white text-gray-800 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110"
                    >
                      {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                    </button>
                  </div>
                  
                  {/* Video title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h4 className="text-white text-xl font-bold">{videos[currentVideo].title}</h4>
                  </div>
                </div>
                
                {/* Enhanced navigation controls */}
                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={() => {
                      setCurrentVideo(prev => prev === 0 ? videos.length - 1 : prev - 1);
                      setIsAutoPlay(false);
                    }}
                    className="group flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-blue-400/30"
                  >
                    <ChevronLeft className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                    <span className="font-bold text-lg">Previous</span>
                  </button>
                  
                  {/* Enhanced video indicators */}
                  <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200 shadow-lg">
                    {videos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentVideo(index);
                          setIsAutoPlay(false);
                        }}
                        className={`relative transition-all duration-300 ${
                          index === currentVideo 
                            ? 'w-8 h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full shadow-md' 
                            : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 rounded-full hover:scale-125'
                        }`}
                      >
                        {index === currentVideo && (
                          <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => {
                      setCurrentVideo(prev => prev === videos.length - 1 ? 0 : prev + 1);
                      setIsAutoPlay(false);
                    }}
                    className="group flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-green-400/30"
                  >
                    <span className="font-bold text-lg">Next</span>
                    <ChevronRight className="w-6 h-6 ml-3 group-hover:animate-pulse" />
                  </button>
                </div>
                
                {/* Enhanced auto-play toggle */}
                <div className="flex items-center justify-center mt-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-lg border border-gray-200">
                    <button
                      onClick={() => setIsAutoPlay(!isAutoPlay)}
                      className={`flex items-center px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                        isAutoPlay 
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-lg mr-3">{isAutoPlay ? '⏸️' : '▶️'}</span>
                      <span className="text-sm">{isAutoPlay ? 'Auto-play ON' : 'Auto-play OFF'}</span>
                    </button>
                  </div>
                </div>
                
                {/* Video counter */}
                <div className="text-center mt-4">
                  <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full font-medium">
                    Video {currentVideo + 1} of {videos.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Live Updates Ticker */}
        <div className="mt-8 bg-gray-900 rounded-xl p-4 overflow-hidden">
          <div className="flex items-center text-white">
            <div className="flex items-center mr-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm font-medium">Live Updates</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="animate-scroll whitespace-nowrap text-sm text-gray-300">
                ⚡ Ahmed family in Karachi now has 24/7 power • 🏠 New installation completed in Hyderabad • 🌞 Solar panels generating peak energy in Lahore • 💡 Night lighting restored for 12 families in Multan • ⚡ Ahmed family in Karachi now has 24/7 power • 🏠 New installation completed in Hyderabad
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}