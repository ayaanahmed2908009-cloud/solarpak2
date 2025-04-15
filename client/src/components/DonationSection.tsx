import { useState } from "react";
import DonationForm from "./DonationForm";
import { Home, Plug, PanelTop, ShieldCheck } from "lucide-react";

export default function DonationSection() {
  return (
    <section id="donate" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-8 md:p-10">
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-800 mb-4">Make a Donation</h2>
                <p className="text-gray-600 mb-6">
                  Your contribution helps bring sustainable electricity to families in Pakistan. Every donation makes a difference.
                </p>
                
                <DonationForm />
              </div>
              
              <div className="lg:w-1/2 bg-secondary text-white p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-2xl mb-6">Your Impact</h3>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex">
                      <div className="mr-4 text-primary text-3xl">
                        <Home className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-lg mb-1">$50 provides</h4>
                        <p className="text-white text-opacity-80">A basic solar lighting system for one room in a family home</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-4 text-primary text-3xl">
                        <Plug className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-lg mb-1">$250 provides</h4>
                        <p className="text-white text-opacity-80">A small solar system to power basic appliances for a family</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-4 text-primary text-3xl">
                        <PanelTop className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-lg mb-1">$1,000 provides</h4>
                        <p className="text-white text-opacity-80">A complete solar system for an entire home with battery storage</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                  <h4 className="font-heading font-semibold text-lg mb-3">Donation Transparency</h4>
                  <p className="text-white text-opacity-90 mb-4">
                    We're committed to transparency. You'll receive updates about your specific contribution, including photos of installations you helped fund.
                  </p>
                  <div className="flex items-center">
                    <div className="mr-2 text-primary">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-white text-opacity-90">Your donation is tax-deductible where applicable</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
