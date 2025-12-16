import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, Sun, Users, Heart, MapPin, Camera, Home, Zap, Target, UserPlus, Image } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Fixed Menu Button - Always Visible */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 right-4 z-[60] p-3 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-gray-200 hover:bg-green-50 transition-all duration-300"
        data-testid="button-menu-toggle"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-green-700" />
        ) : (
          <Menu className="w-6 h-6 text-green-700" />
        )}
      </button>

      {/* Fixed Logo - Top Left */}
      <Link 
        href="/" 
        className="fixed top-4 left-4 z-[60] flex items-center space-x-2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-200 hover:bg-green-50 transition-all duration-300"
        data-testid="link-logo"
      >
        <img src="/favicon.png" alt="SolarPak Logo" className="h-8 w-10 object-contain" />
        <span className="text-xl font-bold text-green-800">SolarPak</span>
      </Link>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[55] transition-opacity duration-300"
          onClick={closeMenu}
        />
      )}

      {/* Slide-in Menu from Right */}
      <nav 
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-[58] shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-emerald-600">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <p className="text-green-100 text-sm mt-1">World's Largest Youth-Led Solar Nonprofit</p>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-4">
              <Link 
                href="/" 
                onClick={closeMenu}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                data-testid="nav-home"
              >
                <Home className="w-5 h-5 mr-3 text-green-600" />
                <span className="font-semibold">Home</span>
              </Link>

              <a 
                href="/#solution" 
                onClick={closeMenu}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                data-testid="nav-what-we-do"
              >
                <Zap className="w-5 h-5 mr-3 text-green-600" />
                <span className="font-semibold">What We Do</span>
              </a>

              <a 
                href="/#impact" 
                onClick={closeMenu}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                data-testid="nav-our-impact"
              >
                <Target className="w-5 h-5 mr-3 text-green-600" />
                <span className="font-semibold">Our Impact</span>
              </a>

              <Link 
                href="/team" 
                onClick={closeMenu}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                data-testid="nav-team"
              >
                <Users className="w-5 h-5 mr-3 text-green-600" />
                <span className="font-semibold">Team</span>
              </Link>

              <div className="pt-4 pb-2">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Get Involved</p>
              </div>

              <Link 
                href="/village" 
                onClick={closeMenu}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                data-testid="nav-stories"
              >
                <Heart className="w-5 h-5 mr-3 text-green-600" />
                <div>
                  <span className="font-semibold">Stories</span>
                  <p className="text-xs text-gray-500">Real impact stories</p>
                </div>
              </Link>

              <Link 
                href="/impact" 
                onClick={closeMenu}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                data-testid="nav-map"
              >
                <MapPin className="w-5 h-5 mr-3 text-green-600" />
                <div>
                  <span className="font-semibold">Impact Map</span>
                  <p className="text-xs text-gray-500">See our locations</p>
                </div>
              </Link>

              <Link 
                href="/membership" 
                onClick={closeMenu}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                data-testid="nav-membership"
              >
                <UserPlus className="w-5 h-5 mr-3 text-green-600" />
                <div>
                  <span className="font-semibold">Membership</span>
                  <p className="text-xs text-gray-500">Join our mission</p>
                </div>
              </Link>

              <Link 
                href="/gallery" 
                onClick={closeMenu}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                data-testid="nav-gallery"
              >
                <Image className="w-5 h-5 mr-3 text-green-600" />
                <div>
                  <span className="font-semibold">Gallery</span>
                  <p className="text-xs text-gray-500">Project photos</p>
                </div>
              </Link>

              <Link 
                href="/worker/login" 
                onClick={closeMenu}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors duration-200 mt-4 border-t border-gray-100 pt-4"
                data-testid="nav-team-login"
              >
                <span className="mr-3 text-lg">🔐</span>
                <div>
                  <span className="font-semibold">Team Login</span>
                  <p className="text-xs text-gray-500">Staff portal</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Donate Button at Bottom */}
          <div className="p-4 border-t border-gray-200">
            <button 
              onClick={() => {
                window.open('https://ko-fi.com/solarpak', '_blank');
                closeMenu();
              }}
              className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black font-bold py-4 px-6 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl"
              data-testid="button-donate"
            >
              ☀️ Donate Now
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
