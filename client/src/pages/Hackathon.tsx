import { useRef, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Zap, Trophy, Briefcase, Users, ChevronDown, Mail, Calendar, Code2, FileText, X, Plus, Trash2, ExternalLink, CheckCircle } from "lucide-react";


const faqs = [
  {
    question: "Who can join?",
    answer:
      "Anyone! Students, professionals, and community members from anywhere in the world are welcome to participate. Whether you're 16 or 60, if you care about solar energy and want to help communities in Pakistan, this is for you.",
  },
  {
    question: "Can I participate as a team?",
    answer:
      "Yes. Teams are 3–4 people. We encourage collaboration — diverse teams often produce the most creative solutions.",
  },
  {
    question: "Do I need coding skills?",
    answer:
      "Not necessarily. Division 1 is entirely non-code — your deliverable is a recorded presentation. Division 2 is the coding division where teams build a website, app, or program. You can choose to participate in one or both divisions.",
  },
  {
    question: "How do I submit for Division 1 (non-code)?",
    answer:
      "Teams prepare a 5–7 minute recorded presentation and submit it via a Google Form. Tools like Loom, Google Slides, Canva, or Notion work great.",
  },
  {
    question: "How do I submit for Division 2 (coding)?",
    answer:
      "For non-website projects: submit a GitHub repository with an adequate README and a video demonstrating the application. For websites: submit a GitHub repository with an adequate README and a live link to access the site.",
  },
  {
    question: "How are submissions judged?",
    answer:
      "Each category is scored 1–10. Division 1 is judged on Creativity & Innovation, Feasibility & Practicality, Presentation Confidence, Relevance to SolarPak's Mission, and Team Collaboration. Division 2 adds User Experience and Presentation/Demo quality. Combined scores across both divisions determine final rankings.",
  },
  {
    question: "What's the internship opportunity?",
    answer:
      "Top participants will be considered for an internship with SolarPak. You'll work alongside our team on real projects — from field operations to impact research — and gain hands-on experience in a mission-driven nonprofit.",
  },
  {
    question: "When are winners announced?",
    answer:
      "Within 2 days of each division's submission deadline, judges finalize scores. Winners are announced via email and on the SolarPak website 3 days after each division closes.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-sm font-semibold text-gray-900 group-hover:text-amber-700 transition-colors pr-4">
          {question}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-300 flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-64 opacity-100 pb-5" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-sm text-gray-500 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

function SignupModal({ onClose }: { onClose: () => void }) {
  const [teamName, setTeamName] = useState("");
  const [division, setDivision] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [members, setMembers] = useState([{ name: "", email: "" }]);
  const [kofiEmail, setKofiEmail] = useState("");
  const [donationConfirmed, setDonationConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const signupMutation = useMutation({
    mutationFn: () =>
      apiRequest("POST", "/api/hackathon/signup", {
        teamName,
        division,
        leaderName,
        leaderEmail,
        members: members.filter((m) => m.name.trim() && m.email.trim()),
        kofiEmail,
      }),
    onSuccess: () => setSuccess(true),
    onError: (err: any) => setError(err?.message || "Something went wrong. Please try again."),
  });

  const addMember = () => {
    if (members.length < 4) setMembers([...members, { name: "", email: "" }]);
  };

  const removeMember = (i: number) => {
    setMembers(members.filter((_, idx) => idx !== i));
  };

  const updateMember = (i: number, field: "name" | "email", value: string) => {
    setMembers(members.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const validMembers = members.filter((m) => m.name.trim() && m.email.trim());
    if (!teamName.trim()) return setError("Team name is required.");
    if (!division) return setError("Please select a division.");
    if (!leaderName.trim() || !leaderEmail.trim()) return setError("Team leader details are required.");
    if (validMembers.length === 0) return setError("Add at least one team member.");
    if (!kofiEmail.trim()) return setError("Please enter the email used for your Ko-fi donation.");
    if (!donationConfirmed) return setError("Please confirm you have made the Ko-fi donation.");
    signupMutation.mutate();
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-10 max-w-sm w-full text-center shadow-xl">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">You're registered!</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            We've received your sign-up. We'll review your donation and confirm your team's spot via email.
          </p>
          <button onClick={onClose} className="bg-gray-900 text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-8">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Register your team</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* Team name */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">Team Name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Solar Surge"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          {/* Division */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">Division</label>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
            >
              <option value="">Select division...</option>
              <option value="division1">Division 1 — Non-Code (June 20th)</option>
              <option value="division2">Division 2 — Coding (July 4th)</option>
              <option value="both">Both Divisions</option>
            </select>
          </div>

          {/* Leader */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">Team Leader</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                placeholder="Full name"
                className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <input
                type="email"
                value={leaderEmail}
                onChange={(e) => setLeaderEmail(e.target.value)}
                placeholder="Email"
                className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>

          {/* Members */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">
              Team Members <span className="font-normal normal-case text-gray-400">(3–4 per team)</span>
            </label>
            <div className="space-y-2">
              {members.map((m, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={m.name}
                    onChange={(e) => updateMember(i, "name", e.target.value)}
                    placeholder="Full name"
                    className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                  <input
                    type="email"
                    value={m.email}
                    onChange={(e) => updateMember(i, "email", e.target.value)}
                    placeholder="Email"
                    className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                  {members.length > 1 && (
                    <button type="button" onClick={() => removeMember(i)} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {members.length < 4 && (
              <button
                type="button"
                onClick={addMember}
                className="mt-2 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add member
              </button>
            )}
          </div>

          {/* Ko-fi donation */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-amber-900 uppercase tracking-widest mb-2">Registration Fee</p>
            <p className="text-sm text-amber-800 leading-relaxed mb-3">
              To complete registration, make a donation at our Ko-fi page with the message{" "}
              <strong className="font-bold">hackathon</strong>. This helps fund the prizes and event.
            </p>
            <a
              href="https://ko-fi.com/Manage/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors mb-4"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Donate on Ko-fi →
            </a>
            <div>
              <label className="text-xs font-semibold text-amber-900 mb-1.5 block">Email used for the Ko-fi donation</label>
              <input
                type="email"
                value={kofiEmail}
                onChange={(e) => setKofiEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full text-sm border border-amber-200 bg-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-400 mb-3"
              />
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={donationConfirmed}
                  onChange={(e) => setDonationConfirmed(e.target.checked)}
                  className="mt-0.5 flex-shrink-0"
                />
                <span className="text-xs text-amber-800 leading-relaxed">
                  I confirm I have donated on Ko-fi with the message <strong>hackathon</strong>
                </span>
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg text-sm transition-colors disabled:opacity-60"
          >
            {signupMutation.isPending ? "Submitting..." : "Submit registration"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Hackathon() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeroVisible(true);
      },
      { threshold: 0.2 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}

      <div className="pt-20">
        {/* Hero */}
        <div
          ref={heroRef}
          className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 py-24 md:py-32 overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-amber-500/8 to-orange-500/8 rounded-full blur-3xl" />
          </div>

          <div
            className="container mx-auto px-6 relative z-10 transition-all duration-1000"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 px-4 py-2 rounded-full mb-6">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400/90 font-medium text-xs uppercase tracking-[0.15em]">
                  Flagship Event
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-[1.1] tracking-tight">
                SolarPak Energy<br />
                <span className="text-amber-400">Hackathon</span>
              </h1>
              <p className="text-lg text-gray-400 max-w-lg leading-relaxed mb-8">
                A two-division innovation challenge — one non-code, one coding — open to everyone. Solve real solar energy problems, compete across two weekends, and earn prizes plus internship opportunities.
              </p>
              <button
                onClick={() => setShowSignup(true)}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-8 py-3.5 rounded-md text-sm transition-colors"
              >
                Register your team
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6">
          {/* At a glance */}
          <div className="max-w-5xl mx-auto py-16 md:py-20">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-10">At a glance</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Zap className="w-5 h-5 text-amber-500" />,
                  label: "Format",
                  value: "2 Divisions",
                  sub: "Non-code & Coding",
                },
                {
                  icon: <Trophy className="w-5 h-5 text-amber-500" />,
                  label: "Prize Pool",
                  value: "$300+",
                  sub: "Cash prizes",
                },
                {
                  icon: <Briefcase className="w-5 h-5 text-amber-500" />,
                  label: "Bonus",
                  value: "Internships",
                  sub: "For top performers",
                },
                {
                  icon: <Users className="w-5 h-5 text-amber-500" />,
                  label: "Team size",
                  value: "3–4",
                  sub: "Per team",
                },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-6">
                  <div className="mb-3">{item.icon}</div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">{item.label}</p>
                  <p className="text-xl font-bold text-gray-900 mb-0.5">{item.value}</p>
                  <p className="text-sm text-gray-400">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-5xl mx-auto"><div className="h-px bg-gray-100" /></div>

          {/* Overview */}
          <div className="max-w-5xl mx-auto py-16 md:py-20">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-5">What is it?</h2>
                <p className="text-gray-500 text-[15px] leading-relaxed mb-4">
                  The SolarPak Hackathon spans two weekends, each representing one division — one non-code and one coding. Both divisions follow three main stages: Introduction &amp; Prompt Reveal, Team Work &amp; Development, and Submission &amp; Review.
                </p>
                <p className="text-gray-500 text-[15px] leading-relaxed mb-4">
                  Each division features a unique problem prompt aligned with SolarPak's mission of providing solar energy solutions to underprivileged communities. The event is held online via Google Meet.
                </p>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FileText className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span><span className="font-medium text-gray-700">Non-code submission:</span> Recorded presentation via email (e.g. Loom)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Code2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span><span className="font-medium text-gray-700">Code submission:</span> GitHub repo with README + video demo (or live link for websites)</span>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-5">Why participate?</h2>
                <ul className="space-y-3">
                  {[
                    "Tackle a real-world energy crisis affecting millions",
                    "Win cash prizes and recognition",
                    "Earn an internship with SolarPak",
                    "Build your portfolio with meaningful impact work",
                    "Connect with a global community of changemakers",
                  ].map((item) => (
                    <li
                      key={item}
                      className="text-[15px] text-gray-500 leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-amber-400"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto"><div className="h-px bg-gray-100" /></div>

          {/* Timeline */}
          <div className="max-w-5xl mx-auto py-16 md:py-20">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-10">Timeline</h2>

            <div className="space-y-10">
              {/* Division 1 */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 px-4 py-2 rounded-full">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-800">June 20th — Division 1 (Non-Code)</span>
                  </div>
                </div>
                <div className="space-y-0 border border-gray-100 rounded-xl overflow-hidden">
                  {[
                    {
                      stage: "Stage 1",
                      title: "Introduction & Prompt Reveal",
                      description: "Before formally starting the competition, a brief introduction of SolarPak and its cause is shared with all participants, before smoothly transitioning to the prompt reveal.",
                    },
                    {
                      stage: "Stage 2",
                      title: "Team Development",
                      description: "Teams brainstorm and develop solutions across 5 days. Teams prepare a 5–7 minute recorded presentation.",
                    },
                    {
                      stage: "Stage 3",
                      title: "Submission",
                      description: "Teams submit recorded presentations via Google Form. Judges begin reviewing based on creativity, feasibility, clarity, and relevance to SolarPak's mission.",
                    },
                  ].map((item, i) => (
                    <div key={item.stage} className={`flex gap-6 p-6 ${i < 2 ? "border-b border-gray-100" : ""}`}>
                      <div className="flex-shrink-0">
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{item.stage}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{item.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Division 2 */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full">
                    <Calendar className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-semibold text-slate-800">July 4th — Division 2 (Coding)</span>
                  </div>
                </div>
                <div className="space-y-0 border border-gray-100 rounded-xl overflow-hidden">
                  {[
                    {
                      stage: "Stage 1",
                      title: "Introduction & Prompt Reveal",
                      description: "The prompt is revealed. Participants work across multiple days in their own time — the solution can be a website, program, app, or anything else.",
                    },
                    {
                      stage: "Stage 2",
                      title: "Team Development",
                      description: "Teams work on their projects with the judging criteria in mind.",
                    },
                    {
                      stage: "Stage 3",
                      title: "Submission & Judging",
                      description: "Teams submit via GitHub repository with a video demonstrating the application, or a live link if they built a website. Judges score based on the same criteria as Division 1. Combined scores determine final rankings.",
                    },
                  ].map((item, i) => (
                    <div key={item.stage} className={`flex gap-6 p-6 ${i < 2 ? "border-b border-gray-100" : ""}`}>
                      <div className="flex-shrink-0">
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{item.stage}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{item.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto"><div className="h-px bg-gray-100" /></div>

          {/* Judging Criteria */}
          <div className="max-w-5xl mx-auto py-16 md:py-20">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-3">Judging Criteria</h2>
            <p className="text-gray-500 text-[15px] mb-10">Each category is scored 1–10 per judge.</p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Division 1 criteria */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">Division 1 — Non-Code</h3>
                <div className="space-y-3">
                  {[
                    { name: "Creativity & Innovation", desc: "Originality and uniqueness of the idea." },
                    { name: "Feasibility & Practicality", desc: "Real-world applicability and sustainability." },
                    { name: "Presentation Confidence", desc: "Clarity, structure, and delivery of the presentation." },
                    { name: "Relevance to SolarPak's Mission", desc: "Alignment with SolarPak's goal of promoting solar energy access." },
                    { name: "Team Collaboration", desc: "Teamwork, communication, and role distribution." },
                  ].map((item) => (
                    <div key={item.name} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900 mb-0.5">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Division 2 criteria */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">Division 2 — Coding</h3>
                <div className="space-y-3">
                  {[
                    { name: "Creativity & Innovation", desc: "Originality and uniqueness of the idea." },
                    { name: "User Experience", desc: "How easy can a user navigate the interface of the project." },
                    { name: "Relevance to SolarPak's Mission", desc: "Alignment with SolarPak's goal of promoting solar energy access." },
                    { name: "Presentation", desc: "Explanation and demo of project quality." },
                  ].map((item) => (
                    <div key={item.name} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900 mb-0.5">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto"><div className="h-px bg-gray-100" /></div>

          {/* Prizes */}
          <div className="max-w-5xl mx-auto py-16 md:py-20">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Prizes</h2>
            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl mb-6">
              <Trophy className="w-8 h-8 text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-2xl font-bold text-gray-900">Over $300 in prizes</p>
                <p className="text-sm text-gray-500 mt-0.5">Awarded to the top-performing teams. Combined scores from both divisions determine final rankings.</p>
              </div>
            </div>
            <div className="p-5 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">Internship opportunities</p>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    Beyond cash prizes, top participants will be considered for a real internship with SolarPak. Work on live projects alongside our team and make a tangible difference.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto"><div className="h-px bg-gray-100" /></div>

          {/* Post-Event Timeline */}
          <div className="max-w-5xl mx-auto py-16 md:py-20">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-10">Post-Event Timeline</h2>
            <div className="space-y-0">
              {[
                {
                  timeframe: "Within 2 Days After Each Division",
                  activity: "Judges finalize scores and determine winners.",
                },
                {
                  timeframe: "3 Days After Each Division",
                  activity: "Winners announced via email and the SolarPak website. Participant feedback collected.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-8 py-7 border-b border-gray-50 last:border-b-0">
                  <div className="flex-shrink-0 w-48">
                    <span className="text-xs font-semibold text-amber-600">{item.timeframe}</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.activity}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-5xl mx-auto"><div className="h-px bg-gray-100" /></div>

          {/* FAQ */}
          <div className="max-w-5xl mx-auto py-16 md:py-20">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-10">FAQ</h2>
            <div className="border-t border-gray-100">
              {faqs.map((faq) => (
                <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>

          <div className="max-w-5xl mx-auto"><div className="h-px bg-gray-100" /></div>

          {/* CTA */}
          <div className="max-w-5xl mx-auto py-16 md:py-20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Ready to join?</h2>
                <p className="text-gray-500 text-[15px] leading-relaxed max-w-md">
                  Register your interest now and we'll reach out with everything you need to participate.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <button
                  onClick={() => setShowSignup(true)}
                  className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-7 py-3 rounded-md text-sm transition-colors"
                >
                  Register your team
                </button>
                <a
                  href="mailto:solarpakorg@gmail.com?subject=SolarPak Hackathon Question"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-amber-700 transition-colors px-7 py-3 border border-gray-200 rounded-md hover:border-amber-200"
                >
                  <Mail className="w-4 h-4" />
                  Ask a question
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
