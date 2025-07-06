import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function MonthlyImpactSection() {
  const [monthlyAmount, setMonthlyAmount] = useState<number>(50);
  
  // Calculate impact metrics based on monthly amount
  const calculateImpact = (amount: number) => {
    return {
      familiesHelped: Math.max(1, Math.floor(amount / 50)),
      co2Reduced: parseFloat((amount * 0.05).toFixed(1)),
      hoursOfPower: Math.floor(amount * 0.7),
      treesEquivalent: Math.floor(amount * 0.2),
    };
  };
  
  const impact = calculateImpact(monthlyAmount);
  
  // Determine membership tier
  const getMembershipTier = (amount: number) => {
    if (amount >= 1000) return { name: "Platinum", color: "text-gray-400" };
    if (amount >= 500) return { name: "Gold", color: "text-yellow-500" };
    if (amount >= 250) return { name: "Silver", color: "text-gray-400" };
    if (amount >= 50) return { name: "Bronze", color: "text-amber-600" };
    return { name: "Supporter", color: "text-gray-600" };
  };
  
  const tier = getMembershipTier(monthlyAmount);
  
  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setMonthlyAmount(value[0]);
  };
  
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Make a Monthly Impact
          </h2>
          <div className="h-1 w-24 bg-primary rounded-full mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg">
            Join our community of monthly donors and help provide sustainable solar energy to families in Pakistan every month.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl overflow-hidden border-0">
            <div className="bg-gradient-to-r from-primary/90 to-primary p-6 md:p-8 text-white">
              <h3 className="text-xl md:text-2xl font-bold mb-2">Your Monthly Impact</h3>
              <p className="opacity-90">
                See how your monthly donation creates lasting change
              </p>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">Monthly Amount</span>
                  <span className="text-2xl font-bold text-primary">${monthlyAmount}</span>
                </div>
                
                <Slider
                  value={[monthlyAmount]}
                  min={10}
                  max={1000}
                  step={5}
                  onValueChange={handleSliderChange}
                  className="my-6"
                />
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>$10</span>
                  <span>$1000</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{impact.familiesHelped}</div>
                  <div className="text-sm text-gray-600">Families Helped</div>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{impact.hoursOfPower}</div>
                  <div className="text-sm text-gray-600">Hours of Power</div>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{impact.co2Reduced}</div>
                  <div className="text-sm text-gray-600">Tons of CO₂ Saved</div>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{impact.treesEquivalent}</div>
                  <div className="text-sm text-gray-600">Trees Equivalent</div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Membership Status</h4>
                  <p className="text-sm text-gray-600">
                    This donation qualifies you for <span className={`font-medium ${tier.color}`}>{tier.name} Membership</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Convenient & Flexible</h4>
                  <p className="text-sm text-gray-600">
                    Cancel or modify your monthly donation at any time
                  </p>
                </div>
              </div>
              
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Secure Payments</h4>
                  <p className="text-sm text-gray-600">
                    Your payments are securely processed via Stripe
                  </p>
                </div>
              </div>
              
              <Button
                className="w-full"
                onClick={() => window.open('https://ko-fi.com/solarpak', '_blank')}
              >
                Become a Monthly Donor
              </Button>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                Your recurring donation helps us plan long-term projects and provide continuous support
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}