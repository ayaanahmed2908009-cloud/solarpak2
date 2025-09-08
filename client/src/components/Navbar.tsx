import { useState } from "react";
import { Link } from "wouter";
import { Sun, Menu, X, Zap, Users, Thermometer, Heart, MapPin, Camera } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-green-200">
      <div className="mx-auto max-w-7xl px-4 py-3 md:px-8 lg:px-12 md:py-4 lg:py-5">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <img src="/favicon.png" alt="SolarPak Logo" className="h-10 w-14 lg:h-12 lg:w-16" />
            <span className="text-xl lg:text-2xl font-bold text-green-700">SolarPak</span>
          </Link>
          
          {/* Main Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-8 xl:space-x-10">
            <a href="/#problem" className="font-medium text-green-700 hover:text-green-600 transition-all duration-200 relative group text-sm lg:text-base xl:text-lg px-2 py-1">
              Crisis
              <span className="absolute left-2 bottom-0 w-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a href="/#solution" className="font-medium text-green-700 hover:text-green-600 transition-all duration-200 relative group text-sm lg:text-base xl:text-lg px-2 py-1">
              Solution
              <span className="absolute left-2 bottom-0 w-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <Link href="/village" className="font-medium text-green-700 hover:text-green-600 transition-all duration-200 relative group text-sm lg:text-base xl:text-lg px-2 py-1">
              Stories
              <span className="absolute left-2 bottom-0 w-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <a href="/#impact" className="font-medium text-green-700 hover:text-green-600 transition-all duration-200 relative group text-sm lg:text-base xl:text-lg px-2 py-1">
              Impact
              <span className="absolute left-2 bottom-0 w-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <Link href="/impact" className="flex items-center font-medium text-green-700 hover:text-green-600 transition-all duration-200 relative group text-sm lg:text-base xl:text-lg px-2 py-1">
              <Zap className="w-3 h-3 lg:w-4 lg:h-4 mr-1.5 text-green-600" />
              Map
              <span className="absolute left-2 bottom-0 w-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link href="/membership" className="font-medium text-green-700 hover:text-green-600 transition-all duration-200 relative group text-sm lg:text-base xl:text-lg px-2 py-1">
              Membership
              <span className="absolute left-2 bottom-0 w-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link href="/team" className="font-medium text-green-700 hover:text-green-600 transition-all duration-200 relative group text-sm lg:text-base xl:text-lg px-2 py-1">
              Team
              <span className="absolute left-2 bottom-0 w-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link href="/gallery" className="font-medium text-green-700 hover:text-green-600 transition-all duration-200 relative group text-sm lg:text-base xl:text-lg px-2 py-1">
              Gallery
              <span className="absolute left-2 bottom-0 w-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </nav>
          
          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4 xl:space-x-6">
            <Link 
              href="/worker/login" 
              className="px-3 py-2 lg:px-4 lg:py-2.5 bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 transition-all duration-200 rounded-lg border border-green-200 hover:border-green-300 text-xs lg:text-sm xl:text-base font-medium"
            >
              🔐 Team Login
            </Link>
            
            <a 
              href="/#donate" 
              className="px-4 py-2 lg:px-5 lg:py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-200 rounded-lg shadow-md hover:shadow-lg text-xs lg:text-sm xl:text-base"
            >
              ❤️ Donate Now
            </a>
          </div>
          
          <button 
            className="md:hidden p-2 rounded-lg bg-green-100 hover:bg-green-200 transition-all duration-300 group" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-green-700 group-hover:rotate-90 transition-transform duration-300" />
            ) : (
              <Menu className="h-6 w-6 text-green-700 group-hover:scale-110 transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header with logo and close button */}
        <div className="flex items-center justify-between p-6 border-b border-green-200">
          <div className="flex items-center space-x-2">
            <img src="/favicon.png" alt="SolarPak Logo" className="h-8 w-12" />
            <span className="text-lg font-bold text-green-700">SolarPak</span>
          </div>
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg bg-green-100 hover:bg-green-200 transition-all duration-300 group"
          >
            <X className="h-6 w-6 text-green-700 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
        
        <div className="flex flex-col p-6 h-full">
          {/* Navigation Links */}
          <div className="space-y-1 mb-8">
            <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-3 px-2">Navigation</div>
            <a 
              href="/#problem" 
              className="flex items-center font-medium text-green-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200 py-3 px-3 rounded-lg relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Thermometer className="w-5 h-5 mr-3 text-green-600" />
              Crisis
            </a>
            <a 
              href="/#solution" 
              className="flex items-center font-medium text-green-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200 py-3 px-3 rounded-lg relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Sun className="w-5 h-5 mr-3 text-green-600" />
              Solution
            </a>
            <a 
              href="/#impact" 
              className="flex items-center font-medium text-green-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200 py-3 px-3 rounded-lg relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Zap className="w-5 h-5 mr-3 text-green-600" />
              Impact
            </a>
            <Link 
              href="/impact" 
              className="flex items-center font-medium text-green-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200 py-3 px-3 rounded-lg relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <MapPin className="w-5 h-5 mr-3 text-green-600" />
              Impact Map
            </Link>
            <Link
              href="/village" 
              className="flex items-center font-medium text-green-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200 py-3 px-3 rounded-lg relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Heart className="w-5 h-5 mr-3 text-green-600" />
              Stories
            </Link>
            <Link
              href="/team" 
              className="flex items-center font-medium text-green-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200 py-3 px-3 rounded-lg relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Users className="w-5 h-5 mr-3 text-green-600" />
              Team
            </Link>
            <Link
              href="/gallery" 
              className="flex items-center font-medium text-green-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200 py-3 px-3 rounded-lg relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Camera className="w-5 h-5 mr-3 text-green-600" />
              Gallery
            </Link>
          </div>
            
          
          {/* Action buttons for mobile */}
          <div className="mt-auto pb-4">
            <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-3 px-2">Actions</div>
            <div className="space-y-3">
              <Link 
                href="/worker/login" 
                className="flex items-center justify-center py-3 px-4 bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 transition-all duration-200 rounded-lg border border-green-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-sm mr-2">🔐</span>
                Team Login
              </Link>
              
              <a 
                href="/#donate" 
                className="flex items-center justify-center py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-200 rounded-lg shadow-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-sm mr-2">❤️</span>
                Donate Now
              </a>
            </div>
            
            {/* Footer info */}
            <div className="mt-6 pt-4 border-t border-green-200 text-center">
              <p className="text-xs text-green-600">Bringing light to Pakistan</p>
              <p className="text-xs text-green-500 mt-1">Since March 2025</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </header>
  );
}
