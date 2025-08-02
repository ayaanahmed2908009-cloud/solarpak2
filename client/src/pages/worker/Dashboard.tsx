import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Users, 
  UserPlus, 
  Calendar, 
  CheckSquare, 
  BarChart3, 
  Settings,
  Bell,
  LogOut,
  ArrowLeft,
  Plus,
  Eye,
  TrendingUp,
  Target,
  Zap
} from "lucide-react";

import { useWorkerAuth, useWorkerList, useTasks } from "@/hooks/useWorkerAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";



export default function WorkerDashboard() {
  const [, navigate] = useLocation();
  const { worker: currentUser } = useWorkerAuth();
  const { data: workers = [] } = useWorkerList();
  const { data: tasks = [] } = useTasks();

  // Check if current user is founder Ayaan Ahmed (admin account)
  const isFounder = currentUser?.username === "admin";
  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "manager";
  const isDirector = currentUser?.role === "manager";
  const isEmployee = currentUser?.role === "worker";

  if (!currentUser) {
    navigate("/worker/login");
    return null;
  }

  // Return appropriate dashboard based on role
  if (isEmployee) {
    return <EmployeeDashboard currentUser={currentUser} isFounder={isFounder} />;
  }
  
  if (isDirector && !isFounder) {
    return <DirectorDashboard currentUser={currentUser} isFounder={isFounder} />;
  }

  const activeTasks = tasks.filter(task => task.status !== "completed");
  const completedTasks = tasks.filter(task => task.status === "completed");
  const urgentTasks = tasks.filter(task => task.priority === "urgent");
  const myTasks = tasks.filter(task => task.assignedTo === currentUser.id);

  const quickActions = [
    {
      title: "Create Task",
      icon: Plus,
      color: isFounder ? "bg-gradient-to-r from-yellow-500 to-amber-500" : "bg-gradient-to-r from-emerald-500 to-green-500",
      action: () => navigate("/worker/tasks"),
      visible: isAdmin
    },
    {
      title: "Create Event",
      icon: Calendar,
      color: isFounder ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-blue-500 to-cyan-500",
      action: () => navigate("/worker/events"),
      visible: isAdmin
    },
    {
      title: "Add Employee",
      icon: UserPlus,
      color: isFounder ? "bg-gradient-to-r from-orange-500 to-yellow-500" : "bg-gradient-to-r from-purple-500 to-pink-500",
      action: () => navigate("/worker/admin"),
      visible: isAdmin
    },
    {
      title: "View Tasks",
      icon: Eye,
      color: isFounder ? "bg-gradient-to-r from-yellow-600 to-amber-600" : "bg-gradient-to-r from-indigo-500 to-purple-500",
      action: () => navigate("/worker/tasks"),
      visible: true
    }
  ].filter(action => action.visible);

  const stats = [
    {
      title: "Total Employees",
      value: workers.length,
      icon: Users,
      change: "+2 this week",
      color: isFounder ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200" : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200",
      iconColor: isFounder ? "text-yellow-600" : "text-green-600",
      visible: isAdmin
    },
    {
      title: "Active Tasks",
      value: activeTasks.length,
      icon: CheckSquare,
      change: `${completedTasks.length} completed`,
      color: isFounder ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200" : "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200",
      iconColor: isFounder ? "text-amber-600" : "text-blue-600",
      visible: true
    },
    {
      title: "My Tasks",
      value: myTasks.length,
      icon: Target,
      change: `${myTasks.filter(t => t.status === "completed").length} done`,
      color: isFounder ? "bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200" : "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200",
      iconColor: isFounder ? "text-orange-600" : "text-purple-600",
      visible: true
    },
    {
      title: "Urgent Items",
      value: urgentTasks.length,
      icon: Zap,
      change: "Needs attention",
      color: isFounder ? "bg-gradient-to-br from-red-50 to-orange-50 border-red-200" : "bg-gradient-to-br from-red-50 to-pink-50 border-red-200",
      iconColor: "text-red-600",
      visible: true
    }
  ].filter(stat => stat.visible);

  return (
    <div className={`min-h-screen ${isFounder ? 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'}`}>
      {/* Header */}
      <div className={`${isFounder ? 'bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600' : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'} text-white shadow-xl border-b-4 ${isFounder ? 'border-yellow-400' : 'border-blue-400'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 ${isFounder ? 'bg-yellow-500' : 'bg-white'} rounded-xl shadow-lg`}>
                <div className={`text-2xl font-bold ${isFounder ? 'text-white' : 'text-blue-600'}`}>
                  {isFounder ? '☀️' : '⚡'}
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {isFounder ? 'SolarPak Founder Portal' : 'SolarPak Worker Dashboard'}
                </h1>
                <p className={`${isFounder ? 'text-yellow-100' : 'text-blue-100'} text-sm`}>
                  {isFounder ? 'Solar Energy Innovation Hub' : 'Administrator Dashboard - Live'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">Welcome back,</p>
                <p className="text-xl font-bold">{currentUser.firstName} {currentUser.lastName}</p>
                <p className={`text-xs ${isFounder ? 'text-yellow-200' : 'text-blue-200'}`}>
                  {isFounder ? 'Founder' : currentUser.role}
                </p>
              </div>
              <div className="h-12 w-12 border-2 border-white rounded-full flex items-center justify-center">
                <div className={`${isFounder ? 'bg-yellow-500' : 'bg-blue-500'} text-white font-bold h-full w-full rounded-full flex items-center justify-center`}>
                  {currentUser.firstName?.[0]}{currentUser.lastName?.[0]}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/worker/login")}
                className="text-white hover:bg-white/20"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <BarChart3 className={`h-5 w-5 ${isFounder ? 'text-yellow-600' : 'text-blue-600'} mr-2`} />
            <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                className={`${action.color} hover:scale-105 transition-all duration-200 text-white h-16 rounded-xl shadow-lg`}
              >
                <action.icon className="h-5 w-5 mr-2" />
                {action.title}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className={`${stat.color} border shadow-lg hover:shadow-xl transition-all duration-200`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Task Management */}
          <Card className={`${isFounder ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'} shadow-xl`}>
            <CardHeader className={`${isFounder ? 'bg-gradient-to-r from-yellow-600 to-amber-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-white rounded-t-lg`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckSquare className="h-5 w-5 mr-2" />
                  <CardTitle>Task Management</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/worker/tasks")}
                  className="text-white hover:bg-white/20"
                >
                  View All Tasks
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow">
                    <div>
                      <p className="font-medium text-gray-800">{task.title}</p>
                      <p className="text-sm text-gray-500">{task.description}</p>
                    </div>
                    <Badge className={`${
                      task.priority === 'urgent' ? 'bg-red-500' :
                      task.priority === 'high' ? 'bg-orange-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    } text-white`}>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No tasks assigned yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Team Overview */}
          {isAdmin && (
            <Card className={`${isFounder ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'} shadow-xl`}>
              <CardHeader className={`${isFounder ? 'bg-gradient-to-r from-amber-600 to-orange-600' : 'bg-gradient-to-r from-green-600 to-emerald-600'} text-white rounded-t-lg`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    <CardTitle>Team Overview</CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/worker/admin")}
                    className="text-white hover:bg-white/20"
                  >
                    Manage Team
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {workers.slice(0, 3).map((worker) => (
                    <div key={worker.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full flex items-center justify-center">
                          <div className={`${isFounder ? 'bg-yellow-500' : 'bg-blue-500'} text-white text-sm h-full w-full rounded-full flex items-center justify-center`}>
                            {worker.firstName?.[0]}{worker.lastName?.[0]}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{worker.firstName} {worker.lastName}</p>
                          <p className="text-sm text-gray-500">{worker.department}</p>
                        </div>
                      </div>
                      <Badge className={`${
                        worker.role === 'admin' ? (isFounder ? 'bg-yellow-500' : 'bg-red-500') :
                        worker.role === 'manager' ? (isFounder ? 'bg-orange-500' : 'bg-purple-500') : 
                        (isFounder ? 'bg-amber-500' : 'bg-blue-500')
                      } text-white`}>
                        {worker.role}
                      </Badge>
                    </div>
                  ))}
                  {workers.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No team members yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Employee Dashboard Component
function EmployeeDashboard({ currentUser, isFounder }: any) {
  const [, navigate] = useLocation();
  const { data: tasks = [] } = useTasks();
  
  const myTasks = tasks.filter(task => task.assignedTo === currentUser.id);
  const pendingTasks = myTasks.filter(task => task.status === "pending");
  const inProgressTasks = myTasks.filter(task => task.status === "in-progress");
  const completedTasks = myTasks.filter(task => task.status === "completed");
  
  const formatDepartmentName = (dept: string) => {
    switch (dept) {
      case "events": return "Events & Community Outreach";
      case "social-media": return "Social Media";
      case "sponsorships": return "Sponsorships & Fundraising";
      case "healthcare": return "Predictive Systems & Healthcare";
      case "management": return "Management";
      default: return dept;
    }
  };

  return (
    <div className={`min-h-screen ${isFounder ? 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50' : 'bg-gradient-to-br from-gray-50 via-green-50 to-blue-50'}`}>
      {/* Header */}
      <div className={`${isFounder ? 'bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600' : 'bg-gradient-to-r from-green-600 via-teal-600 to-blue-600'} text-white shadow-xl border-b-4 ${isFounder ? 'border-yellow-400' : 'border-green-400'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 ${isFounder ? 'bg-yellow-500' : 'bg-white'} rounded-xl shadow-lg`}>
                <div className={`text-2xl font-bold ${isFounder ? 'text-white' : 'text-green-600'}`}>
                  ☀️
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">SolarPak Energy Initiative</h1>
                <p className={`${isFounder ? 'text-yellow-100' : 'text-green-100'} text-sm flex items-center`}>
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Employee Dashboard - Live
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">Welcome back,</p>
                <p className="text-xl font-bold">{currentUser.firstName} {currentUser.lastName}</p>
                <p className={`text-xs ${isFounder ? 'text-yellow-200' : 'text-green-200'}`}>
                  Employee
                </p>
              </div>
              <div className="h-12 w-12 border-2 border-white rounded-full flex items-center justify-center">
                <div className={`${isFounder ? 'bg-yellow-500' : 'bg-green-500'} text-white font-bold h-full w-full rounded-full flex items-center justify-center`}>
                  {currentUser.firstName?.[0]}{currentUser.lastName?.[0]}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/worker/login")}
                className="text-white hover:bg-white/20"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Work Progress */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Work Progress</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                    <p className="text-3xl font-bold text-gray-900">{pendingTasks.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Due this week: {pendingTasks.length}</p>
                  </div>
                  <div className="p-3 bg-green-500 rounded-full">
                    <CheckSquare className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-3xl font-bold text-gray-900">{inProgressTasks.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Active tasks: {inProgressTasks.length}</p>
                  </div>
                  <div className="p-3 bg-orange-500 rounded-full">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-3xl font-bold text-gray-900">{completedTasks.length}</p>
                    <p className="text-xs text-gray-500 mt-1">This month: {completedTasks.length}</p>
                  </div>
                  <div className="p-3 bg-blue-500 rounded-full">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Department</p>
                    <p className="text-lg font-bold text-gray-900">{formatDepartmentName(currentUser.department || '')}</p>
                    <p className="text-xs text-gray-500 mt-1">Your team</p>
                  </div>
                  <div className="p-3 bg-purple-500 rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* My Tasks and Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Tasks */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckSquare className="h-5 w-5 mr-2" />
                  <CardTitle>My Tasks</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/worker/tasks")}
                  className="text-white hover:bg-white/20"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {myTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{task.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <Badge className={`${
                          task.status === 'completed' ? 'bg-green-500' :
                          task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-500'
                        } text-white text-xs`}>
                          {task.status}
                        </Badge>
                        <Badge className={`${
                          task.priority === 'urgent' ? 'bg-red-500' :
                          task.priority === 'high' ? 'bg-orange-500' :
                          task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        } text-white text-xs`}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
                {myTasks.length === 0 && (
                  <div className="text-center py-8">
                    <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No tasks assigned yet</p>
                    <p className="text-sm text-gray-400">Your team lead will assign tasks soon</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Calendar and Events */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <CardTitle>Schedule & Events</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/worker/events")}
                  className="text-white hover:bg-white/20"
                >
                  View Calendar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">August 2025</h3>
                <p className="text-gray-600">Check the events page for upcoming meetings and deadlines</p>
                <Button 
                  onClick={() => navigate("/worker/events")}
                  className="mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View Full Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Director Dashboard Component  
function DirectorDashboard({ currentUser, isFounder }: any) {
  const [, navigate] = useLocation();
  const { data: workers = [] } = useWorkerList();
  const { data: tasks = [] } = useTasks();
  
  // Filter data for director's department
  const departmentWorkers = workers.filter(worker => 
    worker.department === currentUser.department && worker.id !== currentUser.id
  );
  const departmentTasks = tasks.filter(task => {
    const assignedWorker = workers.find(w => w.id === task.assignedTo);
    return assignedWorker?.department === currentUser.department;
  });
  
  const myTasks = tasks.filter(task => task.assignedTo === currentUser.id);
  const pendingTasks = departmentTasks.filter(task => task.status === "pending");
  const inProgressTasks = departmentTasks.filter(task => task.status === "in-progress");
  const completedTasks = departmentTasks.filter(task => task.status === "completed");
  
  const formatDepartmentName = (dept: string) => {
    switch (dept) {
      case "events": return "Events & Community Outreach";
      case "social-media": return "Social Media";
      case "sponsorships": return "Sponsorships & Fundraising";
      case "healthcare": return "Predictive Systems & Healthcare";
      case "management": return "Management";
      default: return dept;
    }
  };

  return (
    <div className={`min-h-screen ${isFounder ? 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50' : 'bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50'}`}>
      {/* Header */}
      <div className={`${isFounder ? 'bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600' : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600'} text-white shadow-xl border-b-4 ${isFounder ? 'border-yellow-400' : 'border-purple-400'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 ${isFounder ? 'bg-yellow-500' : 'bg-white'} rounded-xl shadow-lg`}>
                <div className={`text-2xl font-bold ${isFounder ? 'text-white' : 'text-purple-600'}`}>
                  👑
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">SolarPak Energy Initiative</h1>
                <p className={`${isFounder ? 'text-yellow-100' : 'text-purple-100'} text-sm flex items-center`}>
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  Director Dashboard - Live
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">Welcome back,</p>
                <p className="text-xl font-bold">{currentUser.firstName} {currentUser.lastName}</p>
                <p className={`text-xs ${isFounder ? 'text-yellow-200' : 'text-purple-200'}`}>
                  Director
                </p>
              </div>
              <div className="h-12 w-12 border-2 border-white rounded-full flex items-center justify-center">
                <div className={`${isFounder ? 'bg-yellow-500' : 'bg-purple-500'} text-white font-bold h-full w-full rounded-full flex items-center justify-center`}>
                  {currentUser.firstName?.[0]}{currentUser.lastName?.[0]}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/worker/login")}
                className="text-white hover:bg-white/20"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions for Directors */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Director Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => navigate("/worker/tasks")}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white h-16 rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Task
            </Button>
            <Button
              onClick={() => navigate("/worker/events")}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white h-16 rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Create Event
            </Button>
            <Button
              onClick={() => navigate("/worker/tasks")}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white h-16 rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
            >
              <Eye className="h-5 w-5 mr-2" />
              View All Tasks
            </Button>
            <Button
              onClick={() => navigate("/worker/admin")}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white h-16 rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
            >
              <Users className="h-5 w-5 mr-2" />
              Manage Team
            </Button>
          </div>
        </div>

        {/* Department Overview */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Users className="h-5 w-5 text-purple-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Department Overview - {formatDepartmentName(currentUser.department || '')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Team Members</p>
                    <p className="text-3xl font-bold text-gray-900">{departmentWorkers.length}</p>
                    <p className="text-xs text-gray-500 mt-1">In your department</p>
                  </div>
                  <div className="p-3 bg-purple-500 rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Department Tasks</p>
                    <p className="text-3xl font-bold text-gray-900">{departmentTasks.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Total assigned</p>
                  </div>
                  <div className="p-3 bg-orange-500 rounded-full">
                    <CheckSquare className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-3xl font-bold text-gray-900">{completedTasks.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Tasks finished</p>
                  </div>
                  <div className="p-3 bg-green-500 rounded-full">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-3xl font-bold text-gray-900">{inProgressTasks.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Active now</p>
                  </div>
                  <div className="p-3 bg-blue-500 rounded-full">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Department Tasks and Team Members */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Department Tasks */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckSquare className="h-5 w-5 mr-2" />
                  <CardTitle>Department Tasks</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/worker/tasks")}
                  className="text-white hover:bg-white/20"
                >
                  Manage Tasks
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {departmentTasks.slice(0, 5).map((task) => {
                  const assignedWorker = workers.find(w => w.id === task.assignedTo);
                  return (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{task.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Assigned to: {assignedWorker?.firstName} {assignedWorker?.lastName}
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          <Badge className={`${
                            task.status === 'completed' ? 'bg-green-500' :
                            task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-500'
                          } text-white text-xs`}>
                            {task.status}
                          </Badge>
                          <Badge className={`${
                            task.priority === 'urgent' ? 'bg-red-500' :
                            task.priority === 'high' ? 'bg-orange-500' :
                            task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          } text-white text-xs`}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {departmentTasks.length === 0 && (
                  <div className="text-center py-8">
                    <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No department tasks yet</p>
                    <p className="text-sm text-gray-400">Create tasks for your team members</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Department Team */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <CardTitle>My Team</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/worker/admin")}
                  className="text-white hover:bg-white/20"
                >
                  Manage Team
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {departmentWorkers.map((worker) => {
                  const workerTasks = tasks.filter(t => t.assignedTo === worker.id);
                  const completedCount = workerTasks.filter(t => t.status === 'completed').length;
                  return (
                    <div key={worker.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center">
                          <div className="bg-purple-500 text-white text-sm h-full w-full rounded-full flex items-center justify-center">
                            {worker.firstName?.[0]}{worker.lastName?.[0]}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{worker.firstName} {worker.lastName}</p>
                          <p className="text-sm text-gray-500">@{worker.username}</p>
                          <p className="text-xs text-gray-400">{completedCount} tasks completed</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-500 text-white">
                        {worker.role}
                      </Badge>
                    </div>
                  );
                })}
                {departmentWorkers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No team members yet</p>
                    <p className="text-sm text-gray-400">Contact admin to add members to your department</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}