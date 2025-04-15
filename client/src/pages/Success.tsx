import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Share2, Home } from "lucide-react";

export default function Success() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Thank You for Your Donation!</CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p>
              Your contribution will help bring sustainable solar power to families in Pakistan suffering from electricity shortages.
            </p>
            
            <div className="bg-primary/10 p-4 rounded-lg my-4">
              <h3 className="font-semibold mb-2 text-secondary">What happens next?</h3>
              <p className="text-sm">
                You'll receive a confirmation email with details of your donation. We'll also keep you updated on the progress of the projects you've helped fund.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => {
                  navigator.share({
                    title: 'I just donated to SolarPak',
                    text: 'I just helped bring solar power to families in Pakistan. Join me in making a difference!',
                    url: window.location.origin,
                  }).catch(() => {
                    // Fallback if Web Share API is not available
                    window.open(
                      `https://twitter.com/intent/tweet?text=I just helped bring solar power to families in Pakistan through SolarPak. Join me in making a difference! ${window.location.origin}`,
                      '_blank'
                    );
                  });
                }}
              >
                <Share2 className="h-4 w-4" />
                Share Your Impact
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Return to Homepage
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
