import { useState } from "react";
import { Link } from "wouter";
import { Sun, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-primary text-3xl">
              <Sun className="w-8 h-8" />
            </div>
            <span className="font-heading font-bold text-2xl text-secondary">SolarPak</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#problem" className="font-heading font-medium hover:text-primary transition">
              The Problem
            </a>
            <a href="#solution" className="font-heading font-medium hover:text-primary transition">
              Our Solution
            </a>
            <a href="#impact" className="font-heading font-medium hover:text-primary transition">
              Impact
            </a>
            <Link href="/impact" className="font-heading font-medium text-primary hover:text-primary/80 transition">
              Impact Map
            </Link>
            <a href="#projects" className="font-heading font-medium hover:text-primary transition">
              Projects
            </a>
            <a href="#stories" className="font-heading font-medium hover:text-primary transition">
              Stories
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <a 
              href="#donate" 
              className="hidden md:block bg-primary hover:bg-primary/90 text-white font-heading font-semibold px-6 py-2 rounded-md transition"
            >
              Donate Now
            </a>
            <button 
              className="md:hidden text-gray-600" 
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? '' : 'hidden'}`}>
          <div className="flex flex-col space-y-4 mt-4 pb-4">
            <a 
              href="#problem" 
              className="font-heading font-medium hover:text-primary transition py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              The Problem
            </a>
            <a 
              href="#solution" 
              className="font-heading font-medium hover:text-primary transition py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Our Solution
            </a>
            <a 
              href="#impact" 
              className="font-heading font-medium hover:text-primary transition py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Impact
            </a>
            <Link 
              href="/impact" 
              className="font-heading font-medium text-primary hover:text-primary/80 transition py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Impact Map
            </Link>
            <a 
              href="#projects" 
              className="font-heading font-medium hover:text-primary transition py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </a>
            <a 
              href="#stories" 
              className="font-heading font-medium hover:text-primary transition py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Stories
            </a>
            <a 
              href="#donate" 
              className="bg-primary hover:bg-primary/90 text-white font-heading font-semibold px-6 py-2 rounded-md transition text-center"
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
