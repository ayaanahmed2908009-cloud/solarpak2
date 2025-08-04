import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  User,
  MoreVertical,
  Edit,
  Trash2
} from "lucide-react";

import { useWorkerAuth, useTasks, useCreateTask, useUpdateTask, useDeleteTask, useWorkerList } from "@/hooks/useWorkerAuth";
import { useToast } from "@/hooks/use-toast";
import type { CreateTaskInput, Task } from "@shared/worker-schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema } from "@shared/worker-schema";

export default function TaskManager() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const { worker: currentUser } = useWorkerAuth();
  const { data: tasks = [], isLoading } = useTasks();
  const { data: workers = [] } = useWorkerList();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const { toast } = useToast();
  
  // Check if current user is founder Ayaan Ahmed (admin account)
  const isFounder = currentUser?.username === "admin";

  const createForm = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
      assignedTo: undefined,
      dueDate: undefined,
    },
  });

  const editForm = useForm<Partial<Task>>({
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
      assignedTo: undefined,
    },
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateTask = async (data: CreateTaskInput) => {
    console.log("handleCreateTask called with data:", data);
    console.log("Form errors:", createForm.formState.errors);
    try {
      // Handle "unassigned" value
      const taskData = {
        ...data,
        assignedTo: data.assignedTo === "unassigned" ? undefined : data.assignedTo,
      };
      console.log("Processed task data:", taskData);
      await createTask.mutateAsync(taskData);
      toast({
        title: "Task created",
        description: "New task has been created successfully.",
      });
      setCreateTaskOpen(false);
      createForm.reset();
    } catch (error: any) {
      console.error("Task creation error:", error);
      toast({
        title: "Creation failed",
        description: error.message || "Failed to create task",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (data: Partial<Task>) => {
    if (!editingTask) return;
    
    try {
      // Handle "unassigned" value
      const taskData = {
        ...data,
        assignedTo: data.assignedTo === "unassigned" ? null : data.assignedTo,
      };
      await updateTask.mutateAsync({
        taskId: editingTask.id,
        data: taskData,
      });
      toast({
        title: "Task updated",
        description: "Task has been updated successfully.",
      });
      setEditingTask(null);
      editForm.reset();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask.mutateAsync(taskId);
      toast({
        title: "Task deleted",
        description: "Task has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Deletion failed",
        description: error.message || "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    if (isFounder) {
      switch (priority) {
        case 'urgent': return 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg';
        case 'high': return 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg';
        case 'medium': return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg';
        case 'low': return 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg';
        default: return 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg';
      }
    }
    switch (priority) {
      case 'urgent': return 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg';
      case 'high': return 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg';
      case 'low': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'in_progress': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'pending': return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getWorkerName = (workerId: string | null) => {
    if (!workerId) return "Unassigned";
    const worker = workers.find(w => w.id === workerId);
    return worker ? `${worker.firstName} ${worker.lastName}` : "Unknown Worker";
  };

  const canEditTask = (task: Task) => {
    if (!currentUser) return false;
    return currentUser.role === "admin" || 
           currentUser.role === "manager" || 
           task.assignedBy === currentUser.id ||
           task.assignedTo === currentUser.id;
  };

  const canDeleteTask = (task: Task) => {
    if (!currentUser) return false;
    return currentUser.role === "admin" || 
           currentUser.role === "manager" || 
           task.assignedBy === currentUser.id;
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
                  {isFounder ? '🌟 Founder Task Manager' : '⚡ Task Manager'}
                </h1>
                <p className={`${isFounder ? 'text-yellow-100' : 'text-blue-100'} font-medium`}>
                  {isFounder ? 'Manage your golden solar mission with precision' : 'Assign and track team tasks with vibrant energy'}
                </p>
              </div>
            </div>
            
            <Dialog open={createTaskOpen} onOpenChange={setCreateTaskOpen}>
              <DialogTrigger asChild>
                <Button className={`${isFounder ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600' : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600'} text-white font-semibold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200`}>
                  <Plus className="h-5 w-5 mr-2" />
                  {isFounder ? '⭐ Create Mission' : '✨ Create Task'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Create and assign a task to team members.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...createForm}>
                  <form 
                    onSubmit={(e) => {
                      console.log("Form submitted!");
                      createForm.handleSubmit(handleCreateTask)(e);
                    }} 
                    className="space-y-4"
                  >
                    <FormField
                      control={createForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Task Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter task title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={createForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the task details" 
                              {...field} 
                              value={field.value || ""}
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={createForm.control}
                        name="assignedTo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assign To</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || undefined}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select worker" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="unassigned">Unassigned</SelectItem>
                                {/* Group by departments */}
                                {["manager", "worker"].map(roleType => (
                                  <div key={roleType}>
                                    {workers
                                      .filter(worker => worker.username !== "admin" && worker.role === roleType)
                                      .sort((a, b) => `${a.department}-${a.firstName}`.localeCompare(`${b.department}-${b.firstName}`))
                                      .map(worker => (
                                        <SelectItem key={worker.id} value={worker.id}>
                                          {worker.firstName} {worker.lastName} ({worker.role === "manager" ? "📋 Manager" : "👤 Worker"} - {worker.department?.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase()) || "General"})
                                        </SelectItem>
                                      ))}
                                  </div>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={createForm.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Due Date (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="datetime-local" 
                              {...field}
                              value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setCreateTaskOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createTask.isPending}
                        onClick={() => {
                          console.log("Create Task button clicked!");
                          console.log("Form is valid:", createForm.formState.isValid);
                          console.log("Form values:", createForm.getValues());
                          console.log("Form errors:", createForm.formState.errors);
                        }}
                      >
                        {createTask.isPending ? "Creating..." : "Create Task"}
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
        <div className="bg-gradient-to-r from-white to-blue-50 rounded-2xl shadow-xl border border-blue-200 mb-8 p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                <Input
                  placeholder="🔍 Search for amazing tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg border-2 border-purple-200 focus:border-purple-500 rounded-xl bg-white/70 backdrop-blur-sm"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 rounded-xl shadow-lg">
                  <SelectValue placeholder="📊 Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">⏳ Pending</SelectItem>
                  <SelectItem value="in_progress">🚀 In Progress</SelectItem>
                  <SelectItem value="completed">✅ Completed</SelectItem>
                  <SelectItem value="cancelled">❌ Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40 bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 rounded-xl shadow-lg">
                  <SelectValue placeholder="🔥 Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">🟢 Low</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="high">🟠 High</SelectItem>
                  <SelectItem value="urgent">🔴 Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="grid gap-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-300 border-t-purple-600 mx-auto"></div>
              <p className="text-purple-600 font-medium mt-4 text-lg">Loading amazing tasks... ✨</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 rounded-2xl shadow-xl p-12 text-center">
              <Calendar className="h-16 w-16 text-purple-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-purple-800 mb-2">No tasks found</h3>
              <p className="text-purple-600">No tasks match your search criteria. Try adjusting your filters! 🔍</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-xl border border-purple-200 overflow-hidden transform hover:scale-[1.02] transition-all duration-200 hover:shadow-2xl">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white">
                          {getStatusIcon(task.status)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-xl text-gray-800 mb-1">{task.title}</h3>
                          <Badge className={`${getPriorityColor(task.priority)} px-3 py-1 rounded-xl font-medium`}>
                            {task.priority.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-gray-700 mb-4 text-lg leading-relaxed bg-white/60 p-3 rounded-xl">{task.description}</p>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
                        <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-2 rounded-xl">
                          <User className="h-4 w-4" />
                          <span>{getWorkerName(task.assignedTo)}</span>
                        </div>
                        
                        {task.dueDate && (
                          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-xl">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-slate-500 text-white px-3 py-2 rounded-xl">
                          <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl p-3">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {canEditTask(task) && (
                          <DropdownMenuItem onClick={() => {
                            setEditingTask(task);
                            editForm.reset({
                              title: task.title,
                              description: task.description || '',
                              priority: task.priority,
                              status: task.status,
                              assignedTo: task.assignedTo || 'unassigned',
                            });
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            ✏️ Edit Task
                          </DropdownMenuItem>
                        )}
                        {canDeleteTask(task) && (
                          <DropdownMenuItem 
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            🗑️ Delete Task
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update task details and assignment.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleUpdateTask)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={editForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign To</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {workers.map(worker => (
                            <SelectItem key={worker.id} value={worker.id}>
                              {worker.firstName} {worker.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingTask(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateTask.isPending}>
                  {updateTask.isPending ? "Updating..." : "Update Task"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}