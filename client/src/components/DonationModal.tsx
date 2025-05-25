import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// UI Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Define the donation schema with validation
const donationSchema = z.object({
  amount: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Amount must be a number" })
      .positive("Amount must be positive")
      .min(5, "Minimum donation is $5")
  ),
  donationType: z.enum(["one-time", "monthly"]),
  email: z.string().email("Please enter a valid email"),
  name: z.string().min(2, "Please enter your name"),
  projectId: z.string().optional(),
  message: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms",
  }),
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

      // Check if the user has filled in all required fields
      if (!data.email || !data.name) {
        throw new Error("Please fill in all required fields");
      }

      // Create a donation record
      const donationResponse = await apiRequest("POST", "/api/donations", {
        amount: data.amount,
        email: data.email,
        name: data.name,
        projectId: data.projectId || null,
        message: data.message || "",
        isRecurring: data.donationType === "monthly",
      });

      if (!donationResponse.ok) {
        throw new Error("Failed to create donation");
      }

      const donationData = await donationResponse.json();

      // Set a success toast
      toast({
        title: "Donation Initiated",
        description: "Taking you to the payment page...",
        variant: "default",
      });

      // Navigate to checkout with the donation ID
      navigate(`/checkout?donationId=${donationData.id}`);
      setIsOpen(false);
    } catch (error) {
      console.error("Donation error:", error);
      toast({
        title: "Donation Error",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message) 
          : "There was a problem processing your donation. Please try again.",
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
      return "Basic solar lighting for one room";
    } else {
      return "Contribution towards solar installation";
    }
  };

  // Handle pre-defined amount selection
  const selectAmount = (amount: number) => {
    form.setValue("amount", amount);
  };

  // Get the tier that would be unlocked with this donation
  const getTierUnlocked = (amount: number) => {
    if (amount >= 1000) return "Platinum";
    if (amount >= 500) return "Gold";
    if (amount >= 250) return "Silver";
    if (amount >= 50) return "Bronze";
    return null;
  };

  const tierUnlocked = getTierUnlocked(watchAmount);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={buttonVariant} 
          size={buttonSize}
          className={fullWidth ? "w-full" : ""}
        >
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Make a Donation</DialogTitle>
          <DialogDescription>
            Help bring solar power to families in Pakistan suffering from electricity shortages.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="donationType"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Donation Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex"
                    >
                      <div className="flex items-center space-x-2 mr-6">
                        <RadioGroupItem value="one-time" id="one-time" />
                        <label
                          htmlFor="one-time"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          One-time
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <label
                          htmlFor="monthly"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Monthly
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount selection */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter amount"
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value === "" ? "" : Number(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Predefined amounts */}
              <div className="grid grid-cols-3 gap-2">
                {predefinedAmounts.map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant={watchAmount === amount ? "default" : "outline"}
                    onClick={() => selectAmount(amount)}
                    className="text-sm"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>

              {/* Impact message */}
              {watchAmount > 0 && (
                <div className="text-sm bg-primary/5 p-3 rounded-md border border-primary/10">
                  <div className="font-medium text-primary">
                    Your Impact:
                  </div>
                  <div className="text-gray-600">
                    {getImpactText(watchAmount, watchDonationType === "monthly")}
                  </div>
                  {tierUnlocked && (
                    <div className="mt-2 pt-2 border-t border-primary/10">
                      <span className="text-primary font-medium">
                        Unlocks {tierUnlocked} membership tier
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Separator />

            {/* Personal information */}
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Project selection if available */}
              {projectId ? null : (
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project (Optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a project (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General donation</SelectItem>
                          <SelectItem value="1">Sindh Province Initiative</SelectItem>
                          <SelectItem value="2">Punjab Rural Electrification</SelectItem>
                          <SelectItem value="3">Balochistan Remote Villages</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose a specific project or donate to our general fund.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Your message" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Terms agreement */}
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
                    <FormLabel>
                      I agree to the terms and conditions
                    </FormLabel>
                    <FormDescription>
                      Your donation may be tax-deductible.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Continue to Payment</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}