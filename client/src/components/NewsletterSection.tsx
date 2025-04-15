import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export default function NewsletterSection() {
  const { toast } = useToast();
  
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: NewsletterFormValues) => {
    try {
      await apiRequest("POST", "/api/subscribe", { email: data.email });
      
      toast({
        title: "Thank you!",
        description: "You have successfully subscribed to our newsletter.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem with your subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-12 bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">Stay Updated on Our Progress</h2>
          <p className="text-gray-300 mb-6">
            Join our newsletter to receive updates on projects, success stories, and how your donations are making a difference.
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2 justify-center max-w-lg mx-auto">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your email address"
                        className="px-4 py-3 rounded-md flex-grow bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-primary focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-white mt-1" />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="px-6 py-3 font-heading font-semibold rounded-md whitespace-nowrap"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </Form>
          
          <p className="text-sm text-gray-400 mt-4">
            We respect your privacy. You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
