import { useWorkerAuth } from "@/hooks/useWorkerAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function TestPerformance() {
  const [, navigate] = useLocation();
  const { worker: currentUser } = useWorkerAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Performance Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-4">
          <h2 className="text-xl font-semibold mb-4">Current User Info:</h2>
          <p>Username: {currentUser?.username}</p>
          <p>Role: {currentUser?.role}</p>
          <p>ID: {currentUser?.id}</p>
          <p>Name: {currentUser?.firstName} {currentUser?.lastName}</p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/worker/performance-report")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
          >
            GO TO MY PERFORMANCE REPORT
          </Button>

          <Button 
            onClick={() => navigate("/worker/dashboard")}
            variant="outline"
            className="w-full"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}