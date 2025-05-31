import { ChevronDown } from "lucide-react";
import VirtualVillageTour from "@/components/VirtualVillageTour";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function VillageExperience() {
  const scrollToExperience = () => {
    document.getElementById('village-tour')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Introduction Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 right-32 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            <span className="block text-white">Are you ready to</span>
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-extrabold">
              put yourself
            </span>
            <span className="block text-white">in the shoes of what</span>
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-extrabold">
              millions
            </span>
            <span className="block text-white">have to experience</span>
            <span className="block bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent font-extrabold">
              every day?
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-200 mb-12 leading-relaxed max-w-3xl mx-auto">
            Step into the daily reality of Pakistani families struggling with electricity shortages and extreme heat. 
            Experience their challenges, witness their transformation, and understand how solar power changes everything.
          </p>
          
          <button 
            onClick={scrollToExperience}
            className="group flex flex-col items-center mx-auto animate-bounce"
          >
            <span className="text-white text-lg font-semibold mb-2 group-hover:text-blue-300 transition-colors">
              Scroll down to learn more
            </span>
            <ChevronDown className="w-8 h-8 text-white group-hover:text-blue-300 transition-colors" />
          </button>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-70"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-50" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-white rounded-full animate-ping opacity-60" style={{animationDelay: '2s'}}></div>
      </section>
      
      {/* Village Experience Section */}
      <section id="village-tour" className="relative">
        <VirtualVillageTour />
      </section>
      
      <Footer />
    </div>
  );
}