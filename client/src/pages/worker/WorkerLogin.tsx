import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, LogIn, Users } from "lucide-react";

import { workerLoginSchema, type WorkerLoginInput } from "@shared/worker-schema";
import { useWorkerAuth } from "@/hooks/useWorkerAuth";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function WorkerLogin() {
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useWorkerAuth();
  const { toast } = useToast();

  const form = useForm<WorkerLoginInput>({
    resolver: zodResolver(workerLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: WorkerLoginInput) => {
    try {
      await login(data);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      // Add a small delay to ensure the auth state is updated
      setTimeout(() => {
        navigate("/worker/dashboard");
      }, 100);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Worker Portal</CardTitle>
          <CardDescription>
            Sign in to access your SolarPak worker dashboard
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        {...field}
                        autoComplete="username"
                      />
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
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                          autoComplete="current-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  "Signing in..."
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
              
              <div className="text-center text-sm text-gray-600">
                Need an account?{" "}
                <Link href="/worker/register">
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    Register here
                  </span>
                </Link>
              </div>
              
              <div className="text-center">
                <Link href="/">
                  <span className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
                    ← Back to main site
                  </span>
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}