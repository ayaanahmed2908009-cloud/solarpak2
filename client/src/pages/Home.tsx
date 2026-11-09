import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEOOptimizedContent, SEOFAQSection } from "@/components/SEOOptimizedContent";
import { SEOBlogContent, SEOLocationContent } from "@/components/SEOBlogContent";
import "@/components/premium/premium.css";
import { Ribbon, Hero, NightToLight, WhereWeWork } from "@/components/premium/HomeOpening";
import { SystemSection, ImpactNumbers, FieldStories } from "@/components/premium/HomeMiddle";
import { TeamReveal, Organisation, Research, Fund, HomeFootnotes } from "@/components/premium/HomeClosing";

export default function Home() {
  return (
    <SEOOptimizedContent
      title="The World's Largest Youth Led Solar Non Profit | SolarPak Pakistan"
      description="SolarPak is the world's largest youth-led solar nonprofit, bringing clean energy to Pakistani families. Student-run organization installing solar panels and transforming lives across Pakistan through renewable energy."
      keywords={[
        "world's largest youth led solar nonprofit",
        "youth led solar organization",
        "student run solar charity",
        "young leaders renewable energy",
        "solar energy Pakistan",
        "solar panels donation",
        "Pakistan electricity crisis",
        "youth-led nonprofit",
        "student solar initiative",
      ]}
    >
      <div className="sp min-h-screen overflow-x-clip">
        <Navbar />
        <main>
          <Ribbon />
          <Hero />
          <NightToLight />
          <WhereWeWork />
          <SystemSection />
          <ImpactNumbers />
          <FieldStories />
          <TeamReveal />
          <Organisation />
          <Research />
          <Fund />
        </main>
        <Footer footnotes={<HomeFootnotes />} />
      </div>

      {/* Screen-reader / search-engine content (visually hidden) */}
      <SEOFAQSection />
      <SEOBlogContent />
      <SEOLocationContent />
    </SEOOptimizedContent>
  );
}
