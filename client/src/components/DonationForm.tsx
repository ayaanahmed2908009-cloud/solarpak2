import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import type { Project } from "@shared/schema";

const donationSchema = z.object({
  amount: z.number().min(5, "Minimum donation is $5"),
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  frequency: z.enum(["one-time", "monthly"]),
  projectId: z.string().optional(),
});

type DonationFormValues = z.infer<typeof donationSchema>;

export default function DonationForm() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();

  const { data: projects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Initialize form with user data if available
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 50,
      name: user?.fullName || "",
      email: user?.email || "",
      frequency: "one-time",
      projectId: "",
    },
  });

  const selectAmount = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustomAmount(false);
    form.setValue("amount", amount);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setIsCustomAmount(true);
    setSelectedAmount(isNaN(value) ? 0 : value);
    form.setValue("amount", isNaN(value) ? 0 : value);
  };

  const onSubmit = async (data: DonationFormValues) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Save donation details to session storage for after login
      sessionStorage.setItem('pendingDonation', JSON.stringify({
        amount: data.amount,
        name: data.name,
        email: data.email,
        frequency: data.frequency,
        projectId: data.projectId
      }));
      
      toast({
        title: "Authentication Required",
        description: "Please log in or create an account to continue with your donation.",
      });
      
      // Redirect to login page
      navigate('/login');
      return;
    }
    
    try {
      // Create donation record
      const donationResponse = await apiRequest("POST", "/api/donations", {
        amount: data.amount,
        name: data.name,
        email: data.email,
        isRecurring: data.frequency === "monthly",
        projectId: data.projectId ? parseInt(data.projectId) : undefined,
      });
      
      const donation = await donationResponse.json();
      
      // Navigate to checkout page with donation ID
      navigate(`/checkout?donationId=${donation.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem processing your donation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-heading font-semibold text-lg text-gray-700">Choose Donation Amount</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={selectedAmount === 50 && !isCustomAmount ? "default" : "outline"}
              onClick={() => selectAmount(50)}
              className="h-12 text-lg"
            >
              $50
            </Button>
            
            <Button
              type="button"
              variant={selectedAmount === 100 && !isCustomAmount ? "default" : "outline"}
              onClick={() => selectAmount(100)}
              className="h-12 text-lg"
            >
              $100
            </Button>
            
            <Button
              type="button"
              variant={selectedAmount === 250 && !isCustomAmount ? "default" : "outline"}
              onClick={() => selectAmount(250)}
              className="h-12 text-lg"
            >
              $250
            </Button>
            
            <Button
              type="button"
              variant={selectedAmount === 500 && !isCustomAmount ? "default" : "outline"}
              onClick={() => selectAmount(500)}
              className="h-12 text-lg"
            >
              $500
            </Button>
          </div>
          
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      min="5"
                      className="pl-8"
                      onChange={(e) => handleCustomAmountChange(e)}
                      value={isCustomAmount ? selectedAmount : ""}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Donation Frequency</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="one-time" id="one-time" />
                    <Label htmlFor="one-time">One-time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">Monthly</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Project (Optional)</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="General Fund (All Projects)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="general">General Fund (All Projects)</SelectItem>
                  {projects && projects.map(project => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
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
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full py-6 text-lg"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Processing..." : "Donate Now"}
        </Button>
        
        <div className="text-center text-sm text-gray-500">
          <p>Secure payment processing. 100% of your donation goes directly to solar installations.</p>
        </div>
      </form>
    </Form>
  );
}
