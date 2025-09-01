import { Thermometer, Clock, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Stats } from "@shared/schema";

export default function CrisisSection() {
  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  return (
    <div className="py-24 bg-gradient-to-br from-blue-900 via-slate-800 to-blue-900 text-white relative overflow-hidden">
      {/* Clean background elements */}
      <div className="absolute inset-0">
        {/* Subtle gradient orbs */}
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-red-500/8 to-orange-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-amber-500/8 to-yellow-500/8 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-md px-8 py-4 rounded-full mb-10 border border-red-400/30">
            <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-500 rounded-full mr-4"></div>
            <span className="font-bold text-base tracking-wider text-red-100">⚡ URGENT CRISIS</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-10 leading-tight">
            <span className="block text-white mb-2" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>The Reality in</span>
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
              Pakistan Today
            </span>
          </h2>
          
          <div className="max-w-5xl mx-auto">
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-6 font-medium" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              Right now, millions of Pakistani families are enduring extreme heat without reliable electricity.
            </p>
            <p className="text-lg md:text-xl text-red-300 font-semibold" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              This is not just a statistic—it's a daily struggle for survival.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-red-400/20 hover:border-red-400/40 hover:bg-white/15 transition-all duration-500 group shadow-2xl shadow-red-500/10 hover:shadow-red-500/20 hover:-translate-y-2 ">
            <div className="flex items-start mb-8">
              <div className="relative p-5 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mr-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl shadow-red-500/30">
                <Thermometer className="w-10 h-10 text-white" />
                <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-red-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-2 animate-pulse">{stats?.temperature || 45}°C</div>
                <div className="text-xl text-red-300 font-bold tracking-wide">Extreme Heat</div>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed text-lg">
              Temperatures regularly exceed 45°C, making life unbearable without cooling. 
              <span className="text-red-300 font-semibold">Children cannot study, elderly suffer, and families struggle to sleep.</span>
            </p>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-orange-400/20 hover:border-orange-400/40 hover:bg-white/15 transition-all duration-500 group shadow-2xl shadow-orange-500/10 hover:shadow-orange-500/20 hover:-translate-y-2 ">
            <div className="flex items-start mb-8">
              <div className="relative p-5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mr-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl shadow-orange-500/30">
                <Clock className="w-10 h-10 text-white" />
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-2 animate-pulse">{stats?.hoursWithoutPower || 12}h</div>
                <div className="text-xl text-orange-300 font-bold tracking-wide">Daily Blackouts</div>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed text-lg">
              Daily blackouts leave families without fans, lights, or refrigeration. 
              <span className="text-orange-300 font-semibold">Food spoils, businesses close, and hope fades.</span>
            </p>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-amber-400/20 hover:border-amber-400/40 hover:bg-white/15 transition-all duration-500 group shadow-2xl shadow-amber-500/10 hover:shadow-amber-500/20 hover:-translate-y-2 ">
            <div className="flex items-start mb-8">
              <div className="relative p-5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl mr-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl shadow-amber-500/30">
                <Users className="w-10 h-10 text-white" />
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-2 animate-pulse">50M+</div>
                <div className="text-xl text-amber-300 font-bold tracking-wide">People Affected</div>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed text-lg">
              Millions of Pakistani families struggle with unreliable electricity daily. 
              <span className="text-amber-300 font-semibold">Your support can change this reality, one family at a time.</span>
            </p>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur-lg rounded-3xl p-10 md:p-12 border border-green-400/30 text-center shadow-2xl shadow-green-500/10 animate-fade-in" style={{ animationDelay: '1.6s' }}>
          {/* Hope background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-3xl"></div>
          <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-green-400/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-green-400/30 shadow-xl">
              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full mr-3 animate-pulse shadow-md"></div>
              <span className="font-bold text-base tracking-wide text-green-200">✨ HOPE AHEAD</span>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300 drop-shadow-lg">But There Is Hope</h3>
            
            <p className="text-xl md:text-2xl text-white/95 max-w-5xl mx-auto leading-relaxed mb-10 font-medium" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              While we celebrate our progress, millions still need our help. 
              <span className="font-bold text-yellow-300 bg-yellow-300/10 px-2 py-1 rounded-lg"> Your support doesn't just install solar panels—it restores dignity, enables education, and saves lives.</span>
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-lg">
              <div className="group flex items-center bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 px-8 py-4 rounded-full border border-green-400/30 hover:border-green-400/50 transition-all duration-300 shadow-xl hover:shadow-green-500/20 hover:-translate-y-1">
                <div className="w-4 h-4 bg-gradient-to-r from-green-300 to-green-500 rounded-full mr-4 group-hover:animate-pulse shadow-md"></div>
                <span className="font-semibold text-green-200">Immediate Relief</span>
              </div>
              <div className="group flex items-center bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 px-8 py-4 rounded-full border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full mr-4 group-hover:animate-pulse shadow-md"></div>
                <span className="font-semibold text-blue-200">Long-term Solution</span>
              </div>
              <div className="group flex items-center bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 px-8 py-4 rounded-full border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1">
                <div className="w-4 h-4 bg-gradient-to-r from-purple-300 to-purple-500 rounded-full mr-4 group-hover:animate-pulse shadow-md"></div>
                <span className="font-semibold text-purple-200">Sustainable Future</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}