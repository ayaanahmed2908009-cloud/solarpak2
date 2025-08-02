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
  Eye
} from "lucide-react";

import { useWorkerAuth, useWorkerList, useCreateEmployee, useUpdateEmployee } from "@/hooks/useWorkerAuth";
import { useToast } from "@/hooks/use-toast";
import type { Worker, WorkerRegisterInput } from "@shared/worker-schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workerRegisterSchema } from "@shared/worker-schema";

export default function AdminPanel() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [createEmployeeOpen, setCreateEmployeeOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Worker | null>(null);
  
  const { worker: currentUser } = useWorkerAuth();
  const { data: workers = [], isLoading } = useWorkerList();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/worker/dashboard")} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = 
      worker.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.email.toLowerCase().includes(searchQuery.toLowerCase());
    
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
        description: error.message || "Failed to create employee account",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEmployee = async (data: Partial<Worker>) => {
    if (!editingEmployee) return;
    
    try {
      await updateEmployee.mutateAsync({
        employeeId: editingEmployee.id,
        data,
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
        {/* Filters */}
        <div className={`${isFounder ? 'bg-gradient-to-r from-white to-yellow-50 border border-yellow-200' : 'bg-gradient-to-r from-white to-blue-50 border border-blue-200'} rounded-2xl shadow-xl mb-8 p-6`}>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isFounder ? 'text-yellow-400' : 'text-purple-400'} h-5 w-5`} />
                <Input
                  placeholder={isFounder ? "🌟 Search for golden team members..." : "🔍 Search for amazing team members..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-12 pr-4 py-3 text-lg border-2 ${isFounder ? 'border-yellow-200 focus:border-yellow-500' : 'border-purple-200 focus:border-purple-500'} rounded-xl bg-white/70 backdrop-blur-sm`}
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className={`w-48 ${isFounder ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'} text-white border-0 rounded-xl shadow-lg`}>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={isFounder ? "🏛️ Department" : "🏢 Department"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="events">🤝 Events & Community Outreach</SelectItem>
                  <SelectItem value="social-media">📱 Social Media</SelectItem>
                  <SelectItem value="sponsorships">💰 Sponsorships & Fundraising</SelectItem>
                  <SelectItem value="healthcare">🔬 Predictive Systems & Healthcare</SelectItem>
                  <SelectItem value="management">👑 Management</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className={`w-40 ${isFounder ? 'bg-gradient-to-r from-orange-500 to-yellow-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'} text-white border-0 rounded-xl shadow-lg`}>
                  <Shield className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={isFounder ? "👑 Role" : "🛡️ Role"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="worker">👨‍💼 Employee</SelectItem>
                  <SelectItem value="manager">👑 Director</SelectItem>
                  <SelectItem value="admin">🔥 Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Employee List */}
        <div className={`${isFounder ? 'bg-gradient-to-br from-white via-yellow-50 to-amber-50 border border-yellow-200' : 'bg-gradient-to-br from-white via-purple-50 to-blue-50 border border-purple-200'} rounded-2xl shadow-xl overflow-hidden`}>
          <div className={`${isFounder ? 'bg-gradient-to-r from-yellow-600 to-amber-600' : 'bg-gradient-to-r from-purple-600 to-blue-600'} text-white p-6`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">Team Members ({filteredWorkers.length})</h2>
            </div>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className={`animate-spin rounded-full h-12 w-12 border-4 ${isFounder ? 'border-yellow-300 border-t-yellow-600' : 'border-purple-300 border-t-purple-600'} mx-auto`}></div>
                <p className={`${isFounder ? 'text-yellow-600' : 'text-purple-600'} font-medium mt-4 text-lg`}>
                  {isFounder ? 'Loading golden team members... ⭐' : 'Loading amazing team members... ✨'}
                </p>
              </div>
            ) : filteredWorkers.length === 0 ? (
              <div className={`${isFounder ? 'bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100' : 'bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100'} rounded-2xl p-12 text-center`}>
                <Users className={`h-16 w-16 ${isFounder ? 'text-yellow-400' : 'text-purple-400'} mx-auto mb-6`} />
                <h3 className={`text-xl font-semibold ${isFounder ? 'text-yellow-800' : 'text-purple-800'} mb-2`}>No team members found</h3>
                <p className={`${isFounder ? 'text-yellow-600' : 'text-purple-600'}`}>
                  {isFounder ? 'No golden team members match your search criteria. Try adjusting your filters! 🌟' : 'No employees match your search criteria. Try adjusting your filters! 🔍'}
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredWorkers.map((worker) => (
                  <div key={worker.id} className={`${isFounder ? 'bg-gradient-to-br from-white via-yellow-50 to-amber-50 border border-yellow-200' : 'bg-gradient-to-br from-white via-blue-50 to-purple-50 border border-purple-200'} rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-200 hover:shadow-2xl`}>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${isFounder ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 'bg-gradient-to-r from-purple-500 to-blue-500'} shadow-lg`}>
                            <span className="text-xl font-bold text-white">
                              {worker.firstName?.[0]}{worker.lastName?.[0]}
                            </span>
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-800">{worker.firstName} {worker.lastName}</h3>
                              <Badge className={`${getRoleBadgeColor(worker.role)} px-3 py-1 rounded-xl font-medium`}>
                                {worker.role.toUpperCase()}
                              </Badge>
                              {!worker.isActive && (
                                <Badge className="bg-gradient-to-r from-gray-500 to-slate-500 text-white px-3 py-1 rounded-xl">Inactive</Badge>
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="text-gray-700 font-medium">@{worker.username} • {worker.email}</p>
                              <div className="flex items-center gap-2">
                                <span className={`${isFounder ? 'bg-gradient-to-r from-orange-500 to-yellow-500' : 'bg-gradient-to-r from-emerald-500 to-green-500'} text-white px-3 py-1 rounded-xl text-sm font-medium`}>
                                  {formatDepartmentName(worker.department)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className={`${isFounder ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600' : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'} text-white rounded-xl p-3`}>
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => {
                              setEditingEmployee(worker);
                              editForm.reset({
                                firstName: worker.firstName || '',
                                lastName: worker.lastName || '',
                                email: worker.email,
                                role: worker.role,
                                department: worker.department || "",
                                isActive: worker.isActive,
                              });
                            }}>
                              <Edit className="h-4 w-4 mr-2" />
                              {isFounder ? '⚡ Edit' : '✏️ Edit'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/worker/admin/activity/${worker.id}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              {isFounder ? '🌟 View Activity' : '👁️ View Activity'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Employee Dialog */}
      <Dialog open={!!editingEmployee} onOpenChange={() => setEditingEmployee(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update employee information and permissions.
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
                        <Input {...field} />
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
                        <Input {...field} />
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
                      <Input type="email" {...field} />
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
  );
}