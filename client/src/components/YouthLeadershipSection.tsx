import { Users, Award, Zap, Heart } from "lucide-react";

export default function YouthLeadershipSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-emerald-900 via-teal-800 to-blue-900 relative overflow-hidden">
      {/* Glassmorphic background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-green-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-amber-400/10 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full mb-6 shadow-lg">
            <span className="text-amber-300 font-bold text-sm uppercase tracking-wide">
              🌟 Why We're Different
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            The World's Largest Youth-Led Solar Nonprofit
          </h2>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            SolarPak is founded and run entirely by passionate young leaders committed to solving Pakistan's energy crisis. 
            We bring fresh perspectives, innovative solutions, and boundless energy to renewable energy charity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-500 group hover:-translate-y-2 shadow-xl">
            <div className="flex justify-center mb-4">
              <div className="bg-green-500/30 backdrop-blur-sm p-4 rounded-2xl border border-green-400/30 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-green-300" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 text-center">Youth-Led Team</h3>
            <p className="text-white/70 text-center leading-relaxed">
              100% student-run organization with 11 dedicated young leaders across 4 departments
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-500 group hover:-translate-y-2 shadow-xl">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-500/30 backdrop-blur-sm p-4 rounded-2xl border border-blue-400/30 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-blue-300" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 text-center">Proven Impact</h3>
            <p className="text-white/70 text-center leading-relaxed">
              17 solar installations completed, 100 lives transformed, 270 kWh of clean energy generated
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-500 group hover:-translate-y-2 shadow-xl">
            <div className="flex justify-center mb-4">
              <div className="bg-amber-500/30 backdrop-blur-sm p-4 rounded-2xl border border-amber-400/30 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-amber-300" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 text-center">Rapid Growth</h3>
            <p className="text-white/70 text-center leading-relaxed">
              Founded March 2025, already the largest youth-led solar nonprofit globally
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-500 group hover:-translate-y-2 shadow-xl">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-500/30 backdrop-blur-sm p-4 rounded-2xl border border-purple-400/30 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-purple-300" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 text-center">Mission-Driven</h3>
            <p className="text-white/70 text-center leading-relaxed">
              Passionate youth combining renewable energy expertise with genuine desire to help
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-12 border border-white/20 shadow-2xl">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-lg">Why Youth Leadership Matters</h3>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              Young leaders bring innovation, energy, and a fresh perspective to solving global challenges. 
              Our student-run model ensures passionate, dedicated leadership while connecting with communities 
              who need sustainable energy solutions most. We're not just planning for the future—we're building it.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-amber-300 mb-2">100%</div>
                <div className="text-lg text-white/80">Youth-Led</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-amber-300 mb-2">11</div>
                <div className="text-lg text-white/80">Team Members</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-amber-300 mb-2">4</div>
                <div className="text-lg text-white/80">Departments</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
