import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SignUpForm from "@/components/auth/SignUpForm";
import { useEffect, useState } from "react";

export default function SignUp() {
  const [isVisible, setIsVisible] = useState(false);
  
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
            <SignUpForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}