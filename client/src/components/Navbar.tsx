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
    <header className="bg-black/10 backdrop-blur-md shadow-lg border-b border-gray-400/40 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Sun className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl text-white drop-shadow-lg">
                SolarPak
              </span>
              <span className="text-sm text-white/80 font-medium drop-shadow-md">Powering Communities</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-2">
            <a href="/#problem" className="px-4 py-2.5 rounded-xl font-medium text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200 drop-shadow-sm">
              Crisis
            </a>
            <a href="/#solution" className="px-4 py-2.5 rounded-xl font-medium text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200 drop-shadow-sm">
              Solution
            </a>
            <Link href="/village" className="px-4 py-2.5 rounded-xl font-medium text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200 drop-shadow-sm">
              Stories
            </Link>
            <a href="/#impact" className="px-4 py-2.5 rounded-xl font-medium text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200 drop-shadow-sm">
              Impact
            </a>
            <Link href="/impact" className="flex items-center px-4 py-2.5 rounded-xl font-medium text-yellow-300 bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 drop-shadow-sm">
              <Zap className="w-4 h-4 mr-2" />
              Map
            </Link>
            <a href="/#projects" className="px-4 py-2.5 rounded-xl font-medium text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200 drop-shadow-sm">
              Projects
            </a>
            <Link href="/membership" className="px-4 py-2.5 rounded-xl font-medium text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200 drop-shadow-sm">
              Membership
            </Link>
            <Link href="/team" className="px-4 py-2.5 rounded-xl font-medium text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200 drop-shadow-sm">
              Team
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/worker/login" 
              className="hidden md:block relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
            >
              <span className="relative z-10 flex items-center">
                🔐 Team Login
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Link>
            
            <a 
              href="/#donate" 
              className="hidden md:block relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
            >
              <span className="relative z-10 flex items-center">
                ❤️ Donate Now
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </a>
            

            
            <button 
              className="md:hidden relative p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 group border border-white/30" 
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-white group-hover:rotate-90 transition-transform duration-300 drop-shadow-sm" />
              ) : (
                <Menu className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col space-y-2 mt-4 pb-4 bg-black/10 backdrop-blur-md border border-gray-400/40 rounded-lg p-4 mx-2">
            <a 
              href="/#problem" 
              className="font-medium text-white/90 hover:text-white transition py-2 drop-shadow-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Crisis
            </a>
            <a 
              href="/#solution" 
              className="font-medium text-white/90 hover:text-white transition py-2 drop-shadow-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Solution
            </a>
            <a 
              href="/#impact" 
              className="font-medium text-white/90 hover:text-white transition py-2 drop-shadow-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Impact
            </a>
            <Link 
              href="/impact" 
              className="font-medium text-yellow-300 hover:text-yellow-200 transition py-2 drop-shadow-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Impact Map
            </Link>
            <a 
              href="/#projects" 
              className="font-medium text-white/90 hover:text-white transition py-2 drop-shadow-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </a>
            <Link
              href="/village" 
              className="font-medium text-white/90 hover:text-white transition py-2 drop-shadow-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Stories
            </Link>
            <Link
              href="/team" 
              className="font-medium text-white/90 hover:text-white transition py-2 drop-shadow-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Team
            </Link>
            
            <Link 
              href="/worker/login" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-heading font-semibold px-6 py-2 rounded-md transition text-center mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              🔐 Team Login
            </Link>
            
            <a 
              href="#donate" 
              className="bg-primary hover:bg-primary/90 text-white font-heading font-semibold px-6 py-2 rounded-md transition text-center mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Donate Now
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
