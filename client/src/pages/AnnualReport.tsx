import { useRef, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, Download, ExternalLink } from "lucide-react";

const stats = [
  { label: "Solar Installations", value: "24", sub: "completed in FY1" },
  { label: "People Impacted", value: "240+", sub: "direct beneficiaries" },
  { label: "CO₂ Avoided", value: "1,900 kg", sub: "estimated annually" },
  { label: "Total Raised", value: "PKR 12.7L", sub: "April 2025 – May 2026" },
];

const highlights = [
  { num: "21", desc: "Energy-empowered households" },
  { num: "1", desc: "Rural school electrified" },
  { num: "16", desc: "Active youth team members" },
  { num: "200k+", desc: "Social media views" },
  { num: "3", desc: "Research articles published" },
  { num: "270 kWh", desc: "Clean energy generated" },
];

export default function AnnualReport() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeroVisible(true); },
      { threshold: 0.1 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div
        ref={heroRef}
        className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 pt-32 pb-24 overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-24 w-[500px] h-[500px] bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-teal-500/8 to-cyan-500/8 rounded-full blur-3xl" />
        </div>

        <div
          className="container mx-auto px-6 relative z-10 transition-all duration-1000"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div className="inline-flex items-center gap-2 bg-green-400/10 border border-green-400/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold uppercase tracking-[0.18em]">
              Fiscal Year 1 · April 2025 – May 2026
            </span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-5 leading-[1.05] tracking-tight">
              SolarPak
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                Annual Report
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-xl leading-relaxed mb-5">
              Lighting the Way Forward — our first-year impact across 24 installations, 240+ lives
              changed, and the communities of Khairpur, Pakistan.
            </p>
            <p className="text-sm text-gray-500 max-w-lg leading-relaxed mb-10">
              Written by the SolarPak Impact Labs team. Documenting our environmental and
              economic outcomes, financial transparency, and the year we went from informal
              youth group to a recognised organisation.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="/annual-report-fy1.pdf"
                download="SolarPak-Annual-Report-FY1.pdf"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 hover:shadow-lg hover:shadow-emerald-900/30"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
              <a
                href="/annual-report-fy1.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 border border-white/10"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48L48 42.7C96 37.3 192 26.7 288 24C384 21.3 480 26.7 576 29.3C672 32 768 32 864 29.3C960 26.7 1056 21.3 1152 21.3C1248 21.3 1344 26.7 1392 29.3L1440 32V48H0Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* Stats row */}
      <div className="container mx-auto px-6 -mt-2 mb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300"
            >
              <span className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-0.5">
                {stat.label}
              </span>
              <span className="text-xs text-gray-400">{stat.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights strip */}
      <div className="container mx-auto px-6 mb-16">
        <div className="bg-gradient-to-br from-slate-50 to-emerald-50 border border-emerald-100 rounded-2xl p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 mb-6">By the numbers</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {highlights.map((h) => (
              <div key={h.num} className="text-center">
                <div className="text-2xl font-extrabold text-gray-900 mb-1">{h.num}</div>
                <div className="text-xs text-gray-500 leading-snug">{h.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PDF Viewer Section */}
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <FileText className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Full Report</h2>
                <p className="text-xs text-gray-400">47 pages · FY1 Official · Lighting the Way Forward</p>
              </div>
            </div>
            <a
              href="/annual-report-fy1.pdf"
              download="SolarPak-Annual-Report-FY1.pdf"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-900 transition-colors bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-full"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </a>
          </div>

          {/* PDF embed — object+embed is the most cross-browser reliable approach */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl">
            <object
              data="/annual-report-fy1.pdf"
              type="application/pdf"
              className="w-full"
              style={{ height: "88vh", minHeight: 640, display: "block" }}
            >
              {/* embed as second fallback */}
              <embed
                src="/annual-report-fy1.pdf"
                type="application/pdf"
                className="w-full"
                style={{ height: "88vh", minHeight: 640, display: "block" }}
              />
            </object>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            PDF not displaying?{" "}
            <a
              href="/annual-report-fy1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              Open directly in your browser
            </a>{" "}
            or{" "}
            <a
              href="/annual-report-fy1.pdf"
              download="SolarPak-Annual-Report-FY1.pdf"
              className="text-emerald-600 hover:underline"
            >
              download the file
            </a>
            .
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
