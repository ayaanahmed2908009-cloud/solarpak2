import { useState, useEffect } from "react";
import { Zap, Home, Thermometer, Clock, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface LiveMetrics {
  panelsInstalled: number;
  homesEmpowered: number;
  energyGenerated: number;
  co2Saved: number;
  currentTemp: number;
  hoursWithoutPower: number;
}

export default function LiveImpactTracker() {
  const [animatedMetrics, setAnimatedMetrics] = useState<LiveMetrics>({
    panelsInstalled: 0,
    homesEmpowered: 0,
    energyGenerated: 0,
    co2Saved: 0,
    currentTemp: 0,
    hoursWithoutPower: 0
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const targetMetrics: LiveMetrics = {
    panelsInstalled: (stats as any)?.solarPanelsInstalled || 28,
    homesEmpowered: (stats as any)?.homesHelped || 5,
    energyGenerated: 150, // kWh generated today
    co2Saved: 75, // kg CO2 saved
    currentTemp: 45, // Constant temperature
    hoursWithoutPower: 12 // Constant hours without power
  };

  useEffect(() => {
    const animateCounter = (
      key: keyof LiveMetrics,
      target: number,
      duration: number = 2000
    ) => {
      const start = 0;
      const increment = target / (duration / 50);
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedMetrics(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, 50);
    };

    // Animate each metric with different delays
    setTimeout(() => animateCounter('panelsInstalled', targetMetrics.panelsInstalled), 200);
    setTimeout(() => animateCounter('homesEmpowered', targetMetrics.homesEmpowered), 400);
    setTimeout(() => animateCounter('energyGenerated', targetMetrics.energyGenerated, 3000), 600);
    setTimeout(() => animateCounter('co2Saved', targetMetrics.co2Saved, 3000), 800);
    setTimeout(() => animateCounter('currentTemp', targetMetrics.currentTemp, 1000), 1000);
    setTimeout(() => animateCounter('hoursWithoutPower', targetMetrics.hoursWithoutPower, 1500), 1200);
  }, []);

  return (
    <div className="relative py-16 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full"></div>
        <div className="absolute top-32 right-20 w-20 h-20 bg-orange-400 rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-blue-400 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm font-medium text-gray-700">Live Impact Tracker</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Real-Time Impact in Pakistan
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Watch as your donations create immediate change across Pakistani communities facing extreme heat and power shortages
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Solar Panels Installed */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-100 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800">
                  {animatedMetrics.panelsInstalled.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Panels Installed</div>
              </div>
            </div>

          </div>

          {/* Homes Empowered */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800">
                  {animatedMetrics.homesEmpowered.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Homes Empowered</div>
              </div>
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8 families this month
            </div>
          </div>

          {/* Current Temperature Crisis */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-red-100 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Thermometer className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-red-600">
                  {animatedMetrics.currentTemp}°C
                </div>
                <div className="text-sm text-gray-500">Current Temperature</div>
              </div>
            </div>
            <div className="flex items-center text-red-600 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {animatedMetrics.hoursWithoutPower}h without power today
            </div>
          </div>
        </div>

        {/* Energy Generation Today */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-500 rounded-xl mr-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-800">
                  {animatedMetrics.energyGenerated.toLocaleString()} kWh
                </h3>
                <p className="text-green-600">Clean Energy Generated Today</p>
              </div>
            </div>
            <div className="bg-green-200 rounded-full h-2 mb-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-2000 ease-out"
                style={{ width: '78%' }}
              ></div>
            </div>
            <p className="text-sm text-green-700">Enough to power 52 homes for 24 hours</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-500 rounded-xl mr-4">
                <div className="w-8 h-8 text-white flex items-center justify-center font-bold">🌍</div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-800">
                  {animatedMetrics.co2Saved.toLocaleString()} kg
                </h3>
                <p className="text-blue-600">CO₂ Emissions Prevented</p>
              </div>
            </div>
            <div className="bg-blue-200 rounded-full h-2 mb-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-2000 ease-out"
                style={{ width: '65%' }}
              ></div>
            </div>
            <p className="text-sm text-blue-700">Equivalent to planting 951 trees</p>
          </div>
        </div>

        {/* Live Updates Ticker */}
        <div className="mt-8 bg-gray-900 rounded-xl p-4 overflow-hidden">
          <div className="flex items-center text-white">
            <div className="flex items-center mr-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm font-medium">Live Updates</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="animate-scroll whitespace-nowrap text-sm text-gray-300">
                ⚡ Ahmed family in Karachi now has 24/7 power • 🏠 New installation completed in Hyderabad • 🌞 Solar panels generating peak energy in Lahore • 💡 Night lighting restored for 12 families in Multan • ⚡ Ahmed family in Karachi now has 24/7 power • 🏠 New installation completed in Hyderabad
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}