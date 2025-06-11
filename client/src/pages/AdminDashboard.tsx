import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Plus, Image, Video, Upload, FileText, Trash2 } from "lucide-react";
import { wsClient } from "@/lib/websocket";
import { useAuth } from "@/hooks/useAuth";

interface AdminUser {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  passwordHash: string;
  totalDonated: number;
  role: string;
  membershipTier: string;
  createdAt: string;
}

interface UserImpact {
  id: number;
  userId: number;
  mediaType: string;
  mediaUrl: string;
  title: string;
  description?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showImpactModal, setShowImpactModal] = useState(false);
  const [impactForm, setImpactForm] = useState({
    mediaType: 'photo',
    mediaUrl: '',
    title: '',
    description: '',
    file: null as File | null
  });
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Connect admin to WebSocket
  useEffect(() => {
    if (user?.id) {
      wsClient.connect(user.id, true);
    }

    return () => {
      wsClient.disconnect();
    };
  }, [user?.id]);

  // Fetch all users
  const { data: users, isLoading } = useQuery<AdminUser[]>({
    queryKey: ['/api/admin/users'],
  });

  // Add user impact mutation
  const addImpactMutation = useMutation({
    mutationFn: async (impactData: any) => {
      console.log('Submitting impact data:', impactData);
      try {
        const response = await fetch('/api/admin/user-impact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(impactData),
          credentials: 'include',
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Success result:', result);
        return result;
      } catch (error) {
        console.error('Upload error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Impact media added successfully",
      });
      setShowImpactModal(false);
      setImpactForm({
        mediaType: 'photo',
        mediaUrl: '',
        title: '',
        description: '',
        file: null
      });
      setUploadMethod('url');
      // Force refresh of user impacts for the selected user
      if (selectedUser) {
        queryClient.invalidateQueries({ queryKey: ['/api/user-impacts', selectedUser.id] });
        queryClient.refetchQueries({ queryKey: ['/api/user-impacts', selectedUser.id] });
      }
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add impact media",
        variant: "destructive",
      });
    },
  });

  const handleAddImpact = async () => {
    if (!selectedUser) return;
    
    let mediaUrl = impactForm.mediaUrl;
    
    // Handle file upload if file is selected
    if (uploadMethod === 'file' && impactForm.file) {
      try {
        const formData = new FormData();
        formData.append('file', impactForm.file);
        formData.append('userId', selectedUser.id.toString());
        
        const uploadResponse = await fetch('/api/admin/upload-media', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        
        if (!uploadResponse.ok) {
          throw new Error('File upload failed');
        }
        
        const uploadResult = await uploadResponse.json();
        mediaUrl = uploadResult.fileUrl;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload file",
          variant: "destructive",
        });
        return;
      }
    }
    
    const impactData = {
      userId: selectedUser.id,
      mediaType: impactForm.mediaType,
      mediaUrl,
      title: impactForm.title,
      description: impactForm.description
    };
    
    addImpactMutation.mutate(impactData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage users and their impact media</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
            >
              ← Back to Landing Page
            </Button>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">Please log in as an admin to access this dashboard.</p>
            <Button 
              className="mt-4"
              onClick={() => window.location.href = '/login'}
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users and their impact media</p>
          </div>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            ← Back to Landing Page
          </Button>
        </div>

        {selectedUser ? (
          // User detail view with impact management
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="outline" 
                onClick={() => setSelectedUser(null)}
              >
                ← Back to Users
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedUser.fullName || selectedUser.username}</h2>
                <p className="text-gray-600">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Username</Label>
                    <p className="font-mono text-sm">{selectedUser.username}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="text-sm">{selectedUser.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Password Hash</Label>
                    <p className="font-mono text-xs break-all bg-gray-100 p-2 rounded">
                      {selectedUser.passwordHash}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Total Donated</Label>
                    <p className="text-lg font-semibold text-green-600">${selectedUser.totalDonated}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Role</Label>
                    <p className="text-sm capitalize">{selectedUser.role}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Membership</Label>
                    <p className="text-sm capitalize">{selectedUser.membershipTier}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Impact Media</CardTitle>
                  <Dialog open={showImpactModal} onOpenChange={setShowImpactModal}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Impact
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Impact Media</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="mediaType">Media Type</Label>
                          <Select 
                            value={impactForm.mediaType} 
                            onValueChange={(value) => setImpactForm({...impactForm, mediaType: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="photo">Photo</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                              <SelectItem value="document">Document</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Upload Method</Label>
                          <div className="flex gap-4 mt-2">
                            <Button
                              type="button"
                              variant={uploadMethod === 'url' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setUploadMethod('url')}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              URL
                            </Button>
                            <Button
                              type="button"
                              variant={uploadMethod === 'file' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setUploadMethod('file')}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload File
                            </Button>
                          </div>
                        </div>

                        {uploadMethod === 'url' ? (
                          <div>
                            <Label htmlFor="mediaUrl">Media URL</Label>
                            <Input
                              id="mediaUrl"
                              value={impactForm.mediaUrl}
                              onChange={(e) => setImpactForm({...impactForm, mediaUrl: e.target.value})}
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                        ) : (
                          <div>
                            <Label htmlFor="fileUpload">Select File</Label>
                            <Input
                              id="fileUpload"
                              type="file"
                              accept="image/*,video/*,.pdf,.doc,.docx"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setImpactForm({...impactForm, file});
                              }}
                              className="cursor-pointer"
                            />
                            {impactForm.file && (
                              <p className="text-sm text-gray-600 mt-1">
                                Selected: {impactForm.file.name} ({(impactForm.file.size / (1024 * 1024)).toFixed(2)} MB)
                              </p>
                            )}
                          </div>
                        )}
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={impactForm.title}
                            onChange={(e) => setImpactForm({...impactForm, title: e.target.value})}
                            placeholder="Impact title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={impactForm.description}
                            onChange={(e) => setImpactForm({...impactForm, description: e.target.value})}
                            placeholder="Optional description"
                          />
                        </div>
                        <Button 
                          onClick={handleAddImpact}
                          disabled={
                            addImpactMutation.isPending || 
                            !impactForm.title ||
                            (uploadMethod === 'url' && !impactForm.mediaUrl) ||
                            (uploadMethod === 'file' && !impactForm.file)
                          }
                          className="w-full"
                        >
                          {addImpactMutation.isPending ? "Adding..." : "Add Impact Media"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <UserImpactList userId={selectedUser.id} />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // User list view
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                All Users ({users?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users?.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-medium text-gray-900">
                          {user.fullName || user.username}
                        </h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs font-mono text-gray-400">
                          Password: {user.passwordHash.substring(0, 20)}...
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-lg font-semibold text-green-600">
                          ${user.totalDonated}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {user.role} • {user.membershipTier}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function UserImpactList({ userId }: { userId: number }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: impacts, isLoading } = useQuery<UserImpact[]>({
    queryKey: ['/api/user-impacts', userId],
    queryFn: () => fetch(`/api/user-impacts/${userId}`, { credentials: 'include' }).then(res => res.json()),
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const deleteImpactMutation = useMutation({
    mutationFn: async (impactId: number) => {
      const response = await fetch(`/api/admin/user-impact/${impactId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete impact');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Impact media deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user-impacts', userId] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete impact media",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading impacts...</div>;
  }

  if (!impacts || impacts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No impact media added yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {impacts.map((impact) => (
        <div key={impact.id} className="border rounded-lg p-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {impact.mediaType === 'photo' ? (
                <Image className="h-5 w-5 text-blue-500" />
              ) : impact.mediaType === 'video' ? (
                <Video className="h-5 w-5 text-purple-500" />
              ) : (
                <FileText className="h-5 w-5 text-green-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900">{impact.title}</h4>
              {impact.description && (
                <p className="text-xs text-gray-500 mt-1">{impact.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <a 
                  href={impact.mediaUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  View {impact.mediaType === 'photo' ? 'Photo' : impact.mediaType === 'video' ? 'Video' : 'Document'} →
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteImpactMutation.mutate(impact.id)}
                  disabled={deleteImpactMutation.isPending}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}