import { useState } from "react";
import { Link } from "wouter";
import { Sun, Menu, X, Zap } from "lucide-react";

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
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col space-y-1 mt-0 pb-4 bg-gradient-to-r from-blue-900 to-blue-800 border-t border-blue-700 p-6">
            <a 
              href="/#problem" 
              className="font-medium text-amber-300 hover:text-amber-200 transition-all duration-200 py-2 relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Crisis
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-amber-300 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a 
              href="/#solution" 
              className="font-medium text-amber-300 hover:text-amber-200 transition-all duration-200 py-2 relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Solution
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-amber-300 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a 
              href="/#impact" 
              className="font-medium text-amber-300 hover:text-amber-200 transition-all duration-200 py-2 relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Impact
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-amber-300 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <Link 
              href="/impact" 
              className="font-medium text-amber-300 hover:text-amber-200 transition-all duration-200 py-2 relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Impact Map
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-amber-300 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              href="/village" 
              className="font-medium text-amber-300 hover:text-amber-200 transition-all duration-200 py-2 relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Stories
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-amber-300 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              href="/team" 
              className="font-medium text-amber-300 hover:text-amber-200 transition-all duration-200 py-2 relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Team
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-amber-300 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              href="/gallery" 
              className="font-medium text-amber-300 hover:text-amber-200 transition-all duration-200 py-2 relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Gallery
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-amber-300 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            
            
            {/* Action buttons for mobile */}
            <div className="border-t border-blue-700 pt-4 mt-4 space-y-3">
              <Link 
                href="/worker/login" 
                className="block text-center py-2 px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 transition-all duration-200 rounded-lg border border-amber-400/20"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🔐 Team Login
              </Link>
              
              <a 
                href="/#donate" 
                className="block text-center py-2 px-4 bg-amber-500 hover:bg-amber-400 text-blue-900 font-semibold transition-all duration-200 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ❤️ Donate Now
              </a>
            </div>
        </div>
      </div>
    </header>
  );
}
