import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Share2, Home, Sun, Twitter, Facebook, Mail, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function Success() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Enter animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Impact metrics (this would normally come from the donation data)
  const impactStats = {
    co2Reduced: 2.4,
    familiesHelped: 1,
    hoursOfElectricity: 36
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4 py-20">
        <div className={`w-full max-w-4xl transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-8">
            <div className="animate-fade-in" style={{ animationDuration: '1s', animationDelay: '0.3s', animationFillMode: 'both' }}>
              <div className="mx-auto bg-green-100 p-5 rounded-full w-24 h-24 flex items-center justify-center mb-4 shadow-md">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Thank You for Your Donation!</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your contribution will help bring sustainable solar power to families in Pakistan suffering from electricity shortages.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Left side - impact card */}
            <Card className="shadow-lg border-0 overflow-hidden gradient-border animate-fade-in" 
              style={{ animationDuration: '1s', animationDelay: '0.6s', animationFillMode: 'both' }}>
              <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-6 px-8">
                <h2 className="font-heading font-bold text-2xl mb-1">Your Impact</h2>
                <p className="text-white/80">Here's how your donation makes a difference</p>
              </div>
              
              <CardContent className="p-8">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="mx-auto bg-primary/10 p-2 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                      <Sun className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-bold text-2xl text-primary">{impactStats.hoursOfElectricity}</div>
                    <div className="text-xs text-gray-500">Hours of Clean Electricity</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="mx-auto bg-primary/10 p-2 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                      <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 7v10H3V7l9-4 9 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 7v10M7.5 9.5v5M16.5 9.5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="font-bold text-2xl text-primary">{impactStats.familiesHelped}</div>
                    <div className="text-xs text-gray-500">Families Helped</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="mx-auto bg-primary/10 p-2 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                      <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17.9391C4.6 17.4794 3 15.5457 3 13.7152C3 11.3617 5.2 9.36168 8 9.36168C8.8 7.56068 10.4 5.75969 13 5.75969C16.3 5.75969 19 8.56068 19 11.9617C19 12.6417 19 13.2332 18.8 13.8248C20.2 14.4164 21 15.5457 21 16.7348C21 18.3838 19.8 19.7402 18 19.9359" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 12V21M12 12L9 14.5M12 12L15 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="font-bold text-2xl text-primary">{impactStats.co2Reduced}</div>
                    <div className="text-xs text-gray-500">Tons of CO₂ Reduced</div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">
                  We will keep you updated via email on how your donation is making a real difference in the lives of Pakistani families.
                </p>
                
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <h3 className="font-medium text-gray-800 mb-2">Share Your Impact</h3>
                  <div className="flex gap-3">
                    <button
                      className="bg-[#1DA1F2] text-white p-2 rounded-full hover:bg-[#1DA1F2]/90 transition-all"
                      onClick={() => {
                        window.open(
                          `https://twitter.com/intent/tweet?text=I just helped bring solar power to families in Pakistan through SolarPak. Join me in making a difference! ${window.location.origin}`,
                          '_blank'
                        );
                      }}
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="h-5 w-5" />
                    </button>
                    <button
                      className="bg-[#4267B2] text-white p-2 rounded-full hover:bg-[#4267B2]/90 transition-all"
                      onClick={() => {
                        window.open(
                          `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}`,
                          '_blank'
                        );
                      }}
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </button>
                    <button
                      className="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700 transition-all"
                      onClick={() => {
                        window.open(
                          `mailto:?subject=Help bring solar power to families in Pakistan&body=I just donated to help bring solar power to families in Pakistan through SolarPak. Join me in making a difference! ${window.location.origin}`,
                          '_blank'
                        );
                      }}
                      aria-label="Share via Email"
                    >
                      <Mail className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Right side - what's next */}
            <Card className="shadow-lg border-0 animate-fade-in"
              style={{ animationDuration: '1s', animationDelay: '0.9s', animationFillMode: 'both' }}>
              <CardHeader className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                <CardTitle className="text-xl">What Happens Next?</CardTitle>
              </CardHeader>
              
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0 rounded-full bg-primary text-white w-8 h-8 flex items-center justify-center mr-4">1</div>
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1">Confirmation Email</h3>
                      <p className="text-gray-600 text-sm">
                        You'll receive a confirmation email with the details of your donation and receipt for tax purposes.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 rounded-full bg-primary text-white w-8 h-8 flex items-center justify-center mr-4">2</div>
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1">Project Updates</h3>
                      <p className="text-gray-600 text-sm">
                        We'll send you regular updates about the specific projects your donation is helping to fund.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 rounded-full bg-primary text-white w-8 h-8 flex items-center justify-center mr-4">3</div>
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1">Impact Reports</h3>
                      <p className="text-gray-600 text-sm">
                        You'll receive detailed impact reports showing exactly how your contribution is making a difference.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <Link href="/">
                    <Button size="lg" className="w-full btn-glow">
                      <span className="flex items-center justify-center">
                        Return to Homepage
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
