import { Button } from "@/components/ui/button";
import solarpakVideoPath from "@assets/Solarpak preview website _1756654527775.mp4";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={solarpakVideoPath} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Royal Green Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 via-green-800/60 to-green-700/50 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-4">
        <div className="text-center text-white max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight drop-shadow-2xl">
            <span className="bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent">
              Powering Communities.<br />
              Lighting Futures.
            </span>
          </h1>
          
          {/* Description */}
          <div className="text-xl md:text-2xl mb-12 leading-relaxed space-y-4 drop-shadow-lg">
            <p className="text-green-50">
              At SolarPak, we bring clean, affordable solar energy to families and communities across Pakistan.
            </p>
            <p className="text-green-50">
              Every panel installed means more light for homes, more opportunity for children, and a brighter, sustainable tomorrow.
            </p>
            <p className="text-2xl md:text-3xl font-semibold text-white bg-green-800/30 px-6 py-3 rounded-xl backdrop-blur-sm border border-green-300/20">
              Join us in turning sunlight into hope.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={() => window.open('https://ko-fi.com/solarpak', '_blank')}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-green-400/30"
            >
              Donate Now
            </Button>
            <Button
              variant="outline"
              className="border-2 border-green-300 text-white hover:bg-green-700/80 hover:text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 backdrop-blur-sm"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}