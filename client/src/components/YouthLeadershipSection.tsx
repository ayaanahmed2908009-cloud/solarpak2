import { Users, Award, Zap, Heart } from "lucide-react";

export default function YouthLeadershipSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-amber-100 border border-amber-300 px-6 py-3 rounded-full mb-6">
            <span className="text-amber-700 font-bold text-sm uppercase tracking-wide">
              🌟 Why We're Different
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-6">
            The World's Largest Youth-Led Solar Nonprofit
          </h2>
          
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            SolarPak is founded and run entirely by passionate young leaders committed to solving Pakistan's energy crisis. 
            We bring fresh perspectives, innovative solutions, and boundless energy to renewable energy charity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-green-500">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-green-900 mb-3 text-center">Youth-Led Team</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              100% student-run organization with 9 dedicated young leaders across 4 departments
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-500">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-blue-900 mb-3 text-center">Proven Impact</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              11 solar installations completed, 70 lives transformed, 240 kWh of clean energy generated
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-amber-500">
            <div className="flex justify-center mb-4">
              <div className="bg-amber-100 p-4 rounded-full">
                <Zap className="w-8 h-8 text-amber-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-amber-900 mb-3 text-center">Rapid Growth</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Founded March 2025, already the largest youth-led solar nonprofit globally
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-purple-500">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-100 p-4 rounded-full">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-purple-900 mb-3 text-center">Mission-Driven</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Passionate youth combining renewable energy expertise with genuine desire to help
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-12 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Why Youth Leadership Matters</h3>
            <p className="text-xl leading-relaxed mb-8">
              Young leaders bring innovation, energy, and a fresh perspective to solving global challenges. 
              Our student-run model ensures passionate, dedicated leadership while connecting with communities 
              who need sustainable energy solutions most. We're not just planning for the future—we're building it.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-amber-300 mb-2">100%</div>
                <div className="text-lg">Youth-Led</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-300 mb-2">9</div>
                <div className="text-lg">Team Members</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-300 mb-2">4</div>
                <div className="text-lg">Departments</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
