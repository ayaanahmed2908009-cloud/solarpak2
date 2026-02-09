import { useState, useEffect, useRef } from "react";
import { Zap, Heart, Globe, Users, Home, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

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
    const duration = 2500;
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

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const autoPlayTimer = setInterval(() => {
      setCurrentVideo(prev => prev === videos.length - 1 ? 0 : prev + 1);
    }, 8000);

    return () => clearInterval(autoPlayTimer);
  }, [isAutoPlay, currentVideo]);

  return (
    <div ref={sectionRef} className="py-16 md:py-24 bg-gray-50 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-14">
          <span className="inline-block text-emerald-700 font-semibold text-sm uppercase tracking-widest mb-4">
            Our Global Impact
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Transforming Lives <span className="text-emerald-700">Across Pakistan</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Every solar panel we install creates ripple effects of positive change. From individual families to entire communities, 
            witness the real-time impact of your donations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {[
            { icon: Zap, value: counters.panelsInstalled, label: "Solar Panels Installed", note: "+4 panels this month", accent: "emerald" },
            { icon: Home, value: counters.homesEmpowered, label: "Homes Empowered", note: "+4 families this month", accent: "emerald" },
            { icon: Heart, value: counters.livesImpacted, label: "Lives Transformed", note: "Every donation matters", accent: "emerald" },
          ].map((metric, i) => (
            <div key={i} className="bg-white rounded-xl p-8 border border-gray-200 hover:border-emerald-200 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <metric.icon className="w-7 h-7 text-emerald-700" />
                </div>
                <div className="text-right">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 font-mono">
                    {metric.value.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">{metric.label}</div>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <div className="flex items-center text-emerald-700 text-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  {metric.note}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          <div className="bg-white rounded-xl p-8 border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-emerald-50 rounded-lg mr-5">
                <Zap className="w-8 h-8 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 font-mono">
                  {counters.energyGenerated.toLocaleString()} kWh
                </h3>
                <p className="text-sm text-emerald-700">Clean Energy Generated Total</p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-full h-2.5 mb-3">
              <div 
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-2000 ease-out"
                style={{ width: '78%' }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">Enough to power 30 homes for a day</p>
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-emerald-50 rounded-lg mr-5">
                <Globe className="w-8 h-8 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 font-mono">
                  {counters.co2Prevented.toFixed(1)} kg
                </h3>
                <p className="text-sm text-emerald-700">CO₂ Emissions Prevented</p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-full h-2.5 mb-3">
              <div 
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-2000 ease-out"
                style={{ width: '65%' }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">Equivalent to planting 95 trees this year</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-200 mb-16">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Solar Panel Goal</h3>
            <p className="text-gray-600">Working toward 100 solar panels across Pakistan</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-900 font-semibold text-sm">Progress: 17 / 100 panels</span>
              <span className="text-gray-500 text-sm">17%</span>
            </div>
            
            <div className="bg-gray-100 rounded-full h-3 mb-4">
              <div 
                className="bg-emerald-600 h-3 rounded-full transition-all duration-2000 ease-out"
                style={{ width: '17%' }}
              ></div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-700 font-medium">Every donation brings us closer to transforming 100 communities</p>
            </div>
          </div>
        </div>

        <div className="relative mb-16">
          <div className="text-center mb-12">
            <span className="inline-block text-emerald-700 font-semibold text-sm uppercase tracking-widest mb-4">
              Impact Videos
            </span>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See Our Impact in Action
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Watch real stories from families we've helped across Pakistan
            </p>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6">
                <video
                  ref={videoRef}
                  key={currentVideo}
                  className="w-full h-full object-cover"
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
                
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                  <button
                    onClick={() => {
                      setIsPlaying(!isPlaying);
                      if (videoRef.current) {
                        isPlaying ? videoRef.current.pause() : videoRef.current.play();
                      }
                    }}
                    className="bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition-all duration-300"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                  </button>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                  <h4 className="text-white text-lg font-semibold">{videos[currentVideo].title}</h4>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setCurrentVideo(prev => prev === 0 ? videos.length - 1 : prev - 1);
                    setIsAutoPlay(false);
                  }}
                  className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg transition-colors duration-200 font-medium text-sm"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
                
                <div className="flex items-center space-x-2">
                  {videos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentVideo(index);
                        setIsAutoPlay(false);
                      }}
                      className={`transition-all duration-300 rounded-full ${
                        index === currentVideo 
                          ? 'w-6 h-2 bg-emerald-600' 
                          : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={() => {
                    setCurrentVideo(prev => prev === videos.length - 1 ? 0 : prev + 1);
                    setIsAutoPlay(false);
                  }}
                  className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg transition-colors duration-200 font-medium text-sm"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
              
              <div className="text-center mt-4">
                <span className="text-xs text-gray-500 font-medium">
                  Video {currentVideo + 1} of {videos.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center text-gray-700">
            <div className="flex items-center mr-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm font-medium text-gray-600">Live Updates</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="animate-scroll whitespace-nowrap text-sm text-gray-500">
                Ahmed family in Karachi now has 24/7 power &middot; New installation completed in Hyderabad &middot; Solar panels generating peak energy in Lahore &middot; Night lighting restored for 12 families in Multan &middot; Ahmed family in Karachi now has 24/7 power &middot; New installation completed in Hyderabad
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
