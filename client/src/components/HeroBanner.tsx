import { Sun, Zap, Users, ThermometerSun, ChevronDown } from "lucide-react";

export default function HeroBanner() {

  return (
    <section 
      className="relative bg-gradient-to-br from-blue-900 via-slate-800 to-gray-900 overflow-hidden h-screen"
    >
      
      {/* Clean overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-slate-900/80"></div>
      
      {/* Clean content */}
      <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40 relative z-10 text-white h-full flex flex-col justify-center">
        <div className="max-w-3xl mx-auto md:mx-0">
          <div className="flex items-center mb-4">
            <Sun className="h-8 w-8 mr-2 text-yellow-400" />
            <span className="text-lg font-semibold uppercase tracking-wider text-amber-300">SolarPak Initiative</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            <span className="block text-shadow-lg">Bringing Light to</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-500 font-extrabold">
              Pakistan
            </span>
            <span className="block text-shadow-lg">Through Solar Power</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Help us combat electricity shortages and improve lives by funding solar panel installations for families across Pakistan.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <a 
              href="#donate" 
              className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-bold px-8 py-4 rounded-lg text-center transition-all duration-300 text-lg shadow-lg"
            >
              Make a Donation
            </a>
            <a 
              href="#problem" 
              className="bg-transparent hover:bg-white/10 text-white font-medium px-8 py-4 rounded-lg text-center transition-colors duration-300 text-lg border border-white/40 hover:border-white/60"
            >
              Learn More
            </a>
          </div>
          
          {/* Key stats indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-blue-900/40 rounded-lg p-5 border border-amber-300/30">
            <div className="text-center ">
              <ThermometerSun className="h-6 w-6 mx-auto mb-2 text-amber-400" />
              <p className="text-sm font-medium text-gray-200">Average Temp</p>
              <p className="text-xl font-bold text-white">35°C</p>
            </div>
            <div className="text-center ">
              <Zap className="h-6 w-6 mx-auto mb-2 text-amber-400" />
              <p className="text-sm font-medium text-gray-200">Daily Outages</p>
              <p className="text-xl font-bold text-white">12 hrs</p>
            </div>
            <div className="text-center ">
              <Users className="h-6 w-6 mx-auto mb-2 text-amber-400" />
              <p className="text-sm font-medium text-gray-200">People Affected</p>
              <p className="text-xl font-bold text-white">210M+</p>
            </div>
            <div className="text-center ">
              <Sun className="h-6 w-6 mx-auto mb-2 text-amber-400" />
              <p className="text-sm font-medium text-gray-200">Solar Potential</p>
              <p className="text-xl font-bold text-white">High</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Image of Pakistan with enhanced styling */}
      <div className="absolute right-0 top-0 bottom-0 hidden lg:block lg:w-2/5 h-full z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1593939535589-8356e421b3cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
          alt="Rural landscape in Sindh, Pakistan" 
          className="object-cover h-full w-full blur-sm"
        />
        <img 
          src="https://images.unsplash.com/photo-1592555059503-0a774cb8d477?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
          alt="Interior Sindh, Pakistan rural village" 
          className="absolute inset-0 object-cover h-full w-full opacity-90"
        />
      </div>
      
      {/* Simple scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white z-20">
        <ChevronDown className="h-6 w-6" />
      </div>
      
      {/* Bottom wave decoration for seamless flow */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 70C840 80 960 100 1080 110C1200 120 1320 120 1380 120H1440V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V120Z" 
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
