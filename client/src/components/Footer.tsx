import { Link } from "wouter";
import { Sun, Facebook, Twitter, Instagram, Linkedin, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Glassmorphic background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-amber-400 to-yellow-500 p-2 rounded-xl">
                <Sun className="w-8 h-8 text-white" />
              </div>
              <span className="font-bold text-2xl text-white">SolarPak</span>
            </div>
            <p className="text-white/70 mb-6 leading-relaxed">
              We're on a mission to bring clean, reliable solar energy to families across Pakistan.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20">
                <Facebook className="w-5 h-5 text-white/80" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20">
                <Twitter className="w-5 h-5 text-white/80" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20">
                <Instagram className="w-5 h-5 text-white/80" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20">
                <Linkedin className="w-5 h-5 text-white/80" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="font-bold text-lg mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#problem" className="text-white/70 hover:text-amber-300 transition-colors duration-300 flex items-center"><span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3"></span>The Problem</a></li>
              <li><a href="#solution" className="text-white/70 hover:text-amber-300 transition-colors duration-300 flex items-center"><span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3"></span>Our Solution</a></li>
              <li><a href="#impact" className="text-white/70 hover:text-amber-300 transition-colors duration-300 flex items-center"><span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3"></span>Impact</a></li>
              <li><a href="#donate" className="text-white/70 hover:text-amber-300 transition-colors duration-300 flex items-center"><span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3"></span>Donate</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="font-bold text-lg mb-4 text-white">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-white/70 hover:text-amber-300 transition-colors duration-300 flex items-center"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></span>FAQs</Link></li>

              <li><Link href="/gallery" className="text-white/70 hover:text-amber-300 transition-colors duration-300 flex items-center"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></span>Gallery</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="font-bold text-lg mb-4 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <div className="bg-white/10 p-2 rounded-lg mr-3 group-hover:bg-white/20 transition-colors duration-300">
                  <Mail className="w-4 h-4 text-amber-300" />
                </div>
                <span className="text-white/70 text-sm leading-relaxed">solarpakinitiative@gmail.com</span>
              </li>
              <li className="flex items-start group">
                <div className="bg-white/10 p-2 rounded-lg mr-3 group-hover:bg-white/20 transition-colors duration-300">
                  <MapPin className="w-4 h-4 text-amber-300" />
                </div>
                <span className="text-white/70 text-sm leading-relaxed">Khairpur Mirs, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} SolarPak. All rights reserved. World's Largest Youth-Led Solar Nonprofit.
            </p>
            <div className="flex space-x-6">
              <Link href="/" className="text-white/60 hover:text-amber-300 text-sm transition-colors duration-300">Privacy Policy</Link>
              <Link href="/" className="text-white/60 hover:text-amber-300 text-sm transition-colors duration-300">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
