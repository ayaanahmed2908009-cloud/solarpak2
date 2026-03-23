import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Download, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";

// Import videos
import video1 from "@assets/mid_1756658713398.mp4";
import video2 from "@assets/vidddd_1756658722814.mp4";
import video3 from "@assets/Solarpak preview website _1756658752398.mp4";
import video4 from "@assets/solarpaskk_1756658773087.mp4";
import video5 from "@assets/solarpak3_1756658787729.mp4";
import video6 from "@assets/solarpak2_1756658812429.mp4";

interface Video {
  src: string;
  title: string;
  description: string;
  duration?: string;
}

export default function Gallery() {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [playingStates, setPlayingStates] = useState<Record<number, boolean>>({});
  const [mutedStates, setMutedStates] = useState<Record<number, boolean>>({});
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  const videos: Video[] = [
    { 
      src: video1, 
      title: "Solar Installation Process", 
      description: "Watch our professional team install solar panels with precision and care",
      duration: "2:30"
    },
    { 
      src: video2, 
      title: "Community Impact", 
      description: "See how solar energy transforms entire neighborhoods and communities",
      duration: "1:45"
    },
    { 
      src: video3, 
      title: "Website Preview", 
      description: "Explore how our platform connects donors with families in need",
      duration: "3:15"
    },
    { 
      src: video4, 
      title: "Family Testimonial", 
      description: "Hear directly from families whose lives have been transformed by solar energy",
      duration: "2:10"
    },
    { 
      src: video5, 
      title: "Energy Independence", 
      description: "Discover how solar panels provide reliable, sustainable power solutions",
      duration: "1:55"
    },
    { 
      src: video6, 
      title: "Project Completion", 
      description: "Celebrate the completion of another successful solar installation project",
      duration: "2:45"
    }
  ];

  const togglePlay = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (playingStates[index]) {
      video.pause();
    } else {
      video.play();
    }
    
    setPlayingStates(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleMute = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    video.muted = !mutedStates[index];
    setMutedStates(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const openFullscreen = (index: number) => {
    setSelectedVideo(index);
  };

  const closeFullscreen = () => {
    setSelectedVideo(null);
    // Pause the video when closing fullscreen
    if (selectedVideo !== null) {
      const video = videoRefs.current[selectedVideo];
      if (video) {
        video.pause();
        setPlayingStates(prev => ({ ...prev, [selectedVideo]: false }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-20">
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-teal-500/8 to-cyan-500/8 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-2xl">
              <span className="text-green-400/80 font-medium text-xs uppercase tracking-[0.2em] mb-4 block">
                Video Gallery
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-[1.1] tracking-tight">
                Our Impact Stories
              </h1>
              <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
                Experience the transformation of Pakistani families through solar energy. Real stories of hope and sustainable change.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="container mx-auto px-4 py-16">

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <div key={index} className="group relative">
              <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200 overflow-hidden">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-green-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  {/* Video container */}
                  <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-lg mb-6">
                    <video
                      ref={(el) => { videoRefs.current[index] = el; }}
                      className="w-full h-full object-cover transition-all duration-300"
                      muted={mutedStates[index] ?? true}
                      playsInline
                      onPlay={() => setPlayingStates(prev => ({ ...prev, [index]: true }))}
                      onPause={() => setPlayingStates(prev => ({ ...prev, [index]: false }))}
                    >
                      <source src={video.src} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    
                    {/* Video controls overlay */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => togglePlay(index)}
                          className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110"
                        >
                          {playingStates[index] ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                        </button>
                        
                        <button
                          onClick={() => toggleMute(index)}
                          className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110"
                        >
                          {mutedStates[index] ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                        </button>
                        
                        <button
                          onClick={() => openFullscreen(index)}
                          className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110"
                        >
                          <Eye className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Video duration badge */}
                    <div className="absolute top-3 right-3 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {video.duration}
                    </div>
                  </div>
                  
                  {/* Video info */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {video.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-4xl font-bold mb-6">Become Part of These Stories</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-95">
              Every video represents real families whose lives have been transformed. 
              Your donation can create the next success story.
            </p>
            <a
              href="https://ko-fi.com/solarpak"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-white text-blue-600 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 shadow-xl text-lg"
            >
              ❤️ Donate Now
            </a>
          </div>
        </div>
      </div>

      {/* Fullscreen video modal */}
      {selectedVideo !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl w-full">
            <button
              onClick={closeFullscreen}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-xl font-bold z-10"
            >
              ✕ Close
            </button>
            
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                muted
                playsInline
              >
                <source src={videos[selectedVideo].src} type="video/mp4" />
              </video>
            </div>
            
            <div className="text-center mt-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {videos[selectedVideo].title}
              </h3>
              <p className="text-gray-300">
                {videos[selectedVideo].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}