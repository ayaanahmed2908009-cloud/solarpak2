import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/auth/LoginForm";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const [location] = useLocation();

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12">
        <div className={`w-full max-w-md mx-auto transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <LoginForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}