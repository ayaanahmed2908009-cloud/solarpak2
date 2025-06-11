import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Heart, ArrowRight, Users, Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DonationSuccess() {
  const { user, refreshUser } = useAuth();
  const searchParams = new URLSearchParams(useSearch());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const donationAmount = searchParams.get('amount');
  const donationType = searchParams.get('type');
  const donationId = searchParams.get('donationId');

  useEffect(() => {
    // Refresh user data when the page loads to ensure updated donation totals
    const refreshData = async () => {
      setIsRefreshing(true);
      await refreshUser();
      setIsRefreshing(false);
    };
    
    if (user) {
      refreshData();
    }
  }, [user, refreshUser]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-6">
          {/* Success Animation Card */}
          <Card className="text-center border-green-200 bg-green-50/50 shadow-2xl">
            <CardHeader className="pb-4">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-green-800 mb-2">
                Donation Successful!
              </CardTitle>
              <CardDescription className="text-lg text-green-700">
                Thank you for bringing light to families in Pakistan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {donationAmount && (
                <div className="bg-white rounded-lg p-6 border border-green-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Your Contribution
                  </h3>
                  <p className="text-3xl font-bold text-green-600">
                    ${donationAmount}
                  </p>
                  {donationType === 'subscription' && (
                    <p className="text-sm text-gray-600 mt-1">Monthly Donation</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <Users className="w-6 h-6 text-blue-600" />
                    <h4 className="font-semibold text-gray-800">Impact Created</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your donation will help provide solar panels to families without electricity
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <Heart className="w-6 h-6 text-red-500" />
                    <h4 className="font-semibold text-gray-800">Lives Changed</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Bringing clean energy and hope to communities in Khairpur Mirs, Sindh
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  What Happens Next?
                </h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      1
                    </div>
                    <p className="text-sm text-blue-700">
                      Our team will identify a family in need and begin the solar panel installation process
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      2
                    </div>
                    <p className="text-sm text-blue-700">
                      You'll receive photos and videos of the installation on your dashboard
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      3
                    </div>
                    <p className="text-sm text-blue-700">
                      Watch your personal impact grow as more families receive clean energy
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-yellow-800 font-medium text-center">
                  📧 A receipt has been sent to your email address
                </p>
                <p className="text-yellow-700 text-sm text-center mt-1">
                  Keep it for your tax-deductible records
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-lg px-8 py-3"
                disabled={isRefreshing}
              >
                {isRefreshing ? "Updating..." : "View Your Dashboard"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <Link href="/">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto border-2 text-lg px-8 py-3"
              >
                Return to Homepage
              </Button>
            </Link>
          </div>

          {/* Social Sharing Encouragement */}
          <Card className="border-gray-200">
            <CardContent className="pt-6 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Share Your Impact
              </h3>
              <p className="text-gray-600 mb-4">
                Inspire others to join the mission of bringing solar power to families in need
              </p>
              <div className="text-sm text-gray-500">
                Share your story on social media and help us reach more donors
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}