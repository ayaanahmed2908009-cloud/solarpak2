import { useState, useEffect } from "react";
import { X, ScrollText, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { SSEP_POLICY_ANALYSIS_SLUG } from "@/data/ssepPolicyAnalysis";

// On-load announcement for the SSEP policy analysis, shown once on the Impact
// Labs listing page. Follows the same popup pattern as the retired FY1
// annual-report announcement (fixed overlay + centered dark gradient card,
// localStorage-dismissed).
export default function SsepAnalysisAnnouncement() {
  const [isVisible, setIsVisible] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const hasSeen = localStorage.getItem("ssep-policy-analysis-announcement-dismissed");
    if (!hasSeen) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
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
              <ScrollText className="w-7 h-7 text-emerald-400" />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">New Policy Analysis</span>
            </div>

            <h2 className="text-2xl font-extrabold text-white mb-2 leading-tight tracking-tight">
              What Really Happened
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                with the SSEP
              </span>
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed mb-3 max-w-xs mx-auto">
              A full review of the World Bank-financed Sindh Solar Energy Project — what was
              promised, what got built, and why the delivery model broke down.
            </p>

            <p className="text-gray-500 text-xs leading-relaxed mb-6 max-w-xs mx-auto">
              Researched and written in-house by our team of researchers at{" "}
              <span className="text-emerald-400 font-medium">SolarPak Impact Labs</span>, drawing
              on official World Bank, Senate and Auditor-General records.
            </p>

            {/* Stats teaser */}
            <div className="grid grid-cols-3 gap-3 mb-7">
              {[
                { val: "7.5%", lbl: "Capacity Built" },
                { val: "26.8%", lbl: "Access Delivered" },
                { val: "12", lbl: "Page Report" },
              ].map((s) => (
                <div key={s.lbl} className="bg-white/5 border border-white/10 rounded-xl py-3 px-2">
                  <div className="text-lg font-bold text-white">{s.val}</div>
                  <div className="text-xs text-gray-400">{s.lbl}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleReadAnalysis}
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-900/40 text-sm"
              >
                Read the Analysis
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleDismiss}
                className="text-gray-500 hover:text-gray-400 text-xs transition-colors pt-1"
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
