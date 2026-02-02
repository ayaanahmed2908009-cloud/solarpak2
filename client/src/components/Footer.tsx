import { Link } from "wouter";
import { Sun, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-primary text-3xl">
                <Sun className="w-8 h-8" />
              </div>
              <span className="font-heading font-bold text-2xl">SolarPak</span>
            </div>
            <p className="text-gray-400 mb-4">
              We're on a mission to bring clean, reliable solar energy to families across Pakistan.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#problem" className="text-gray-400 hover:text-primary transition">The Problem</a></li>
              <li><a href="#solution" className="text-gray-400 hover:text-primary transition">Our Solution</a></li>
              <li><a href="#impact" className="text-gray-400 hover:text-primary transition">Impact</a></li>
              <li><a href="#projects" className="text-gray-400 hover:text-primary transition">Projects</a></li>
              <li><a href="/village" className="text-gray-400 hover:text-primary transition">Stories</a></li>
              <li><a href="#donate" className="text-gray-400 hover:text-primary transition">Donate</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              
              <li><Link href="/" className="text-gray-400 hover:text-primary transition">FAQs</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <Mail className="w-5 h-5 mr-3 mt-1" />
                <span>solarpakinitiative@gmail.com</span>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-1" />
                <span>Khairpur Mirs, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} SolarPak. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/" className="text-gray-500 hover:text-primary text-sm transition">Privacy Policy</Link>
              <Link href="/" className="text-gray-500 hover:text-primary text-sm transition">Terms of Service</Link>
              <Link href="/" className="text-gray-500 hover:text-primary text-sm transition">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
