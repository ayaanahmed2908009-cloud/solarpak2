import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Lock,
  LockOpen,
  Plus,
  Trash2,
  ChevronDown,
  Check,
  X,
  Clock,
  LogOut,
  Briefcase,
  FileText,
  Download,
} from "lucide-react";
import type { JobListing, JobApplication } from "@shared/schema";

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/auth", { password }),
    onSuccess: () => onLogin(),
    onError: () => setError("Incorrect password"),
  });

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Navbar />
      <div className="w-full max-w-sm px-6">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-emerald-900 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5 text-green-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Enter password to continue</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError("");
            loginMutation.mutate();
          }}
        >
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-3"
          />
          {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
          <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function CreateJobForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [qualifications, setQualifications] = useState("");

  const createMutation = useMutation({
    mutationFn: () =>
      apiRequest("POST", "/api/admin/jobs", {
        title,
        department,
        type,
        location,
        description,
        responsibilities: responsibilities.split("\n").filter((r) => r.trim()),
        qualifications: qualifications.split("\n").filter((q) => q.trim()),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/jobs"] });
      onClose();
    },
  });

  const depts = ["Field Operations", "Social Media", "Events & Community Outreach", "Sales & Sponsorships", "Predictive Systems", "Impact Labs", "General Management"];

  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-white mb-8">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">New job listing</h3>
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Social Media Intern" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Select department</option>
              {depts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Type</label>
            <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g. Volunteer (Remote)" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Location</label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Remote" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Brief description of the role" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Responsibilities (one per line)</label>
          <Textarea value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} rows={4} placeholder={"Manage social media accounts\nCreate content calendars\nEngage with followers"} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Qualifications (one per line)</label>
          <Textarea value={qualifications} onChange={(e) => setQualifications(e.target.value)} rows={4} placeholder={"Experience with social media\nGood written English\nSelf-motivated"} />
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            onClick={() => createMutation.mutate()}
            disabled={!title || !department || !type || !location || !description || createMutation.isPending}
            className="bg-gray-900 hover:bg-gray-800"
          >
            {createMutation.isPending ? "Creating..." : "Create job"}
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}

function JobRow({ job }: { job: JobListing }) {
  const toggleAppsMutation = useMutation({
    mutationFn: () => apiRequest("PATCH", `/api/admin/jobs/${job.id}`, { applicationsOpen: !(job as any).applicationsOpen }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/jobs"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", `/api/admin/jobs/${job.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
    },
  });

  const appsOpen = (job as any).applicationsOpen !== false;

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <h4 className="text-sm font-semibold text-gray-900 truncate">{job.title}</h4>
          {!job.isActive && (
            <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Hidden</span>
          )}
          {!appsOpen && (
            <span className="text-[10px] font-medium text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">Applications Closed</span>
          )}
        </div>
        <p className="text-xs text-gray-400">{job.department} · {job.location} · {job.type}</p>
      </div>
      <div className="flex items-center gap-1 ml-4">
        <button
          onClick={() => toggleAppsMutation.mutate()}
          disabled={toggleAppsMutation.isPending}
          title={appsOpen ? "Close applications" : "Open applications"}
          className={`p-2 rounded-lg transition-colors ${appsOpen ? "text-green-600 hover:text-orange-500 hover:bg-orange-50" : "text-orange-500 hover:text-green-600 hover:bg-green-50"}`}
        >
          {appsOpen ? <LockOpen className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        </button>
        <button
          onClick={() => {
            if (window.confirm("Delete this job and all its applications?")) {
              deleteMutation.mutate();
            }
          }}
          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ApplicationRow({ app, jobs }: { app: JobApplication; jobs: JobListing[] }) {
  const [expanded, setExpanded] = useState(false);
  const job = jobs.find((j) => j.id === app.jobId);

  const statusMutation = useMutation({
    mutationFn: (status: string) => apiRequest("PATCH", `/api/admin/applications/${app.id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", `/api/admin/applications/${app.id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] }),
  });

  const statusColors: Record<string, string> = {
    pending: "text-amber-600 bg-amber-50",
    reviewed: "text-blue-600 bg-blue-50",
    accepted: "text-green-600 bg-green-50",
    rejected: "text-red-600 bg-red-50",
  };

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-sm font-semibold text-gray-900 truncate">{app.name}</h4>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded capitalize ${statusColors[app.status] || statusColors.pending}`}>
              {app.status}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            {job?.title || "Unknown role"} · {app.email} · {new Date(app.createdAt).toLocaleDateString()}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-300 flex-shrink-0 ml-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      <div className={`overflow-hidden transition-all duration-200 ${expanded ? "max-h-[500px] opacity-100 pb-4" : "max-h-0 opacity-0"}`}>
        {app.phone && (
          <p className="text-xs text-gray-400 mb-2">Phone: {app.phone}</p>
        )}
        {(app as any).resumeFilename && (
          <a
            href={`/api/admin/applications/${app.id}/resume`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 mb-3 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download CV ({(app as any).resumeFilename})
          </a>
        )}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Cover letter</h5>
            <a
              href={`/api/admin/applications/${app.id}/cover-letter`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download DOCX
            </a>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{app.coverLetter}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["pending", "reviewed", "accepted", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => statusMutation.mutate(s)}
              disabled={app.status === s}
              className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize transition-colors ${
                app.status === s
                  ? statusColors[s] + " cursor-default"
                  : "text-gray-500 bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
          <button
            onClick={() => {
              if (window.confirm("Delete this application?")) deleteMutation.mutate();
            }}
            className="text-xs font-medium px-3 py-1.5 rounded-full text-red-500 bg-red-50 hover:bg-red-100 transition-colors ml-auto"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [tab, setTab] = useState<"jobs" | "applications">("jobs");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: jobs = [], isLoading: jobsLoading } = useQuery<JobListing[]>({
    queryKey: ["/api/admin/jobs"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: applications = [], isLoading: appsLoading } = useQuery<JobApplication[]>({
    queryKey: ["/api/admin/applications"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/auth/logout"),
    onSuccess: () => window.location.reload(),
  });

  const pendingCount = applications.filter((a) => a.status === "pending").length;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20">
        <div className="container mx-auto px-6 py-10">
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin</h1>
              <button
                onClick={() => logoutMutation.mutate()}
                className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
            </div>

            <div className="flex gap-1 mb-8 border-b border-gray-100">
              <button
                onClick={() => setTab("jobs")}
                className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                  tab === "jobs" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Jobs ({jobs.length})
                </span>
                {tab === "jobs" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />}
              </button>
              <button
                onClick={() => setTab("applications")}
                className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                  tab === "applications" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Applications ({applications.length})
                  {pendingCount > 0 && (
                    <span className="text-[10px] font-bold text-white bg-amber-500 w-5 h-5 rounded-full flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </span>
                {tab === "applications" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />}
              </button>
            </div>

            {tab === "jobs" && (
              <>
                {!showCreateForm ? (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add new job
                  </button>
                ) : (
                  <CreateJobForm onClose={() => setShowCreateForm(false)} />
                )}

                {jobsLoading ? (
                  <p className="text-sm text-gray-400 py-8">Loading...</p>
                ) : jobs.length === 0 ? (
                  <p className="text-sm text-gray-400 py-8">No jobs created yet.</p>
                ) : (
                  <div>
                    {jobs.map((job) => (
                      <JobRow key={job.id} job={job} />
                    ))}
                  </div>
                )}
              </>
            )}

            {tab === "applications" && (
              <>
                {appsLoading ? (
                  <p className="text-sm text-gray-400 py-8">Loading...</p>
                ) : applications.length === 0 ? (
                  <p className="text-sm text-gray-400 py-8">No applications received yet.</p>
                ) : (
                  <div>
                    {applications.map((app) => (
                      <ApplicationRow key={app.id} app={app} jobs={jobs} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const { data: authData, isLoading } = useQuery<{ authenticated: boolean }>({
    queryKey: ["/api/admin/auth/check"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (authData?.authenticated) setAuthenticated(true);
  }, [authData]);

  if (isLoading) return null;

  if (!authenticated) {
    return <LoginForm onLogin={() => setAuthenticated(true)} />;
  }

  return <Dashboard />;
}
