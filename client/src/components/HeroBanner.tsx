import { Sun, Zap, Users, ThermometerSun, ChevronDown } from "lucide-react";
import videoBackground from "@assets/Solarpak preview website_-VEED_1756655158911.mp4";

export default function HeroBanner() {

  return (
    <section 
      className="relative overflow-hidden h-screen"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          preload="metadata"
          className="w-full h-full transition-opacity duration-500 opacity-0"
          style={{ 
            objectFit: 'cover',
            objectPosition: window.innerWidth < 768 ? '25% center' : 'center center'
          }}
          src={videoBackground}
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23374151;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23111827;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1' height='1' fill='url(%23grad)' /%3E%3C/svg%3E"
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload nofullscreen noremoteplayback"
          onError={(e) => {
            console.error('Video failed to load:', e);
            const target = e.target as HTMLVideoElement;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.style.background = 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)';
            }
          }}
          onLoadStart={(e) => {
            console.log('Video started loading');
            const video = e.target as HTMLVideoElement;
            // Mobile-specific optimizations
            if (window.innerWidth < 768) {
              video.style.objectPosition = 'center center';
              video.style.transform = 'scale(1.05)';
              // Reduce quality for mobile performance
              video.playbackRate = 1;
              video.setAttribute('webkit-playsinline', 'true');
            }
          }}
          onCanPlay={(e) => {
            console.log('Video can play');
            const video = e.target as HTMLVideoElement;
            video.style.opacity = '1';
            
            // Additional mobile optimizations
            if (window.innerWidth < 768) {
              video.style.willChange = 'transform';
              video.style.backfaceVisibility = 'hidden';
            }
          }}
          onPlay={() => console.log('Video is playing')}
        >
          Your browser does not support the video tag.
        </video>
        {/* Light blue tint for text readability */}
        <div className="absolute inset-0 bg-blue-900/30 md:bg-blue-900/30 sm:bg-blue-900/45"></div>
      </div>
      
      {/* Clean content */}
      <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40 relative z-10 text-white h-full flex flex-col justify-center">
        <div className="max-w-3xl mx-auto md:mx-0">
          <div className="flex items-center mb-4">
            <Sun className="h-8 w-8 mr-2 text-yellow-400" />
            <span className="text-lg font-semibold uppercase tracking-wider text-amber-300">SolarPak Initiative</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            <span className="block font-bold text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>Powering Communities.</span>
            <span className="block text-amber-400 font-bold" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
              Lighting Futures.
            </span>
          </h1>
          
          <div className="text-lg md:text-xl leading-relaxed mb-8 max-w-4xl mx-auto space-y-4">
            <div className="space-y-3">
              <p className="text-white font-medium leading-relaxed" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>At SolarPak, we bring clean, affordable solar energy to families and communities across Pakistan.</p>
              <p className="text-white/95 font-medium leading-relaxed" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>Every panel installed means more light for homes, more opportunity for children, and a brighter, sustainable tomorrow.</p>
            </div>
            
            <div className="mt-4">
              <p className="text-amber-300 font-medium text-xl leading-tight">Join us in turning sunlight into hope.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
            <button 
              onClick={() => window.open('https://ko-fi.com/solarpak', '_blank')}
              className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 w-full sm:w-auto max-w-xs shadow-lg"
            >
              Donate Now
            </button>
            <button 
              onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-transparent hover:bg-white/10 text-white font-medium py-4 px-8 rounded-lg text-lg transition-colors duration-300 w-full sm:w-auto max-w-xs border border-white/40 hover:border-white/60"
            >
              Learn More
            </button>
          </div>
          
          {/* Simple Scroll Indicator */}
          <div className="flex justify-center">
            <button 
              onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer"
            >
              <ChevronDown className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
    </section>
  );
}
