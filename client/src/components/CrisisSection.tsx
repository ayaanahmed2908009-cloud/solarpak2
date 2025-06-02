import { Thermometer, Clock, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function CrisisSection() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  return (
    <div className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Modern background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-red-500/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-red-400/30">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse mr-3"></div>
            <span className="font-semibold text-sm tracking-wide">URGENT CRISIS</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
            <span className="block text-white">The Reality in</span>
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
              Pakistan Today
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Right now, millions of Pakistani families are enduring extreme heat without reliable electricity. 
            This is not just a statistic—it's a daily struggle for survival.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-200 group">
            <div className="flex items-start mb-6">
              <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mr-6 group-hover:scale-110 transition-transform duration-200 shadow-xl">
                <Thermometer className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-4xl font-bold text-white">{stats?.temperature || 45}°C</div>
                <div className="text-lg text-slate-300 font-medium">Extreme Heat</div>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Temperatures regularly exceed 45°C, making life unbearable without cooling. 
              Children cannot study, elderly suffer, and families struggle to sleep.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-200 group">
            <div className="flex items-start mb-6">
              <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mr-6 group-hover:scale-110 transition-transform duration-200 shadow-xl">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-4xl font-bold text-white">{(stats as any)?.hoursWithoutPower || 16}h</div>
                <div className="text-lg text-slate-300 font-medium">Daily Blackouts</div>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Daily blackouts leave families without fans, lights, or refrigeration. 
              Food spoils, businesses close, and hope fades.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-200 group">
            <div className="flex items-start mb-6">
              <div className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl mr-6 group-hover:scale-110 transition-transform duration-200 shadow-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-4xl font-bold text-white">50M+</div>
                <div className="text-lg text-slate-300 font-medium">People Affected</div>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Millions of Pakistani families struggle with unreliable electricity daily. 
              Your support can change this reality, one family at a time.
            </p>
          </div>
        </div>

        <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-8 border border-white/30 text-center">
          <h3 className="text-3xl font-bold mb-4">But There Is Hope</h3>
          <p className="text-xl opacity-95 max-w-4xl mx-auto leading-relaxed mb-6">
            While we celebrate our progress, millions still need our help. 
            <span className="font-semibold text-yellow-200"> Your support doesn't just install solar panels—it restores dignity, enables education, and saves lives.</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-lg">
            <div className="flex items-center bg-white/10 px-6 py-3 rounded-full">
              <div className="w-3 h-3 bg-green-300 rounded-full mr-3"></div>
              <span>Immediate Relief</span>
            </div>
            <div className="flex items-center bg-white/10 px-6 py-3 rounded-full">
              <div className="w-3 h-3 bg-blue-300 rounded-full mr-3"></div>
              <span>Long-term Solution</span>
            </div>
            <div className="flex items-center bg-white/10 px-6 py-3 rounded-full">
              <div className="w-3 h-3 bg-purple-300 rounded-full mr-3"></div>
              <span>Sustainable Future</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}