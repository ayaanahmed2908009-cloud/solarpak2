import { useState, useEffect } from "react";
import { X, Zap } from "lucide-react";

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenAnnouncement = localStorage.getItem("hackathon-announcement-dismissed");

    if (!hasSeenAnnouncement) {
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("hackathon-announcement-dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={handleDismiss}
      />

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-8 relative">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-full"
            aria-label="Close announcement"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-100 rounded-full mb-6">
              <Zap className="w-7 h-7 text-amber-600" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Introducing Our Flagship Hackathon
            </h2>

            <p className="text-xl font-semibold text-amber-600 mb-4">
              SolarPak Energy Hackathon
            </p>

            <ul className="text-gray-600 text-sm space-y-2 mb-6 text-left inline-block">
              <li>⚡ No-code — open to everyone</li>
              <li>🏆 Over $300 in prizes up for grabs</li>
              <li>💼 Internship opportunities on the line</li>
            </ul>

            <div className="flex flex-col gap-3">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeS8Ggp6mGCLbMc_fWZ7XbMYehpx9Suq-T_2kEpo5ZXwBt5ag/viewform?usp=sharing&ouid=103166990689961663759"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-md transition-colors duration-200"
              >
                Register Interest Now
              </a>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 text-sm transition-colors duration-200"
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
