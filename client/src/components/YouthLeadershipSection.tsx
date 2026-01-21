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
    <section className="h-screen w-full relative overflow-hidden bg-[#1a1f2e]">
      <div 
        className="absolute inset-0"
        style={{
          display: 'grid',
          gridTemplateColumns: '15% 12% 13% 1fr 22% 22%',
          gridTemplateRows: '20% 15% 25% 20% 20%',
          gap: '4px',
        }}
      >
        <div className="overflow-hidden" style={{ gridColumn: '1', gridRow: '1 / 3' }}>
          <img src={image1} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="overflow-hidden" style={{ gridColumn: '2', gridRow: '1' }}>
          <img src={image6} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="overflow-hidden" style={{ gridColumn: '3', gridRow: '1' }}>
          <img src={image7} alt="" className="w-full h-full object-cover" />
        </div>
        
        <div className="overflow-hidden" style={{ gridColumn: '1', gridRow: '3 / 5' }}>
          <img src={image2} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="overflow-hidden" style={{ gridColumn: '2', gridRow: '2 / 4' }}>
          <img src={image3} alt="" className="w-full h-full object-cover" />
        </div>
        
        <div className="overflow-hidden" style={{ gridColumn: '1', gridRow: '5' }}>
          <img src={image4} alt="" className="w-full h-full object-cover" />
        </div>
        
        <div className="overflow-hidden" style={{ gridColumn: '4', gridRow: '4 / 6' }}>
          <img src={image5} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="overflow-hidden" style={{ gridColumn: '5', gridRow: '5' }}>
          <img src={image8} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="overflow-hidden" style={{ gridColumn: '6', gridRow: '5' }}>
          <img src={image9} alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f2e]/60 via-transparent to-transparent pointer-events-none"></div>

      <div className="relative z-10 h-full w-full flex">
        <div className="w-[55%] h-full flex flex-col justify-center" style={{ paddingLeft: '18%', paddingRight: '4%' }}>
          <div className="inline-flex items-center bg-green-500/20 border border-green-400/40 px-4 py-2 rounded-full w-fit mb-8">
            <span className="text-green-400 font-semibold text-xs uppercase tracking-widest">
              Our Impact
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-10">
            Measuring Our<br />
            <span className="text-green-400">Community</span><br />
            Impact
          </h2>

          <div className="space-y-6 text-gray-400 text-[15px] leading-relaxed max-w-[420px]">
            <p>
              SolarPak stands at the forefront of renewable energy access in Pakistan. 
              Here we believe that clean energy is the foundation for change when families 
              can study, work, and thrive without electricity insecurity.
            </p>
            <p>
              We know that sustainable impact requires dedication, but it is the mission 
              of dreamers and doers. Our commitment is to bring light to every home 
              that needs it.
            </p>
            <p>
              With SolarPak, every installation is not just a panel, but a story to be told 
              about <span className="text-green-400">transformation and hope</span>.
            </p>
          </div>
        </div>

        <div className="w-[45%] h-full flex items-center justify-end pr-6">
          <div className="w-full max-w-[340px]">
            <div className="grid grid-cols-2 gap-3 mb-3">
              {metrics.slice(0, 2).map((metric, index) => (
                <div 
                  key={index}
                  className="bg-white/[0.08] backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center"
                >
                  <metric.icon className="w-6 h-6 mb-2 text-green-400" />
                  <span className="text-2xl font-bold text-white">{metric.value}</span>
                  <span className="text-[11px] text-gray-400 mt-1">{metric.label}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="overflow-hidden rounded-2xl">
                <img src={image10} alt="" className="w-full h-full object-cover" style={{ height: '140px' }} />
              </div>
              <div className="flex flex-col gap-3">
                {metrics.slice(2, 4).map((metric, index) => (
                  <div 
                    key={index}
                    className="bg-white/[0.08] backdrop-blur-sm border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center text-center flex-1"
                  >
                    <metric.icon className="w-5 h-5 mb-1 text-green-400" />
                    <span className="text-lg font-bold text-white">{metric.value}</span>
                    <span className="text-[10px] text-gray-400">{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {metrics.slice(4, 6).map((metric, index) => (
                <div 
                  key={index}
                  className={`backdrop-blur-sm border rounded-2xl p-4 flex flex-col items-center justify-center text-center ${
                    metric.isSpecial 
                      ? 'bg-[#1a1f2e]/90 border-green-500/30' 
                      : 'bg-white/[0.08] border-white/10'
                  }`}
                >
                  <metric.icon className="w-5 h-5 mb-1 text-green-400" />
                  <span className="text-xl font-bold text-white">{metric.value}</span>
                  <span className="text-[11px] text-gray-400 mt-1">{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
