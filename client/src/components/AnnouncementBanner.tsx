import { useState, useEffect } from "react";
import { X, Globe } from "lucide-react";

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the announcement
    const hasSeenAnnouncement = localStorage.getItem("morocco-announcement-dismissed");
    
    if (!hasSeenAnnouncement) {
      // Show announcement after a short delay for better UX
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
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-300"
        onClick={handleDismiss}
      />
      
      {/* Announcement Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4 animate-in zoom-in-95 slide-in-from-top-4 duration-300">
        <div className="bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-3xl shadow-2xl border-2 border-green-200 p-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl"></div>
          
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close announcement"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg">
              <Globe className="w-8 h-8 text-white animate-pulse" />
            </div>
            
            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Exciting News! 🌍
            </h2>
            
            {/* Message */}
            <p className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
              SolarPak Morocco Coming Soon
            </p>
            
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
              We're expanding our mission to bring clean, sustainable solar energy to families in Morocco. 
              Stay tuned for updates on this exciting new chapter!
            </p>
            
            {/* Action button */}
            <button
              onClick={handleDismiss}
              className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Got It! ✨
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
