import { useState, useEffect } from "react";
import { Sun, Thermometer, Zap, Wind, Cloud } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function PakistanWeatherWidget() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [solarEfficiency, setSolarEfficiency] = useState(0);

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const pakistanCities = [
    { name: "Karachi", temp: 39, solar: 92, condition: "sunny" },
    { name: "Lahore", temp: 43, solar: 89, condition: "sunny" },
    { name: "Islamabad", temp: 37, solar: 85, condition: "partly-cloudy" },
    { name: "Rawalpindi", temp: 36, solar: 87, condition: "sunny" },
    { name: "Faisalabad", temp: 44, solar: 94, condition: "sunny" },
    { name: "Multan", temp: 46, solar: 96, condition: "sunny" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Calculate solar efficiency based on time of day
    const hour = new Date().getHours();
    let efficiency = 0;
    if (hour >= 6 && hour <= 18) {
      // Peak efficiency between 10 AM - 2 PM
      if (hour >= 10 && hour <= 14) {
        efficiency = 90 + Math.random() * 10; // 90-100%
      } else if (hour >= 8 && hour <= 16) {
        efficiency = 70 + Math.random() * 20; // 70-90%
      } else {
        efficiency = 30 + Math.random() * 40; // 30-70%
      }
    }
    setSolarEfficiency(Math.round(efficiency));

    return () => clearInterval(timer);
  }, []);

  const getPakistanTime = () => {
    const pakistanTime = new Date(currentTime.getTime() + (5 * 60 * 60 * 1000)); // UTC+5
    return pakistanTime.toLocaleTimeString('en-US', { 
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getTimeOfDayIcon = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) return "🌅";
    if (hour >= 12 && hour < 17) return "☀️";
    if (hour >= 17 && hour < 19) return "🌆";
    return "🌙";
  };

  const getSolarStatus = () => {
    if (solarEfficiency >= 85) return { status: "Excellent", color: "text-green-600", bg: "bg-green-100" };
    if (solarEfficiency >= 70) return { status: "Very Good", color: "text-blue-600", bg: "bg-blue-100" };
    if (solarEfficiency >= 50) return { status: "Good", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (solarEfficiency >= 30) return { status: "Fair", color: "text-orange-600", bg: "bg-orange-100" };
    return { status: "Low", color: "text-red-600", bg: "bg-red-100" };
  };

  const solarStatus = getSolarStatus();

  return (
    <div className="fixed top-20 right-4 z-30 pointer-events-auto">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-sm">
        {/* Header with Pakistan flag and time */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-2xl mr-2">🇵🇰</span>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">Pakistan Live</h3>
              <div className="text-xs text-gray-500">Solar Conditions</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-mono text-gray-800">{getPakistanTime()}</div>
            <div className="text-xs text-gray-500 flex items-center">
              <span className="mr-1">{getTimeOfDayIcon()}</span>
              UTC +5
            </div>
          </div>
        </div>

        {/* Current Solar Efficiency */}
        <div className={`${solarStatus.bg} rounded-xl p-4 mb-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className={`w-5 h-5 ${solarStatus.color} mr-2`} />
              <div>
                <div className="font-bold text-gray-800">Solar Efficiency</div>
                <div className={`text-sm ${solarStatus.color}`}>{solarStatus.status}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${solarStatus.color}`}>{solarEfficiency}%</div>
              <div className="text-xs text-gray-600">Current Output</div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 bg-white/50 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                solarEfficiency >= 85 ? 'bg-green-500' :
                solarEfficiency >= 70 ? 'bg-blue-500' :
                solarEfficiency >= 50 ? 'bg-yellow-500' :
                solarEfficiency >= 30 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${solarEfficiency}%` }}
            ></div>
          </div>
        </div>

        {/* Major Cities Quick View */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {pakistanCities.slice(0, 4).map((city) => (
            <div key={city.name} className="bg-gray-50 rounded-lg p-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-gray-700">{city.name}</div>
                  <div className="text-lg font-bold text-red-600">{city.temp}°C</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Solar</div>
                  <div className="text-sm font-bold text-green-600">{city.solar}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Installation Alert */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-3 text-white">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
            <div className="flex-1">
              <div className="text-sm font-semibold">🔴 Live Installation</div>
              <div className="text-xs opacity-90">Installing panels in Hyderabad right now!</div>
            </div>
            <div className="text-lg">⚡</div>
          </div>
        </div>

        {/* Perfect Conditions Message */}
        {solarEfficiency >= 85 && (
          <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center text-green-800">
              <Sun className="w-4 h-4 mr-2" />
              <div className="text-xs">
                <strong>Perfect solar conditions!</strong> Panels are generating maximum power across Pakistan.
              </div>
            </div>
          </div>
        )}

        {/* Heat Warning */}
        {((stats as any)?.temperature ?? 35) >= 35 && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center text-red-800">
              <Thermometer className="w-4 h-4 mr-2" />
              <div className="text-xs">
                <strong>Extreme heat alert!</strong> Families desperately need relief from {(stats as any)?.temperature ?? 35}°C temperatures.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}