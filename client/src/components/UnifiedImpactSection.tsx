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
    livesImpacted: 100,
    energyGenerated: 270,
    co2Prevented: 1900,
    hoursOfPower: 3,
    panelsInstalled: 17,
    homesEmpowered: 17
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
    <div ref={sectionRef} className="py-12 md:py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Glassmorphic Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-purple-400/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-green-400/15 to-teal-400/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-amber-400/8 to-transparent rounded-full blur-2xl"></div>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
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
        {/* Glassmorphic Main Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-xl px-4 md:px-6 py-2 md:py-3 rounded-full mb-6 border border-white/20">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3"></div>
            <span className="font-medium text-white text-sm md:text-base">Our Global Impact Dashboard</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Transforming Lives <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">Across Pakistan</span>
          </h2>
          <p className="text-lg md:text-xl text-white/85 max-w-3xl mx-auto">
            Every solar panel we install creates ripple effects of positive change. From individual families to entire communities, 
            witness the real-time impact of your donations.
          </p>
        </div>

        {/* Glassmorphic Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          <div className="group">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-105 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-br from-yellow-400/80 to-orange-500/80 backdrop-blur-sm rounded-xl group-hover:rotate-12 transition-transform duration-300 border border-yellow-300/30">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl md:text-4xl font-bold text-white font-mono">
                    {counters.panelsInstalled.toLocaleString()}
                  </div>
                  <div className="text-xs md:text-sm text-white/70">Solar Panels Installed</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-yellow-400/20">
                <div className="flex items-center text-yellow-300 text-sm">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  +4 panels this month
                </div>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-105 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-400/80 to-blue-600/80 backdrop-blur-sm rounded-xl group-hover:rotate-12 transition-transform duration-300 border border-blue-300/30">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl md:text-4xl font-bold text-white font-mono">
                    {counters.homesEmpowered.toLocaleString()}
                  </div>
                  <div className="text-xs md:text-sm text-white/70">Homes Empowered</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-blue-400/20">
                <div className="flex items-center text-blue-300 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  +4 families this month
                </div>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-105 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-br from-red-400/80 to-orange-500/80 backdrop-blur-sm rounded-xl group-hover:rotate-12 transition-transform duration-300 border border-red-300/30">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl md:text-4xl font-bold text-white font-mono">
                    {counters.livesImpacted.toLocaleString()}
                  </div>
                  <div className="text-xs md:text-sm text-white/70">Lives Transformed</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-red-400/20">
                <div className="flex items-center text-red-300 text-sm">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                  Every donation matters
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Glassmorphic Environmental Impact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
          <div className="bg-green-500/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-green-400/20">
            <div className="flex items-center mb-6">
              <div className="p-4 bg-gradient-to-br from-green-400/80 to-emerald-500/80 backdrop-blur-sm rounded-xl mr-6 border border-green-300/30">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-3xl font-bold text-white font-mono">
                  {counters.energyGenerated.toLocaleString()} kWh
                </h3>
                <p className="text-sm md:text-base text-green-300">Clean Energy Generated Total</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full h-3 mb-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-emerald-400 h-3 rounded-full transition-all duration-2000 ease-out"
                style={{ width: '78%' }}
              ></div>
            </div>
            <p className="text-sm text-green-300/80">Enough to power 30 homes for a day</p>
          </div>

          <div className="bg-blue-500/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-blue-400/20">
            <div className="flex items-center mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-400/80 to-cyan-500/80 backdrop-blur-sm rounded-xl mr-6 border border-blue-300/30">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-3xl font-bold text-white font-mono">
                  {counters.co2Prevented.toFixed(1)} kg
                </h3>
                <p className="text-sm md:text-base text-blue-300">CO₂ Emissions Prevented</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full h-3 mb-3">
              <div 
                className="bg-gradient-to-r from-blue-400 to-cyan-400 h-3 rounded-full transition-all duration-2000 ease-out"
                style={{ width: '65%' }}
              ></div>
            </div>
            <p className="text-sm text-blue-300/80">Equivalent to planting 95 trees this year</p>
          </div>
        </div>

        {/* Glassmorphic Solar Panel Progress Goal */}
        <div className="bg-amber-500/10 backdrop-blur-xl rounded-3xl p-8 border border-amber-400/20 mb-16">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-white mb-2">🎯 Our Solar Panel Goal</h3>
            <p className="text-white/80 text-lg">Working toward 100 solar panels across Pakistan</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white font-semibold">Progress: 17 / 100 panels</span>
              <span className="text-white/70">17%</span>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-full h-4 mb-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-4 rounded-full transition-all duration-2000 ease-out relative"
                style={{ width: '17%' }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-white text-lg font-medium">We'll get there soon! 🚀</p>
              <p className="text-white/70 text-sm mt-1">Every donation brings us closer to transforming 100 communities</p>
            </div>
          </div>
        </div>

        {/* Glassmorphic Video Carousel */}
        <div className="relative mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full mb-8 shadow-lg border border-white/20">
              <Play className="w-5 h-5 text-amber-300 mr-3 animate-pulse" />
              <span className="font-bold text-white">🎥 Impact Videos</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
              See Our Impact <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">in Action</span>
            </h3>
            <p className="text-xl md:text-2xl text-white/85 max-w-4xl mx-auto leading-relaxed font-medium">
              Watch real stories from families we've helped across Pakistan
            </p>
          </div>
          
          <div className="relative max-w-6xl mx-auto">
            {/* Glassmorphic video container */}
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/20 overflow-hidden transform hover:-translate-y-2 transition-all duration-500">
              {/* Enhanced background glow effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-3xl"></div>
              <div className="absolute top-4 left-4 w-32 h-32 bg-blue-400/15 rounded-full blur-2xl"></div>
              <div className="absolute bottom-4 right-4 w-24 h-24 bg-green-400/15 rounded-full blur-xl animate-pulse"></div>
              
              <div className="relative z-10">
                {/* Video display */}
                <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-xl mb-6">
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
                  
                  {/* Glassmorphic video overlay controls */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                    <button
                      onClick={() => {
                        setIsPlaying(!isPlaying);
                        if (videoRef.current) {
                          isPlaying ? videoRef.current.pause() : videoRef.current.play();
                        }
                      }}
                      className="bg-white/20 backdrop-blur-xl hover:bg-white/30 text-white p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 border border-white/30"
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
                  
                  {/* Glassmorphic video indicators */}
                  <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20 shadow-lg">
                    {videos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentVideo(index);
                          setIsAutoPlay(false);
                        }}
                        className={`relative transition-all duration-300 ${
                          index === currentVideo 
                            ? 'w-8 h-3 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full shadow-md' 
                            : 'w-3 h-3 bg-white/40 hover:bg-white/60 rounded-full hover:scale-125'
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
                
                
                {/* Glassmorphic video counter */}
                <div className="text-center mt-4">
                  <span className="text-sm text-white/80 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full font-medium border border-white/20">
                    Video {currentVideo + 1} of {videos.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Glassmorphic Live Updates Ticker */}
        <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-xl p-4 overflow-hidden border border-white/20">
          <div className="flex items-center text-white">
            <div className="flex items-center mr-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm font-medium text-white">Live Updates</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="animate-scroll whitespace-nowrap text-sm text-white/80">
                ⚡ Ahmed family in Karachi now has 24/7 power • 🏠 New installation completed in Hyderabad • 🌞 Solar panels generating peak energy in Lahore • 💡 Night lighting restored for 12 families in Multan • ⚡ Ahmed family in Karachi now has 24/7 power • 🏠 New installation completed in Hyderabad
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}