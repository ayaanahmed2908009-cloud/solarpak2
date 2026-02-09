import { useState, useEffect } from "react";
import { X, Globe } from "lucide-react";

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenAnnouncement = localStorage.getItem("morocco-announcement-dismissed");
    
    if (!hasSeenAnnouncement) {
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("morocco-announcement-dismissed", "true");
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
            <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-full mb-6">
              <Globe className="w-7 h-7 text-emerald-700" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Exciting News
            </h2>
            
            <p className="text-xl font-semibold text-gray-800 mb-3">
              SolarPak Morocco Coming Soon
            </p>
            
            <p className="text-gray-600 leading-relaxed mb-6">
              We're expanding our mission to bring clean, sustainable solar energy to families in Morocco. 
              Stay tuned for updates on this exciting new chapter.
            </p>
            
            <button
              onClick={handleDismiss}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-8 py-3 rounded-md transition-colors duration-200"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
