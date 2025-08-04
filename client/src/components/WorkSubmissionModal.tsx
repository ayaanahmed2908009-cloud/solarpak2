import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { UploadResult } from "@uppy/core";
import type { Task } from "@shared/worker-schema";
import { Upload, FileImage } from "lucide-react";

interface WorkSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

export function WorkSubmissionModal({ isOpen, onClose, task }: WorkSubmissionModalProps) {
  const [description, setDescription] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitWorkMutation = useMutation({
    mutationFn: async (data: { taskId: string; description: string; screenshotUrl?: string }) => {
      const response = await fetch("/worker/api/work-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Work Submitted",
        description: "Your work has been submitted for review.",
      });
      queryClient.invalidateQueries({ queryKey: ["/worker/api/work-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["/worker/api/tasks"] });
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit work",
        variant: "destructive",
      });
    },
  });

  const handleGetUploadParameters = async () => {
    try {
      const response = await fetch("/worker/api/objects/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to get upload URL");
      }
      
      const data = await response.json();
      return {
        method: "PUT" as const,
        url: data.uploadURL,
      };
    } catch (error) {
      console.error("Error getting upload parameters:", error);
      throw error;
    }
  };

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedFile = result.successful[0];
      if (uploadedFile.uploadURL) {
        // Convert the upload URL to our object path format
        const url = new URL(uploadedFile.uploadURL);
        const pathParts = url.pathname.split('/');
        if (pathParts.length >= 3) {
          // Extract object ID from path
          const objectId = pathParts.slice(-1)[0];
          const normalizedPath = `/objects/screenshots/${objectId}`;
          setScreenshotUrl(normalizedPath);
          setIsUploading(false);
          toast({
            title: "Screenshot Uploaded",
            description: "Screenshot uploaded successfully",
          });
        }
      }
    }
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      toast({
        title: "Description Required",
        description: "Please provide a description of your work",
        variant: "destructive",
      });
      return;
    }

    submitWorkMutation.mutate({
      taskId: task.id,
      description: description.trim(),
      screenshotUrl: screenshotUrl || undefined,
    });
  };

  const handleClose = () => {
    setDescription("");
    setScreenshotUrl("");
    setIsUploading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Submit Work for: {task.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Task Description</h4>
            <p className="text-sm text-gray-600">{task.description}</p>
          </div>

          {/* Work Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Work Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what you have completed for this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Screenshot Upload */}
          <div className="space-y-2">
            <Label>Screenshot (Optional)</Label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
              {screenshotUrl ? (
                <div className="flex items-center gap-3 text-green-600">
                  <FileImage className="h-5 w-5" />
                  <span className="text-sm font-medium">Screenshot uploaded successfully</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setScreenshotUrl("")}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <ObjectUploader
                    maxNumberOfFiles={1}
                    maxFileSize={10485760} // 10MB
                    onGetUploadParameters={handleGetUploadParameters}
                    onComplete={handleUploadComplete}
                    buttonClassName="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Screenshot
                    </div>
                  </ObjectUploader>
                  <p className="text-xs text-gray-500 mt-2">
                    Upload a screenshot showing your completed work (optional)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitWorkMutation.isPending || isUploading}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {submitWorkMutation.isPending ? "Submitting..." : "Submit Work"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}