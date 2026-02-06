import SimpleVillageStories from "@/components/SimpleVillageStories";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function VillageExperience() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20">
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-teal-500/8 to-cyan-500/8 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <span className="text-green-400/80 font-medium text-xs uppercase tracking-[0.2em] mb-4 block">
              Real Impact
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-[1.1] tracking-tight">
              Village Stories
            </h1>
            <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
              See how solar power transforms families across Pakistan.
            </p>
          </div>
        </div>
      </section>
      
      {/* Simple Village Stories Section */}
      <section className="relative">
        <SimpleVillageStories />
      </section>
      
      </div>
      <Footer />
    </div>
  );
}