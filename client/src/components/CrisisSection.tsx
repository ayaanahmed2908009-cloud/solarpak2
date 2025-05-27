import { Thermometer, Clock, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function CrisisSection() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  return (
    <div className="py-20 bg-gradient-to-br from-red-600 via-orange-600 to-red-700 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-20 h-20 border border-white rounded-full"></div>
        <div className="absolute bottom-8 right-8 w-16 h-16 border border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 border border-white rounded-full"></div>
        <div className="absolute top-8 right-1/4 w-8 h-8 border border-white rounded-full"></div>
        <div className="absolute bottom-1/4 left-8 w-14 h-14 border border-white rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
            <div className="w-3 h-3 bg-red-300 rounded-full animate-pulse mr-3"></div>
            <span className="font-semibold text-sm">URGENT: Current Crisis</span>
          </div>
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
            The Reality in Pakistan Today
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Right now, millions of Pakistani families are enduring extreme heat without reliable electricity. 
            This is not just a statistic—it's a daily struggle for survival.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center mb-6">
              <div className="p-4 bg-red-500 rounded-xl mr-6 group-hover:scale-110 transition-transform duration-300">
                <Thermometer className="w-10 h-10 text-white" />
              </div>
              <div>
                <div className="text-5xl font-bold">{stats?.temperature || 45}°C</div>
                <div className="text-lg opacity-90">Extreme Heat</div>
              </div>
            </div>
            <p className="text-base opacity-80 leading-relaxed">
              Temperatures regularly exceed 45°C, making life unbearable without cooling. 
              Children cannot study, elderly suffer, and families struggle to sleep.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center mb-6">
              <div className="p-4 bg-orange-500 rounded-xl mr-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <div>
                <div className="text-5xl font-bold">{stats?.hoursWithoutPower || 16}h</div>
                <div className="text-lg opacity-90">Daily Blackouts</div>
              </div>
            </div>
            <p className="text-base opacity-80 leading-relaxed">
              Daily blackouts leave families without fans, lights, or refrigeration. 
              Food spoils, businesses close, and hope fades.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center mb-6">
              <div className="p-4 bg-yellow-500 rounded-xl mr-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div>
                <div className="text-5xl font-bold">50M+</div>
                <div className="text-lg opacity-90">People Affected</div>
              </div>
            </div>
            <p className="text-base opacity-80 leading-relaxed">
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