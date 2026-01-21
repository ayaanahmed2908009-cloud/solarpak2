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
    { icon: Sun, value: "17", label: "Solar Panels", color: "bg-green-50" },
    { icon: Users, value: "100", label: "People Impacted", color: "bg-green-50" },
    { icon: DollarSign, value: "11K", label: "SAR Raised", color: "bg-green-50" },
    { icon: Leaf, value: "100kg", label: "CO2 Prevented", color: "bg-green-50" },
    { icon: Award, value: "12", label: "Team Members", color: "bg-green-50" },
    { icon: Heart, value: "✓", label: "Community Pillar", color: "bg-green-50" },
  ];

  const collageImages = [
    { src: image1, alt: "Solar panel installation" },
    { src: image2, alt: "Community member" },
    { src: image3, alt: "Village resident" },
    { src: image4, alt: "Installation work" },
    { src: image5, alt: "Family beneficiary" },
    { src: image6, alt: "Team at work" },
    { src: image7, alt: "Community elder" },
    { src: image8, alt: "Local resident" },
    { src: image9, alt: "Happy beneficiary" },
    { src: image10, alt: "Village woman" },
    { src: image11, alt: "Young community member" },
  ];

  return (
    <section className="min-h-screen bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="grid grid-cols-4 grid-rows-3 h-full w-full opacity-40">
          {collageImages.slice(0, 12).map((img, index) => (
            <div 
              key={index} 
              className="relative overflow-hidden"
              style={{
                gridColumn: index === 0 ? 'span 1' : undefined,
                gridRow: index === 0 ? 'span 2' : undefined,
              }}
            >
              <img 
                src={img.src} 
                alt={img.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-8">
            <div className="inline-flex items-center bg-green-500/20 border border-green-400/40 px-5 py-2 rounded-full">
              <span className="text-green-400 font-semibold text-sm uppercase tracking-wider">
                Our Impact
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Measuring Our<br />
              <span className="text-green-400">Community</span><br />
              Impact
            </h2>

            <div className="space-y-6 text-gray-300 text-lg leading-relaxed max-w-xl">
              <p>
                SolarPak stands at the forefront of renewable energy access in Pakistan. 
                We believe that clean energy is the foundation for change when families 
                can study, work, and thrive without the burden of electricity insecurity.
              </p>
              <p>
                We know that sustainable impact requires dedication, but it is the mission 
                of dreamers and doers. Our commitment is to bring light to every home that 
                needs it.
              </p>
              <p>
                With SolarPak, every installation is not just a panel, but a 
                <span className="text-green-400 font-semibold"> story of transformation</span>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <div 
                key={index}
                className={`${metric.color} rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  index === 5 ? 'bg-slate-800 border border-green-500/30' : ''
                }`}
              >
                <metric.icon className={`w-8 h-8 mb-3 ${index === 5 ? 'text-green-400' : 'text-green-600'}`} />
                <span className={`text-3xl md:text-4xl font-bold ${index === 5 ? 'text-green-400' : 'text-slate-900'}`}>
                  {metric.value}
                </span>
                <span className={`text-sm mt-1 ${index === 5 ? 'text-gray-400' : 'text-slate-600'}`}>
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-1/2 h-full">
          <div className="grid grid-cols-3 gap-2 h-full opacity-60">
            {collageImages.slice(5, 11).map((img, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg">
                <img 
                  src={img.src} 
                  alt={img.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
