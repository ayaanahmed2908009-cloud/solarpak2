import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Heart, Home, Calendar, CreditCard } from "lucide-react";

interface DonationSessionData {
  amount: number;
  currency: string;
  donationType: string;
  email: string;
  name: string;
  message?: string;
  projectId?: string;
}

export default function MonthlyDonationSuccess() {
  const [, navigate] = useLocation();
  const { user, refreshUser } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Extract order details from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const order = urlParams.get('order');
    const payer = urlParams.get('payer');
    
    if (order && payer) {
      setSessionId(order);
      // Process PayPal payment completion
      handlePayPalSuccess(order, payer);
    }
  }, []);

  const handlePayPalSuccess = async (orderID: string, payerID: string) => {
    try {
      const donationId = sessionStorage.getItem('pendingDonationId');
      
      if (!donationId) {
        console.error('No pending donation ID found');
        return;
      }

      // Capture the PayPal payment using monthly endpoint
      const captureResponse = await fetch(`/api/paypal/monthly/order/${orderID}/capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (captureResponse.ok) {
        // Update donation status
        const successResponse = await fetch('/api/paypal-donation-success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            donationId: parseInt(donationId),
            orderID: orderID,
            payerID: payerID
          })
        });

        if (successResponse.ok) {
          const result = await successResponse.json();
          console.log('Monthly donation processed successfully:', result);
          
          // Clear the pending donation ID
          sessionStorage.removeItem('pendingDonationId');
          
          // Refresh user data to show updated tier
          refreshUser();
        }
      }
    } catch (error) {
      console.error('Error processing PayPal monthly success:', error);
    }
  };

  // Get donation ID from session storage
  const [donationId, setDonationId] = useState<string | null>(null);
  
  useEffect(() => {
    const storedDonationId = sessionStorage.getItem('pendingDonationId');
    if (storedDonationId) {
      setDonationId(storedDonationId);
    }
  }, []);

  // Fetch donation details
  const { data: sessionData, isLoading: sessionLoading } = useQuery<DonationSessionData>({
    queryKey: ['/api/donation-session', donationId],
    enabled: !!donationId,
  });

  // Refetch user data to get updated tier information
  useEffect(() => {
    if (user && sessionData) {
      refreshUser();
    }
  }, [user, sessionData, refreshUser]);

  const getMembershipTier = (totalDonations: number) => {
    if (totalDonations >= 5000) return { name: "Platinum", color: "text-gray-600", bgColor: "bg-gray-100" };
    if (totalDonations >= 1000) return { name: "Gold", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    if (totalDonations >= 500) return { name: "Silver", color: "text-gray-500", bgColor: "bg-gray-100" };
    if (totalDonations >= 100) return { name: "Bronze", color: "text-orange-600", bgColor: "bg-orange-100" };
    return { name: "Supporter", color: "text-blue-600", bgColor: "bg-blue-100" };
  };

  const currentTier = user ? getMembershipTier(user.totalDonated || 0) : null;

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your monthly donation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center border-b border-green-200 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold mb-2">Monthly Donation Successful!</CardTitle>
          <CardDescription className="text-green-100 text-lg">
            Thank you for your monthly commitment to sustainable energy
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Donation Details */}
            <div className="bg-white rounded-lg border-2 border-green-200 p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-600" />
                Monthly Donation Details
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Monthly Amount</p>
                  <p className="font-semibold text-lg">
                    ${sessionData?.amount || 0} {sessionData?.currency || 'USD'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold flex items-center">
                    <CreditCard className="h-4 w-4 mr-1" />
                    PayPal
                  </p>
                </div>
              </div>
              
              {sessionData?.message && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Your Message</p>
                  <p className="text-gray-800 italic">"{sessionData.message}"</p>
                </div>
              )}
            </div>

            {/* Membership Tier */}
            {currentTier && (
              <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-blue-600" />
                  Your Membership Status
                </h3>
                
                <div className="flex items-center space-x-4">
                  <div className={`px-4 py-2 rounded-full ${currentTier.bgColor} ${currentTier.color} font-semibold`}>
                    {currentTier.name} Member
                  </div>
                  <div className="text-sm text-gray-600">
                    Total Donated: ${user?.totalDonated || 0}
                  </div>
                </div>
              </div>
            )}

            {/* Monthly Impact */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-2 border-amber-200 p-6">
              <h3 className="text-xl font-semibold mb-3 text-amber-800">Monthly Impact</h3>
              <p className="text-amber-700 mb-4">
                Your monthly contribution of ${sessionData?.amount || 0} will help provide sustainable energy solutions to families in Pakistan every month.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-amber-800 font-semibold">Monthly Solar Panels</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {Math.floor((sessionData?.amount || 0) / 50)}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-amber-800 font-semibold">Families Helped Monthly</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {Math.floor((sessionData?.amount || 0) / 25)}
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-6">
              <h3 className="text-xl font-semibold mb-3 text-blue-800">What's Next?</h3>
              <p className="text-blue-700 mb-4">
                Visit your dashboard to track your monthly impact and see how your recurring donations are making a difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => navigate('/dashboard')} className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  View Dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate('/')} className="flex-1">
                  <Home className="h-4 w-4 mr-2" />
                  Return Home
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}