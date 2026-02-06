import { useState, useEffect } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function Membership() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slight delay for entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const membershipTiers = [
    {
      id: "bronze",
      name: "Bronze",
      description: "Support our mission with a one-time contribution",
      threshold: 50,
      benefits: [
        "Access to impact reports",
        "Updates on projects you've supported",
        "Name listed on our supporters page",
      ],
      color: "from-amber-700 to-amber-500",
      textColor: "text-amber-600",
      borderColor: "border-amber-200",
      bgColor: "bg-amber-50",
    },
    {
      id: "silver",
      name: "Silver",
      description: "Become a valued supporter with increased impact",
      threshold: 250,
      benefits: [
        "All Bronze benefits",
        "Quarterly newsletter with exclusive updates",
        "Certificate of appreciation",
        "Personal impact report",
      ],
      color: "from-gray-400 to-gray-300",
      textColor: "text-gray-500",
      borderColor: "border-gray-200",
      bgColor: "bg-gray-50",
    },
    {
      id: "gold",
      name: "Gold",
      description: "Make a significant difference with your contribution",
      threshold: 500,
      benefits: [
        "All Silver benefits",
        "Recognition on our website's partner page",
        "Exclusive webinar invitations",
        "Video updates from the field",
        "Annual impact report personalized to your contributions",
      ],
      color: "from-yellow-500 to-yellow-300",
      textColor: "text-yellow-600",
      borderColor: "border-yellow-200",
      bgColor: "bg-yellow-50",
    },
    {
      id: "platinum",
      name: "Platinum",
      description: "Transform lives with your generous commitment",
      threshold: 1000,
      benefits: [
        "All Gold benefits",
        "Named recognition on a solar panel installation",
        "Virtual tour of installations you've funded",
        "Direct communication with our team",
        "Invitation to annual virtual event with beneficiaries",
        "Personalized thank you video from a family you've helped",
      ],
      color: "from-primary to-blue-400",
      textColor: "text-primary",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-50",
    },
  ];

  // Public page - no user-specific tier highlighting

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="pt-20">
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-teal-500/8 to-cyan-500/8 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className={`max-w-2xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <span className="text-green-400/80 font-medium text-xs uppercase tracking-[0.2em] mb-4 block">
                Join Us
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-[1.1] tracking-tight">
                Membership Tiers
              </h1>
              <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
                Join our community of supporters and help bring solar power to families in need. Every contribution makes a difference.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className={`max-w-6xl mx-auto transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {membershipTiers.map((tier, index) => (
              <Card 
                key={tier.id}
                className="overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <div className={`bg-gradient-to-r ${tier.color} h-3 w-full`}></div>
                <CardHeader>
                  <CardTitle className={`font-heading text-xl ${tier.textColor}`}>
                    {tier.name}
                  </CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">${tier.threshold}+</span>
                    <span className="text-sm text-gray-500 ml-1">donation</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-0">
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex">
                        <CheckCircle className={`h-5 w-5 mr-2 shrink-0 ${tier.textColor}`} />
                        <span className="text-gray-600 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6 pb-6">
                  <Link href={`/#donate?suggested=${tier.threshold}`}>
                    <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80">
                      Donate Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 border border-blue-100 mb-8">
            <h2 className="font-heading text-2xl font-semibold mb-4 text-blue-900">
              Learn More About Our Memberships
            </h2>
            <p className="text-gray-600 mb-6">
              Get detailed information about all membership tiers, benefits, and exclusive opportunities available to our supporters.
            </p>
            <a 
              href="/membership-guide.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              📄 Download Membership Guide (PDF)
            </a>
          </div>

          <div className="max-w-3xl mx-auto text-center bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="font-heading text-2xl font-semibold mb-4">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6 text-left">
              <div>
                <h3 className="font-medium text-lg mb-2">How do I reach a higher tier?</h3>
                <p className="text-gray-600">
                  Your membership tier is determined by your highest single donation. Make a donation at or above the threshold to unlock the corresponding tier and its benefits.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Do my donations accumulate?</h3>
                <p className="text-gray-600">
                  We track your total donation amount, but your membership tier is based on your largest single donation. This encourages larger one-time donations that can fund complete solar installations.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Are my donations tax-deductible?</h3>
                <p className="text-gray-600">
                  Yes, all donations are tax-deductible where applicable. You'll receive a receipt via email after your donation is processed.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Can I upgrade my membership later?</h3>
                <p className="text-gray-600">
                  Absolutely! You can make additional donations at any time to reach a higher membership tier and unlock more benefits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}