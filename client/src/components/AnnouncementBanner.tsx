import { useState, useEffect } from "react";
import { X, FileText, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const hasSeen = localStorage.getItem("annual-report-announcement-dismissed");
    if (!hasSeen) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("annual-report-announcement-dismissed", "true");
  };

  const handleReadReport = () => {
    handleDismiss();
    setLocation("/annual-report");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={handleDismiss} />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4">
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-2xl shadow-2xl overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-green-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 z-10 text-white/40 hover:text-white/80 transition-colors p-1.5 hover:bg-white/10 rounded-full"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative p-8 text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-green-400/10 border border-emerald-400/20 mb-5">
              <FileText className="w-7 h-7 text-emerald-400" />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Just Released</span>
            </div>

            <h2 className="text-2xl font-extrabold text-white mb-2 leading-tight tracking-tight">
              Our FY1 Annual Report
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                is here
              </span>
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs mx-auto">
              Read our first-year impact report — milestones, communities transformed,
              and what's next for SolarPak.
            </p>

            {/* Stats teaser */}
            <div className="grid grid-cols-3 gap-3 mb-7">
              {[
                { val: "24", lbl: "Installs" },
                { val: "240+", lbl: "Lives" },
                { val: "1,900kg", lbl: "CO₂ Saved" },
              ].map((s) => (
                <div key={s.lbl} className="bg-white/5 border border-white/10 rounded-xl py-3 px-2">
                  <div className="text-lg font-bold text-white">{s.val}</div>
                  <div className="text-xs text-gray-400">{s.lbl}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleReadReport}
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-900/40 text-sm"
              >
                Read the Report
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="/annual-report-fy1.pdf"
                download="SolarPak-Annual-Report-FY1.pdf"
                onClick={handleDismiss}
                className="inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/12 text-white/70 hover:text-white font-medium px-6 py-2.5 rounded-xl transition-all duration-200 text-sm border border-white/10"
              >
                Download PDF
              </a>
              <button
                onClick={handleDismiss}
                className="text-gray-500 hover:text-gray-400 text-xs transition-colors pt-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
