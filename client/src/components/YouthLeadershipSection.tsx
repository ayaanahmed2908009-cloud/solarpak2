import { Users, Award, Zap, Heart } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function YouthLeadershipSection() {
  const sectionRef = useScrollReveal(0.1);

  return (
    <section ref={sectionRef} className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 scroll-reveal">
          <span className="inline-block text-emerald-400 font-semibold text-sm uppercase tracking-widest mb-4">
            Why We're Different
          </span>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            The World's Largest Youth-Led Solar Nonprofit
          </h2>
          
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            SolarPak is founded and run entirely by passionate young leaders committed to solving Pakistan's energy crisis. 
            We bring fresh perspectives, innovative solutions, and boundless energy to renewable energy charity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Users, title: "Youth-Led Team", desc: "100% student-run organization with 15 dedicated young leaders across 5 departments" },
            { icon: Award, title: "Proven Impact", desc: "23 solar installations completed, 100 lives transformed, 270 kWh of clean energy generated" },
            { icon: Zap, title: "Rapid Growth", desc: "Founded March 2025, already the largest youth-led solar nonprofit globally" },
            { icon: Heart, title: "Mission-Driven", desc: "Passionate youth combining renewable energy expertise with genuine desire to help" },
          ].map((item, i) => (
            <div key={i} className={`scroll-reveal stagger-delay-${i + 1}`}>
              <div className="bg-white/5 rounded-xl p-8 border border-white/10 hover:border-emerald-500/30 hover:bg-white/[0.08] transition-all duration-500 group h-full">
                <div className="flex justify-center mb-5">
                  <div className="bg-emerald-900/60 p-4 rounded-xl group-hover:bg-emerald-800/60 group-hover:scale-110 transition-all duration-500">
                    <item.icon className="w-7 h-7 text-emerald-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">{item.title}</h3>
                <p className="text-gray-400 text-center leading-relaxed text-sm">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="scroll-reveal">
          <div className="bg-white/5 rounded-xl p-10 md:p-12 border border-white/10 hover:border-emerald-500/20 transition-all duration-500">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl font-bold text-white mb-6">Why Youth Leadership Matters</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-10">
                Young leaders bring innovation, energy, and a fresh perspective to solving global challenges. 
                Our student-run model ensures passionate, dedicated leadership while connecting with communities 
                who need sustainable energy solutions most. We're not just planning for the future — we're building it.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                {[
                  { value: "100%", label: "Youth-Led" },
                  { value: "15", label: "Team Members" },
                  { value: "5", label: "Departments" },
                ].map((stat, i) => (
                  <div key={i} className={`scroll-reveal-scale stagger-delay-${i + 1}`}>
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-emerald-500/20 transition-all duration-300">
                      <div className="text-3xl font-bold text-emerald-400 mb-2">{stat.value}</div>
                      <div className="text-sm text-gray-400 uppercase tracking-wide">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
