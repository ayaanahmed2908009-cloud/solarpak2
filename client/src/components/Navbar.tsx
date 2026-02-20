import { Link, useLocation } from "wouter";
import { Sun, Zap, Users, Heart, MapPin, Camera, FlaskConical, Briefcase } from "lucide-react";

function NavLink({ href, children, className, ...props }: { href: string; children: React.ReactNode; className?: string; [key: string]: any }) {
  const [, setLocation] = useLocation();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "instant" });
    if (href.startsWith("/#")) {
      setLocation("/");
      setTimeout(() => {
        const id = href.replace("/#", "");
        const el = document.getElementById(id);
        if (el) {
          const offset = 80;
          const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 100);
    } else {
      setLocation(href);
    }
    const menu = document.getElementById("mobile-menu");
    if (menu && !menu.classList.contains("hidden")) {
      menu.classList.add("hidden");
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}

function DropdownNavLink({ href, children, className, ...props }: { href: string; children: React.ReactNode; className?: string; [key: string]: any }) {
  const [, setLocation] = useLocation();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "instant" });
    setLocation(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <NavLink href="/" className="flex items-center space-x-3 group">
            <img src="/favicon.png" alt="SolarPak Logo" className="h-10 w-12 object-contain" />
            <div>
              <span className="text-2xl font-bold text-gray-900">SolarPak</span>
            </div>
          </NavLink>
          
          <div className="hidden lg:flex items-center space-x-8">
            <NavLink 
              href="/" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 text-sm uppercase tracking-wide"
              data-testid="link-home"
            >
              HOME
            </NavLink>
            <NavLink 
              href="/#solution" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 text-sm uppercase tracking-wide"
              data-testid="link-what-we-do"
            >
              WHAT WE DO
            </NavLink>
            <NavLink 
              href="/#impact" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 text-sm uppercase tracking-wide"
              data-testid="link-our-impact"
            >
              OUR IMPACT
            </NavLink>
            <NavLink 
              href="/impact-labs" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 text-sm uppercase tracking-wide"
            >
              IMPACT LABS
            </NavLink>
            <div className="relative group">
              <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 text-sm uppercase tracking-wide flex items-center">
                GET INVOLVED
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                <div className="py-2">
                  <DropdownNavLink 
                    href="/impact" 
                    className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                    data-testid="link-map"
                  >
                    <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                    <div>
                      <div className="font-medium text-sm text-gray-700">Map</div>
                      <div className="text-xs text-gray-400">Locations</div>
                    </div>
                  </DropdownNavLink>
                  <DropdownNavLink 
                    href="/membership" 
                    className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                    data-testid="link-membership"
                  >
                    <Users className="w-4 h-4 mr-3 text-gray-400" />
                    <div>
                      <div className="font-medium text-sm text-gray-700">Membership</div>
                      <div className="text-xs text-gray-400">Join us</div>
                    </div>
                  </DropdownNavLink>
                  <DropdownNavLink 
                    href="/gallery" 
                    className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                    data-testid="link-gallery"
                  >
                    <Camera className="w-4 h-4 mr-3 text-gray-400" />
                    <div>
                      <div className="font-medium text-sm text-gray-700">Gallery</div>
                      <div className="text-xs text-gray-400">Photos</div>
                    </div>
                  </DropdownNavLink>
                  <DropdownNavLink 
                    href="/opportunities" 
                    className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                    data-testid="link-opportunities"
                  >
                    <Briefcase className="w-4 h-4 mr-3 text-gray-400" />
                    <div>
                      <div className="font-medium text-sm text-gray-700">Opportunities</div>
                      <div className="text-xs text-gray-400">Join our team</div>
                    </div>
                  </DropdownNavLink>
                  <DropdownNavLink 
                    href="/worker/login" 
                    className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors duration-200 border-t border-gray-100"
                    data-testid="link-team-login"
                  >
                    <span className="mr-3 text-gray-400">🔐</span>
                    <div>
                      <div className="font-medium text-sm text-gray-700">Team Login</div>
                      <div className="text-xs text-gray-400">Access portal</div>
                    </div>
                  </DropdownNavLink>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => window.open('https://ko-fi.com/solarpak', '_blank')}
            className="hidden lg:block bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 px-6 rounded-md text-sm uppercase tracking-wide transition-colors duration-200"
            data-testid="button-donate"
          >
            DONATE
          </button>
          
          <button 
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
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
        
        <div id="mobile-menu" className="hidden lg:hidden pt-4 pb-2 border-t border-gray-100 mt-4">
          <div className="flex flex-col space-y-2">
            <NavLink href="/" className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200">
              HOME
            </NavLink>
            <NavLink href="/#solution" className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200">
              WHAT WE DO
            </NavLink>
            <NavLink href="/#impact" className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200">
              OUR IMPACT
            </NavLink>
            <NavLink href="/impact" className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200">
              Map
            </NavLink>
            <NavLink href="/membership" className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200">
              Membership
            </NavLink>
            <NavLink href="/gallery" className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200">
              Gallery
            </NavLink>
            <NavLink href="/impact-labs" className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200">
              Impact Labs
            </NavLink>
            <NavLink href="/opportunities" className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200">
              Opportunities
            </NavLink>
            <button 
              onClick={() => window.open('https://ko-fi.com/solarpak', '_blank')}
              className="mx-4 mt-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-6 rounded-md text-sm uppercase tracking-wide transition-colors duration-200"
            >
              DONATE
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
