import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Zap, Sun, Users, Loader2 } from "lucide-react";
import PayPalButton from "./PayPalButton";

// Donation form schema
const donationSchema = z.object({
  amount: z.number().min(1, "Amount must be at least $1"),
  donationType: z.enum(["one-time", "monthly"]),
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(1, "Please enter your name"),
  projectId: z.string().optional(),
  message: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  })
});

type DonationFormValues = z.infer<typeof donationSchema>;

interface DonationModalProps {
  suggestedAmount?: number;
  buttonText?: string;
  buttonVariant?: "default" | "secondary" | "outline" | "destructive" | "ghost" | "link" | null;
  buttonSize?: "default" | "sm" | "lg" | "icon";
  fullWidth?: boolean;
  projectId?: string;
}

export default function DonationModal({
  suggestedAmount = 50,
  buttonText = "Donate Now",
  buttonVariant = "default",
  buttonSize = "default",
  fullWidth = false,
  projectId,
}: DonationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Pre-define popular donation amounts
  const predefinedAmounts = [25, 50, 100, 250, 500, 1000];

  // Form definition using react-hook-form
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: suggestedAmount,
      donationType: buttonText?.toLowerCase().includes("monthly") ? "monthly" : "one-time",
      email: user?.email || "",
      name: user?.fullName || "",
      projectId: projectId || "",
      message: "",
      agreeToTerms: false,
    },
  });
  
  // Update form values when user or suggested amount changes
  useEffect(() => {
    if (user) {
      form.setValue("email", user.email || "");
      form.setValue("name", user.fullName || "");
    }
    
    if (suggestedAmount) {
      form.setValue("amount", suggestedAmount);
    }
    
    // Set donation type based on button text
    if (buttonText?.toLowerCase().includes("monthly")) {
      form.setValue("donationType", "monthly");
    }
  }, [user, suggestedAmount, buttonText, form]);

  const watchAmount = form.watch("amount");
  const watchDonationType = form.watch("donationType");

  // Handle donation submission
  const onSubmit = async (data: DonationFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to complete your donation",
        variant: "destructive",
      });
      setIsOpen(false);
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create donation record first
      const response = await apiRequest("POST", "/api/create-donation", {
        amount: data.amount,
        isMonthly: data.donationType === "monthly",
        projectId: data.projectId,
        name: data.name,
        email: data.email,
        message: data.message
      });

      if (response.ok) {
        const donationData = await response.json();
        
        // Store donation ID for success page
        sessionStorage.setItem('pendingDonationId', donationData.donationId.toString());
        
        toast({
          title: "Donation Created",
          description: "Redirecting to PayPal for secure payment...",
        });
        
        // Create PayPal order
        const paypalOrder = await apiRequest("POST", "/api/paypal/order", {
          amount: data.amount.toString(),
          currency: "USD",
          intent: "CAPTURE"
        });

        if (paypalOrder.ok) {
          const orderData = await paypalOrder.json();
          
          // Get approval URL from PayPal response
          const approvalUrl = orderData.links?.find((link: any) => link.rel === 'approve')?.href;
          
          if (approvalUrl) {
            // Redirect to PayPal for payment
            window.location.href = approvalUrl;
          } else {
            throw new Error("PayPal approval URL not found");
          }
        } else {
          const paypalError = await paypalOrder.json();
          throw new Error(paypalError.error || "Failed to create PayPal order");
        }
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to create donation");
      }
    } catch (error: any) {
      console.error("Donation error:", error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate impact text
  const getImpactText = (amount: number, isMonthly: boolean) => {
    const displayAmount = isMonthly ? amount : amount;

    if (displayAmount >= 1000) {
      return "Full solar system for a family home";
    } else if (displayAmount >= 250) {
      return "Small solar system for essential appliances";
    } else if (displayAmount >= 100) {
      return "Solar lighting for multiple rooms";
    } else if (displayAmount >= 50) {
      return "Basic solar lighting setup";
    } else {
      return "Contribution towards solar equipment";
    }
  };

  // Calculate families helped per month
  const getFamiliesHelped = (amount: number, isMonthly: boolean) => {
    const monthlyEquivalent = isMonthly ? amount : amount / 12;
    return Math.floor(monthlyEquivalent / 25); // Assuming $25 helps one family per month
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant || "default"}
          size={buttonSize}
          className={`${fullWidth ? "w-full" : ""} ${buttonVariant === "default" ? "bg-black hover:bg-gray-800 text-white font-semibold" : "border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900"}`}
        >
          <Heart className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl font-bold">
            <Sun className="mr-2 h-6 w-6 text-yellow-500" />
            Make a Donation
          </DialogTitle>
          <DialogDescription>
            Help us bring solar power to families in Pakistan who need it most.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Donation Type Selection */}
            <FormField
              control={form.control}
              name="donationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Donation Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select donation type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="one-time">One-time Donation</SelectItem>
                      <SelectItem value="monthly">Monthly Donation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Monthly donations help us plan long-term projects better.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount Selection */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Donation Amount (USD)</FormLabel>
                  <div className="space-y-3">
                    {/* Predefined amount buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      {predefinedAmounts.map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant={watchAmount === amount ? "default" : "outline"}
                          size="sm"
                          onClick={() => field.onChange(amount)}
                          className="h-12"
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                    
                    {/* Custom amount input */}
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-medium">$</span>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter custom amount"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="text-lg"
                        />
                      </FormControl>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Impact Preview */}
            {watchAmount > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 mb-2">Your Impact</h4>
                      <div className="space-y-2 text-sm text-blue-800">
                        <div className="flex items-center justify-between">
                          <span>Impact:</span>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {getImpactText(watchAmount, watchDonationType === "monthly")}
                          </Badge>
                        </div>
                        {watchDonationType === "monthly" && getFamiliesHelped(watchAmount, true) > 0 && (
                          <div className="flex items-center justify-between">
                            <span>Families helped monthly:</span>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span className="font-semibold">{getFamiliesHelped(watchAmount, true)}</span>
                            </div>
                          </div>
                        )}
                        {watchDonationType === "monthly" && (
                          <div className="text-xs text-blue-600 mt-2">
                            Annual impact: ${watchAmount * 12}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Optional Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Share why you're donating or leave a message for the families you're helping..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your message will be shared with the families you help (if you wish).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Terms Agreement */}
            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm">
                      I agree to the terms and conditions and understand that donations are processed securely through Stripe.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold text-lg py-6 transition-all duration-200 shadow-lg hover:shadow-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-5 w-5" />
                  {watchDonationType === "monthly" 
                    ? `Donate $${watchAmount}/month` 
                    : `Donate $${watchAmount}`
                  }
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}