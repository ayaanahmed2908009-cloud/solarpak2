import { useState } from "react";
import { Link } from "wouter";
import { Sun, User, Menu, X, Zap } from "lucide-react";
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
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 scale-110 group-hover:opacity-30 transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-full group-hover:scale-105 transition-transform duration-300">
                <Sun className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-2xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Solar Light Pakistan
              </span>
              <span className="text-xs text-gray-500 font-medium tracking-wide">Bringing Energy to Communities</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            <a href="#problem" className="relative group px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50">
              <span className="relative z-10">The Crisis</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
            </a>
            <a href="#solution" className="relative group px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50">
              <span className="relative z-10">Our Solution</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
            </a>
            <a href="#village" className="relative group px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50">
              <span className="relative z-10">Village Stories</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
            </a>
            <a href="#impact" className="relative group px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50">
              <span className="relative z-10">Impact</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
            </a>
            <Link href="/impact" className="relative group px-4 py-2 rounded-lg font-medium text-blue-600 hover:text-blue-700 transition-all duration-300 bg-blue-50 hover:bg-blue-100">
              <span className="relative z-10 flex items-center">
                <Zap className="w-4 h-4 mr-1" />
                Impact Map
              </span>
            </Link>
            <a href="#projects" className="relative group px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50">
              <span className="relative z-10">Projects</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
            </a>
            <Link href="/membership" className="relative group px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50">
              <span className="relative z-10">Membership</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <a 
              href="#donate" 
              className="hidden md:block relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
            >
              <span className="relative z-10 flex items-center">
                ❤️ Donate Now
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </a>
            
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImageUrl || ""} />
                      <AvatarFallback className="bg-primary/10">
                        {user.fullName?.charAt(0) || user.email.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.fullName || user.email}</span>
                      <span className="text-xs text-muted-foreground">{user.role}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/membership">
                    <DropdownMenuItem className="cursor-pointer">
                      Membership
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" size="sm">Sign up</Button>
                </Link>
              </div>
            )}
            
            <button 
              className="md:hidden relative p-2 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group" 
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-blue-600 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Menu className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col space-y-2 mt-4 pb-4 bg-gradient-to-b from-blue-50/50 to-white rounded-lg p-4 mx-2">
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
            
            {isAuthenticated && user ? (
              <>
                <div className="border-t border-gray-200 pt-4 mt-2"></div>
                <Link 
                  href="/dashboard" 
                  className="font-heading font-medium hover:text-primary transition py-2 flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  My Dashboard
                  {user.role === 'admin' && (
                    <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded-full">
                      Admin
                    </span>
                  )}
                </Link>
                <Link 
                  href="/membership" 
                  className="font-heading font-medium hover:text-primary transition py-2 flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                    <path d="M18 12a2 2 0 0 0 0 4h2v-4Z" />
                  </svg>
                  Membership
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="font-heading font-medium text-gray-600 hover:text-primary transition py-2 text-left"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-gray-200 pt-4 mt-2"></div>
                <Link 
                  href="/login" 
                  className="font-heading font-medium hover:text-primary transition py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link 
                  href="/signup" 
                  className="font-heading font-medium hover:text-primary transition py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
            
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
