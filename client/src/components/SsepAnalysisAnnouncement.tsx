import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useLocation } from "wouter";
import { SSEP_POLICY_ANALYSIS_SLUG } from "@/data/ssepPolicyAnalysis";

// On-load announcement for the SSEP policy analysis, shown once on the site's
// landing page (not on Impact Labs itself). Follows the same popup pattern as
// the retired FY1 annual-report announcement (fixed overlay + centered dark
// gradient card, localStorage-dismissed).
export default function SsepAnalysisAnnouncement() {
  const [isVisible, setIsVisible] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const hasSeen = localStorage.getItem("ssep-policy-analysis-announcement-dismissed");
    if (!hasSeen) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("ssep-policy-analysis-announcement-dismissed", "true");
  };

  const handleReadAnalysis = () => {
    handleDismiss();
    setLocation(`/impact-labs/${SSEP_POLICY_ANALYSIS_SLUG}`);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={handleDismiss} />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm px-4">
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-2xl shadow-2xl overflow-hidden border border-white/10">
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

          <div className="relative p-7">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">New from Impact Labs</span>
            </div>

            <h2 className="text-xl font-extrabold text-white mb-3 leading-snug tracking-tight">
              What really happened with the Sindh Solar Energy Project
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              A full policy analysis of the World Bank-financed SSEP — what was promised,
              what got built, and why the delivery model broke down.
            </p>

            <p className="text-gray-500 text-xs leading-relaxed mb-6 pb-6 border-b border-white/10">
              Researched and written in-house by our team of researchers at{" "}
              <span className="text-emerald-400 font-medium">SolarPak Impact Labs</span>, drawing
              on official World Bank, Senate and Auditor-General records.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReadAnalysis}
                className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-900/40 text-sm"
              >
                Read the analysis
              </button>
              <button
                onClick={handleDismiss}
                className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
