import { Sun, Users, Leaf, DollarSign, Award, Heart } from "lucide-react";

import image1 from "@assets/Screenshot_2026-01-21_at_5.41.04_PM_1769006990502.png";
import image2 from "@assets/Screenshot_2026-01-21_at_5.41.39_PM_1769006999511.png";
import image3 from "@assets/Screenshot_2026-01-21_at_5.42.30_PM_1769007006322.png";
import image4 from "@assets/Screenshot_2026-01-21_at_5.43.41_PM_1769007014926.png";
import image5 from "@assets/Screenshot_2026-01-21_at_5.44.20_PM_1769007024573.png";
import image6 from "@assets/Screenshot_2026-01-21_at_5.45.12_PM_1769007052880.png";
import image7 from "@assets/Screenshot_2026-01-21_at_5.45.37_PM_1769007067682.png";
import image8 from "@assets/Screenshot_2026-01-21_at_5.46.54_PM_1769007076281.png";
import image9 from "@assets/Screenshot_2026-01-21_at_5.47.28_PM_1769007086790.png";
import image10 from "@assets/Screenshot_2026-01-21_at_5.48.50_PM_1769007093619.png";
import image11 from "@assets/Screenshot_2026-01-21_at_5.48.08_PM_1769007109189.png";

export default function YouthLeadershipSection() {
  const metrics = [
    { icon: Sun, value: "17", label: "Solar Panels" },
    { icon: Users, value: "100", label: "People Impacted" },
    { icon: DollarSign, value: "11K", label: "SAR Raised" },
    { icon: Leaf, value: "100kg", label: "CO2 Prevented" },
    { icon: Award, value: "12", label: "Team Members" },
    { icon: Heart, value: "✓", label: "Community Pillar", isSpecial: true },
  ];

  return (
    <section className="min-h-screen bg-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6">
        <div className="col-span-3 row-span-2 relative overflow-hidden">
          <img src={image1} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="col-span-2 row-span-2 relative overflow-hidden">
          <img src={image6} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="col-span-3 row-span-2 relative overflow-hidden">
          <img src={image7} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="col-span-4 row-span-2"></div>
        
        <div className="col-span-2 row-span-2 relative overflow-hidden">
          <img src={image2} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="col-span-3 row-span-2"></div>
        <div className="col-span-3 row-span-2"></div>
        <div className="col-span-4 row-span-2"></div>
        
        <div className="col-span-2 row-span-2 relative overflow-hidden">
          <img src={image3} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="col-span-3 row-span-2"></div>
        <div className="col-span-3 row-span-2"></div>
        <div className="col-span-2 row-span-2 relative overflow-hidden">
          <img src={image8} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="col-span-2 row-span-2 relative overflow-hidden">
          <img src={image9} alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/50 to-slate-900/60"></div>

      <div className="relative z-10 container mx-auto px-6 py-16 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-screen items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center bg-green-500/30 backdrop-blur-sm border border-green-400/50 px-5 py-2 rounded-full">
              <span className="text-green-300 font-semibold text-sm uppercase tracking-wider">
                Our Impact
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Measuring Our<br />
              <span className="text-green-400">Community</span><br />
              Impact
            </h2>

            <div className="space-y-5 text-gray-300 text-base leading-relaxed max-w-lg">
              <p>
                SolarPak stands at the forefront of renewable energy access in Pakistan. 
                We believe that clean energy is the foundation for change when families 
                can study, work, and thrive without electricity insecurity.
              </p>
              <p>
                We know that sustainable impact requires dedication, but it is the mission 
                of dreamers and doers. Our commitment is to bring light to every home.
              </p>
              <p>
                With SolarPak, every installation is not just a panel, but a 
                <span className="text-green-400 font-semibold"> story of transformation</span>.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              {metrics.slice(0, 2).map((metric, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-white/15 hover:scale-105"
                >
                  <metric.icon className="w-7 h-7 mb-3 text-green-400" />
                  <span className="text-3xl md:text-4xl font-bold text-white">
                    {metric.value}
                  </span>
                  <span className="text-sm mt-1 text-gray-300">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <div className="relative overflow-hidden rounded-2xl h-48">
                  <img src={image4} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="grid grid-rows-2 gap-4">
                  {metrics.slice(2, 4).map((metric, index) => (
                    <div 
                      key={index}
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-white/15"
                    >
                      <metric.icon className="w-6 h-6 mb-2 text-green-400" />
                      <span className="text-2xl font-bold text-white">
                        {metric.value}
                      </span>
                      <span className="text-xs text-gray-300">
                        {metric.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {metrics.slice(4, 6).map((metric, index) => (
                <div 
                  key={index}
                  className={`backdrop-blur-md border rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 ${
                    metric.isSpecial 
                      ? 'bg-slate-900/60 border-green-500/40' 
                      : 'bg-white/10 border-white/20 hover:bg-white/15'
                  }`}
                >
                  <metric.icon className="w-7 h-7 mb-2 text-green-400" />
                  <span className="text-3xl font-bold text-white">
                    {metric.value}
                  </span>
                  <span className="text-sm mt-1 text-gray-300">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-1/3 h-1/4 grid grid-cols-3 gap-1 opacity-80">
        <div className="relative overflow-hidden">
          <img src={image10} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative overflow-hidden">
          <img src={image11} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative overflow-hidden">
          <img src={image5} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}
