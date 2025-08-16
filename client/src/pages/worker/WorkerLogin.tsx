import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, LogIn, Sun, Zap, Shield, Users, ArrowRight } from "lucide-react";

import { workerLoginSchema, type WorkerLoginInput } from "@shared/worker-schema";
import { useWorkerAuth } from "@/hooks/useWorkerAuth";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import logoPath from "@assets/solarpak_1755365112937.jpeg";

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Solar Panels Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 transform rotate-12 rounded-lg"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-500 transform -rotate-12 rounded-lg"></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 bg-gradient-to-r from-orange-400 to-red-500 transform rotate-45 rounded-lg"></div>
        <div className="absolute bottom-20 right-32 w-18 h-18 bg-gradient-to-r from-yellow-500 to-amber-500 transform -rotate-45 rounded-lg"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Branding Section */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 relative">
            <div className="w-24 h-24 mx-auto bg-white rounded-full shadow-2xl border-4 border-yellow-400 flex items-center justify-center overflow-hidden">
              <img 
                src={logoPath} 
                alt="SolarPak Logo" 
                className="w-20 h-20 object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.style.display = 'flex';
                  }
                }}
              />
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full hidden items-center justify-center">
                <Sun className="h-12 w-12 text-white" />
              </div>
            </div>
            {/* Animated glow effect */}
            <div className="absolute inset-0 w-24 h-24 mx-auto bg-yellow-400 rounded-full animate-pulse opacity-20"></div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
            SolarPak
          </h1>
          <p className="text-amber-700 text-lg font-medium mb-1">Worker Portal</p>
          <p className="text-amber-600 text-sm">Powering Pakistan's Solar Future</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white rounded-t-lg">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Shield className="h-6 w-6" />
              <Zap className="h-5 w-5" />
              <Sun className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Team Access</CardTitle>
            <CardDescription className="text-yellow-100">
              Secure login for SolarPak team members
            </CardDescription>
          </CardHeader>
        
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6 p-8">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-700 font-semibold flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Username</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your team username"
                          className="h-12 border-2 border-amber-200 focus:border-yellow-400 focus:ring-yellow-300 bg-amber-50/50"
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
                      <FormLabel className="text-amber-700 font-semibold flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>Password</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your secure password"
                            className="h-12 border-2 border-amber-200 focus:border-yellow-400 focus:ring-yellow-300 bg-amber-50/50 pr-12"
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
                              <EyeOff className="h-4 w-4 text-amber-600" />
                            ) : (
                              <Eye className="h-4 w-4 text-amber-600" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4 p-8 pt-0">
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-600 hover:via-amber-600 hover:to-orange-600 text-white font-semibold text-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <LogIn className="h-5 w-5" />
                      <span>Access Dashboard</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
                
                <div className="text-center text-sm text-amber-700">
                  Need team access?{" "}
                  <Link href="/worker/register">
                    <span className="text-orange-600 hover:text-orange-700 font-semibold hover:underline cursor-pointer">
                      Register here
                    </span>
                  </Link>
                </div>
                
                <div className="text-center">
                  <Link href="/">
                    <span className="text-sm text-amber-600 hover:text-amber-700 cursor-pointer flex items-center justify-center space-x-1">
                      <span>←</span>
                      <span>Back to SolarPak main site</span>
                    </span>
                  </Link>
                </div>

                {/* Security Notice */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                  <div className="flex items-center space-x-2 text-amber-700 text-xs">
                    <Shield className="h-3 w-3" />
                    <span>Secure team portal - All activity is monitored</span>
                  </div>
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {/* Footer Branding */}
        <div className="text-center mt-6 text-amber-600 text-sm">
          <p>© 2025 SolarPak - Illuminating Pakistan's Future</p>
        </div>
      </div>
    </div>
  );
}