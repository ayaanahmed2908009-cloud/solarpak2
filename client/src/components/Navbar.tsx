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
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg border-b border-blue-700">
      <div className="mx-auto max-w-7xl px-6 py-4 md:px-12 md:py-6">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="p-2 bg-amber-400 rounded-lg">
              <Sun className="h-6 w-6 text-blue-900" />
            </div>
            <span className="text-xl lg:text-2xl font-bold text-amber-300">SolarPak</span>
          </Link>
          
          {/* Main Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a href="/#problem" className="font-medium text-amber-300 hover:text-amber-200 transition-all duration-200 relative group text-base lg:text-lg">
              Crisis
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-amber-300 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a href="/#solution" className="font-medium text-amber-300 hover:text-amber-200 transition-all duration-200 relative group text-base lg:text-lg">
              Solution
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-amber-300 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <Link href="/village" className="font-medium text-amber-300 hover:text-amber-200 transition-all duration-200 relative group text-base lg:text-lg">
              Stories
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-amber-300 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <a href="/#impact" className="font-medium text-amber-300 hover:text-amber-200 transition-all duration-200 relative group text-base lg:text-lg">
              Impact
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-amber-300 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <Link href="/impact" className="flex items-center font-medium text-amber-300 hover:text-amber-200 transition-all duration-200 relative group text-base lg:text-lg">
              <Zap className="w-4 h-4 mr-2" />
              Map
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-amber-300 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link href="/membership" className="font-medium text-amber-300 hover:text-amber-200 transition-all duration-200 relative group text-base lg:text-lg">
              Membership
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-amber-300 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link href="/team" className="font-medium text-amber-300 hover:text-amber-200 transition-all duration-200 relative group text-base lg:text-lg">
              Team
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-amber-300 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link href="/gallery" className="font-medium text-amber-300 hover:text-amber-200 transition-all duration-200 relative group text-base lg:text-lg">
              Gallery
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-amber-300 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </nav>
          
          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link 
              href="/worker/login" 
              className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 transition-all duration-200 rounded-lg border border-amber-400/20 hover:border-amber-400/40 text-sm lg:text-base"
            >
              🔐 Team Login
            </Link>
            
            <a 
              href="/#donate" 
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-blue-900 font-semibold transition-all duration-200 rounded-lg shadow-md hover:shadow-lg text-sm lg:text-base"
            >
              ❤️ Donate Now
            </a>
          </div>
          
          <button 
            className="md:hidden p-2 rounded-lg bg-blue-800 hover:bg-blue-700 transition-all duration-300 group" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-yellow-300 group-hover:rotate-90 transition-transform duration-300" />
            ) : (
              <Menu className="h-6 w-6 text-yellow-300 group-hover:scale-110 transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-blue-900 to-blue-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header with logo and close button */}
        <div className="flex items-center justify-between p-6 border-b border-blue-700">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-400 rounded-lg">
              <Sun className="h-5 w-5 text-blue-900" />
            </div>
            <span className="text-lg font-bold text-amber-300">SolarPak</span>
          </div>
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg bg-blue-800 hover:bg-blue-700 transition-all duration-300 group"
          >
            <X className="h-6 w-6 text-amber-300 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
        
        <div className="flex flex-col p-6 h-full">
          {/* Navigation Links */}
          <div className="space-y-1 mb-8">
            <div className="text-xs font-semibold text-amber-300/70 uppercase tracking-wider mb-3 px-2">Navigation</div>
            <a 
              href="/#problem" 
              className="flex items-center font-medium text-amber-300 hover:text-amber-200 hover:bg-blue-800/50 transition-all duration-200 py-3 px-3 rounded-lg relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Thermometer className="w-5 h-5 mr-3 text-amber-400" />
              Crisis
            </a>
            <a 
              href="/#solution" 
              className="flex items-center font-medium text-amber-300 hover:text-amber-200 hover:bg-blue-800/50 transition-all duration-200 py-3 px-3 rounded-lg relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Sun className="w-5 h-5 mr-3 text-amber-400" />
              Solution
            </a>
            <a 
              href="/#impact" 
              className="flex items-center font-medium text-amber-300 hover:text-amber-200 hover:bg-blue-800/50 transition-all duration-200 py-3 px-3 rounded-lg relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Zap className="w-5 h-5 mr-3 text-amber-400" />
              Impact
            </a>
            <Link 
              href="/impact" 
              className="flex items-center font-medium text-amber-300 hover:text-amber-200 hover:bg-blue-800/50 transition-all duration-200 py-3 px-3 rounded-lg relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <MapPin className="w-5 h-5 mr-3 text-amber-400" />
              Impact Map
            </Link>
            <Link
              href="/village" 
              className="flex items-center font-medium text-amber-300 hover:text-amber-200 hover:bg-blue-800/50 transition-all duration-200 py-3 px-3 rounded-lg relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Heart className="w-5 h-5 mr-3 text-amber-400" />
              Stories
            </Link>
            <Link
              href="/team" 
              className="flex items-center font-medium text-amber-300 hover:text-amber-200 hover:bg-blue-800/50 transition-all duration-200 py-3 px-3 rounded-lg relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Users className="w-5 h-5 mr-3 text-amber-400" />
              Team
            </Link>
            <Link
              href="/gallery" 
              className="flex items-center font-medium text-amber-300 hover:text-amber-200 hover:bg-blue-800/50 transition-all duration-200 py-3 px-3 rounded-lg relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Camera className="w-5 h-5 mr-3 text-amber-400" />
              Gallery
            </Link>
          </div>
            
          
          {/* Action buttons for mobile */}
          <div className="mt-auto pb-4">
            <div className="text-xs font-semibold text-amber-300/70 uppercase tracking-wider mb-3 px-2">Actions</div>
            <div className="space-y-3">
              <Link 
                href="/worker/login" 
                className="flex items-center justify-center py-3 px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 transition-all duration-200 rounded-lg border border-amber-400/20"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-sm mr-2">🔐</span>
                Team Login
              </Link>
              
              <a 
                href="/#donate" 
                className="flex items-center justify-center py-3 px-4 bg-amber-500 hover:bg-amber-400 text-blue-900 font-semibold transition-all duration-200 rounded-lg shadow-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-sm mr-2">❤️</span>
                Donate Now
              </a>
            </div>
            
            {/* Footer info */}
            <div className="mt-6 pt-4 border-t border-blue-700/50 text-center">
              <p className="text-xs text-amber-300/60">Bringing light to Pakistan</p>
              <p className="text-xs text-amber-300/40 mt-1">Since March 2025</p>
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
