import { useState, useEffect, useRef } from "react";
import { Zap, Heart, Globe, Users, Home, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useScrollReveal } from "@/hooks/useScrollReveal";

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
  const scrollRef = useScrollReveal(0.05);
  
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
    livesImpacted: 250,
    energyGenerated: 270,
    co2Prevented: 1900,
    hoursOfPower: 3,
    panelsInstalled: 27,
    homesEmpowered: 23
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

  const statColumns = [
    {
      icon: <Zap className="w-5 h-5" />,
      label: "SOLAR ENERGY",
      title: "Clean Power",
      stats: [
        { icon: <Zap className="w-5 h-5" />, value: counters.panelsInstalled, suffix: "+", label: "Solar Panels Installed" },
        { icon: <Home className="w-5 h-5" />, value: counters.homesEmpowered, suffix: "+", label: "Homes Empowered" },
        { icon: <Home className="w-5 h-5" />, value: 1, suffix: " school", label: "School Powered" },
      ],
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "COMMUNITY",
      title: "Human Impact",
      stats: [
        { icon: <Heart className="w-5 h-5" />, value: counters.livesImpacted, suffix: "+", label: "Lives Changed" },
        { icon: <Users className="w-5 h-5" />, value: 100, suffix: "K+", label: "Engaged — Social Media" },
        { icon: <Globe className="w-5 h-5" />, value: 3, suffix: " villages", label: "Communities Powered" },
      ],
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: "ENVIRONMENT",
      title: "Planet Care",
      stats: [
        { icon: <Globe className="w-5 h-5" />, value: Math.round(counters.co2Prevented), suffix: " kg", label: "CO₂ Emissions Prevented" },
        { icon: <Heart className="w-5 h-5" />, value: 95, suffix: " trees", label: "Equivalent Trees Planted" },
        { icon: <Zap className="w-5 h-5" />, value: counters.panelsInstalled * 25, suffix: " W", label: "Clean Capacity Installed" },
      ],
    },
  ];

  return (
    <div ref={(el) => {
      (sectionRef as any).current = el;
      if (scrollRef.current === null && el) {
        (scrollRef as any).current = el;
      }
    }} className="relative overflow-hidden">

      {/* Nahj-style full-width stats banner */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: "90vh" }}>
        {/* Video background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={video3}
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.72)" }} />

        <div className="relative z-10 container mx-auto px-6 py-20">
          {/* Header */}
          <div className="mb-14">
            <span className="text-yellow-400 font-semibold text-xs uppercase tracking-[0.25em] mb-3 block">
              Our Impact
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-2xl">
              Numbers that tell the story of empowerment
            </h2>
            <div className="w-16 h-1 bg-yellow-400 mt-4" />
          </div>

          {/* Stats columns */}
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/20">
            {statColumns.map((col, ci) => (
              <div
                key={ci}
                className={`${ci > 0 ? "md:pl-10" : ""} ${ci < statColumns.length - 1 ? "md:pr-10" : ""} pb-10 md:pb-0 ${ci > 0 ? "pt-10 md:pt-0" : ""}`}
              >
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-yellow-400">{col.icon}</span>
                  <div>
                    <p className="text-yellow-400/80 text-[10px] uppercase tracking-widest font-semibold">{col.label}</p>
                    <p className="text-white font-bold text-lg leading-tight">{col.title}</p>
                  </div>
                </div>
                <div className="space-y-8">
                  {col.stats.map((stat, si) => (
                    <div key={si} className="flex items-start gap-4">
                      <span className="text-yellow-400 shrink-0 mt-2">{stat.icon}</span>
                      <div>
                        <div className="text-white font-bold text-5xl md:text-6xl leading-none">
                          {stat.value.toLocaleString()}{stat.suffix}
                        </div>
                        <p className="text-white/70 text-base mt-2">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-6 relative z-10">

        <div className="relative mb-16">
          <div className="text-center mb-12 scroll-reveal">
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
          
          <div className="relative max-w-5xl mx-auto scroll-reveal-scale">
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-500">
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

        <div className="scroll-reveal">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center text-gray-700">
              <div className="flex items-center mr-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm font-medium text-gray-600">Live Updates</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="animate-scroll whitespace-nowrap text-sm text-gray-500">
                  Ahmed family in Karachi now has 24/7 power &middot; New installation completed in Hyderabad &middot; Solar panels generating peak energy in Lahore &middot; Night lighting restored for 12 families in Multan &middot; SolarPak exploring first school solar installation in Sindh &middot; Open roles available — visit Opportunities to apply &middot; Ahmed family in Karachi now has 24/7 power &middot; New installation completed in Hyderabad &middot; Solar panels generating peak energy in Lahore &middot; Night lighting restored for 12 families in Multan &middot; SolarPak exploring first school solar installation in Sindh &middot; Open roles available — visit Opportunities to apply
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
