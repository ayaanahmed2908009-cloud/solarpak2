import { Link } from "wouter";
import { Sun, Zap, Users, Heart, MapPin, Camera } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <img src="/favicon.png" alt="SolarPak Logo" className="h-10 w-12 object-contain transition-transform duration-300 group-hover:scale-110" />
            <div>
              <span className="text-2xl font-bold text-green-800">SolarPak</span>
            </div>
          </Link>
          
          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            <a 
              href="/" 
              className="text-green-700 hover:text-green-900 font-semibold transition-colors duration-200 text-sm uppercase tracking-wide"
              data-testid="link-home"
            >
              HOME
            </a>
            <a 
              href="/#solution" 
              className="text-green-700 hover:text-green-900 font-semibold transition-colors duration-200 text-sm uppercase tracking-wide"
              data-testid="link-what-we-do"
            >
              WHAT WE DO
            </a>
            <a 
              href="/#impact" 
              className="text-green-700 hover:text-green-900 font-semibold transition-colors duration-200 text-sm uppercase tracking-wide"
              data-testid="link-our-impact"
            >
              OUR IMPACT
            </a>
            <Link 
              href="/team" 
              className="text-green-700 hover:text-green-900 font-semibold transition-colors duration-200 text-sm uppercase tracking-wide"
              data-testid="link-about-us"
            >
              ABOUT US
            </Link>
            <div className="relative group">
              <button className="text-green-700 hover:text-green-900 font-semibold transition-colors duration-200 text-sm uppercase tracking-wide flex items-center">
                GET INVOLVED
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                <div className="py-2">
                  <Link 
                    href="/village" 
                    className="flex items-center px-4 py-3 text-green-700 hover:bg-green-50 transition-colors duration-200"
                    data-testid="link-stories"
                  >
                    <Heart className="w-4 h-4 mr-3 text-green-600" />
                    <div>
                      <div className="font-semibold text-sm">Stories</div>
                      <div className="text-xs text-green-600">Real impact</div>
                    </div>
                  </Link>
                  <Link 
                    href="/impact" 
                    className="flex items-center px-4 py-3 text-green-700 hover:bg-green-50 transition-colors duration-200"
                    data-testid="link-map"
                  >
                    <MapPin className="w-4 h-4 mr-3 text-green-600" />
                    <div>
                      <div className="font-semibold text-sm">Map</div>
                      <div className="text-xs text-green-600">Locations</div>
                    </div>
                  </Link>
                  <Link 
                    href="/membership" 
                    className="flex items-center px-4 py-3 text-green-700 hover:bg-green-50 transition-colors duration-200"
                    data-testid="link-membership"
                  >
                    <Users className="w-4 h-4 mr-3 text-green-600" />
                    <div>
                      <div className="font-semibold text-sm">Membership</div>
                      <div className="text-xs text-green-600">Join us</div>
                    </div>
                  </Link>
                  <Link 
                    href="/gallery" 
                    className="flex items-center px-4 py-3 text-green-700 hover:bg-green-50 transition-colors duration-200"
                    data-testid="link-gallery"
                  >
                    <Camera className="w-4 h-4 mr-3 text-green-600" />
                    <div>
                      <div className="font-semibold text-sm">Gallery</div>
                      <div className="text-xs text-green-600">Photos</div>
                    </div>
                  </Link>
                  <Link 
                    href="/worker/login" 
                    className="flex items-center px-4 py-3 text-green-700 hover:bg-green-50 transition-colors duration-200 border-t border-gray-100"
                    data-testid="link-team-login"
                  >
                    <span className="mr-3">🔐</span>
                    <div>
                      <div className="font-semibold text-sm">Team Login</div>
                      <div className="text-xs text-green-600">Access portal</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Donate Button */}
          <button 
            onClick={() => window.open('https://ko-fi.com/solarpak', '_blank')}
            className="hidden lg:block bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black font-bold py-3 px-8 rounded-lg text-sm uppercase tracking-wide transition-all duration-300 shadow-md hover:shadow-lg"
            data-testid="button-donate"
          >
            DONATE
          </button>
          
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-green-700 hover:text-green-900 transition-colors duration-200"
            onClick={() => {
              const menu = document.getElementById('mobile-menu');
              menu?.classList.toggle('hidden');
            }}
            data-testid="button-mobile-menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div id="mobile-menu" className="hidden lg:hidden pt-4 pb-2 border-t border-gray-200 mt-4">
          <div className="flex flex-col space-y-2">
            <a href="/" className="px-4 py-2 text-green-700 hover:bg-green-50 rounded-lg font-semibold transition-colors duration-200">
              HOME
            </a>
            <a href="/#solution" className="px-4 py-2 text-green-700 hover:bg-green-50 rounded-lg font-semibold transition-colors duration-200">
              WHAT WE DO
            </a>
            <a href="/#impact" className="px-4 py-2 text-green-700 hover:bg-green-50 rounded-lg font-semibold transition-colors duration-200">
              OUR IMPACT
            </a>
            <Link href="/team" className="px-4 py-2 text-green-700 hover:bg-green-50 rounded-lg font-semibold transition-colors duration-200">
              ABOUT US
            </Link>
            <Link href="/village" className="px-4 py-2 text-green-700 hover:bg-green-50 rounded-lg font-semibold transition-colors duration-200">
              Stories
            </Link>
            <Link href="/impact" className="px-4 py-2 text-green-700 hover:bg-green-50 rounded-lg font-semibold transition-colors duration-200">
              Map
            </Link>
            <Link href="/membership" className="px-4 py-2 text-green-700 hover:bg-green-50 rounded-lg font-semibold transition-colors duration-200">
              Membership
            </Link>
            <Link href="/gallery" className="px-4 py-2 text-green-700 hover:bg-green-50 rounded-lg font-semibold transition-colors duration-200">
              Gallery
            </Link>
            <button 
              onClick={() => window.open('https://ko-fi.com/solarpak', '_blank')}
              className="mx-4 mt-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black font-bold py-3 px-6 rounded-lg text-sm uppercase tracking-wide transition-all duration-300"
            >
              DONATE
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
