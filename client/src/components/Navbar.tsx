import { useState } from "react";
import { Link } from "wouter";
import { Sun, Menu, X, Zap, Users, Thermometer, Heart, MapPin, Camera } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Hamburger Menu Button - Fixed position top-left */}
      <button 
        className="fixed top-6 left-6 z-[60] p-3 rounded-lg bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 group shadow-lg border border-white/20" 
        onClick={toggleSidebar}
        aria-label="Toggle sidebar menu"
        data-testid="button-menu-toggle"
      >
        <div className="flex flex-col space-y-1.5 w-6 h-6 items-center justify-center">
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isSidebarOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${isSidebarOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isSidebarOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </div>
      </button>
      
      {/* Animated Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header with logo and close button */}
        <div className="flex items-center justify-between p-6 border-b border-green-200 bg-white">
          <div className="flex items-center space-x-3">
            <img src="/favicon.png" alt="SolarPak Logo" className="h-10 w-12 object-contain" />
            <div>
              <span className="text-xl font-bold text-green-800">SolarPak</span>
              <p className="text-xs text-green-600">Lighting Futures</p>
            </div>
          </div>
          <button 
            onClick={closeSidebar}
            className="p-2 rounded-lg bg-green-100 hover:bg-green-200 transition-all duration-300 group"
            data-testid="button-sidebar-close"
          >
            <X className="h-6 w-6 text-green-700 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
        
        <div className="flex flex-col p-6 h-full overflow-y-auto">
          {/* Navigation Links */}
          <div className="space-y-2 mb-8">
            <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-4 px-2">Navigation</div>
            
            <a 
              href="/#problem" 
              className="flex items-center font-medium text-green-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200 py-4 px-4 rounded-xl group border-l-4 border-transparent hover:border-green-500"
              onClick={closeSidebar}
              data-testid="link-crisis"
            >
              <Thermometer className="w-5 h-5 mr-4 text-green-600 group-hover:scale-110 transition-transform duration-200" />
              <div>
                <div className="font-semibold">Crisis</div>
                <div className="text-xs text-green-600">Energy challenges</div>
              </div>
            </a>
            
            <a 
              href="/#solution" 
              className="flex items-center font-medium text-green-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200 py-4 px-4 rounded-xl group border-l-4 border-transparent hover:border-green-500"
              onClick={closeSidebar}
              data-testid="link-solution"
            >
              <Sun className="w-5 h-5 mr-4 text-green-600 group-hover:scale-110 transition-transform duration-200" />
              <div>
                <div className="font-semibold">Solution</div>
                <div className="text-xs text-green-600">Solar power</div>
              </div>
            </a>
            
            <Link 
              href="/village" 
              className="flex items-center font-medium text-green-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200 py-4 px-4 rounded-xl group border-l-4 border-transparent hover:border-green-500"
              onClick={closeSidebar}
              data-testid="link-stories"
            >
              <Heart className="w-5 h-5 mr-4 text-green-600 group-hover:scale-110 transition-transform duration-200" />
              <div>
                <div className="font-semibold">Stories</div>
                <div className="text-xs text-green-600">Real impact</div>
              </div>
            </Link>
            
            <a 
              href="/#impact" 
              className="flex items-center font-medium text-green-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200 py-4 px-4 rounded-xl group border-l-4 border-transparent hover:border-green-500"
              onClick={closeSidebar}
              data-testid="link-impact"
            >
              <Zap className="w-5 h-5 mr-4 text-green-600 group-hover:scale-110 transition-transform duration-200" />
              <div>
                <div className="font-semibold">Impact</div>
                <div className="text-xs text-green-600">Our results</div>
              </div>
            </a>
            
            <Link 
              href="/impact" 
              className="flex items-center font-medium text-green-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200 py-4 px-4 rounded-xl group border-l-4 border-transparent hover:border-green-500"
              onClick={closeSidebar}
              data-testid="link-map"
            >
              <MapPin className="w-5 h-5 mr-4 text-green-600 group-hover:scale-110 transition-transform duration-200" />
              <div>
                <div className="font-semibold">Map</div>
                <div className="text-xs text-green-600">Locations</div>
              </div>
            </Link>
            
            <Link
              href="/membership" 
              className="flex items-center font-medium text-green-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200 py-4 px-4 rounded-xl group border-l-4 border-transparent hover:border-green-500"
              onClick={closeSidebar}
              data-testid="link-membership"
            >
              <Users className="w-5 h-5 mr-4 text-green-600 group-hover:scale-110 transition-transform duration-200" />
              <div>
                <div className="font-semibold">Membership</div>
                <div className="text-xs text-green-600">Join us</div>
              </div>
            </Link>
            
            <Link
              href="/team" 
              className="flex items-center font-medium text-green-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200 py-4 px-4 rounded-xl group border-l-4 border-transparent hover:border-green-500"
              onClick={closeSidebar}
              data-testid="link-team"
            >
              <Users className="w-5 h-5 mr-4 text-green-600 group-hover:scale-110 transition-transform duration-200" />
              <div>
                <div className="font-semibold">Team</div>
                <div className="text-xs text-green-600">Meet us</div>
              </div>
            </Link>
            
            <Link
              href="/gallery" 
              className="flex items-center font-medium text-green-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200 py-4 px-4 rounded-xl group border-l-4 border-transparent hover:border-green-500"
              onClick={closeSidebar}
              data-testid="link-gallery"
            >
              <Camera className="w-5 h-5 mr-4 text-green-600 group-hover:scale-110 transition-transform duration-200" />
              <div>
                <div className="font-semibold">Gallery</div>
                <div className="text-xs text-green-600">Photos & videos</div>
              </div>
            </Link>
          </div>
          
          {/* Action buttons */}
          <div className="mt-auto space-y-4 pb-6">
            <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-4 px-2">Quick Actions</div>
            
            <Link 
              href="/worker/login" 
              className="flex items-center justify-center py-4 px-6 bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 transition-all duration-200 rounded-xl border border-green-200 hover:border-green-300 font-semibold group"
              onClick={closeSidebar}
              data-testid="link-team-login"
            >
              <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-200">🔐</span>
              <div className="text-left">
                <div>Team Login</div>
                <div className="text-xs text-green-600">Access portal</div>
              </div>
            </Link>
            
            <a 
              href="/#donate" 
              className="flex items-center justify-center py-4 px-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl group"
              onClick={closeSidebar}
              data-testid="link-donate"
            >
              <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-200">❤️</span>
              <div className="text-left">
                <div>Donate Now</div>
                <div className="text-xs text-green-100">Support families</div>
              </div>
            </a>
            
            {/* Footer info */}
            <div className="mt-6 pt-6 border-t border-green-200 text-center">
              <p className="text-sm font-semibold text-green-700">Bringing light to Pakistan</p>
              <p className="text-xs text-green-600 mt-1">Empowering communities since 2025</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={closeSidebar}
          data-testid="sidebar-backdrop"
        ></div>
      )}
    </>
  );
}