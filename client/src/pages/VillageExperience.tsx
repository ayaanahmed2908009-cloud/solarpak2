import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import VirtualVillageTour from "@/components/VirtualVillageTour";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function VillageExperience() {
  const [displayedText, setDisplayedText] = useState("");
  const [showSubtext, setShowSubtext] = useState(false);
  const [showScrollPrompt, setShowScrollPrompt] = useState(false);
  
  const mainText = "Are you prepared to see what millions have to go through each day?";
  const subText = "Scroll down to witness it yourself";
  
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= mainText.length) {
        setDisplayedText(mainText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        // Show subtext after main text is complete
        setTimeout(() => setShowSubtext(true), 500);
        setTimeout(() => setShowScrollPrompt(true), 1000);
      }
    }, 80); // Typing speed

    return () => clearInterval(typingInterval);
  }, []);

  const scrollToExperience = () => {
    document.getElementById('village-tour')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Minimalist Typing Animation Section */}
      <section className="min-h-screen flex items-center justify-center bg-white relative">
        <div className="text-center max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight min-h-[200px] flex items-center justify-center">
            <span className="border-r-2 border-gray-900 pr-1 animate-pulse">
              {displayedText}
            </span>
          </h1>
          
          {showSubtext && (
            <p className="text-xl md:text-2xl text-gray-600 mb-12 opacity-0 animate-fade-in">
              {subText}
            </p>
          )}
          
          {showScrollPrompt && (
            <button 
              onClick={scrollToExperience}
              className="group flex flex-col items-center mx-auto animate-bounce opacity-0 animate-fade-in-delayed"
            >
              <ChevronDown className="w-8 h-8 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          )}
        </div>
      </section>
      
      {/* Village Experience Section */}
      <section id="village-tour" className="relative">
        <VirtualVillageTour />
      </section>
      
      <Footer />
    </div>
  );
}