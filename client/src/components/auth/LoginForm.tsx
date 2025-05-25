import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/login", {
        email: data.email,
        password: data.password,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to log in");
      }

      toast({
        title: "Login successful",
        description: "Welcome back to SolarPak!",
      });
      
      // Redirect to home page
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Incorrect email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Welcome back</h2>
        <p className="text-gray-600 mt-2">
          Log in to track your donations and continue supporting solar power in Pakistan
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@email.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Link 
              href="/forgot-password" 
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button 
            type="submit" 
            className="w-full mt-6" 
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </Form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
      
      <div className="relative mt-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <Button variant="outline" className="w-full" disabled={isLoading}>
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </Button>
        <Button variant="outline" className="w-full" disabled={isLoading}>
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M17.569 12.6254C17.5996 15.2582 19.8115 16.3307 19.8553 16.3518C19.8334 16.4263 19.4499 17.7071 18.457 18.9879C17.6142 20.0815 16.7331 21.1751 15.3915 21.1962C14.0719 21.2174 13.6665 20.4658 12.1428 20.4658C10.6412 20.4658 10.1935 21.1751 8.9516 21.2174C7.6742 21.2597 6.6456 19.9996 5.7812 18.9059C4.0169 16.6884 2.7077 12.5721 4.5144 9.84983C5.4103 8.48977 6.9969 7.62707 8.7175 7.60587C9.9759 7.58468 11.1447 8.4039 11.9008 8.4039C12.6569 8.4039 14.0938 7.41028 15.6375 7.55547C16.2999 7.58468 17.5554 7.81306 18.3982 8.55161C18.3039 8.61401 16.7167 9.53912 16.7386 11.5309C16.7167 11.5732 17.5335 12.0187 17.569 12.6254ZM15.0073 5.95472C15.6697 5.16377 16.1187 4.02862 15.9963 2.8723C15.0073 2.91505 13.7668 3.51701 13.0773 4.30796C12.4652 5.00512 11.9118 6.16147 12.0558 7.29664C13.1534 7.3712 14.3447 6.74564 15.0073 5.95472Z" fill="currentColor" />
          </svg>
          Apple
        </Button>
      </div>
    </div>
  );
}