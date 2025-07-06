import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Heart, Users, Zap, ArrowRight, Star } from "lucide-react";

interface DonationSessionData {
  amount: number;
  currency: string;
  isMonthly: boolean;
  projectId?: string;
  donorName: string;
  donorEmail: string;
}

interface UserTierInfo {
  currentTier: string;
  totalDonated: number;
  nextTier?: string;
  nextTierAmount?: number;
}

export default function DonationSuccess() {
  const [, navigate] = useLocation();
  const { user, refreshUser } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Get donation ID from session storage  
  useEffect(() => {
    const storedDonationId = sessionStorage.getItem('pendingDonationId');
    if (storedDonationId) {
      setSessionId(storedDonationId);
      // Clear the pending donation ID
      sessionStorage.removeItem('pendingDonationId');
      // Refresh user data to show updated tier
      refreshUser();
    }
  }, [refreshUser]);

  // Fetch donation details
  const { data: sessionData, isLoading: sessionLoading } = useQuery<DonationSessionData>({
    queryKey: ['/api/donation-session', sessionId],
    enabled: !!sessionId,
  });

  // Refetch user data to get updated tier information
  useEffect(() => {
    if (sessionId && user) {
      // Refetch user data after a small delay to ensure webhook has processed
      setTimeout(() => {
        refreshUser();
      }, 2000);
    }
  }, [sessionId, user, refreshUser]);

  const getTierInfo = (totalDonated: number): UserTierInfo => {
    let currentTier = 'none';
    let nextTier: string | undefined = 'bronze';
    let nextTierAmount: number | undefined = 100;

    if (totalDonated >= 5000) {
      currentTier = 'platinum';
      nextTier = undefined;
      nextTierAmount = undefined;
    } else if (totalDonated >= 1000) {
      currentTier = 'gold';
      nextTier = 'platinum';
      nextTierAmount = 5000;
    } else if (totalDonated >= 500) {
      currentTier = 'silver';
      nextTier = 'gold';
      nextTierAmount = 1000;
    } else if (totalDonated >= 100) {
      currentTier = 'bronze';
      nextTier = 'silver';
      nextTierAmount = 500;
    }

    return { currentTier, totalDonated, nextTier, nextTierAmount };
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'bronze': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'platinum': return <Star className="h-4 w-4" />;
      case 'gold': return <Star className="h-4 w-4" />;
      case 'silver': return <Star className="h-4 w-4" />;
      case 'bronze': return <Star className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  const getImpactMessage = (amount: number) => {
    if (amount >= 1000) {
      return "Your generous donation can provide a complete solar system for a family home!";
    } else if (amount >= 250) {
      return "Your donation can provide a small solar system for essential appliances!";
    } else if (amount >= 100) {
      return "Your donation can provide solar lighting for multiple rooms!";
    } else if (amount >= 50) {
      return "Your donation can provide basic solar lighting setup!";
    } else {
      return "Your contribution helps towards solar equipment for families in need!";
    }
  };

  if (sessionLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your donation...</p>
        </div>
      </div>
    );
  }

  const tierInfo = getTierInfo(user.totalDonated || 0);
  const donationAmount = sessionData?.amount || 50; // Fallback amount

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Thank You!
          </h1>
          <p className="text-xl text-gray-600">
            Your donation has been successfully processed
          </p>
        </div>

        {/* Donation Details Card */}
        <Card className="mb-6 border-2 border-green-200 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Donation Confirmed
              </h2>
              <div className="text-3xl font-bold text-green-600 mb-2">
                ${donationAmount}
                {sessionData?.isMonthly && <span className="text-lg text-gray-500">/month</span>}
              </div>
              <p className="text-gray-600">
                {getImpactMessage(donationAmount)}
              </p>
            </div>

            {/* Membership Tier Update */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Your Membership Status
              </h3>
              
              <Badge className={`text-lg px-4 py-2 mb-3 ${getTierColor(tierInfo.currentTier)}`}>
                {getTierIcon(tierInfo.currentTier)}
                <span className="ml-2 capitalize">{tierInfo.currentTier} Member</span>
              </Badge>
              
              <p className="text-gray-600 mb-2">
                Total Contributed: <span className="font-semibold">${tierInfo.totalDonated}</span>
              </p>
              
              {tierInfo.nextTier && tierInfo.nextTierAmount && (
                <p className="text-sm text-gray-500">
                  ${tierInfo.nextTierAmount - tierInfo.totalDonated} more to reach {tierInfo.nextTier} status
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Impact Tracking Notice */}
        <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Track Your Impact
                </h3>
                <p className="text-gray-600 mb-4">
                  Keep a close lookout on your user dashboard for updates on where your money goes. 
                  You'll receive detailed reports showing exactly how your contribution is helping 
                  families in Pakistan get access to clean, reliable solar energy.
                </p>
                <div className="flex items-center text-sm text-yellow-700">
                  <Zap className="h-4 w-4 mr-1" />
                  <span>Real-time impact updates coming to your dashboard</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3"
          >
            <Users className="mr-2 h-5 w-5" />
            View Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/')}
            className="border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900 px-8 py-3"
          >
            Return Home
          </Button>
        </div>

        {/* Share Success */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Help us spread the word about solar energy access in Pakistan
          </p>
        </div>
      </div>
    </div>
  );
}