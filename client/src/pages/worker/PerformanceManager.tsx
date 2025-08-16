import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  ArrowLeft, 
  Plus, 
  Star, 
  TrendingUp, 
  BarChart3, 
  Users,
  Calendar,
  Target,
  Award,
  MessageSquare,
  CheckCircle
} from "lucide-react";

import { useWorkerAuth } from "@/hooks/useWorkerAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { CreatePerformanceScoreInput, PerformancePeriod, PerformanceScore, Worker } from "@shared/worker-schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPerformanceScoreSchema } from "@shared/worker-schema";

export default function PerformanceManager() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [scoringEmployeeId, setScoringEmployeeId] = useState<string | null>(null);
  const [createPeriodOpen, setCreatePeriodOpen] = useState(false);
  
  const { worker: currentUser } = useWorkerAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if current user is admin
  const isAdmin = currentUser?.role === "admin";

  const { data: periods = [] } = useQuery({
    queryKey: ["/worker/api/performance-periods"],
    enabled: isAdmin,
  });

  const { data: activePeriod } = useQuery({
    queryKey: ["/worker/api/performance-periods/active"],
    enabled: isAdmin,
  });

  const { data: workers = [] } = useQuery({
    queryKey: ["/worker/api/workers"],
    enabled: isAdmin,
  });

  const { data: performanceScores = [] } = useQuery({
    queryKey: ["/worker/api/performance-scores"],
    enabled: isAdmin && !!activePeriod,
  });

  const createPeriodForm = useForm({
    defaultValues: {
      month: "",
      year: new Date().getFullYear().toString(),
    },
  });

  const scoringForm = useForm<CreatePerformanceScoreInput>({
    resolver: zodResolver(createPerformanceScoreSchema),
    defaultValues: {
      periodId: "",
      workerId: "",
      taskCompletion: "5",
      teamwork: "5",
      initiative: "5",
      reliability: "5",
      qualityOfWork: "5",
      strengths: "",
      areasForImprovement: "",
      goals: "",
      adminNotes: "",
    },
  });

  // Set active period in form when available
  useEffect(() => {
    if (activePeriod && scoringEmployeeId) {
      scoringForm.setValue("periodId", activePeriod.id);
      scoringForm.setValue("workerId", scoringEmployeeId);
    }
  }, [activePeriod, scoringEmployeeId, scoringForm]);

  const createPeriodMutation = useMutation({
    mutationFn: async (data: { month: string; year: string }) => {
      return await fetch("/worker/api/performance-periods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(res => res.json());
    },
    onSuccess: () => {
      toast({
        title: "Performance period created",
        description: "New monthly performance evaluation period has been created.",
      });
      queryClient.invalidateQueries({ queryKey: ["/worker/api/performance-periods"] });
      setCreatePeriodOpen(false);
      createPeriodForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create performance period",
        variant: "destructive",
      });
    },
  });

  const createScoreMutation = useMutation({
    mutationFn: async (data: CreatePerformanceScoreInput) => {
      return await fetch("/worker/api/performance-scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(res => res.json());
    },
    onSuccess: () => {
      toast({
        title: "Performance score submitted",
        description: "Employee performance score has been recorded and they will be notified.",
      });
      queryClient.invalidateQueries({ queryKey: ["/worker/api/performance-scores"] });
      setScoringEmployeeId(null);
      scoringForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit performance score",
        variant: "destructive",
      });
    },
  });

  const handleCreatePeriod = (data: { month: string; year: string }) => {
    createPeriodMutation.mutate(data);
  };

  const handleCreateScore = (data: CreatePerformanceScoreInput) => {
    createScoreMutation.mutate(data);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-100";
    if (score >= 6) return "text-yellow-600 bg-yellow-100";
    if (score >= 4) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getOverallRating = (score: number) => {
    if (score >= 9) return "Excellent";
    if (score >= 8) return "Very Good";
    if (score >= 7) return "Good";
    if (score >= 6) return "Satisfactory";
    if (score >= 5) return "Needs Improvement";
    return "Poor";
  };

  const employeesWithScores = workers.filter(w => w.username !== "admin").map(worker => {
    const score = performanceScores.find(s => s.workerId === worker.id && s.periodId === activePeriod?.id);
    return { ...worker, score };
  });

  const completedScores = performanceScores.filter(s => s.periodId === activePeriod?.id).length;
  const totalEmployees = workers.filter(w => w.username !== "admin").length;
  const averageScore = performanceScores.length > 0 
    ? Math.round(performanceScores.reduce((sum, s) => sum + parseInt(s.overallScore), 0) / performanceScores.length)
    : 0;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              Only administrators can access the Performance Manager.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/worker/dashboard")}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/worker/dashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Performance Manager</h1>
                <p className="text-sm text-gray-500">Monthly employee performance evaluation system</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Dialog open={createPeriodOpen} onOpenChange={setCreatePeriodOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Period
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Performance Period</DialogTitle>
                    <DialogDescription>
                      Create a new monthly performance evaluation period.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...createPeriodForm}>
                    <form onSubmit={createPeriodForm.handleSubmit(handleCreatePeriod)} className="space-y-4">
                      <FormField
                        control={createPeriodForm.control}
                        name="month"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Month</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="2025-01">January 2025</SelectItem>
                                <SelectItem value="2025-02">February 2025</SelectItem>
                                <SelectItem value="2025-03">March 2025</SelectItem>
                                <SelectItem value="2025-04">April 2025</SelectItem>
                                <SelectItem value="2025-05">May 2025</SelectItem>
                                <SelectItem value="2025-06">June 2025</SelectItem>
                                <SelectItem value="2025-07">July 2025</SelectItem>
                                <SelectItem value="2025-08">August 2025</SelectItem>
                                <SelectItem value="2025-09">September 2025</SelectItem>
                                <SelectItem value="2025-10">October 2025</SelectItem>
                                <SelectItem value="2025-11">November 2025</SelectItem>
                                <SelectItem value="2025-12">December 2025</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={createPeriodForm.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="2025" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button 
                          type="submit" 
                          disabled={createPeriodMutation.isPending}
                        >
                          Create Period
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="scoring">Employee Scoring</TabsTrigger>
            <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Period</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {activePeriod ? activePeriod.month : "None"}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Scores Completed</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {completedScores}/{totalEmployees}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Average Score</p>
                      <p className="text-2xl font-bold text-gray-900">{averageScore}/10</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Employees</p>
                      <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Period Status */}
            <Card>
              <CardHeader>
                <CardTitle>Current Performance Period</CardTitle>
                <CardDescription>
                  {activePeriod 
                    ? `Performance evaluations for ${activePeriod.month} are ${activePeriod.status}`
                    : "No active performance period. Create one to start evaluations."
                  }
                </CardDescription>
              </CardHeader>
              {activePeriod && (
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-gray-500">
                        {completedScores} of {totalEmployees} employees scored
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${totalEmployees > 0 ? (completedScores / totalEmployees) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="scoring" className="space-y-6">
            {!activePeriod ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Period</h3>
                  <p className="text-gray-500 mb-4">
                    Create a performance period to start scoring employees.
                  </p>
                  <Button onClick={() => setCreatePeriodOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Performance Period
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employeesWithScores.map((employee) => (
                  <Card key={employee.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {employee.firstName} {employee.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">{employee.department}</p>
                        </div>
                        {employee.score ? (
                          <Badge className={`${getScoreColor(parseInt(employee.score.overallScore))}`}>
                            <Star className="h-3 w-3 mr-1" />
                            {employee.score.overallScore}/10
                          </Badge>
                        ) : (
                          <Badge variant="outline">Not Scored</Badge>
                        )}
                      </div>

                      {employee.score ? (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            <strong>Status:</strong> {getOverallRating(parseInt(employee.score.overallScore))}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Scored on:</strong> {new Date(employee.score.createdAt!).toLocaleDateString()}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => setScoringEmployeeId(employee.id)}
                          >
                            Update Score
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className="w-full"
                          onClick={() => setScoringEmployeeId(employee.id)}
                        >
                          <Target className="h-4 w-4 mr-2" />
                          Score Employee
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Performance Scoring Dialog */}
            <Dialog open={!!scoringEmployeeId} onOpenChange={() => setScoringEmployeeId(null)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Employee Performance Scoring</DialogTitle>
                  <DialogDescription>
                    Score employee performance across different categories (1-10 scale)
                  </DialogDescription>
                </DialogHeader>

                {scoringEmployeeId && (
                  <Form {...scoringForm}>
                    <form onSubmit={scoringForm.handleSubmit(handleCreateScore)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <FormField
                          control={scoringForm.control}
                          name="taskCompletion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Task Completion</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={scoringForm.control}
                          name="teamwork"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Teamwork</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={scoringForm.control}
                          name="initiative"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Initiative</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={scoringForm.control}
                          name="reliability"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reliability</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={scoringForm.control}
                          name="qualityOfWork"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quality of Work</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={scoringForm.control}
                          name="strengths"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Strengths</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={4} placeholder="What does this employee do well?" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={scoringForm.control}
                          name="areasForImprovement"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Areas for Improvement</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={4} placeholder="What areas need development?" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={scoringForm.control}
                          name="goals"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Goals for Next Month</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={4} placeholder="What goals should they focus on?" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={scoringForm.control}
                        name="adminNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Admin Notes (Private)</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} placeholder="Private notes for admin use only..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button 
                          type="submit" 
                          disabled={createScoreMutation.isPending}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Award className="h-4 w-4 mr-2" />
                          Submit Performance Score
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Overview of team performance metrics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Reports Coming Soon</h3>
                  <p className="text-gray-500">
                    Performance analytics and detailed reports will be available in the next update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}