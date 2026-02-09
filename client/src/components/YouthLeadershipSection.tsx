import { Users, Award, Zap, Heart } from "lucide-react";

export default function YouthLeadershipSection() {
  return (
    <section className="py-20 bg-slate-900 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
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
          <div className="bg-white/5 rounded-xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 group">
            <div className="flex justify-center mb-5">
              <div className="bg-emerald-900/60 p-4 rounded-xl group-hover:bg-emerald-800/60 transition-colors duration-300">
                <Users className="w-7 h-7 text-emerald-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 text-center">Youth-Led Team</h3>
            <p className="text-gray-400 text-center leading-relaxed text-sm">
              100% student-run organization with 11 dedicated young leaders across 4 departments
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 group">
            <div className="flex justify-center mb-5">
              <div className="bg-emerald-900/60 p-4 rounded-xl group-hover:bg-emerald-800/60 transition-colors duration-300">
                <Award className="w-7 h-7 text-emerald-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 text-center">Proven Impact</h3>
            <p className="text-gray-400 text-center leading-relaxed text-sm">
              17 solar installations completed, 100 lives transformed, 270 kWh of clean energy generated
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 group">
            <div className="flex justify-center mb-5">
              <div className="bg-emerald-900/60 p-4 rounded-xl group-hover:bg-emerald-800/60 transition-colors duration-300">
                <Zap className="w-7 h-7 text-emerald-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 text-center">Rapid Growth</h3>
            <p className="text-gray-400 text-center leading-relaxed text-sm">
              Founded March 2025, already the largest youth-led solar nonprofit globally
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 group">
            <div className="flex justify-center mb-5">
              <div className="bg-emerald-900/60 p-4 rounded-xl group-hover:bg-emerald-800/60 transition-colors duration-300">
                <Heart className="w-7 h-7 text-emerald-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 text-center">Mission-Driven</h3>
            <p className="text-gray-400 text-center leading-relaxed text-sm">
              Passionate youth combining renewable energy expertise with genuine desire to help
            </p>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-10 md:p-12 border border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-white mb-6">Why Youth Leadership Matters</h3>
            <p className="text-lg text-gray-300 leading-relaxed mb-10">
              Young leaders bring innovation, energy, and a fresh perspective to solving global challenges. 
              Our student-run model ensures passionate, dedicated leadership while connecting with communities 
              who need sustainable energy solutions most. We're not just planning for the future — we're building it.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="text-3xl font-bold text-emerald-400 mb-2">100%</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Youth-Led</div>
              </div>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="text-3xl font-bold text-emerald-400 mb-2">11</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Team Members</div>
              </div>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="text-3xl font-bold text-emerald-400 mb-2">4</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Departments</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
