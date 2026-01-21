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
    <section className="h-screen bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-1 p-1">
        <div className="col-span-2 row-span-3 overflow-hidden rounded-sm">
          <img src={image1} alt="" className="w-full h-full object-cover" />
        </div>
        
        <div className="col-span-2 row-span-2 overflow-hidden rounded-sm">
          <img src={image6} alt="" className="w-full h-full object-cover" />
        </div>
        
        <div className="col-span-2 row-span-2 overflow-hidden rounded-sm">
          <img src={image7} alt="" className="w-full h-full object-cover" />
        </div>
        
        <div className="col-span-6 row-span-2 bg-transparent"></div>
        
        <div className="col-span-2 row-span-2 overflow-hidden rounded-sm">
          <img src={image2} alt="" className="w-full h-full object-cover" />
        </div>
        
        <div className="col-span-4 row-span-2 bg-transparent"></div>
        
        <div className="col-span-3 row-span-2 bg-transparent"></div>
        <div className="col-span-3 row-span-2 bg-transparent"></div>
        
        <div className="col-span-2 row-span-2 overflow-hidden rounded-sm">
          <img src={image3} alt="" className="w-full h-full object-cover" />
        </div>
        
        <div className="col-span-4 row-span-2 bg-transparent"></div>
        
        <div className="col-span-2 row-span-2 overflow-hidden rounded-sm">
          <img src={image8} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="col-span-2 row-span-2 overflow-hidden rounded-sm">
          <img src={image9} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="col-span-2 row-span-2 overflow-hidden rounded-sm">
          <img src={image10} alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="relative z-10 h-full flex">
        <div className="w-1/2 h-full flex flex-col justify-center pl-[18%] pr-8 py-16">
          <div className="inline-flex items-center bg-green-500/30 backdrop-blur-sm border border-green-400/50 px-4 py-2 rounded-full w-fit mb-6">
            <span className="text-green-300 font-semibold text-sm uppercase tracking-wider">
              Our Impact
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
            Measuring Our<br />
            <span className="text-green-400">Community</span><br />
            Impact
          </h2>

          <div className="space-y-4 text-gray-300 text-sm leading-relaxed max-w-md">
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

        <div className="w-1/2 h-full flex items-center pr-8 py-16">
          <div className="w-full max-w-md ml-auto">
            <div className="grid grid-cols-2 gap-2 mb-2">
              {metrics.slice(0, 2).map((metric, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 flex flex-col items-center justify-center text-center"
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

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="overflow-hidden rounded-xl h-32">
                <img src={image5} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-rows-2 gap-2">
                {metrics.slice(2, 4).map((metric, index) => (
                  <div 
                    key={index}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2 flex flex-col items-center justify-center text-center"
                  >
                    <metric.icon className="w-4 h-4 mb-1 text-green-400" />
                    <span className="text-lg font-bold text-white">
                      {metric.value}
                    </span>
                    <span className="text-[10px] text-gray-300">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {metrics.slice(4, 6).map((metric, index) => (
                <div 
                  key={index}
                  className={`backdrop-blur-md border rounded-xl p-4 flex flex-col items-center justify-center text-center ${
                    metric.isSpecial 
                      ? 'bg-slate-800/80 border-green-500/40' 
                      : 'bg-white/10 border-white/20'
                  }`}
                >
                  <metric.icon className="w-5 h-5 mb-1 text-green-400" />
                  <span className="text-xl font-bold text-white">
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
      </div>
    </section>
  );
}
