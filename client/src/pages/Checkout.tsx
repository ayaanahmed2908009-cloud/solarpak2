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

    // Confirm the payment
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
        // Can add receipt email here if needed
        receipt_email: donation.email,
      },
      redirect: 'if_required',
    });

    setIsProcessing(false);

    if (error) {
      // Show error to customer
      onError(error.message || "An unknown error occurred");
    } else {
      // Payment succeeded
      onSuccess();
      
      // Also trigger our manual webhook for the demo
      // In a real application, Stripe would send a webhook
      try {
        await apiRequest("POST", "/api/payment-webhook", {
          donationId: donation.id,
          status: "succeeded",
        });
      } catch (err) {
        console.error("Error updating payment status:", err);
      }
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
      </div>
    </form>
  );
}

export default function Checkout() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const donationId = params.get("donationId");
  const { toast } = useToast();
  
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Fetch donation details
  const { data: donation, isLoading: donationLoading } = useQuery<Donation>({
    queryKey: ['/api/donations', donationId],
    enabled: !!donationId,
    retry: 1,
  });

  // Create payment intent when donation is loaded
  useEffect(() => {
    if (donation && paymentStatus === "idle") {
      // Create a payment intent
      const createIntent = async () => {
        try {
          setPaymentStatus("processing");
          const response = await apiRequest("POST", "/api/create-payment-intent", {
            amount: donation.amount,
            donationId: donation.id,
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Error</CardTitle>
              <CardDescription>No donation information found.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/">
                <Button className="w-full">Return to Homepage</Button>
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
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <Link href="/" className="text-secondary hover:text-primary inline-flex items-center mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to home
            </Link>
            <CardTitle className="text-2xl font-bold">Complete Your Donation</CardTitle>
            <CardDescription>
              You're donating ${donation.amount} {donation.isRecurring ? 'monthly' : ''}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {paymentStatus === "success" ? (
              <div className="text-center py-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Payment Successful</h3>
                <p className="text-gray-600 mb-4">Thank you for your donation!</p>
                <p className="text-gray-600">Redirecting to confirmation page...</p>
              </div>
            ) : paymentStatus === "error" ? (
              <div className="text-center py-4">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Payment Failed</h3>
                <p className="text-gray-600 mb-4">
                  {errorMessage || "There was an error processing your payment."}
                </p>
                <Button 
                  onClick={resetPaymentStatus} 
                  className="mx-auto"
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
              <div className="flex justify-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading payment form"/>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
