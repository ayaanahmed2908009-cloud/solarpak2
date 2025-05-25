import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@/hooks/useAuth";

// Helper function to get badge color based on membership tier
const getMembershipBadgeColor = (tier: string) => {
  switch (tier) {
    case 'platinum':
      return 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600';
    case 'gold':
      return 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600';
    case 'silver':
      return 'bg-gradient-to-r from-slate-300 to-slate-400 hover:from-slate-400 hover:to-slate-500';
    case 'bronze':
      return 'bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

// User Management Table Component for Admin
function UserManagementTable() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest("GET", "/api/admin/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const updateUserRole = async (userId: number, role: string) => {
    try {
      const response = await apiRequest("PATCH", `/api/admin/users/${userId}/role`, { role });
      const updatedUser = await response.json();
      
      // Update local state
      setUsers(users.map(user => user.id === userId ? { ...user, role } : user));
      
      toast({
        title: "Success",
        description: `User role updated to ${role}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const updateMembershipTier = async (userId: number, tier: string) => {
    try {
      const response = await apiRequest("PATCH", `/api/admin/users/${userId}/membership`, { tier });
      const updatedUser = await response.json();
      
      // Update local state
      setUsers(users.map(user => user.id === userId ? { ...user, membershipTier: tier } : user));
      
      toast({
        title: "Success",
        description: `User membership updated to ${tier}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update membership tier",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading user data...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-primary/10">
            <th className="px-4 py-2 text-left">User</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Membership</th>
            <th className="px-4 py-2 text-left">Total Donated</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-2">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={user.profileImageUrl || ""} />
                    <AvatarFallback>{user.fullName?.charAt(0) || user.email.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.fullName || "No name"}</div>
                    <div className="text-sm text-gray-500">{user.username || "No username"}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">
                <select 
                  value={user.role}
                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="user">User</option>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="px-4 py-2">
                <select 
                  value={user.membershipTier}
                  onChange={(e) => updateMembershipTier(user.id, e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="none">None</option>
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
              </td>
              <td className="px-4 py-2">${user.totalDonated?.toFixed(2) || "0.00"}</td>
              <td className="px-4 py-2">
                <Button variant="outline" size="sm">View Details</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Member Dashboard Content
function MemberDashboardContent({ user }: { user: User }) {
  const membershipBadgeColor = getMembershipBadgeColor(user.membershipTier || 'none');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>Membership Status</CardTitle>
            <CardDescription>Your current membership level and benefits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.profileImageUrl || ""} />
                <AvatarFallback className="text-xl">{user.fullName?.charAt(0) || user.email.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold">{user.fullName || user.email}</h3>
                <Badge className={membershipBadgeColor}>
                  {user.membershipTier === 'none' ? 'Basic Member' : `${user.membershipTier?.charAt(0).toUpperCase()}${user.membershipTier?.slice(1)} Member`}
                </Badge>
              </div>
            </div>
            
            <div className="pt-4">
              <h4 className="font-semibold mb-2">Membership Benefits:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {user.membershipTier === 'platinum' && (
                  <>
                    <li>VIP access to all impact stories</li>
                    <li>Monthly video calls with families</li>
                    <li>Named recognition on a solar installation</li>
                    <li>Quarterly impact reports</li>
                    <li>All Gold, Silver, and Bronze benefits</li>
                  </>
                )}
                {user.membershipTier === 'gold' && (
                  <>
                    <li>Exclusive access to impact stories</li>
                    <li>Annual video call with beneficiary families</li>
                    <li>Quarterly impact reports</li>
                    <li>All Silver and Bronze benefits</li>
                  </>
                )}
                {user.membershipTier === 'silver' && (
                  <>
                    <li>Priority access to impact updates</li>
                    <li>Personalized thank you messages</li>
                    <li>All Bronze benefits</li>
                  </>
                )}
                {user.membershipTier === 'bronze' || user.membershipTier === 'none' ? (
                  <>
                    <li>Access to member-only updates</li>
                    <li>Monthly newsletter</li>
                    <li>Impact statistics</li>
                  </>
                ) : null}
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => window.location.href = "/#donate"}>
              Upgrade Membership
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="w-full md:w-2/3">
          <CardHeader>
            <CardTitle>Your Impact</CardTitle>
            <CardDescription>See how your contributions are making a difference</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold">${user.totalDonated?.toFixed(2) || "0.00"}</p>
                <p className="text-sm">Total Donated</p>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold">{Math.floor((user.totalDonated || 0) / 200) || 0}</p>
                <p className="text-sm">Solar Panels Funded</p>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold">{Math.floor((user.totalDonated || 0) / 1000) || 0}</p>
                <p className="text-sm">Families Helped</p>
              </div>
            </div>
            
            <div className="pt-4">
              <h4 className="font-semibold mb-2">Latest Updates:</h4>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium">New Solar Installation in Sindh</h5>
                  <p className="text-sm text-gray-600">Our team just completed a new installation that will help 5 families with consistent electricity.</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium">Impact Report: Q2 2025</h5>
                  <p className="text-sm text-gray-600">View our latest quarterly report detailing all installations and their impact.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Admin Dashboard Content
function AdminDashboardContent() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Administrator Dashboard</CardTitle>
          <CardDescription>Manage users, content, and view platform analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users">
            <TabsList className="mb-4">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="content">Content Management</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <UserManagementTable />
            </TabsContent>
            
            <TabsContent value="content">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Content Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto py-8 flex flex-col items-center justify-center">
                    <span className="text-xl mb-2">Impact Stories</span>
                    <span className="text-sm text-gray-500">Add or edit impact stories</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-8 flex flex-col items-center justify-center">
                    <span className="text-xl mb-2">Testimonials</span>
                    <span className="text-sm text-gray-500">Manage testimonials</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-8 flex flex-col items-center justify-center">
                    <span className="text-xl mb-2">Projects</span>
                    <span className="text-sm text-gray-500">Update active projects</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Platform Analytics</h3>
                <p>Analytics dashboard coming soon.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access your dashboard",
      });
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate, toast]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">
        {user.role === 'admin' ? 'Admin Dashboard' : 'Member Dashboard'}
      </h1>
      
      {user.role === 'admin' ? (
        <AdminDashboardContent />
      ) : (
        <MemberDashboardContent user={user} />
      )}
    </div>
  );
}