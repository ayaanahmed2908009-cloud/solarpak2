import { useState } from "react";
import DonationModal from "./DonationModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DonationSection() {
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  
  // Pre-defined donation amounts
  const donationAmounts = [
    { amount: 25, impact: "Provides basic solar lighting for a family" },
    { amount: 50, impact: "Powers essential appliances for one day" },
    { amount: 100, impact: "Lights an entire home for a month" },
    { amount: 250, impact: "Installs a small solar system" },
    { amount: 500, impact: "Provides sustainable electricity for a family" },
    { amount: 1000, impact: "Installs a complete solar system" },
  ];

  return (
    <section id="donate" className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Make a Difference Today
          </h2>
          <div className="h-1 w-24 bg-primary rounded-full mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg">
            Your donation brings clean, reliable solar energy to families in Pakistan suffering from electricity shortages and extreme heat.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col">
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Choose a Donation Amount</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {donationAmounts.map((option) => (
                  <button
                    key={option.amount}
                    className={cn(
                      "border rounded-lg p-4 transition-all text-left",
                      selectedAmount === option.amount
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-gray-200 hover:border-primary/50 hover:bg-primary/5"
                    )}
                    onClick={() => setSelectedAmount(option.amount)}
                  >
                    <div className="font-bold text-xl text-primary mb-1">
                      ${option.amount}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {option.impact}
                    </p>
                  </button>
                ))}
              </div>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="font-medium mb-2">Your Impact</h4>
                <p className="text-gray-600">
                  {donationAmounts.find(d => d.amount === selectedAmount)?.impact || "Your donation helps provide solar energy to families in need"}
                </p>
                
                {selectedAmount >= 50 && (
                  <div className="mt-3 text-sm">
                    <span className="text-primary font-medium">
                      {selectedAmount >= 1000 ? "Platinum" : 
                       selectedAmount >= 500 ? "Gold" : 
                       selectedAmount >= 250 ? "Silver" : "Bronze"} membership tier unlocked!
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <DonationModal
                suggestedAmount={selectedAmount}
                buttonText="Donate Once"
                fullWidth={true}
              />
              
              <DonationModal
                suggestedAmount={selectedAmount}
                buttonText="Donate Monthly"
                buttonVariant="outline"
                fullWidth={true}
                projectId="1" // Optional, can be removed if not needed
              />
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              All donations are secure and tax-deductible where applicable.
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4">Other Ways to Help</h3>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button variant="outline">Become a Partner</Button>
            <Button variant="outline">Corporate Sponsorships</Button>
            <Button variant="outline">Share Our Mission</Button>
          </div>
        </div>
      </div>
    </section>
  );
}