import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import founderPhoto from "@assets/Founder_1770399563006.png";

export default function FounderQuote() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="relative flex justify-center">
              <div className="aspect-square max-w-md w-full rounded-2xl overflow-hidden bg-white shadow-2xl">
                <img
                  src={founderPhoto}
                  alt="Ayaan Ahmed - Founder & CEO"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-amber-300 to-yellow-400 rounded-xl -z-10" />
            </div>

            <div className="relative">
              <Quote className="w-16 h-16 text-emerald-100 mb-6" strokeWidth={1.5} />
              <blockquote className="text-xl md:text-2xl lg:text-3xl font-light text-gray-800 leading-relaxed mb-8 tracking-tight">
                Every family deserves the dignity of light. Solar energy isn't just about electricity — it's about giving children a chance to study after dark, giving mothers the ability to cook safely, and giving entire communities hope for a brighter tomorrow.
              </blockquote>
              <div className="h-px w-16 bg-emerald-500 mb-6" />
              <div>
                <p className="text-lg font-semibold text-gray-900">Ayaan Ahmed</p>
                <p className="text-sm text-emerald-600 font-medium tracking-wide">Founder & CEO, SolarPak</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
