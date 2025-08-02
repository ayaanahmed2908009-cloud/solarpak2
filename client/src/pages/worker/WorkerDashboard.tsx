import { useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Users, 
  Activity, 
  LogOut, 
  UserCog, 
  Calendar,
  BarChart3,
  Shield,
  Clock
} from "lucide-react";

import { useWorkerAuth, useWorkerActivity } from "@/hooks/useWorkerAuth";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function WorkerDashboard() {
  const [, navigate] = useLocation();
  const { worker, isAuthenticated, isLoading, logout } = useWorkerAuth();
  const { toast } = useToast();

  const { data: activityLogs = [] } = useWorkerActivity(worker?.id || "");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/worker/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/worker/login");
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!worker) {
    return null;
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'manager': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case 'events': return <Calendar className="h-4 w-4" />;
      case 'social-media': return <Users className="h-4 w-4" />;
      case 'sponsorships': return <BarChart3 className="h-4 w-4" />;
      case 'healthcare': return <Shield className="h-4 w-4" />;
      default: return <UserCog className="h-4 w-4" />;
    }
  };

  const formatDepartmentName = (department: string) => {
    switch (department) {
      case 'events': return 'Events & Community Outreach';
      case 'social-media': return 'Social Media';
      case 'sponsorships': return 'Sponsorships & Fundraising';
      case 'healthcare': return 'Predictive Systems & Healthcare';
      default: return department;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">SolarPak Worker Portal</h1>
                <p className="text-sm text-gray-500">Welcome back, {worker.firstName}!</p>
              </div>
            </div>
            
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{worker.firstName} {worker.lastName}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium">{worker.username}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{worker.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <Badge className={getRoleBadgeColor(worker.role)}>
                  {worker.role.charAt(0).toUpperCase() + worker.role.slice(1)}
                </Badge>
              </div>
              
              {worker.department && (
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getDepartmentIcon(worker.department)}
                    <span className="font-medium">{formatDepartmentName(worker.department)}</span>
                  </div>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">
                  {new Date(worker.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              {worker.lastLogin && (
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="font-medium">
                    {new Date(worker.lastLogin).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Logs */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your recent actions and login history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activityLogs.length > 0 ? (
                <div className="space-y-4">
                  {activityLogs.slice(0, 10).map((log: any, index: number) => (
                    <div key={log.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 capitalize">
                            {log.action.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(log.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {log.details && (
                          <p className="text-sm text-gray-600">{log.details}</p>
                        )}
                        {log.ipAddress && (
                          <p className="text-xs text-gray-400">IP: {log.ipAddress}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No activity logs yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions for All Workers */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Access management tools and features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                variant="outline"
                onClick={() => navigate("/worker/tasks")}
                className="h-20 flex flex-col items-center justify-center"
              >
                <BarChart3 className="h-6 w-6 mb-2" />
                <span>Task Manager</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate("/worker/events")}
                className="h-20 flex flex-col items-center justify-center"
              >
                <Calendar className="h-6 w-6 mb-2" />
                <span>Event Manager</span>
              </Button>

              {(worker.role === 'admin' || worker.role === 'manager') && (
                <Button 
                  variant="outline"
                  onClick={() => navigate("/worker/admin")}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Shield className="h-6 w-6 mb-2" />
                  <span>Admin Panel</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}