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
    <header className="sticky top-0 z-50 transition-all duration-300 px-6 py-4 md:py-6">
      <div className="bg-black/20 backdrop-blur-md shadow-lg border border-gray-400/50 rounded-full mx-auto max-w-7xl px-6 py-3 md:px-12 md:py-5">
        <div className="flex items-center justify-center">
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-10">
            <a href="/#problem" className="font-medium text-yellow-300 hover:text-yellow-200 transition-all duration-200 relative group text-base lg:text-lg">
              Crisis
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a href="/#solution" className="font-medium text-yellow-300 hover:text-yellow-200 transition-all duration-200 relative group text-base lg:text-lg">
              Solution
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <Link href="/village" className="font-medium text-yellow-300 hover:text-yellow-200 transition-all duration-200 relative group text-base lg:text-lg">
              Stories
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <a href="/#impact" className="font-medium text-yellow-300 hover:text-yellow-200 transition-all duration-200 relative group text-base lg:text-lg">
              Impact
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <Link href="/impact" className="flex items-center font-medium text-yellow-300 hover:text-yellow-200 transition-all duration-200 relative group text-base lg:text-lg">
              <Zap className="w-4 h-4 mr-2" />
              Map
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <a href="/#projects" className="font-medium text-yellow-300 hover:text-yellow-200 transition-all duration-200 relative group text-base lg:text-lg">
              Projects
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <Link href="/membership" className="font-medium text-yellow-300 hover:text-yellow-200 transition-all duration-200 relative group text-base lg:text-lg">
              Membership
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link href="/team" className="font-medium text-yellow-300 hover:text-yellow-200 transition-all duration-200 relative group text-base lg:text-lg">
              Team
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link 
              href="/worker/login" 
              className="font-medium text-yellow-300 hover:text-yellow-200 transition-all duration-200 relative group text-base lg:text-lg"
            >
              🔐 Team Login
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            
            <a 
              href="/#donate" 
              className="font-medium text-yellow-300 hover:text-yellow-200 transition-all duration-200 relative group text-base lg:text-lg"
            >
              ❤️ Donate Now
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
            </a>
          </div>
          
          <button 
            className="md:hidden absolute right-6 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all duration-300 group border border-gray-400/50" 
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
        <div className="flex flex-col space-y-2 mt-4 pb-4 bg-black/20 backdrop-blur-md border border-gray-400/50 rounded-full p-6 mx-6">
            <a 
              href="/#problem" 
              className="font-medium text-yellow-300 hover:text-yellow-200 transition-all duration-200 py-2 relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Crisis
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a 
              href="/#solution" 
              className="font-medium text-yellow-300 hover:text-yellow-200 transition-all duration-200 py-2 relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Solution
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a 
              href="/#impact" 
              className="font-medium text-yellow-300 hover:text-yellow-200 transition-all duration-200 py-2 relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Impact
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <Link 
              href="/impact" 
              className="font-medium text-yellow-300 hover:text-yellow-200 transition-all duration-200 py-2 relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Impact Map
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <a 
              href="/#projects" 
              className="font-medium text-yellow-300 hover:text-yellow-200 transition-all duration-200 py-2 relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <Link
              href="/village" 
              className="font-medium text-yellow-300 hover:text-yellow-200 transition-all duration-200 py-2 relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Stories
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              href="/team" 
              className="font-medium text-yellow-300 hover:text-yellow-200 transition-all duration-200 py-2 relative group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Team
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            
            <Link 
              href="/worker/login" 
              className="font-medium text-yellow-300 hover:text-yellow-200 transition-all duration-200 py-2 relative group text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              🔐 Team Login
              <span className="absolute left-1/2 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full transform -translate-x-1/2"></span>
            </Link>
            
            <a 
              href="#donate" 
              className="font-medium text-yellow-300 hover:text-yellow-200 transition-all duration-200 py-2 relative group text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ❤️ Donate Now
              <span className="absolute left-1/2 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full transform -translate-x-1/2"></span>
            </a>
        </div>
      </div>
    </header>
  );
}
