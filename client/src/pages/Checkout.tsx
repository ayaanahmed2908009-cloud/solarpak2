import { useEffect, useState } from "react";
import { useLocation, useSearch, Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Donation } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

// Load Stripe outside of component rendering to avoid recreating it on each render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Payment form component that uses Stripe Elements
function CheckoutForm({ donation, onSuccess, onError }: { 
  donation: Donation;
  onSuccess: () => void;
  onError: (message: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    setIsProcessing(true);

    try {
      // Use the appropriate confirmation method based on whether this is recurring
      if (donation.isRecurring) {
        // For recurring donations (subscriptions)
        const { error } = await stripe.confirmSetup({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/success?type=subscription&donationId=${donation.id}`,
          },
          redirect: 'if_required',
        });

        if (error) {
          throw error;
        }
      } else {
        // For one-time donations (payment intents)
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/success?type=payment&donationId=${donation.id}`,
            receipt_email: donation.email,
          },
          redirect: 'if_required',
        });

        if (error) {
          throw error;
        }
      }

      // If we get here without redirecting, the payment succeeded
      onSuccess();
      
      // Trigger our manual webhook for the demo
      // In a real application, Stripe would send a webhook
      try {
        await apiRequest("POST", "/api/payment-webhook", {
          donationId: donation.id,
          status: "succeeded",
        });
      } catch (err) {
        console.error("Error updating payment status:", err);
      }
    } catch (error: any) {
      // Show error to customer
      onError(error.message || "An unknown error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      
      <Button 
        type="submit" 
        className="w-full mt-6"
        disabled={!stripe || !elements || isProcessing}
      >
        {isProcessing ? "Processing..." : "Complete Donation"}
      </Button>
      
      <div className="text-xs text-gray-500 text-center mt-4">
        Your payment information is secured with encryption by Stripe.
        {donation.isRecurring && (
          <p className="mt-1">
            You can cancel your monthly donation at any time from your account.
          </p>
        )}
      </div>
    </form>
  );
}

export default function Checkout() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const donationId = params.get("donationId");
  const projectId = params.get("projectId");
  const { toast } = useToast();
  
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Animation effect
  useEffect(() => {
    // Slight delay for entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Fetch donation details
  const { data: donation, isLoading: donationLoading } = useQuery<Donation>({
    queryKey: ['/api/donations', donationId],
    enabled: !!donationId,
    retry: 1,
  });

  // Create payment intent when donation is loaded
  useEffect(() => {
    if (donation && paymentStatus === "idle") {
      // Create a payment intent or setup intent based on donation type
      const createIntent = async () => {
        try {
          setPaymentStatus("processing");
          
          const endpoint = donation.isRecurring 
            ? "/api/create-subscription" 
            : "/api/create-payment-intent";
          
          const response = await apiRequest("POST", endpoint, {
            amount: donation.amount,
            donationId: donation.id,
            email: donation.email,
            name: donation.name,
          });
          
          const data = await response.json();
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
            setPaymentStatus("idle");
          } else {
            throw new Error("No client secret returned");
          }
        } catch (error) {
          console.error("Payment intent creation failed:", error);
          setPaymentStatus("error");
          setErrorMessage("Failed to initialize payment system. Please try again.");
        }
      };

      createIntent();
    }
  }, [donation, paymentStatus]);

  const handlePaymentSuccess = () => {
    setPaymentStatus("success");
    
    // Show a toast notification
    toast({
      title: "Payment successful!",
      description: "Thank you for your generous donation",
      variant: "default",
    });
    
    // Redirect to success page after a short delay
    setTimeout(() => {
      navigate("/success");
    }, 2000);
  };

  const handlePaymentError = (message: string) => {
    setPaymentStatus("error");
    setErrorMessage(message);
    toast({
      title: "Payment failed",
      description: message,
      variant: "destructive",
    });
  };

  const resetPaymentStatus = () => {
    setPaymentStatus("idle");
    setErrorMessage(null);
  };

  if (donationLoading || (paymentStatus === "processing" && !clientSecret)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" aria-label="Loading"/>
          <p className="text-gray-600 animate-pulse">Preparing your donation...</p>
        </div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md gradient-border animate-fade-in shadow-xl">
            <CardHeader className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
              <CardTitle className="text-xl font-semibold">Error</CardTitle>
              <CardDescription>No donation information found.</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Link href="/">
                <Button className="btn-glow px-8">Return to Homepage</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Stripe options
  const stripeOptions = {
    clientSecret: clientSecret || '',
    appearance: {
      theme: 'stripe' as const,
      labels: 'floating' as const,
      variables: {
        colorPrimary: '#4F46E5',
        colorBackground: '#FFFFFF',
        colorText: '#1F2937',
        colorDanger: '#EF4444',
        fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system',
        borderRadius: '8px',
        spacingUnit: '4px',
      }
    },
  };

  // Impact information based on donation amount
  const getDonationImpact = (amount: number) => {
    if (amount >= 1000) {
      return "Complete solar system for an entire home with battery storage";
    } else if (amount >= 250) {
      return "Small solar system to power basic appliances for a family";
    } else if (amount >= 50) {
      return "Basic solar lighting system for one room in a family home";
    } else {
      return "Contribution towards solar panel installation";
    }
  };

  const impact = getDonationImpact(donation.amount);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className={`max-w-6xl mx-auto transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side - donation information */}
            <div className="w-full md:w-2/5 order-2 md:order-1">
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 md:p-8 h-full">
                <div className="mb-8">
                  <Link href="/" className="text-primary hover:text-primary/80 inline-flex items-center mb-8 transition-all duration-300">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    <span>Back to home</span>
                  </Link>
                  
                  <h3 className="font-heading font-bold text-2xl mb-2">Your Donation Summary</h3>
                  <div className="h-1 w-20 bg-primary rounded-full mb-6"></div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold text-lg text-primary">
                        ${donation.amount}{donation.isRecurring && <span className="text-sm font-normal">/month</span>}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{donation.isRecurring ? 'Monthly recurring' : 'One-time donation'}</span>
                    </div>
                    
                    {donation.projectId && (
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <span className="text-gray-600">Project:</span>
                        <span className="font-medium">Project #{donation.projectId}</span>
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <h4 className="font-semibold mb-2">Your Impact:</h4>
                      <p className="text-gray-600">{impact}</p>
                    </div>
                    
                    {donation.isRecurring && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                        <h4 className="font-medium text-primary mb-1">Monthly Impact</h4>
                        <p className="text-sm text-gray-600">
                          Your recurring donation helps us plan long-term projects and provide continuous support to communities in need.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h4 className="font-medium mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                    <span>Tax Deductible Donation</span>
                  </h4>
                  <p className="text-sm text-gray-600">
                    Your donation is tax-deductible where applicable. You'll receive a receipt via email once your payment is processed.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right side - payment form */}
            <div className="w-full md:w-3/5 order-1 md:order-2">
              <Card className="shadow-xl border-0 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-6 px-8">
                  <h2 className="font-heading font-bold text-2xl mb-1">Complete Your Donation</h2>
                  <p className="text-white/80">Enter your payment details to finalize your donation</p>
                </div>
                
                <CardContent className="p-8">
                  {paymentStatus === "success" ? (
                    <div className="text-center py-8 animate-fade-in">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-10 w-10 text-green-500" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Payment Successful</h3>
                      <p className="text-gray-600 mb-6">Thank you for your generous donation!</p>
                      <p className="text-gray-600">Redirecting to confirmation page...</p>
                    </div>
                  ) : paymentStatus === "error" ? (
                    <div className="text-center py-8 animate-fade-in">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-10 w-10 text-red-500" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Payment Failed</h3>
                      <p className="text-gray-600 mb-6">
                        {errorMessage || "There was an error processing your payment."}
                      </p>
                      <Button 
                        onClick={resetPaymentStatus} 
                        className="btn-glow px-8"
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : clientSecret ? (
                    <Elements stripe={stripePromise} options={stripeOptions}>
                      <CheckoutForm 
                        donation={donation} 
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </Elements>
                  ) : (
                    <div className="flex justify-center items-center py-16">
                      <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading payment form"/>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
