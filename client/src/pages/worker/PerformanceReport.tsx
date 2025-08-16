import { useState } from "react";
import { useLocation } from "wouter";
import { 
  ArrowLeft, 
  Star, 
  TrendingUp, 
  BarChart3, 
  Target,
  Award,
  MessageSquare,
  CheckCircle,
  Calendar,
  Download,
  Eye
} from "lucide-react";

import { useWorkerAuth } from "@/hooks/useWorkerAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PerformanceReport() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("current");
  
  const { worker: currentUser } = useWorkerAuth();
  const { toast } = useToast();

  const { data: activePeriod } = useQuery({
    queryKey: ["/worker/api/performance-periods/active"],
  });

  const { data: myScores = [] } = useQuery({
    queryKey: ["/worker/api/performance-scores"],
    enabled: !!currentUser,
  });

  const acknowledgeMutation = useMutation({
    mutationFn: async (scoreId: string) => {
      return await fetch(`/worker/api/performance-scores/${scoreId}/acknowledge`, {
        method: "PATCH",
      }).then(res => res.json());
    },
    onSuccess: () => {
      toast({
        title: "Performance score acknowledged",
        description: "Thank you for reviewing your performance feedback.",
      });
    },
  });

  const currentScore = myScores.find(s => s.periodId === activePeriod?.id);
  const allMyScores = myScores.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

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

  const getScoreDescription = (score: number) => {
    if (score >= 9) return "Outstanding performance! Keep up the excellent work.";
    if (score >= 8) return "Very good performance with minimal areas for improvement.";
    if (score >= 7) return "Good performance meeting most expectations.";
    if (score >= 6) return "Satisfactory performance with some room for growth.";
    if (score >= 5) return "Performance needs improvement to meet expectations.";
    return "Significant improvement needed to meet basic expectations.";
  };

  const ScoreCard = ({ title, score, description }: { title: string; score: number; description: string }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">{title}</span>
          <Badge className={`${getScoreColor(score)}`}>
            {score}/10
          </Badge>
        </div>
        <Progress value={score * 10} className="mb-2" />
        <p className="text-xs text-gray-500">{description}</p>
      </CardContent>
    </Card>
  );

  const PerformanceInfographic = ({ score }: { score: any }) => {
    const overallScore = parseInt(score.overallScore);
    const categories = [
      { name: "Task Completion", score: parseInt(score.taskCompletion), description: "Quality and timeliness" },
      { name: "Teamwork", score: parseInt(score.teamwork), description: "Collaboration skills" },
      { name: "Initiative", score: parseInt(score.initiative), description: "Proactive approach" },
      { name: "Reliability", score: parseInt(score.reliability), description: "Consistency and dependability" },
      { name: "Quality of Work", score: parseInt(score.qualityOfWork), description: "Standards and excellence" },
    ];

    return (
      <div className="space-y-6">
        {/* Overall Score Display */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallScore / 10)}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{overallScore}</div>
                  <div className="text-xs text-gray-600">out of 10</div>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {getOverallRating(overallScore)}
            </h3>
            <p className="text-sm text-gray-600">
              {getScoreDescription(overallScore)}
            </p>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <ScoreCard
              key={index}
              title={category.name}
              score={category.score}
              description={category.description}
            />
          ))}
        </div>

        {/* Feedback Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-green-800 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-700">{score.strengths}</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-orange-800 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-700">{score.areasForImprovement}</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-blue-800 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Goals for Next Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700">{score.goals}</p>
            </CardContent>
          </Card>
        </div>

        {/* Acknowledgment */}
        {score.status !== "acknowledged" && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-yellow-800 mb-1">Action Required</h3>
                  <p className="text-sm text-yellow-700">
                    Please acknowledge that you have reviewed your performance feedback.
                  </p>
                </div>
                <Button
                  onClick={() => acknowledgeMutation.mutate(score.id)}
                  disabled={acknowledgeMutation.isPending}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Acknowledge
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

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
                <h1 className="text-xl font-semibold text-gray-900">My Performance Report</h1>
                <p className="text-sm text-gray-500">View your monthly performance evaluations and feedback</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Current Period</TabsTrigger>
            <TabsTrigger value="history">Performance History</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            {currentScore ? (
              <PerformanceInfographic score={currentScore} />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Score Available</h3>
                  <p className="text-gray-500">
                    {activePeriod 
                      ? `Your performance score for ${activePeriod.month} has not been submitted yet.`
                      : "No active performance period at this time."
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {allMyScores.length > 0 ? (
              <div className="space-y-4">
                {allMyScores.map((score, index) => (
                  <Card key={score.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Performance Score - {score.periodId}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Scored on {new Date(score.createdAt!).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={`${getScoreColor(parseInt(score.overallScore))}`}>
                            <Star className="h-3 w-3 mr-1" />
                            {score.overallScore}/10
                          </Badge>
                          {score.status === "acknowledged" && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Acknowledged
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-5 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Task Completion</p>
                          <p className="text-lg font-semibold">{score.taskCompletion}/10</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Teamwork</p>
                          <p className="text-lg font-semibold">{score.teamwork}/10</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Initiative</p>
                          <p className="text-lg font-semibold">{score.initiative}/10</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Reliability</p>
                          <p className="text-lg font-semibold">{score.reliability}/10</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Quality</p>
                          <p className="text-lg font-semibold">{score.qualityOfWork}/10</p>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        <p><strong>Strengths:</strong> {score.strengths}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Performance History</h3>
                  <p className="text-gray-500">
                    You don't have any performance scores yet. Check back after your first evaluation.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}