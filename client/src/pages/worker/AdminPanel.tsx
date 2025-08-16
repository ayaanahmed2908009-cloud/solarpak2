import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Users, 
  UserPlus, 
  Settings, 
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Eye,
  Clock,
  Activity
} from "lucide-react";

import { useWorkerAuth, useWorkerList, useCreateEmployee, useUpdateEmployee } from "@/hooks/useWorkerAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { Worker, WorkerRegisterInput } from "@shared/worker-schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workerRegisterSchema } from "@shared/worker-schema";

type LoginStatusWorker = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  department: string;
  role: string;
  lastLogin: string | null;
  isActive: boolean;
};

export default function AdminPanel() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [createEmployeeOpen, setCreateEmployeeOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Worker | null>(null);
  const [activeTab, setActiveTab] = useState("workers");
  
  const { worker: currentUser } = useWorkerAuth();
  const { data: workers = [], isLoading } = useWorkerList();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  
  // Fetch login status data (admin only)
  const { data: loginStatusData = [], isLoading: loginStatusLoading } = useQuery<LoginStatusWorker[]>({
    queryKey: ["/worker/api/workers/login-status"],
    enabled: currentUser?.role === "admin",
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  // Check if current user is founder Ayaan Ahmed (admin account)
  const isFounder = currentUser?.username === "admin";
  const { toast } = useToast();

  const createForm = useForm<WorkerRegisterInput>({
    resolver: zodResolver(workerRegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      department: "",
      role: "worker",
    },
  });

  const editForm = useForm<Partial<Worker>>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "worker",
      department: "",
      isActive: true,
    },
  });

  if (currentUser?.role !== "admin" && currentUser?.role !== "manager") {
    navigate("/worker/dashboard");
    return null;
  }

  // Filter workers based on search and selections
  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch = 
      worker.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = selectedDepartment === "all" || worker.department === selectedDepartment;
    const matchesRole = selectedRole === "all" || worker.role === selectedRole;
    
    return matchesSearch && matchesDepartment && matchesRole;
  });

  const handleCreateEmployee = async (data: WorkerRegisterInput) => {
    try {
      await createEmployee.mutateAsync(data);
      toast({
        title: "Employee created",
        description: "New employee account has been created successfully.",
      });
      setCreateEmployeeOpen(false);
      createForm.reset();
    } catch (error: any) {
      toast({
        title: "Creation failed",
        description: error.message || "Failed to create employee",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEmployee = async (data: Partial<Worker>) => {
    if (!editingEmployee) return;
    
    try {
      await updateEmployee.mutateAsync({
        id: editingEmployee.id,
        updates: data,
      });
      toast({
        title: "Employee updated",
        description: "Employee information has been updated successfully.",
      });
      setEditingEmployee(null);
      editForm.reset();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update employee",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    if (isFounder) {
      switch (role) {
        case 'admin': return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg';
        case 'manager': return 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg';
        default: return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg';
      }
    }
    switch (role) {
      case 'admin': return 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg';
      case 'manager': return 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg';
      default: return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg';
    }
  };

  const formatDepartmentName = (department: string | undefined) => {
    if (!department) return 'Unassigned';
    switch (department) {
      case 'events': return 'Events & Community Outreach';
      case 'social-media': return 'Social Media';
      case 'sponsorships': return 'Sponsorships & Fundraising';
      case 'healthcare': return 'Predictive Systems & Healthcare';
      case 'management': return 'Management';
      default: return department;
    }
  };

  const getDepartmentColor = (department: string | undefined) => {
    if (!department) return 'bg-gradient-to-r from-gray-500 to-slate-500';
    switch (department) {
      case 'social-media': return 'bg-gradient-to-r from-pink-500 to-rose-500';
      case 'events': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'sponsorships': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'healthcare': return 'bg-gradient-to-r from-purple-500 to-indigo-500';
      case 'management': return 'bg-gradient-to-r from-orange-500 to-yellow-500';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return "Never logged in";
    const loginDate = new Date(lastLogin);
    const now = new Date();
    const diffInMs = now.getTime() - loginDate.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)} days ago`;
    } else {
      return loginDate.toLocaleDateString();
    }
  };

  const getLoginStatusColor = (lastLogin: string | null) => {
    if (!lastLogin) return "bg-gray-500";
    const loginDate = new Date(lastLogin);
    const now = new Date();
    const diffInHours = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) return "bg-green-500";
    if (diffInHours < 72) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className={`min-h-screen ${isFounder ? 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50'}`}>
      {/* Header */}
      <div className={`${isFounder ? 'bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600' : 'bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600'} text-white shadow-xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                onClick={() => navigate("/worker/dashboard")}
                className="text-white hover:bg-white/20 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className={`text-3xl font-bold bg-gradient-to-r ${isFounder ? 'from-white to-yellow-100' : 'from-white to-blue-100'} bg-clip-text text-transparent`}>
                  {isFounder ? '🌟 Founder Dashboard' : '👑 Admin Panel'}
                </h1>
                <p className={`${isFounder ? 'text-yellow-100' : 'text-blue-100'} font-medium`}>
                  {isFounder ? 'Lead your solar revolution with golden vision' : 'Manage your vibrant team with power and style'}
                </p>
              </div>
            </div>
            
            <Dialog open={createEmployeeOpen} onOpenChange={setCreateEmployeeOpen}>
              <DialogTrigger asChild>
                <Button className={`${isFounder ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600' : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600'} text-white font-semibold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200`}>
                  <UserPlus className="h-5 w-5 mr-2" />
                  {isFounder ? '⭐ Create Employee' : '✨ Create Employee'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Employee Account</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new employee account.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...createForm}>
                  <form onSubmit={createForm.handleSubmit(handleCreateEmployee)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="First name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={createForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={createForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="worker">Employee</SelectItem>
                                <SelectItem value="manager">Director</SelectItem>
                                {currentUser?.role === "admin" && (
                                  <SelectItem value="admin">Admin</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={createForm.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="events">Events & Community Outreach</SelectItem>
                                <SelectItem value="social-media">Social Media</SelectItem>
                                <SelectItem value="sponsorships">Sponsorships & Fundraising</SelectItem>
                                <SelectItem value="healthcare">Predictive Systems & Healthcare</SelectItem>
                                <SelectItem value="management">Management</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={createForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Confirm password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setCreateEmployeeOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createEmployee.isPending}>
                        {createEmployee.isPending ? "Creating..." : "Create Employee"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="workers" className="flex items-center gap-2 data-[state=active]:bg-white">
              <Users className="h-4 w-4" />
              Team Management
            </TabsTrigger>
            <TabsTrigger value="login-activity" className="flex items-center gap-2 data-[state=active]:bg-white">
              <Activity className="h-4 w-4" />
              Login Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workers">
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 items-center w-full lg:w-auto">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="w-48 border-gray-300">
                        <SelectValue placeholder="Filter by department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="events">Events & Community</SelectItem>
                        <SelectItem value="social-media">Social Media</SelectItem>
                        <SelectItem value="sponsorships">Sponsorships</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="management">Management</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="w-32 border-gray-300">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="worker">Worker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-gray-600">
                    {filteredWorkers.length} employees
                  </Badge>
                </div>
              </div>
            </div>

            {/* Employees Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkers.map((worker) => (
                <Card key={worker.id} className="bg-white shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-full flex items-center justify-center">
                          <div className={`${getDepartmentColor(worker.department)} text-white text-lg h-full w-full rounded-full flex items-center justify-center font-bold`}>
                            {worker.firstName?.[0]}{worker.lastName?.[0]}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{worker.firstName} {worker.lastName}</h3>
                          <p className="text-sm text-gray-500">@{worker.username}</p>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => {
                            setEditingEmployee(worker);
                            editForm.reset({
                              firstName: worker.firstName || '',
                              lastName: worker.lastName || '',
                              email: worker.email || '',
                              role: worker.role,
                              department: worker.department || '',
                              isActive: worker.isActive,
                            });
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Role:</span>
                        <Badge className={getRoleBadgeColor(worker.role)}>
                          {worker.role}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Department:</span>
                        <span className="text-sm">{formatDepartmentName(worker.department)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Status:</span>
                        <Badge variant={worker.isActive ? "default" : "secondary"}>
                          {worker.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm text-gray-800 truncate max-w-32">{worker.email || 'N/A'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredWorkers.length === 0 && (
              <Card className="bg-white shadow-lg">
                <CardContent className="p-12 text-center">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Team Members Found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery || selectedDepartment !== "all" || selectedRole !== "all" 
                      ? "Try adjusting your search filters" 
                      : "Start building your team by creating employee accounts"
                    }
                  </p>
                  {(!searchQuery && selectedDepartment === "all" && selectedRole === "all") && (
                    <Button onClick={() => setCreateEmployeeOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create First Employee
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="login-activity">
            <Card className="bg-white shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    <CardTitle>Team Login Activity</CardTitle>
                  </div>
                  <Badge className="bg-white/20 text-white">
                    {loginStatusData.length} members
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loginStatusLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading login activity...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {loginStatusData.map((worker) => (
                      <div key={worker.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-full flex items-center justify-center">
                            <div className={`${getDepartmentColor(worker.department)} text-white text-sm h-full w-full rounded-full flex items-center justify-center`}>
                              {worker.firstName?.[0]}{worker.lastName?.[0]}
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{worker.firstName} {worker.lastName}</p>
                            <p className="text-sm text-gray-500">@{worker.username}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getRoleBadgeColor(worker.role)}>
                                {worker.role}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {formatDepartmentName(worker.department)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getLoginStatusColor(worker.lastLogin)}`}></div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-700">
                              {formatLastLogin(worker.lastLogin)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {worker.isActive ? "Active" : "Inactive"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {loginStatusData.length === 0 && (
                      <div className="text-center py-8">
                        <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No team members found</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Employee Dialog */}
        <Dialog open={!!editingEmployee} onOpenChange={(open) => !open && setEditingEmployee(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Employee Information</DialogTitle>
              <DialogDescription>
                Update employee details and permissions.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleUpdateEmployee)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="worker">Employee</SelectItem>
                            <SelectItem value="manager">Director</SelectItem>
                            {currentUser?.role === "admin" && (
                              <SelectItem value="admin">Admin</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="events">Events & Community Outreach</SelectItem>
                            <SelectItem value="social-media">Social Media</SelectItem>
                            <SelectItem value="sponsorships">Sponsorships & Fundraising</SelectItem>
                            <SelectItem value="healthcare">Predictive Systems & Healthcare</SelectItem>
                            <SelectItem value="management">Management</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setEditingEmployee(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateEmployee.isPending}>
                    {updateEmployee.isPending ? "Updating..." : "Update Employee"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}