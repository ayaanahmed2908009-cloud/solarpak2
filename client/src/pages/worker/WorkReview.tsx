import { useState } from "react";
import { useLocation } from "wouter";
import { 
  ArrowLeft, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  FileImage,
  User,
  Calendar,
  MessageSquare
} from "lucide-react";

import { useWorkerAuth } from "@/hooks/useWorkerAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface WorkSubmissionWithDetails {
  id: string;
  taskId: string;
  workerId: string;
  description: string;
  screenshotUrl?: string;
  status: string;
  adminResponse?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  taskTitle: string;
  taskDescription: string;
  workerFirstName: string;
  workerLastName: string;
  workerUsername: string;
}

export default function WorkReview() {
  const [, navigate] = useLocation();
  const { worker: currentUser } = useWorkerAuth();
  const [selectedSubmission, setSelectedSubmission] = useState<WorkSubmissionWithDetails | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const [reviewAction, setReviewAction] = useState<"approved" | "rejected">("approved");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch work submissions for current user's department
  const { data: submissions = [], isLoading } = useQuery<WorkSubmissionWithDetails[]>({
    queryKey: ["/worker/api/work-submissions", currentUser?.department],
    queryFn: async () => {
      const response = await fetch(`/worker/api/work-submissions?department=${currentUser?.department}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch work submissions");
      return response.json();
    },
    enabled: !!currentUser?.department && (currentUser?.role === "admin" || currentUser?.role === "manager"),
  });

  const reviewSubmissionMutation = useMutation({
    mutationFn: async ({ id, status, response }: { id: string; status: string; response: string }) => {
      const res = await fetch(`/worker/api/work-submissions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status, adminResponse: response }),
      });
      if (!res.ok) throw new Error("Failed to review submission");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Review Submitted",
        description: "Work submission has been reviewed successfully.",
      });
      // Invalidate all work submission queries to refresh both manager and employee views
      queryClient.invalidateQueries({ queryKey: ["/worker/api/work-submissions"] });
      // Also invalidate specific employee queries
      if (selectedSubmission) {
        queryClient.invalidateQueries({ 
          queryKey: ["/worker/api/work-submissions", "employee", selectedSubmission.workerId] 
        });
      }
      setReviewModalOpen(false);
      setSelectedSubmission(null);
      setAdminResponse("");
    },
    onError: () => {
      toast({
        title: "Review Failed",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleReview = () => {
    if (!selectedSubmission) return;
    reviewSubmissionMutation.mutate({
      id: selectedSubmission.id,
      status: reviewAction,
      response: adminResponse,
    });
  };

  const handleViewSubmission = (submission: WorkSubmissionWithDetails) => {
    setSelectedSubmission(submission);
    setAdminResponse(submission.adminResponse || "");
    setReviewAction(submission.status === "approved" ? "approved" : "rejected");
    setReviewModalOpen(true);
  };

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "manager")) {
    navigate("/worker/dashboard");
    return null;
  }

  const pendingSubmissions = submissions.filter(s => s.status === "pending");
  const reviewedSubmissions = submissions.filter(s => s.status !== "pending");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/worker/dashboard")}
                className="text-white hover:bg-white/20 mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Work Review</h1>
                <p className="text-blue-100 mt-1">Review work submissions from your team</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pending Reviews */}
        <Card className="mb-8 shadow-xl border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Pending Reviews ({pendingSubmissions.length})
            </CardTitle>
            <CardDescription className="text-orange-100">
              Work submissions waiting for your review
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : pendingSubmissions.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No pending reviews</p>
                <p className="text-sm text-gray-400">All work submissions have been reviewed</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pendingSubmissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-orange-200">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-orange-100 text-orange-600">
                          {submission.workerFirstName[0]}{submission.workerLastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{submission.taskTitle}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Submitted by {submission.workerFirstName} {submission.workerLastName}
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(submission.createdAt).toLocaleDateString()}
                          </Badge>
                          {submission.screenshotUrl && (
                            <Badge variant="outline" className="text-xs">
                              <FileImage className="h-3 w-3 mr-1" />
                              Screenshot
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleViewSubmission(submission)}
                      className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviewed Submissions */}
        <Card className="shadow-xl border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Reviewed Submissions ({reviewedSubmissions.length})
            </CardTitle>
            <CardDescription className="text-green-100">
              Previously reviewed work submissions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {reviewedSubmissions.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No reviewed submissions yet</p>
              </div>
            ) : (
              <div className="grid gap-4 max-h-96 overflow-y-auto">
                {reviewedSubmissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-green-200">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-green-100 text-green-600">
                          {submission.workerFirstName[0]}{submission.workerLastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{submission.taskTitle}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {submission.workerFirstName} {submission.workerLastName}
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          <Badge className={submission.status === "approved" ? "bg-green-500" : "bg-red-500"}>
                            {submission.status === "approved" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {submission.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {new Date(submission.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewSubmission(submission)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Work Submission Review</DialogTitle>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-6">
              {/* Task Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{selectedSubmission.taskTitle}</h3>
                <p className="text-gray-600 mb-2">{selectedSubmission.taskDescription}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-1" />
                  {selectedSubmission.workerFirstName} {selectedSubmission.workerLastName}
                  <Calendar className="h-4 w-4 ml-4 mr-1" />
                  {new Date(selectedSubmission.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Work Description */}
              <div>
                <Label className="text-base font-semibold">Work Description</Label>
                <div className="mt-2 p-4 bg-blue-50 rounded-lg border">
                  <p className="text-gray-800">{selectedSubmission.description}</p>
                </div>
              </div>

              {/* Screenshot */}
              {selectedSubmission.screenshotUrl && (
                <div>
                  <Label className="text-base font-semibold">Screenshot</Label>
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <img 
                      src={selectedSubmission.screenshotUrl} 
                      alt="Work submission screenshot"
                      className="w-full max-h-96 object-contain bg-gray-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Review Section */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Review</Label>
                
                <div className="flex space-x-4">
                  <Button
                    variant={reviewAction === "approved" ? "default" : "outline"}
                    onClick={() => setReviewAction("approved")}
                    className={reviewAction === "approved" ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant={reviewAction === "rejected" ? "default" : "outline"}
                    onClick={() => setReviewAction("rejected")}
                    className={reviewAction === "rejected" ? "bg-red-500 hover:bg-red-600" : ""}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>

                <div>
                  <Label htmlFor="admin-response">Feedback (Optional)</Label>
                  <Textarea
                    id="admin-response"
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Provide feedback to the worker..."
                    className="mt-2"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setReviewModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleReview}
                  disabled={reviewSubmissionMutation.isPending}
                  className={reviewAction === "approved" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
                >
                  {reviewSubmissionMutation.isPending ? "Submitting..." : `${reviewAction === "approved" ? "Approve" : "Reject"} Work`}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}