import SimpleVillageStories from "@/components/SimpleVillageStories";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function VillageExperience() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Simple Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Village Stories
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            See how solar power transforms families across Pakistan
          </p>
        </div>
      </section>
      
      {/* Simple Village Stories Section */}
      <section className="relative">
        <SimpleVillageStories />
      </section>
      
      <Footer />
    </div>
  );
}