import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  MapPin,
  Clock,
  Mail,
  ArrowUpRight,
  Send,
  CheckCircle2,
} from "lucide-react";
import type { JobListing as JobListingType } from "@shared/schema";

const departments = [
  {
    name: "Field Operations",
    description: "Our field team works on the ground across Sindh, Pakistan — coordinating solar panel installations, managing logistics, and working directly with families to assess energy needs and deliver sustainable power solutions.",
  },
  {
    name: "Social Media",
    description: "The social media team manages SolarPak's digital presence across platforms, creating content that tells our story, engages our global community, and drives awareness of Pakistan's energy crisis and our mission to solve it.",
  },
  {
    name: "Events & Community Outreach",
    description: "This team organises fundraising events, community engagement initiatives, and public outreach programmes. They build relationships with local leaders, schools, and partner organisations to expand our reach and impact.",
  },
  {
    name: "Sales & Sponsorships",
    description: "Our sales and sponsorships team identifies and secures partnerships with businesses, foundations, and individual sponsors. They develop funding proposals, manage donor relationships, and create sustainable revenue channels for SolarPak.",
  },
  {
    name: "Predictive Systems",
    description: "The predictive systems team uses data analysis and modelling to forecast energy demand, optimise installation planning, and measure long-term impact. They build the analytical tools that inform SolarPak's strategic decisions.",
  },
  {
    name: "Impact Labs",
    description: "Impact Labs is SolarPak's research and publishing arm. The team collects field data, writes reports and case studies, and produces articles that document our environmental and economic impact with rigorous, evidence-based analysis.",
  },
  {
    name: "General Management",
    description: "General management oversees day-to-day operations, coordinates across all departments, handles administrative tasks, and ensures SolarPak runs smoothly as an organisation. This team keeps everything connected and on track.",
  },
];

function DepartmentList() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="border-t border-gray-100">
      {departments.map((dept) => (
        <div key={dept.name} className="border-b border-gray-100">
          <button
            onClick={() => setExpanded(expanded === dept.name ? null : dept.name)}
            className="w-full flex items-center justify-between py-5 text-left group"
          >
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-green-800 transition-colors">
              {dept.name}
            </h3>
            <ChevronDown
              className={`w-4 h-4 text-gray-300 flex-shrink-0 transition-transform duration-200 ${
                expanded === dept.name ? "rotate-180" : ""
              }`}
            />
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${
            expanded === dept.name ? "max-h-40 opacity-100 pb-5" : "max-h-0 opacity-0"
          }`}>
            <p className="text-sm text-gray-500 leading-relaxed">{dept.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ApplicationForm({ jobId, jobTitle, onClose }: { jobId: number; jobTitle: string; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const applyMutation = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append("data", JSON.stringify({
        jobId,
        name,
        email,
        phone: phone || undefined,
        coverLetter,
      }));
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }
      return fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        body: formData,
        credentials: "include",
      }).then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).message);
        return res.json();
      });
    },
    onSuccess: () => setSubmitted(true),
  });

  if (submitted) {
    return (
      <div className="bg-green-50 rounded-xl p-6 mt-4 text-center">
        <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-3" />
        <h4 className="text-sm font-semibold text-green-900 mb-1">Application submitted</h4>
        <p className="text-xs text-green-700">We'll review your application and get back to you soon.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6 mt-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-4">Apply for {jobTitle}</h4>
      <div className="space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <Input placeholder="Full name *" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Email *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <Input placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Textarea
          placeholder="Tell us why you're interested and what you'd bring to the role *"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          rows={4}
        />
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1.5 block">CV / Resume (PDF, DOC, DOCX — max 5MB)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 file:cursor-pointer"
          />
        </div>
        <div className="flex gap-3 pt-1">
          <Button
            onClick={() => applyMutation.mutate()}
            disabled={!name || !email || !coverLetter || applyMutation.isPending}
            className="bg-gray-900 hover:bg-gray-800"
            size="sm"
          >
            <Send className="w-3.5 h-3.5 mr-2" />
            {applyMutation.isPending ? "Submitting..." : "Submit application"}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}

function JobListingCard({ job }: { job: JobListingType }) {
  const [open, setOpen] = useState(false);
  const [showApply, setShowApply] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => { setOpen(!open); if (open) setShowApply(false); }}
        className="w-full text-left py-6 group"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1.5">
              <h3 className="text-base font-semibold text-gray-900 group-hover:text-green-800 transition-colors">
                {job.title}
              </h3>
              <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded font-medium">
                {job.type}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 text-xs text-gray-400">
              <span>{job.department}</span>
              <span className="hidden sm:inline">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />{job.location}
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />Flexible
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-300 mt-1.5 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[1200px] opacity-100 pb-6" : "max-h-0 opacity-0"}`}>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">{job.description}</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">What you'll do</h4>
            <ul className="space-y-2">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="text-sm text-gray-600 leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-green-400">
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">What we're looking for</h4>
            <ul className="space-y-2">
              {job.qualifications.map((q, i) => (
                <li key={i} className="text-sm text-gray-600 leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gray-300">
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-50">
          {!showApply ? (
            <button
              onClick={() => setShowApply(true)}
              className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-900 transition-colors group/link"
            >
              Apply for this role
              <ArrowUpRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </button>
          ) : (
            <ApplicationForm jobId={job.id} jobTitle={job.title} onClose={() => setShowApply(false)} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function Opportunities() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  const { data: jobs = [], isLoading } = useQuery<JobListingType[]>({
    queryKey: ["/api/jobs"],
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeroVisible(true); },
      { threshold: 0.2 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-20">
        <div
          ref={heroRef}
          className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 py-24 md:py-32 overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-teal-500/8 to-cyan-500/8 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-green-400/5 to-transparent rounded-full" />
          </div>

          <div
            className="container mx-auto px-6 relative z-10 transition-all duration-1000"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <div className="max-w-2xl">
              <span className="text-green-400/80 font-medium text-xs uppercase tracking-[0.2em] mb-4 block">
                Careers & Volunteering
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-[1.1] tracking-tight">
                Opportunities
              </h1>
              <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
                SolarPak is built by volunteers. Here's how we're organised and where you can contribute.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="max-w-3xl py-16 md:py-20">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-10">
              Organisation
            </h2>
            <DepartmentList />
          </div>

          <div className="h-px bg-gray-100" />

          <div className="max-w-3xl py-16 md:py-20">
            <div className="flex items-end justify-between mb-3">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Open roles
              </h2>
              {!isLoading && (
                <span className="text-xs text-gray-400 font-medium">{jobs.length} position{jobs.length !== 1 ? "s" : ""}</span>
              )}
            </div>
            <p className="text-gray-500 text-[15px] leading-relaxed mb-10 max-w-xl">
              All positions are volunteer-based or unpaid internships. Hours are flexible and most roles are remote.
            </p>

            {isLoading ? (
              <div className="py-12 text-center text-sm text-gray-400">Loading...</div>
            ) : jobs.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-400">No open positions at the moment. Check back soon.</div>
            ) : (
              <div className="border-t border-gray-100">
                {jobs.map((job) => (
                  <JobListingCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-gray-100" />

          <div className="max-w-3xl py-16 md:py-20">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-3">
              Get involved
            </h2>
            <p className="text-gray-500 text-[15px] leading-relaxed mb-6 max-w-xl">
              Don't see a role that fits? We're always open to hearing from people who share our mission. Send us a note about who you are and how you'd like to help.
            </p>
            <a
              href="mailto:solarpakinitiative@gmail.com?subject=SolarPak Volunteer Interest"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-green-800 transition-colors group"
            >
              <Mail className="w-4 h-4" />
              solarpakinitiative@gmail.com
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-green-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
