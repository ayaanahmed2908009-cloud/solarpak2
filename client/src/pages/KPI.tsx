import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  weeksElapsed, yearFromWeeks, scoreAllTeams, calcOverallScore, ragStatus,
  DEFAULT_INPUTS,
  type TeamScore,
} from "@/lib/scoring";

type Tab = "scores" | "input" | "history" | "impact" | "settings" | "social" | "sponsorships" | "management" | "labs" | "evts";

type UserRole = "admin" | "team" | "social" | "sponsorships";

interface KpiUser {
  username: string;
  password: string;
  role: UserRole;
  displayName: string;
  teamId: string | null;
}

interface KpiSession {
  username: string;
  role: UserRole;
  displayName: string;
  teamId: string | null;
}

const USERS: KpiUser[] = [
  { username: "ceo", password: "SolarPak@CEO", role: "admin", displayName: "CEO", teamId: null },
  { username: "management", password: "SolarPak@Mgmt", role: "admin", displayName: "General Management", teamId: "management" },
  { username: "socialmedia", password: "SolarPak@Social", role: "social", displayName: "Social Media Head", teamId: null },
  { username: "sponsorships", password: "SolarPak@Spnsr", role: "sponsorships", displayName: "Sponsorships & Fundraising", teamId: null },
  { username: "marketing", password: "SolarPak@Mktg", role: "team", displayName: "Marketing & Social Media", teamId: "marketing" },
  { username: "partnerships", password: "SolarPak@Prtnr", role: "team", displayName: "Partnerships & Outreach", teamId: "partnerships" },
  { username: "impactlabs", password: "SolarPak@Labs", role: "team", displayName: "Impact Labs", teamId: "impactlabs" },
  { username: "events", password: "SolarPak@Events", role: "team", displayName: "Events & Community Outreach", teamId: "events" },
];

const SESSION_KEY = "kpi_session";

function loadSession(): KpiSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveSession(s: KpiSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function KpiLogin({ onLogin }: { onLogin: (s: KpiSession) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = USERS.find(
      (u) => u.username === username.trim().toLowerCase() && u.password === password
    );
    if (!user) {
      setError("Invalid username or password.");
      return;
    }
    const session: KpiSession = {
      username: user.username,
      role: user.role,
      displayName: user.displayName,
      teamId: user.teamId,
    };
    saveSession(session);
    onLogin(session);
  }

  return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-black text-black text-lg">S</div>
          <div>
            <div className="font-black text-white text-lg leading-none">SolarPak</div>
            <div className="text-[12px] text-white/40 mt-0.5">KPI Scoring System</div>
          </div>
        </div>

        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-7">
          <h1 className="text-xl font-bold text-white mb-1">Sign in</h1>
          <p className="text-sm text-white/35 mb-6">Internal access only. Contact your team lead for credentials.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 font-medium">Username</label>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-yellow-400/50 transition-colors"
                placeholder="e.g. marketing"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-white/20 focus:outline-none focus:border-yellow-400/50 transition-colors"
                  placeholder="••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 text-xs px-1"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 active:scale-95 transition-all mt-2"
            >
              Sign In
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-white/20 mt-6">
          SolarPak Internal · Restricted Access
        </p>
      </motion.div>
    </div>
  );
}

const TEAM_META: Record<string, { name: string; color: string }> = {
  marketing: { name: "Marketing & Social Media", color: "#7c3aed" },
  partnerships: { name: "Partnerships & Outreach", color: "#0891b2" },
  management: { name: "General Management", color: "#d97706" },
  impactlabs: { name: "Impact Labs", color: "#16a34a" },
  events: { name: "Events & Community Outreach", color: "#db2777" },
};

const TEAM_IDS = ["marketing", "partnerships", "management", "impactlabs", "events"];

const INPUT_FIELDS: Record<string, { key: string; label: string; hint: string; type: "number" | "decimal" | "binary"; tag?: string }[]> = {
  marketing: [
    { key: "posts_this_week", label: "Posts published this week", hint: "Feeds posts/month KPI and stacked bar chart · Target: 3/week", type: "number" },
    { key: "videos_this_week", label: "Videos published this week", hint: "Combined with posts to calculate post:video ratio trend", type: "number" },
    { key: "follower_gain_this_week", label: "Net follower gain this week", hint: "Feeds cumulative follower growth line chart · Target: 50/week", type: "number" },
    { key: "total_followers", label: "Total followers right now", hint: "Absolute figure for line chart Y-axis and probability gap", type: "number" },
    { key: "avg_engagement_rate", label: "Average engagement rate this week (%)", hint: "Feeds gauge dial and rolling average for probability · e.g. 3.2", type: "decimal" },
    { key: "press_contacts_this_week", label: "Press contacts reached out to this week", hint: "Pipeline proxy for press mentions KPI probability", type: "number" },
    { key: "press_mentions_this_week", label: "Press mentions confirmed this week", hint: "Cumulative count feeds funnel chart and probability", type: "number" },
  ],
  partnerships: [
    { key: "outreach_meetings_this_week", label: "Outreach meetings held this week", hint: "Stage 1 of partner pipeline · feeds conversion rate calc · Target: 0.5/week", type: "number" },
    { key: "prospects_outreach", label: "Prospects currently in outreach stage", hint: "Kanban column 1 badge count (infographic only)", type: "number" },
    { key: "prospects_meeting", label: "Prospects currently in meeting stage", hint: "Kanban column 2 badge count (infographic only)", type: "number" },
    { key: "new_partnerships_this_week", label: "New partnerships formalised this week", hint: "Kanban column 3 · cumulative partner count and probability · Target: ~1 every 8 weeks", type: "number" },
    { key: "total_active_partners", label: "Total active partners right now", hint: "Absolute count for probability gap calculation", type: "number" },
    { key: "communities_reached", label: "Total communities reached (cumulative)", hint: "Number of distinct communities engaged via partners · feeds community reach chart", type: "number" },
    { key: "funds_raised_this_week", label: "Funds raised or committed this week (USD)", hint: "Feeds monthly fundraising bar chart and thermometer", type: "number" },
    { key: "total_funds_ytd", label: "Total funds raised YTD (USD)", hint: "Absolute figure for thermometer fill and probability gap", type: "number" },
  ],
  management: [
    { key: "new_members_this_week", label: "New members joined this week", hint: "Upward tick on headcount line chart · Target: ~8 new/year (14 → 22)", type: "number" },
    { key: "members_left_this_week", label: "Members who left or went inactive this week", hint: "Downward tick on headcount chart · feeds churn and retention calc", type: "number" },
    { key: "total_active_members", label: "Total active members right now", hint: "Absolute figure for headcount chart Y-axis and probability gap", type: "number" },
    { key: "okr_tasks_completed", label: "OKR tasks completed this week", hint: "Numerator for OKR completion rate heatmap", type: "number" },
    { key: "okr_tasks_due", label: "Total OKR tasks due this week", hint: "Denominator for OKR completion rate heatmap", type: "number" },
    { key: "probability_self_assessed", label: "Self-assessed probability of hitting targets (%)", hint: "AI cross-checks this against its own calculation · e.g. 72", type: "decimal" },
    { key: "worker_satisfaction_pct", label: "Worker satisfaction — % satisfied", hint: "Feeds satisfaction donut chart · enter 0 in non-survey weeks", type: "decimal", tag: "QUARTERLY" },
    { key: "survey_respondents", label: "Number of survey respondents", hint: "Low response count reduces AI confidence in satisfaction score", type: "number", tag: "QUARTERLY" },
  ],
  impactlabs: [
    { key: "articles_research_stage", label: "Articles currently in research stage", hint: "Feeds production tracker progress bar stage 1 (infographic only)", type: "number" },
    { key: "articles_draft_stage", label: "Articles currently in draft stage", hint: "Feeds production tracker progress bar stage 2 (infographic only)", type: "number" },
    { key: "articles_review_stage", label: "Articles currently in review stage", hint: "Feeds production tracker progress bar stage 3 (infographic only)", type: "number" },
    { key: "articles_published_this_week", label: "Articles published this week", hint: "Cumulative count vs annual target of 8 for probability", type: "number" },
    { key: "total_articles_ytd", label: "Total articles published YTD", hint: "Absolute count for probability gap calculation", type: "number" },
    { key: "ai_quality_score", label: "AI quality score of report reviewed this week (0–100)", hint: "Feeds quality score trend and probability threshold · enter 0 if no report reviewed", type: "decimal" },
    { key: "data_points_verified", label: "Data points verified or updated this week", hint: "Weekly proxy for data accuracy KPI probability · Target: 3/week", type: "number" },
    { key: "data_accuracy_audit_score", label: "Data accuracy audit score (%)", hint: "Quarterly gauge input and probability · enter 0 in non-audit weeks", type: "decimal", tag: "QUARTERLY" },
    { key: "external_citations_this_week", label: "External citations confirmed this week", hint: "Feeds citation growth bar chart and cumulative count", type: "number" },
    { key: "findings_submitted_externally", label: "SolarPak findings submitted externally this week?", hint: "Feeds 6-week rolling window check in AI probability prompt", type: "binary" },
    { key: "annual_report_pct_complete", label: "Annual impact report % complete", hint: "Feeds report progress bar · update monthly, enter 0 in non-update weeks", type: "number" },
  ],
  events: [
    { key: "planning_hours_this_week", label: "Hours spent on event planning this week", hint: "Effort proxy for events organised KPI when no event is imminent · e.g. 4.5", type: "decimal" },
    { key: "event_active", label: "Is an event live or within 2 weeks?", hint: "Triggers active event highlighting on calendar heatmap", type: "binary" },
    { key: "events_completed_ytd", label: "Events completed YTD", hint: "Absolute count vs annual target for probability gap · Year 1 target: 3", type: "number" },
    { key: "new_registrations_this_week", label: "New registrations confirmed this week", hint: "Cumulative count feeds attendee tracker", type: "number" },
    { key: "total_attendees_ytd", label: "Total confirmed attendees YTD", hint: "Absolute count for probability gap calculation · Year 1 target: 300", type: "number" },
    { key: "sponsor_conversations_this_week", label: "Sponsor or partner conversations held this week", hint: "Pipeline proxy for sponsored events KPI", type: "number" },
    { key: "events_with_sponsor_ytd", label: "Events with a confirmed sponsor YTD", hint: "Absolute count for probability calculation and pipeline tracker", type: "number" },
    { key: "post_event_satisfaction", label: "Post-event satisfaction score (out of 5)", hint: "Feeds satisfaction trend chart · enter 0 if no event closed this week", type: "decimal", tag: "EVENT-TRIGGERED" },
    { key: "repeat_attendees_at_event", label: "Repeat attendees at the closed event", hint: "Numerator for repeat attendee rate", type: "number", tag: "EVENT-TRIGGERED" },
    { key: "total_attendees_at_event", label: "Total attendees at the closed event", hint: "Denominator for repeat rate and avg attendees per event calculation", type: "number", tag: "EVENT-TRIGGERED" },
  ],
};

function ragColors(rag: "green" | "amber" | "red") {
  if (rag === "green") return { bg: "bg-green-900/20", border: "border-green-500/40", text: "text-green-400", badge: "bg-green-500" };
  if (rag === "amber") return { bg: "bg-amber-900/20", border: "border-amber-500/40", text: "text-amber-400", badge: "bg-amber-500" };
  return { bg: "bg-red-900/20", border: "border-red-500/40", text: "text-red-400", badge: "bg-red-500" };
}

function ScoreRing({ score, size = 80, strokeWidth = 8, color }: { score: number; size?: number; strokeWidth?: number; color: string }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em" fill="white" fontSize={size * 0.22} fontWeight="bold">
        {Math.round(score)}
      </text>
    </svg>
  );
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function KPI() {
  const [session, setSession] = useState<KpiSession | null>(() => loadSession());

  if (!session) {
    return <KpiLogin onLogin={(s) => setSession(s)} />;
  }

  return <KpiDashboard session={session} onLogout={() => { clearSession(); setSession(null); }} />;
}

function KpiDashboard({ session, onLogout }: { session: KpiSession; onLogout: () => void }) {
  const isAdmin = session.role === "admin";
  const isSocial = session.role === "social";
  const isSponsorship = session.role === "sponsorships";
  const isViewer = isSocial || isSponsorship;
  const isImpactLabs = session.role === "team" && session.teamId === "impactlabs";
  const isEvents = session.role === "team" && session.teamId === "events";
  const visibleTeamIds = (isAdmin || isViewer) ? TEAM_IDS : (session.teamId ? [session.teamId] : TEAM_IDS);
  const allowedTabs: Tab[] = isSocial
    ? ["social"]
    : isSponsorship
    ? ["sponsorships"]
    : isAdmin
    ? ["scores", "input", "history", "impact", "settings", "social", "sponsorships", "management", "labs", "evts"]
    : isImpactLabs
    ? ["scores", "input", "history", "labs"]
    : isEvents
    ? ["scores", "input", "history", "evts"]
    : ["scores", "input", "history"];

  const [tab, setTab] = useState<Tab>(allowedTabs[0]);
  const [selectedInputTeam, setSelectedInputTeam] = useState(
    () => isAdmin ? 0 : Math.max(0, TEAM_IDS.indexOf(session.teamId || ""))
  );
  const [inputDrafts, setInputDrafts] = useState<Record<string, any>>(
    () => {
      try { return JSON.parse(localStorage.getItem("kpi_drafts") || "{}"); } catch { return {}; }
    }
  );
  const [startDateDraft, setStartDateDraft] = useState("");
  const [saved, setSaved] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(() => {
    try { return JSON.parse(localStorage.getItem("kpi_analysis") || "null"); } catch { return null; }
  });
  const [analysisHistory, setAnalysisHistory] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem("kpi_analysis_history") || "[]"); } catch { return []; }
  });
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const qc = useQueryClient();

  const { data: settings } = useQuery<{ startDate: string }>({
    queryKey: ["/api/kpi/settings"],
  });

  const { data: submissions = [] } = useQuery<any[]>({
    queryKey: ["/api/kpi/submissions"],
  });

  const { data: impactDataList = [] } = useQuery<any[]>({
    queryKey: ["/api/kpi/impact-data"],
  });

  const impactDataMutation = useMutation({
    mutationFn: (body: { month: string; familiesServed: number; co2AvoidedKg: number; adminToken: string }) =>
      apiRequest("POST", "/api/kpi/impact-data", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/kpi/impact-data"] }),
  });

  const settingsMutation = useMutation({
    mutationFn: (startDate: string) =>
      apiRequest("POST", "/api/kpi/settings", { startDate }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/kpi/settings"] }),
  });

  const submitMutation = useMutation({
    mutationFn: (body: any) =>
      apiRequest("POST", "/api/kpi/submissions", body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/kpi/submissions"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const startDate = settings?.startDate || "2025-01-01";
  const weeks = weeksElapsed(startDate);

  useEffect(() => {
    setStartDateDraft(startDate);
  }, [startDate]);

  useEffect(() => {
    localStorage.setItem("kpi_drafts", JSON.stringify(inputDrafts));
  }, [inputDrafts]);

  function getInputs(teamId: string): Record<string, any> {
    return { ...DEFAULT_INPUTS[teamId], ...(inputDrafts[teamId] || {}) };
  }

  function setField(teamId: string, key: string, value: number) {
    setInputDrafts((prev) => ({
      ...prev,
      [teamId]: { ...DEFAULT_INPUTS[teamId], ...(prev[teamId] || {}), [key]: value },
    }));
  }

  const allInputs: Record<string, any> = {};
  TEAM_IDS.forEach((id) => { allInputs[id] = getInputs(id); });

  const teamScores = scoreAllTeams(allInputs, weeks);
  const overallScore = calcOverallScore(teamScores);
  const overallRag = ragStatus(overallScore);

  function handleSubmitTeam(teamId: string) {
    const ts = teamScores.find((t) => t.teamId === teamId);
    if (!ts) return;
    submitMutation.mutate({
      teamId,
      weekNumber: weeks,
      inputs: getInputs(teamId),
      kpiScores: ts.kpiScores,
      teamScore: ts.teamScore,
    });
  }

  async function runAnalysis() {
    setAnalysisLoading(true);
    setAnalysisError(null);
    try {
      const resp = await apiRequest("POST", "/api/kpi/analysis", {
        weekNumber: weeks,
        submissions,
        currentInputs: allInputs,
      });
      const data = await resp.json();
      setAnalysisResult(data);
      localStorage.setItem("kpi_analysis", JSON.stringify(data));
      const newHistory = [...analysisHistory, data].slice(-12);
      setAnalysisHistory(newHistory);
      localStorage.setItem("kpi_analysis_history", JSON.stringify(newHistory));
    } catch (err: any) {
      setAnalysisError(err.message || "Analysis failed");
    } finally {
      setAnalysisLoading(false);
    }
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(submissions, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `solarpak-kpi-history-week${weeks}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleReset() {
    try {
      await apiRequest("DELETE", "/api/kpi/submissions");
      qc.invalidateQueries({ queryKey: ["/api/kpi/submissions"] });
      setAnalysisResult(null);
      setAnalysisHistory([]);
      localStorage.removeItem("kpi_analysis");
      localStorage.removeItem("kpi_analysis_history");
      setResetConfirm(false);
    } catch {}
  }

  // Leadership warning: any team below 50% in all last 6 consecutive analysis runs
  const leadershipWarnings: string[] = [];
  if (analysisHistory.length >= 6) {
    TEAM_IDS.forEach((id) => {
      const last6 = analysisHistory.slice(-6);
      if (last6.every((r) => (r.probabilities?.[id]?.overall ?? 100) < 50)) {
        leadershipWarnings.push(id);
      }
    });
  }

  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const currentYear = yearFromWeeks(weeks);

  const ragColors2 = ragColors(overallRag);

  const historyByTeam: Record<string, any[]> = {};
  (submissions as any[]).forEach((s) => {
    if (!historyByTeam[s.teamId]) historyByTeam[s.teamId] = [];
    historyByTeam[s.teamId].push({
      week: `W${s.weekNumber}`,
      score: Math.round(s.teamScore),
      date: new Date(s.submittedAt).toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
    });
  });

  const overallHistory: any[] = [];
  const weekNums = Array.from(new Set((submissions as any[]).map((s) => s.weekNumber))).sort((a, b) => a - b);
  weekNums.forEach((wk) => {
    const weekSubs = (submissions as any[]).filter((s) => s.weekNumber === wk);
    const avg = weekSubs.reduce((sum, s) => sum + s.teamScore, 0) / (weekSubs.length || 1);
    overallHistory.push({ week: `W${wk}`, score: Math.round(avg) });
  });

  const tabMeta: Record<Tab, { icon: string; label: string }> = {
    scores: { icon: "◉", label: "Scores" },
    input: { icon: "✎", label: "Weekly Input" },
    history: { icon: "◈", label: "History" },
    impact: { icon: "⬡", label: "Impact Charts" },
    settings: { icon: "⚙", label: "Settings" },
    social: { icon: "📱", label: "Social Media" },
    sponsorships: { icon: "🤝", label: "Sponsorships" },
    management: { icon: "🏢", label: "General Mgmt" },
    labs: { icon: "🔬", label: "Impact Labs" },
    evts: { icon: "🎪", label: "Events" },
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-white flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-60 bg-[#0c1326] border-r border-white/8 fixed top-0 left-0 h-full z-20">
          <div className="p-5 border-b border-white/8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-black text-black text-base">S</div>
              <div>
                <div className="font-bold text-white text-sm">SolarPak</div>
                <div className="text-[11px] text-white/40">KPI Scoring System</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {allowedTabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  tab === t
                    ? "bg-yellow-400/15 text-yellow-300 border border-yellow-400/25"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{tabMeta[t].icon}</span>{tabMeta[t].label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/8 space-y-1">
            <div className="text-[10px] text-white/25 uppercase tracking-widest mb-2">Week {weeks}</div>
            {teamScores
              .filter((ts) => visibleTeamIds.includes(ts.teamId))
              .map((ts) => {
                const meta = TEAM_META[ts.teamId];
                const dot = ts.rag === "green" ? "#22c55e" : ts.rag === "amber" ? "#f59e0b" : "#ef4444";
                return (
                  <div key={ts.teamId} className="flex items-center gap-2 py-1">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                    <span className="text-[11px] text-white/50 truncate flex-1">{meta?.name.split(" ")[0]}</span>
                    <span className="text-[11px] font-bold text-white/60">{Math.round(ts.teamScore)}</span>
                  </div>
                );
              })}
          </div>

          {/* User / Logout */}
          <div className="p-4 border-t border-white/8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center text-yellow-300 text-xs font-bold">
                {session.displayName[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate">{session.displayName}</div>
                <div className="text-[10px] text-white/30">{isAdmin ? "Full Access" : isSocial ? "Social Media View" : isSponsorship ? "Sponsorships View" : "Team View"}</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full text-xs text-white/35 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg px-3 py-2 transition-all text-left"
            >
              Sign Out
            </button>
          </div>
        </aside>

        <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
          {/* Top Bar */}
          <header className="sticky top-0 z-10 bg-[#080d1a]/90 backdrop-blur border-b border-white/8 px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-white">
                {tab === "scores" && "Score Dashboard"}
                {tab === "input" && "Weekly Input"}
                {tab === "history" && "Score History"}
                {tab === "impact" && "Impact Summary"}
                {tab === "settings" && "Settings"}
              </h1>
              <p className="text-[11px] text-white/35 mt-0.5">Week {weeks} · Year {currentYear} of 3 · Started {startDate}</p>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold ${ragColors2.bg} ${ragColors2.border} ${ragColors2.text}`}>
                  <span>Overall</span>
                  <span className="text-xl font-black">{Math.round(overallScore)}</span>
                </div>
              )}
              {!isAdmin && session.teamId && (() => {
                const myTs = teamScores.find((t) => t.teamId === session.teamId);
                const myRag = myTs ? ragColors(myTs.rag) : ragColors("red");
                return myTs ? (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold ${myRag.bg} ${myRag.border} ${myRag.text}`}>
                    <span>Score</span>
                    <span className="text-xl font-black">{Math.round(myTs.teamScore)}</span>
                  </div>
                ) : null;
              })()}
              {/* Mobile sign out */}
              <button
                onClick={onLogout}
                className="md:hidden text-xs text-white/35 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-lg px-3 py-2 transition-all"
              >
                Sign Out
              </button>
            </div>
          </header>

          <main className="flex-1 p-6">
            {/* Leadership Warning Banner */}
            {leadershipWarnings.length > 0 && (
              <div className="mb-4 p-4 bg-red-500/15 border border-red-500/40 rounded-2xl flex flex-wrap items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-lg">⚠</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-red-400 mb-1">Leadership Review Triggered</div>
                  {leadershipWarnings.map((id) => (
                    <div key={id} className="text-xs text-red-300/70">
                      <span className="font-semibold" style={{ color: TEAM_META[id]?.color }}>{TEAM_META[id]?.name}</span>
                      {" — "}Leadership review triggered — this team has been below 50% probability for 6 consecutive weeks.
                    </div>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {tab === "scores" && (
                <motion.div key="scores" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
                  <ScoresTab
                    teamScores={teamScores}
                    overallScore={overallScore}
                    overallRag={overallRag}
                    weeks={weeks}
                    visibleTeamIds={visibleTeamIds}
                    isAdmin={isAdmin}
                    historyByTeam={historyByTeam}
                    submissions={submissions as any[]}
                    analysisResult={analysisResult}
                    analysisLoading={analysisLoading}
                    analysisError={analysisError}
                    onRunAnalysis={runAnalysis}
                  />
                </motion.div>
              )}
              {tab === "input" && (
                <motion.div key="input" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
                  <InputTab
                    selectedTeam={selectedInputTeam}
                    setSelectedTeam={isAdmin ? setSelectedInputTeam : () => {}}
                    teamScores={teamScores}
                    getInputs={getInputs}
                    setField={setField}
                    handleSubmit={handleSubmitTeam}
                    isPending={submitMutation.isPending}
                    saved={saved}
                    visibleTeamIds={visibleTeamIds}
                    isAdmin={isAdmin}
                  />
                </motion.div>
              )}
              {tab === "history" && (
                <motion.div key="history" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
                  <HistoryTab
                    historyByTeam={historyByTeam}
                    overallHistory={overallHistory}
                    visibleTeamIds={visibleTeamIds}
                    isAdmin={isAdmin}
                  />
                </motion.div>
              )}
              {tab === "impact" && isAdmin && (
                <motion.div key="impact" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
                  <ImpactTab
                    submissions={submissions as any[]}
                    impactData={impactDataList}
                    isAdmin={isAdmin}
                    onSaveImpact={(month, families, co2, adminToken) =>
                      impactDataMutation.mutate({ month, familiesServed: families, co2AvoidedKg: co2, adminToken })
                    }
                  />
                </motion.div>
              )}
              {tab === "settings" && isAdmin && (
                <motion.div key="settings" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
                  <SettingsTab
                    startDateDraft={startDateDraft}
                    setStartDateDraft={setStartDateDraft}
                    onSave={() => settingsMutation.mutate(startDateDraft)}
                    isPending={settingsMutation.isPending}
                    weeks={weeks}
                    submissionCount={(submissions as any[]).length}
                    onExport={handleExport}
                    onReset={handleReset}
                    resetConfirm={resetConfirm}
                    setResetConfirm={setResetConfirm}
                  />
                </motion.div>
              )}
              {tab === "social" && (isAdmin || isSocial) && (() => {
                const mkt = teamScores.find((t) => t.teamId === "marketing");
                if (!mkt) return null;
                const meta = TEAM_META["marketing"];
                const ringColor = mkt.rag === "green" ? "#22c55e" : mkt.rag === "amber" ? "#f59e0b" : "#ef4444";
                return (
                  <motion.div key="social" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-white mb-1">Social Media Dashboard</h2>
                      <p className="text-sm text-white/40">Marketing &amp; Social Media team · Week {weeks}</p>
                    </div>
                    <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: meta?.color }} />
                        <h2 className="text-lg font-bold text-white">{meta?.name}</h2>
                        <div className={`ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${mkt.rag === "green" ? "bg-green-500/15 text-green-400" : mkt.rag === "amber" ? "bg-amber-500/15 text-amber-400" : "bg-red-500/15 text-red-400"}`}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ringColor }} />
                          {mkt.rag === "green" ? "On Track" : mkt.rag === "amber" ? "Needs Attention" : "Critical"}
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex flex-col items-center gap-2">
                          <ScoreRing score={mkt.teamScore} size={140} strokeWidth={12} color={ringColor} />
                          <div className="text-xs text-white/35">Weekly Score</div>
                          <div className="text-xs text-white/25">Target: 70 / 100</div>
                        </div>
                        <div className="flex-1 w-full">
                          <div className="text-xs text-white/35 uppercase tracking-widest mb-2 text-center">KPI Radar</div>
                          <ResponsiveContainer width="100%" height={200}>
                            <RadarChart data={mkt.kpiScores.map((k) => ({ name: k.name, score: k.score, target: 70 }))}>
                              <PolarGrid stroke="rgba(255,255,255,0.08)" />
                              <PolarAngleAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} />
                              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                              <Radar name="Target" dataKey="target" stroke="#facc15" fill="#facc15" fillOpacity={0.06} strokeWidth={1} strokeDasharray="4 3" />
                              <Radar name="Score" dataKey="score" stroke={meta?.color} fill={meta?.color} fillOpacity={0.3} strokeWidth={2.5} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="w-full md:w-56 space-y-3">
                          {mkt.kpiScores.map((kpi) => {
                            const kColor = kpi.rag === "green" ? "#22c55e" : kpi.rag === "amber" ? "#f59e0b" : "#ef4444";
                            return (
                              <div key={kpi.name}>
                                <div className="flex justify-between mb-1">
                                  <span className="text-xs text-white/50">{kpi.name}</span>
                                  <span className="text-xs font-bold" style={{ color: kColor }}>{Math.round(kpi.score)}</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div className="h-full rounded-full" style={{ backgroundColor: kColor }}
                                    initial={{ width: 0 }} animate={{ width: `${kpi.score}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
              {tab === "sponsorships" && (isAdmin || isSponsorship) && (() => {
                const prtnr = teamScores.find((t) => t.teamId === "partnerships");
                if (!prtnr) return null;
                const meta = TEAM_META["partnerships"];
                const ringColor = prtnr.rag === "green" ? "#22c55e" : prtnr.rag === "amber" ? "#f59e0b" : "#ef4444";
                return (
                  <motion.div key="sponsorships" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-white mb-1">Sponsorships &amp; Fundraising Dashboard</h2>
                      <p className="text-sm text-white/40">Partnerships &amp; Outreach team · Week {weeks}</p>
                    </div>
                    <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: meta?.color }} />
                        <h2 className="text-lg font-bold text-white">{meta?.name}</h2>
                        <div className={`ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${prtnr.rag === "green" ? "bg-green-500/15 text-green-400" : prtnr.rag === "amber" ? "bg-amber-500/15 text-amber-400" : "bg-red-500/15 text-red-400"}`}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ringColor }} />
                          {prtnr.rag === "green" ? "On Track" : prtnr.rag === "amber" ? "Needs Attention" : "Critical"}
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex flex-col items-center gap-2">
                          <ScoreRing score={prtnr.teamScore} size={140} strokeWidth={12} color={ringColor} />
                          <div className="text-xs text-white/35">Weekly Score</div>
                          <div className="text-xs text-white/25">Target: 70 / 100</div>
                        </div>
                        <div className="flex-1 w-full">
                          <div className="text-xs text-white/35 uppercase tracking-widest mb-2 text-center">KPI Radar</div>
                          <ResponsiveContainer width="100%" height={200}>
                            <RadarChart data={prtnr.kpiScores.map((k) => ({ name: k.name, score: k.score, target: 70 }))}>
                              <PolarGrid stroke="rgba(255,255,255,0.08)" />
                              <PolarAngleAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} />
                              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                              <Radar name="Target" dataKey="target" stroke="#facc15" fill="#facc15" fillOpacity={0.06} strokeWidth={1} strokeDasharray="4 3" />
                              <Radar name="Score" dataKey="score" stroke={meta?.color} fill={meta?.color} fillOpacity={0.3} strokeWidth={2.5} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="w-full md:w-56 space-y-3">
                          {prtnr.kpiScores.map((kpi) => {
                            const kColor = kpi.rag === "green" ? "#22c55e" : kpi.rag === "amber" ? "#f59e0b" : "#ef4444";
                            return (
                              <div key={kpi.name}>
                                <div className="flex justify-between mb-1">
                                  <span className="text-xs text-white/50">{kpi.name}</span>
                                  <span className="text-xs font-bold" style={{ color: kColor }}>{Math.round(kpi.score)}</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div className="h-full rounded-full" style={{ backgroundColor: kColor }}
                                    initial={{ width: 0 }} animate={{ width: `${kpi.score}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}

              {tab === "management" && isAdmin && (
                <motion.div key="management" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-1">General Management Dashboard</h2>
                    <p className="text-sm text-white/40">Headcount · OKR Heatmap · Team Satisfaction · Week {weeks}</p>
                  </div>
                  <ManagementAnalyticsPanel historyByTeam={historyByTeam} weeks={weeks} submissions={submissions as any[]} />
                </motion.div>
              )}

              {tab === "labs" && (isAdmin || isImpactLabs) && (
                <motion.div key="labs" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-1">Impact Labs Dashboard</h2>
                    <p className="text-sm text-white/40">Article pipeline · AI quality scores · citation growth · Week {weeks}</p>
                  </div>
                  <ImpactLabsAnalyticsPanel weeks={weeks} />
                </motion.div>
              )}

              {tab === "evts" && (isAdmin || isEvents) && (
                <motion.div key="evts" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-1">Events & Community Dashboard</h2>
                    <p className="text-sm text-white/40">Calendar heatmap · attendee mix · satisfaction trend · 2025</p>
                  </div>
                  <EventsAnalyticsPanel />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          <footer className="px-6 py-3 border-t border-white/8 flex items-center justify-between text-[11px] text-white/25">
            <span>SolarPak KPI System · Year {currentYear} of 3</span>
            <span>Last updated: {today}</span>
          </footer>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0c1326] border-t border-white/8 z-20 flex">
        {allowedTabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-all ${tab === t ? "text-yellow-400" : "text-white/35"}`}>
            <span className="text-base">{tabMeta[t].icon}</span>
            {tabMeta[t].label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function ExecutiveSummaryPanel({ teamScores, overallScore, historyByTeam, weeks }: {
  teamScores: TeamScore[];
  overallScore: number;
  historyByTeam: Record<string, any[]>;
  weeks: number;
}) {
  const [ragSort, setRagSort] = useState<"rag" | "team" | "score">("rag");

  const allKpis: { team: string; teamColor: string; kpi: string; score: number; rag: "green" | "amber" | "red" }[] = [];
  teamScores.forEach((ts) => {
    ts.kpiScores.forEach((k) => {
      allKpis.push({ team: TEAM_META[ts.teamId]?.name.split(" ")[0], teamColor: TEAM_META[ts.teamId]?.color, kpi: k.name, score: k.score, rag: k.rag });
    });
  });
  const ragOrder = { red: 0, amber: 1, green: 2 };
  const sortedKpis = [...allKpis].sort((a, b) => {
    if (ragSort === "rag") return ragOrder[a.rag] - ragOrder[b.rag];
    if (ragSort === "team") return a.team.localeCompare(b.team);
    return a.score - b.score;
  });

  return (
    <div className="space-y-6">
      {/* 1. Speedometer + Team Pentagon Radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6 flex flex-col items-center">
          <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">Weekly Score Speedometer</div>
          <p className="text-[11px] text-white/20 mb-4 text-center">Composite executive score — Week {weeks}</p>
          <Speedometer score={overallScore} />
          <div className="mt-3 flex gap-5 text-[11px]">
            <div className="flex items-center gap-1.5 text-red-400"><span className="w-2.5 h-2.5 rounded-sm bg-red-500/40" />0–49 Critical</div>
            <div className="flex items-center gap-1.5 text-amber-400"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500/40" />50–69 At Risk</div>
            <div className="flex items-center gap-1.5 text-green-400"><span className="w-2.5 h-2.5 rounded-sm bg-green-500/40" />70+ On Track</div>
          </div>
        </div>

        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6 flex flex-col">
          <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">Team Performance Radar</div>
          <p className="text-[11px] text-white/20 mb-2">Pentagon — each axis = one team's weekly score</p>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={230}>
              <RadarChart
                data={teamScores.map((ts) => ({
                  team: TEAM_META[ts.teamId]?.name.split(" ")[0],
                  score: Math.round(ts.teamScore),
                  target: 70,
                }))}
                margin={{ top: 16, right: 28, bottom: 16, left: 28 }}
              >
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis
                  dataKey="team"
                  tick={({ x, y, payload }: any) => {
                    const ts = teamScores.find((t) => TEAM_META[t.teamId]?.name.split(" ")[0] === payload.value);
                    const c = ts ? TEAM_META[ts.teamId]?.color : "#fff";
                    return <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill={c} fontSize={11} fontWeight={600}>{payload.value}</text>;
                  }}
                />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Target" dataKey="target" stroke="#facc15" fill="#facc15" fillOpacity={0.05} strokeWidth={1} strokeDasharray="4 3" />
                <Radar name="Score" dataKey="score" stroke="#facc15" fill="#facc15" fillOpacity={0.18} strokeWidth={2.5} dot={{ fill: "#facc15", r: 4 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 text-[10px] text-white/30 justify-center mt-1">
            <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-yellow-400" />Score</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded border-t border-dashed border-yellow-400/50" style={{ borderTopStyle: "dashed" }} />Target 70</div>
          </div>
        </div>
      </div>

      {/* 2. 6-week mini trend charts per team */}
      <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
        <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">6-Week Score Trend per Team</div>
        <p className="text-[11px] text-white/20 mb-5">Red line at 50 — teams below this for 6+ weeks trigger a leadership review</p>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {teamScores.map((ts) => {
            const meta = TEAM_META[ts.teamId];
            const hist = (historyByTeam[ts.teamId] || []).slice(0, 6).reverse();
            const chartData = hist.length > 0 ? hist : [{ week: "now", score: Math.round(ts.teamScore) }];
            const c = meta?.color;
            return (
              <div key={ts.teamId} className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c }} />
                  <span className="text-[11px] font-semibold text-white/60">{meta?.name.split(" ")[0]}</span>
                  <span className="ml-auto text-[11px] font-black" style={{ color: c }}>{Math.round(ts.teamScore)}</span>
                </div>
                <ResponsiveContainer width="100%" height={80}>
                  <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                    <YAxis domain={[0, 100]} hide />
                    <XAxis dataKey="week" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 8 }} axisLine={false} tickLine={false} />
                    <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="3 2" strokeWidth={1.5} opacity={0.6} />
                    <ReferenceLine y={70} stroke="#22c55e" strokeDasharray="3 2" strokeWidth={1} opacity={0.35} />
                    <Line type="monotone" dataKey="score" stroke={c} strokeWidth={2} dot={{ fill: c, r: 2.5 }} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
        <div className="flex gap-5 mt-3 text-[10px] text-white/30">
          <div className="flex items-center gap-1.5"><span className="w-4 border-t border-dashed border-red-400/60" style={{ borderTopStyle: "dashed" }} />Review trigger at 50</div>
          <div className="flex items-center gap-1.5"><span className="w-4 border-t border-dashed border-green-400/40" style={{ borderTopStyle: "dashed" }} />Target at 70</div>
        </div>
      </div>

      {/* 3. RAG Status Summary Table */}
      <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs font-semibold text-white/40 uppercase tracking-widest">RAG Status Summary</div>
          <div className="flex gap-1">
            {(["rag", "team", "score"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setRagSort(s)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${ragSort === s ? "bg-yellow-400/15 text-yellow-300 border border-yellow-400/30" : "text-white/30 hover:text-white/60 hover:bg-white/5"}`}
              >
                Sort: {s === "rag" ? "Status" : s === "team" ? "Team" : "Score ↑"}
              </button>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-white/20 mb-4">All {allKpis.length} KPIs across {teamScores.length} teams — scan for reds first</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left text-white/30 font-medium pb-2 pr-3 w-8">Status</th>
                <th className="text-left text-white/30 font-medium pb-2 pr-3">KPI</th>
                <th className="text-left text-white/30 font-medium pb-2 pr-3">Team</th>
                <th className="text-right text-white/30 font-medium pb-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {sortedKpis.map((row, i) => {
                const dotColor = row.rag === "green" ? "#22c55e" : row.rag === "amber" ? "#f59e0b" : "#ef4444";
                return (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="py-2 pr-3">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: dotColor }} />
                    </td>
                    <td className="py-2 pr-3 text-white/70 font-medium">{row.kpi}</td>
                    <td className="py-2 pr-3">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: row.teamColor }} />
                        <span className="text-white/40">{row.team}</span>
                      </span>
                    </td>
                    <td className="py-2 text-right font-bold" style={{ color: dotColor }}>{Math.round(row.score)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Speedometer({ score }: { score: number }) {
  const W = 300, H = 248;
  const cx = 150, cy = 158;
  const r = 110;
  const trackSW = 26;

  // 270° sweep: score 0 → 225°, score 100 → -45° (clockwise on screen)
  function ang(s: number): number {
    return (225 - s * 2.7) * (Math.PI / 180);
  }
  function pt(s: number, rr = r): [number, number] {
    const a = ang(s);
    return [+(cx + rr * Math.cos(a)).toFixed(2), +(cy - rr * Math.sin(a)).toFixed(2)];
  }
  function arc(s1: number, s2: number): string {
    const [x1, y1] = pt(s1);
    const [x2, y2] = pt(s2);
    const large = (s2 - s1) * 2.7 > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }

  const nc = score >= 70 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const [nx, ny] = pt(score, r * 0.74);

  // Tick dividers at zone boundaries
  const dividers = [
    { s: 50, color: "#f59e0b" },
    { s: 70, color: "#22c55e" },
  ];

  // Labels outside the track
  const labelR = r + trackSW / 2 + 14;
  const labels = [
    { s: 0, text: "0" },
    { s: 50, text: "50" },
    { s: 100, text: "100" },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 340 }}>
      <defs>
        <filter id="ndl-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodColor={nc} floodOpacity="0.6" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="shadow" />
          <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="hub-grad" cx="50%" cy="50%">
          <stop offset="0%" stopColor={nc} stopOpacity="0.9" />
          <stop offset="100%" stopColor={nc} stopOpacity="0.6" />
        </radialGradient>
      </defs>

      {/* Background track */}
      <path d={arc(0, 100)} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={trackSW} />

      {/* Color zone bands */}
      <path d={arc(0, 49)}   fill="none" stroke="#ef4444" strokeWidth={trackSW} opacity={0.28} strokeLinecap="butt" />
      <path d={arc(49, 70)}  fill="none" stroke="#f59e0b" strokeWidth={trackSW} opacity={0.28} strokeLinecap="butt" />
      <path d={arc(70, 100)} fill="none" stroke="#22c55e" strokeWidth={trackSW} opacity={0.28} strokeLinecap="butt" />

      {/* Score fill (thinner, bright) */}
      {score > 0.5 && (
        <path d={arc(0, Math.min(score, 99.9))} fill="none" stroke={nc} strokeWidth={trackSW - 12}
              strokeLinecap="round" opacity={0.95} />
      )}

      {/* Zone divider lines */}
      {dividers.map(({ s, color }) => {
        const a = ang(s);
        const [x1, y1] = pt(s, r - trackSW / 2 - 1);
        const [x2, y2] = pt(s, r + trackSW / 2 + 1);
        return <line key={s} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2.5} opacity={0.9} />;
      })}

      {/* Outer tick labels */}
      {labels.map(({ s, text }) => {
        const [lx, ly] = pt(s, labelR);
        return (
          <text key={s} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                fill="rgba(255,255,255,0.32)" fontSize={9.5} fontWeight={500}>{text}</text>
        );
      })}

      {/* Needle shadow */}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={nc} strokeWidth={6} strokeLinecap="round" opacity={0.15} />
      {/* Needle */}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="white" strokeWidth={2.5} strokeLinecap="round" filter="url(#ndl-glow)" />

      {/* Hub */}
      <circle cx={cx} cy={cy} r={13} fill={nc} opacity={0.12} />
      <circle cx={cx} cy={cy} r={8} fill="url(#hub-grad)" />
      <circle cx={cx} cy={cy} r={3.5} fill="#080d1a" />

      {/* Score */}
      <text x={cx} y={cy + 34} textAnchor="middle" fill="white" fontSize={50} fontWeight="900"
            style={{ fontVariantNumeric: "tabular-nums" }}>{Math.round(score)}</text>
      <text x={cx} y={cy + 50} textAnchor="middle" fill="rgba(255,255,255,0.22)" fontSize={11}>out of 100</text>
      <text x={cx} y={cy + 66} textAnchor="middle" fill={nc} fontSize={10} fontWeight={700}
            letterSpacing="1.2">{score >= 70 ? "ON TRACK" : score >= 50 ? "NEEDS ATTENTION" : "CRITICAL"}</text>

      {/* Zone legend inside bottom gap */}
      <text x={54} y={H - 10} fill="#ef4444" fontSize={8.5} opacity={0.65} textAnchor="middle">Critical</text>
      <text x={150} y={H - 2} fill="#f59e0b" fontSize={8.5} opacity={0.65} textAnchor="middle">At Risk</text>
      <text x={246} y={H - 10} fill="#22c55e" fontSize={8.5} opacity={0.65} textAnchor="middle">On Track</text>
    </svg>
  );
}

// ─── Management Analytics ────────────────────────────────────────────────────


function HeadcountDot(props: any) {
  const { cx, cy, payload } = props;
  if (!payload || (!payload.joins && !payload.departures)) {
    return <circle cx={cx} cy={cy} r={2} fill="#60a5fa" opacity={0.6} />;
  }
  return (
    <g>
      {(payload.joins ?? 0) > 0 && (
        <g>
          <polygon points={`${cx},${cy - 14} ${cx - 5},${cy - 7} ${cx + 5},${cy - 7}`} fill="#22c55e" opacity={0.9} />
          {payload.joins > 1 && (
            <text x={cx} y={cy - 17} textAnchor="middle" fill="#22c55e" fontSize={8} fontWeight={700}>+{payload.joins}</text>
          )}
        </g>
      )}
      {(payload.departures ?? 0) > 0 && (
        <g>
          <polygon points={`${cx},${cy + 14} ${cx - 5},${cy + 7} ${cx + 5},${cy + 7}`} fill="#ef4444" opacity={0.9} />
        </g>
      )}
      <circle cx={cx} cy={cy} r={2.5} fill="#60a5fa" />
    </g>
  );
}

function OkrHeatmap({ weeks, submissions }: { weeks: number; submissions: any[] }) {
  const displayWeeks = Math.min(weeks, 52);
  const teams = [
    { id: "marketing",    label: "Marketing" },
    { id: "partnerships", label: "Partnerships" },
    { id: "management",   label: "Management" },
    { id: "impactlabs",   label: "Impact Labs" },
    { id: "events",       label: "Events" },
  ];
  const labelW = 86;
  const cellH = 30;
  const headerH = 20;
  const gap = 1;
  const maxCellW = 32;
  const minCellW = 10;
  const availW = 680;
  const cellW = Math.max(minCellW, Math.min(maxCellW, Math.floor((availW - labelW) / displayWeeks)));
  const svgW = labelW + displayWeeks * cellW;
  const svgH = headerH + teams.length * (cellH + gap);

  const liveMatrix: Record<string, Record<number, number>> = {};
  submissions.forEach((s: any) => {
    if (!liveMatrix[s.teamId]) liveMatrix[s.teamId] = {};
    liveMatrix[s.teamId][s.weekNumber] = Math.round(s.teamScore ?? 0);
  });
  const hasAnyData = submissions.length > 0;

  function scoreColor(s: number) {
    if (s >= 90) return "#14532d";
    if (s >= 80) return "#166534";
    if (s >= 70) return "#15803d";
    if (s >= 60) return "#16a34a";
    if (s >= 50) return "#d97706";
    return "#b91c1c";
  }
  function scoreOpacity(s: number) { return 0.18 + (s / 100) * 0.72; }

  if (!hasAnyData) {
    return (
      <div className="flex items-center justify-center h-32 text-white/30 text-xs text-center">
        No data yet — submit weekly inputs to see the OKR heatmap
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH} style={{ minWidth: svgW }}>
        {Array.from({ length: displayWeeks }, (_, wi) => {
          const showLabel = displayWeeks <= 20 || wi % Math.ceil(displayWeeks / 16) === 0;
          return showLabel ? (
            <text key={wi} x={labelW + wi * cellW + cellW / 2} y={12}
                  textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize={7.5}>W{wi + 1}</text>
          ) : null;
        })}
        {teams.map((team, ti) => {
          const rowY = headerH + ti * (cellH + gap);
          const teamScores = liveMatrix[team.id] ?? {};
          return (
            <g key={team.id}>
              <text x={labelW - 5} y={rowY + cellH / 2 + 1} textAnchor="end" dominantBaseline="middle"
                    fill="rgba(255,255,255,0.45)" fontSize={9}>{team.label}</text>
              {Array.from({ length: displayWeeks }, (_, wi) => {
                const weekNum = wi + 1;
                const score = teamScores[weekNum];
                const hasScore = score !== undefined;
                return (
                  <g key={wi}>
                    <rect x={labelW + wi * cellW + gap} y={rowY} width={cellW - gap} height={cellH}
                          rx={2}
                          fill={hasScore ? scoreColor(score) : "rgba(255,255,255,0.04)"}
                          opacity={hasScore ? scoreOpacity(score) : 1} />
                    {cellW >= 22 && hasScore && (
                      <text x={labelW + wi * cellW + cellW / 2} y={rowY + cellH / 2 + 1}
                            textAnchor="middle" dominantBaseline="middle"
                            fill="rgba(255,255,255,0.75)" fontSize={7.5}>{Math.round(score)}</text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function SatisfactionDonut({ satisfactionHistory }: { satisfactionHistory: { period: string; satisfied: number }[] }) {
  const current = satisfactionHistory.length > 0
    ? satisfactionHistory[satisfactionHistory.length - 1]
    : null;
  const pct = current ? current.satisfied : 0;
  const target = 90;
  const nc = pct >= target ? "#22c55e" : pct >= target - 10 ? "#f59e0b" : "#ef4444";
  const data = [
    { name: "Satisfied", value: pct },
    { name: "Gap", value: 100 - pct },
  ];

  if (!current) {
    return (
      <div className="flex items-center justify-center h-[180px] text-white/30 text-xs text-center">
        No satisfaction data yet
      </div>
    );
  }

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={54} outerRadius={78}
               dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
            <Cell fill={nc} opacity={0.88} />
            <Cell fill="rgba(255,255,255,0.05)" />
          </Pie>
          <Pie data={[{ value: target }, { value: 100 - target }]} cx="50%" cy="50%"
               innerRadius={80} outerRadius={82} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
            <Cell fill="#facc15" opacity={0.6} />
            <Cell fill="transparent" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-4xl font-black" style={{ color: nc }}>{pct}%</div>
        <div className="text-[10px] text-white/35 mt-0.5">satisfied</div>
        <div className={`text-[10px] font-bold mt-1 ${pct >= target ? "text-green-400" : "text-amber-400"}`}>
          target {target}%
        </div>
      </div>
    </div>
  );
}

function ManagementAnalyticsPanel({ historyByTeam, weeks, submissions }: {
  historyByTeam: Record<string, any[]>;
  weeks: number;
  submissions: any[];
}) {
  const mgmtSubs = submissions
    .filter((s: any) => s.teamId === "management")
    .sort((a: any, b: any) => a.weekNumber - b.weekNumber);

  const slice = mgmtSubs.map((s: any) => ({
    week: `W${s.weekNumber}`,
    headcount: (s.inputs as any)?.total_active_members ?? 0,
    joins: (s.inputs as any)?.new_members_this_week ?? 0,
    departures: (s.inputs as any)?.members_left_this_week ?? 0,
  }));

  const currentHC = slice.length > 0 ? slice[slice.length - 1].headcount : 0;
  const phase = currentHC >= 70 ? 3 : currentHC >= 40 ? 2 : currentHC >= 22 ? 1 : 0;

  const satisfactionHistory = mgmtSubs
    .filter((s: any) => (s.inputs as any)?.worker_satisfaction_pct > 0)
    .map((s: any) => ({
      period: `W${s.weekNumber}`,
      satisfied: Math.round((s.inputs as any).worker_satisfaction_pct),
    }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-5 rounded-full bg-violet-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">General Management Analytics</h3>
        <span className="text-[10px] text-white/25 ml-auto">Headcount · OKRs · Satisfaction</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── Headcount Growth ── */}
        <div className="lg:col-span-2 bg-[#0c1326] border border-white/10 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Headcount Growth</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{currentHC || "—"}</span>
                <span className="text-xs text-white/30">active members</span>
                {currentHC > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${phase >= 1 ? "bg-blue-500/15 text-blue-400" : "bg-white/5 text-white/30"}`}>
                    Phase {phase > 0 ? phase : "—"} reached
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3 text-[10px] text-white/40 mt-1">
              <span className="flex items-center gap-1"><span className="text-green-400 font-bold">▲</span> Joins</span>
              <span className="flex items-center gap-1"><span className="text-red-400 font-bold">▽</span> Departures</span>
            </div>
          </div>
          {slice.length === 0 ? (
            <div className="flex items-center justify-center h-[185px] text-white/30 text-xs text-center">
              No data yet — submit weekly management inputs
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={185}>
              <LineChart data={slice} margin={{ top: 22, right: 48, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 8.5 }}
                       axisLine={false} tickLine={false}
                       interval={Math.max(0, Math.floor(slice.length / 8) - 1)} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 8.5 }}
                       axisLine={false} tickLine={false} domain={[0, 75]} />
                <Tooltip contentStyle={{ background: "#0d1526", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }}
                         itemStyle={{ color: "white" }} labelStyle={{ color: "rgba(255,255,255,0.45)" }}
                         formatter={(v: any, name: string) => name === "headcount" ? [`${v} members`, "Headcount"] : [v, name]} />
                <ReferenceLine y={22} stroke="#60a5fa" strokeDasharray="4 3" strokeOpacity={0.55}
                               label={{ value: "Ph.1 · 22", position: "right", fill: "#60a5fa", fontSize: 8.5, opacity: 0.7 }} />
                <ReferenceLine y={40} stroke="#a78bfa" strokeDasharray="4 3" strokeOpacity={0.55}
                               label={{ value: "Ph.2 · 40", position: "right", fill: "#a78bfa", fontSize: 8.5, opacity: 0.7 }} />
                <ReferenceLine y={70} stroke="#f472b6" strokeDasharray="4 3" strokeOpacity={0.55}
                               label={{ value: "Ph.3 · 70", position: "right", fill: "#f472b6", fontSize: 8.5, opacity: 0.7 }} />
                <Line type="monotone" dataKey="headcount" stroke="#60a5fa" strokeWidth={2.5}
                      dot={<HeadcountDot />} activeDot={{ r: 5, fill: "#60a5fa", strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ── Satisfaction Donut ── */}
        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-5 flex flex-col">
          <div className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">Team Satisfaction</div>
          <div className="text-[10px] text-white/20 mb-2">Weekly survey · target ≥ 90%</div>
          <SatisfactionDonut satisfactionHistory={satisfactionHistory} />
          <div className="mt-auto space-y-1.5 pt-2">
            {satisfactionHistory.slice(-4).map((h) => {
              const c = h.satisfied >= 90 ? "#22c55e" : h.satisfied >= 80 ? "#f59e0b" : "#ef4444";
              return (
                <div key={h.period} className="flex items-center gap-2">
                  <span className="text-[9.5px] text-white/30 w-14 shrink-0">{h.period}</span>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${h.satisfied}%`, backgroundColor: c }} />
                  </div>
                  <span className="text-[9.5px] font-bold w-7 text-right" style={{ color: c }}>{h.satisfied}%</span>
                </div>
              );
            })}
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-[9px] text-white/20 w-14 shrink-0">Target</span>
              <div className="flex-1 h-px border-t border-dashed border-yellow-400/40" />
              <span className="text-[9px] text-yellow-400/60 w-7 text-right">90%</span>
            </div>
          </div>
        </div>

        {/* ── OKR Heatmap ── */}
        <div className="lg:col-span-3 bg-[#0c1326] border border-white/10 rounded-2xl p-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
            <div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">OKR Completion Heatmap</div>
              <div className="text-[10px] text-white/20">Teams × weeks — cell colour = OKR completion rate</div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {[
                { label: "< 50", bg: "rgba(185,28,28,0.45)", fg: "#fca5a5" },
                { label: "50 – 70", bg: "rgba(217,119,6,0.4)", fg: "#fcd34d" },
                { label: "70 – 90", bg: "rgba(21,128,61,0.5)", fg: "#86efac" },
                { label: "≥ 90", bg: "rgba(20,83,45,0.8)", fg: "#4ade80" },
              ].map((l) => (
                <span key={l.label} className="px-2 py-0.5 rounded text-[9px] font-medium"
                      style={{ background: l.bg, color: l.fg }}>{l.label}</span>
              ))}
            </div>
          </div>
          <OkrHeatmap weeks={weeks} submissions={submissions} />
        </div>

      </div>
    </div>
  );
}

// ─── Impact Labs Analytics ───────────────────────────────────────────────────

const STAGE_LABELS = ["Research", "Draft", "Review", "Published"] as const;
const STAGE_COLORS = ["#60a5fa", "#a78bfa", "#f59e0b", "#22c55e"];
const STAGE_PCT = [0.08, 0.36, 0.68, 1.0];

const ARTICLES_DATA = [
  { title: "Solar Microgrids in East Africa",        stage: 3, date: "Jan 15, 2025" },
  { title: "Carbon Offset Methodologies Reviewed",   stage: 2, date: "Feb 28, 2025" },
  { title: "Community Solar: A Case Study",          stage: 2, date: "Mar 30, 2025" },
  { title: "AI in Renewable Energy Monitoring",      stage: 1, date: "Apr 15, 2025" },
  { title: "Solar Panel Efficiency Benchmarks",      stage: 1, date: "May 1, 2025"  },
  { title: "Impact of Subsidies on Solar Adoption",  stage: 0, date: "Jun 30, 2025" },
  { title: "Rural Electrification: Progress Report", stage: 0, date: "Aug 15, 2025" },
  { title: "Annual Impact Report 2025",              stage: 0, date: "Dec 1, 2025"  },
];

const AI_QUALITY_DATA = [
  { label: "R1", title: "Microgrids",      score: 82 },
  { label: "R2", title: "Carbon Offsets",  score: 88 },
  { label: "R3", title: "Community Solar", score: 91 },
  { label: "R4", title: "AI Monitoring",   score: 85 },
  { label: "R5", title: "Efficiency",      score: 78 },
  { label: "R6", title: "Subsidies",       score: 93 },
  { label: "R7", title: "Rural Elec.",     score: 88 },
  { label: "R8", title: "Impact Review",   score: 96 },
];

const CITATION_DATA = [
  { quarter: "Q1 '25", citations: 12, cumulative: 12,  note: null },
  { quarter: "Q2 '25", citations: 18, cumulative: 30,  note: "Microgrids article" },
  { quarter: "Q3 '25", citations: 31, cumulative: 61,  note: "Carbon Offset spike" },
  { quarter: "Q4 '25", citations: 14, cumulative: 75,  note: null },
];

function ImpactLabsAnalyticsPanel({ weeks }: { weeks: number }) {
  const year = yearFromWeeks(weeks);
  const threshold = year <= 1 ? 85 : year === 2 ? 90 : 95;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-5 rounded-full bg-teal-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Impact Labs Analytics</h3>
        <span className="text-[10px] text-white/25 ml-auto">Articles · AI Quality · Citations</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* ── Article Production Tracker ── */}
        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-5">
          <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Article Production Tracker</div>
          <div className="text-[10px] text-white/20 mb-4">8 articles · Research → Draft → Review → Published</div>

          {/* Stage legend */}
          <div className="flex gap-3 mb-4">
            {STAGE_LABELS.map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STAGE_COLORS[i] }} />
                <span className="text-[9px] text-white/35">{s}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {ARTICLES_DATA.map((a, i) => {
              const pct = STAGE_PCT[a.stage];
              const col = STAGE_COLORS[a.stage];
              const stageLabel = STAGE_LABELS[a.stage];
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-white/70 truncate flex-1 mr-2" title={a.title}>{a.title}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                            style={{ backgroundColor: `${col}20`, color: col }}>{stageLabel}</span>
                      <span className="text-[9px] text-white/25">{a.date}</span>
                    </div>
                  </div>
                  <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                    {/* Stage threshold marks */}
                    {STAGE_PCT.slice(0, 3).map((tp, ti) => (
                      <div key={ti} className="absolute top-0 bottom-0 w-px bg-white/10"
                           style={{ left: `${tp * 100}%` }} />
                    ))}
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: col }}
                      initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }}
                      transition={{ duration: 0.9, ease: "easeOut", delay: i * 0.05 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── AI Quality Score Trend ── */}
        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-1">
            <div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">AI Quality Score</div>
              <div className="text-[10px] text-white/20">Per report · threshold {threshold}% (Y{year} target)</div>
            </div>
            <div className="flex gap-2 text-[9px] mt-0.5">
              <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-green-500" /> Above</span>
              <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-red-500" /> Below</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={AI_QUALITY_DATA} margin={{ top: 16, right: 12, left: -24, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#0d1526", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }}
                itemStyle={{ color: "white" }} labelStyle={{ color: "rgba(255,255,255,0.45)" }}
                formatter={(v: any, _: any, p: any) => [`${v}% — ${p.payload.title}`, "Score"]} />
              <ReferenceLine y={threshold} stroke="#facc15" strokeDasharray="5 4" strokeOpacity={0.7}
                             label={{ value: `Target ${threshold}%`, position: "right", fill: "#facc15", fontSize: 9, opacity: 0.7 }} />
              <Line type="monotone" dataKey="score" stroke="rgba(255,255,255,0.15)" strokeWidth={2}
                    dot={(props: any) => {
                      const { cx, cy, payload, key } = props;
                      const below = payload.score < threshold;
                      return (
                        <g key={key}>
                          <circle cx={cx} cy={cy} r={7} fill={below ? "#ef4444" : "#22c55e"} opacity={0.18} />
                          <circle cx={cx} cy={cy} r={4.5} fill={below ? "#ef4444" : "#22c55e"} />
                        </g>
                      );
                    }}
                    activeDot={{ r: 6, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ── Citation Growth Bar Chart ── */}
        <div className="lg:col-span-2 bg-[#0c1326] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">Citation Growth</div>
              <div className="text-[10px] text-white/20">Cumulative external citations per quarter · annotations mark spike drivers</div>
            </div>
            <div className="text-2xl font-black text-white">
              {CITATION_DATA[CITATION_DATA.length - 1].cumulative}
              <span className="text-sm font-normal text-white/30 ml-1">total citations</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CITATION_DATA} margin={{ top: 30, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="quarter" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#0d1526", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }}
                itemStyle={{ color: "white" }} labelStyle={{ color: "rgba(255,255,255,0.45)" }}
                formatter={(v: any) => [`${v} citations`, "Cumulative"]} />
              <Bar dataKey="cumulative" radius={[4, 4, 0, 0]}>
                {CITATION_DATA.map((entry, idx) => (
                  <Cell key={idx} fill={entry.note ? "#22c55e" : "#3b82f6"} opacity={entry.note ? 0.85 : 0.55} />
                ))}
              </Bar>
              {/* Annotation labels for spike quarters */}
              {CITATION_DATA.map((entry, idx) =>
                entry.note ? (
                  <ReferenceLine key={idx} x={entry.quarter} stroke="#22c55e" strokeOpacity={0.3} strokeDasharray="3 3"
                                 label={{ value: `↑ ${entry.note}`, position: "insideTopRight", fill: "#4ade80", fontSize: 9, offset: 6 }} />
                ) : null
              )}
            </BarChart>
          </ResponsiveContainer>
          {/* Quarter breakdown */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            {CITATION_DATA.map((d) => (
              <div key={d.quarter} className="bg-white/3 rounded-lg p-2 text-center">
                <div className="text-[9px] text-white/30 mb-0.5">{d.quarter}</div>
                <div className="text-base font-black text-white">{d.cumulative}</div>
                <div className="text-[9px] text-white/25">+{d.citations} new</div>
                {d.note && <div className="text-[8px] text-green-400 mt-0.5 leading-tight">{d.note}</div>}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Events Analytics ────────────────────────────────────────────────────────

const MONTH_WEEKS = [
  { short: "Jan", weeks: [1,2,3,4] },
  { short: "Feb", weeks: [5,6,7,8] },
  { short: "Mar", weeks: [9,10,11,12] },
  { short: "Apr", weeks: [13,14,15,16,17] },
  { short: "May", weeks: [18,19,20,21] },
  { short: "Jun", weeks: [22,23,24,25] },
  { short: "Jul", weeks: [26,27,28,29,30] },
  { short: "Aug", weeks: [31,32,33,34] },
  { short: "Sep", weeks: [35,36,37,38] },
  { short: "Oct", weeks: [39,40,41,42,43] },
  { short: "Nov", weeks: [44,45,46,47] },
  { short: "Dec", weeks: [48,49,50,51,52] },
];

// 0=quiet, 1=planning, 2=active, 3=event
const EVENT_WEEK_MAP: Record<number, { label: string; level: 0|1|2|3 }> = {
  3:  { label: "New Year Kickoff",       level: 3 },
  4:  { label: "Post-event wrap",        level: 2 },
  7:  { label: "Solar Summit",           level: 3 },
  8:  { label: "Summit follow-up",       level: 2 },
  11: { label: "Community Day",          level: 3 },
  13: { label: "Earth Day planning",     level: 1 },
  14: { label: "Earth Day planning",     level: 1 },
  15: { label: "Earth Day planning",     level: 1 },
  16: { label: "Earth Day Fair",         level: 3 },
  17: { label: "Post-event debrief",     level: 2 },
  19: { label: "Outreach planning",      level: 1 },
  20: { label: "School Outreach Week",   level: 3 },
  21: { label: "Outreach wrap-up",       level: 2 },
  22: { label: "Gala prep",             level: 1 },
  23: { label: "Gala prep",             level: 1 },
  24: { label: "Mid-Year Gala",          level: 3 },
  25: { label: "Post-gala review",       level: 2 },
  28: { label: "Partner Breakfast",      level: 3 },
  31: { label: "Workshop planning",      level: 1 },
  32: { label: "Workshop planning",      level: 1 },
  33: { label: "Youth Workshop",         level: 3 },
  34: { label: "Workshop follow-up",     level: 2 },
  35: { label: "Harvest prep",           level: 1 },
  36: { label: "Harvest prep",           level: 1 },
  37: { label: "Harvest prep",           level: 1 },
  38: { label: "Harvest Festival",       level: 3 },
  39: { label: "Post-harvest debrief",   level: 2 },
  40: { label: "Conference prep",        level: 1 },
  41: { label: "Conference prep",        level: 1 },
  42: { label: "Conference prep",        level: 2 },
  43: { label: "Impact Conference",      level: 3 },
  44: { label: "Conference follow-up",   level: 2 },
  45: { label: "Year-end planning",      level: 1 },
  46: { label: "Year-end planning",      level: 1 },
  47: { label: "Year-End Celebration",   level: 3 },
  49: { label: "Year wrap-up",           level: 2 },
  50: { label: "Planning Sprint",        level: 2 },
};

const ATTENDEE_DATA = [
  { event: "Solar Summit",     total: 280, repeat: 112 },
  { event: "Earth Day Fair",   total: 450, repeat: 234 },
  { event: "Mid-Year Gala",    total: 320, repeat: 182 },
  { event: "Youth Workshop",   total: 180, repeat:  81 },
  { event: "Harvest Festival", total: 520, repeat: 322 },
  { event: "Conf. 2025",       total: 410, repeat: 262 },
];

const EVENT_SATISFACTION = [
  { short: "Kickoff",   score: 4.2 },
  { short: "Summit",    score: 4.5 },
  { short: "Comm.Day",  score: 3.8 },
  { short: "Earth Day", score: 4.6 },
  { short: "Outreach",  score: 3.9 },
  { short: "Gala",      score: 4.7 },
  { short: "Breakfast", score: 4.1 },
  { short: "Workshop",  score: 3.7 },
  { short: "Harvest",   score: 4.4 },
  { short: "Conf.",     score: 4.8 },
];

function MiniDonut({ pct, color }: { pct: number; color: string }) {
  const r = 28, sw = 10, cx = 40, cy = 40;
  const circ = 2 * Math.PI * r;
  const fill = (pct / 100) * circ;
  return (
    <svg viewBox="0 0 80 80" width={80} height={80}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw}
              strokeDasharray={`${fill} ${circ - fill}`}
              strokeLinecap="round" strokeDashoffset={circ / 4}
              style={{ transform: "rotate(-90deg)", transformOrigin: "40px 40px" }} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize={13} fontWeight={900}>{pct}%</text>
      <text x={cx} y={cy + 9} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={7.5}>repeat</text>
    </svg>
  );
}

function EventsAnalyticsPanel() {
  const LEVEL_COLORS = [
    "rgba(255,255,255,0.04)",  // 0 quiet
    "rgba(20,184,166,0.20)",   // 1 planning — pale teal
    "rgba(20,184,166,0.52)",   // 2 active   — medium teal
    "#0f766e",                 // 3 event    — dark teal
  ];
  const LEVEL_LABELS = ["Quiet", "Planning", "Active", "Event"];
  const SAT_THRESHOLD = 4.0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-5 rounded-full bg-orange-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Events & Community Analytics</h3>
        <span className="text-[10px] text-white/25 ml-auto">Calendar · Attendees · Satisfaction</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── Calendar Heatmap (full width) ── */}
        <div className="lg:col-span-3 bg-[#0c1326] border border-white/10 rounded-2xl p-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
            <div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">Event Calendar Heatmap — 2025</div>
              <div className="text-[10px] text-white/20">Each cell = one week · hover for event name</div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {LEVEL_LABELS.map((l, i) => (
                <span key={l} className="flex items-center gap-1 text-[9px] text-white/40">
                  <span className="w-3 h-3 rounded-sm inline-block"
                        style={{ backgroundColor: LEVEL_COLORS[i], border: i === 0 ? "1px solid rgba(255,255,255,0.08)" : "none" }} />
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-12 gap-1.5">
            {MONTH_WEEKS.map((m) => (
              <div key={m.short}>
                <div className="text-[9px] text-white/35 text-center mb-1.5 font-medium">{m.short}</div>
                <div className="space-y-1">
                  {m.weeks.map((w) => {
                    const ev = EVENT_WEEK_MAP[w];
                    const level = ev?.level ?? 0;
                    return (
                      <div key={w} className="w-full h-5 rounded-sm cursor-default transition-opacity hover:opacity-80"
                           style={{ backgroundColor: LEVEL_COLORS[level] }}
                           title={ev ? `W${w}: ${ev.label}` : `W${w}: No activity`} />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── New vs Repeat Attendee Donuts ── */}
        <div className="lg:col-span-2 bg-[#0c1326] border border-white/10 rounded-2xl p-5">
          <div className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">New vs Repeat Attendees</div>
          <div className="text-[10px] text-white/20 mb-4">Per event · repeat % in centre · trend shows community building</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {ATTENDEE_DATA.map((d) => {
              const pct = Math.round((d.repeat / d.total) * 100);
              const newPct = 100 - pct;
              const col = pct >= 60 ? "#22c55e" : pct >= 40 ? "#f59e0b" : "#60a5fa";
              return (
                <div key={d.event} className="flex flex-col items-center gap-1">
                  <MiniDonut pct={pct} color={col} />
                  <div className="text-[10px] text-white/60 text-center font-medium leading-tight">{d.event}</div>
                  <div className="text-[9px] text-white/25 text-center">{d.total.toLocaleString()} attendees</div>
                  <div className="flex gap-2 text-[8.5px] mt-0.5">
                    <span style={{ color: col }}>↩ {pct}% repeat</span>
                    <span className="text-white/25">✦ {newPct}% new</span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Trend note */}
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
            <span className="text-[9px] text-white/25">Repeat % trend:</span>
            {ATTENDEE_DATA.map((d, i) => {
              const pct = Math.round((d.repeat / d.total) * 100);
              const col = pct >= 60 ? "#22c55e" : pct >= 40 ? "#f59e0b" : "#60a5fa";
              return (
                <div key={i} className="flex flex-col items-end gap-0.5">
                  <div className="w-5 rounded-sm" style={{ height: `${Math.round(pct * 0.3)}px`, backgroundColor: col, opacity: 0.7 }} />
                  <span className="text-[8px]" style={{ color: col }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Satisfaction Trend ── */}
        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-5">
          <div className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">Satisfaction Score Trend</div>
          <div className="text-[10px] text-white/20 mb-3">Post-event survey / 5 · threshold 4.0</div>
          <div className="flex gap-3 text-[9px] mb-3">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> ≥ 4.0</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Below</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={EVENT_SATISFACTION} margin={{ top: 12, right: 8, left: -28, bottom: 24 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="short" tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 8 }}
                     axisLine={false} tickLine={false} angle={-35} textAnchor="end" interval={0} />
              <YAxis domain={[3.0, 5.0]} ticks={[3.0,3.5,4.0,4.5,5.0]}
                     tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0d1526", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }}
                       itemStyle={{ color: "white" }} labelStyle={{ color: "rgba(255,255,255,0.45)" }}
                       formatter={(v: any) => [`${v} / 5`, "Satisfaction"]} />
              <ReferenceLine y={SAT_THRESHOLD} stroke="#facc15" strokeDasharray="5 4" strokeOpacity={0.7}
                             label={{ value: "4.0 target", position: "right", fill: "#facc15", fontSize: 8.5, opacity: 0.7 }} />
              <Line type="monotone" dataKey="score" stroke="rgba(255,255,255,0.12)" strokeWidth={2}
                    dot={(props: any) => {
                      const { cx, cy, payload, key } = props;
                      const below = payload.score < SAT_THRESHOLD;
                      return (
                        <g key={key}>
                          <circle cx={cx} cy={cy} r={6} fill={below ? "#ef4444" : "#22c55e"} opacity={0.2} />
                          <circle cx={cx} cy={cy} r={4} fill={below ? "#ef4444" : "#22c55e"} />
                        </g>
                      );
                    }}
                    activeDot={{ r: 6, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function ScoresTab({ teamScores, overallScore, overallRag, weeks, visibleTeamIds, isAdmin, historyByTeam, submissions, analysisResult, analysisLoading, analysisError, onRunAnalysis }: {
  teamScores: TeamScore[];
  overallScore: number;
  overallRag: "green" | "amber" | "red";
  weeks: number;
  visibleTeamIds: string[];
  isAdmin: boolean;
  historyByTeam: Record<string, any[]>;
  submissions: any[];
  analysisResult: any | null;
  analysisLoading: boolean;
  analysisError: string | null;
  onRunAnalysis: () => void;
}) {
  const overallColor = overallRag === "green" ? "#22c55e" : overallRag === "amber" ? "#f59e0b" : "#ef4444";
  const visibleScores = teamScores.filter((t) => visibleTeamIds.includes(t.teamId));

  const execProb = analysisResult?.executiveScore ?? null;
  const execColor = execProb == null ? "#6b7280" : execProb >= 70 ? "#22c55e" : execProb >= 50 ? "#f59e0b" : "#ef4444";
  const execLabel = execProb == null ? "—" : execProb >= 70 ? "On Track" : execProb >= 50 ? "At Risk" : "Critical";

  return (
    <div className="space-y-6">

      {/* AI Executive Probability + Run Analysis */}
      {isAdmin && (
        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-5">
          <div className="flex flex-wrap items-start gap-4">
            {/* Executive probability score */}
            <div className="flex items-center gap-5">
              <div className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2"
                   style={{ borderColor: `${execColor}40`, backgroundColor: `${execColor}0d` }}>
                <div className="text-3xl font-black" style={{ color: execColor }}>
                  {execProb != null ? execProb : "—"}
                </div>
                <div className="text-[10px] text-white/30 text-center leading-tight mt-0.5">AI Score</div>
              </div>
              <div>
                <div className="text-xs text-white/30 uppercase tracking-widest mb-0.5">AI Executive Score</div>
                <div className="text-lg font-bold" style={{ color: execColor }}>{execLabel}</div>
                <div className="text-[11px] text-white/30 mt-0.5">Year-end probability · avg of all 5 teams</div>
                {analysisResult && (
                  <div className="text-[10px] text-white/20 mt-1">
                    Last run: {new Date(analysisResult.timestamp).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} · Week {analysisResult.weekNumber}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 ml-auto">
              <button
                onClick={onRunAnalysis}
                disabled={analysisLoading}
                className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                style={{ backgroundColor: "#facc15", color: "#000" }}
              >
                {analysisLoading ? "Analysing…" : "Run AI Analysis"}
              </button>
              {analysisError && (
                <div className="text-[11px] text-red-400 max-w-xs text-right">{analysisError}</div>
              )}
            </div>
          </div>

          {/* Per-team probability grid */}
          {analysisResult?.probabilities && (
            <div className="mt-5 pt-4 border-t border-white/8">
              <div className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Year-end probability per team</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
                {TEAM_IDS.filter((id) => visibleTeamIds.includes(id)).map((id) => {
                  const meta = TEAM_META[id];
                  const prob = analysisResult.probabilities[id];
                  if (!prob) return null;
                  const pc = prob.overall ?? 0;
                  const pCol = pc >= 70 ? "#22c55e" : pc >= 50 ? "#f59e0b" : "#ef4444";
                  return (
                    <div key={id} className="bg-white/4 border border-white/8 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: meta?.color }} />
                          <span className="text-[11px] font-bold text-white/70">{meta?.name.split(" ")[0]}</span>
                        </div>
                        <span className="text-sm font-black" style={{ color: pCol }}>{pc}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pc}%`, backgroundColor: pCol }} />
                      </div>
                      <div className="space-y-1">
                        {Object.entries(prob.kpis || {}).map(([kpiName, val]: [string, any]) => {
                          const kCol = val >= 70 ? "#22c55e" : val >= 50 ? "#f59e0b" : "#ef4444";
                          return (
                            <div key={kpiName} className="flex items-center justify-between gap-1">
                              <span className="text-[9px] text-white/30 truncate flex-1">{kpiName}</span>
                              <span className="text-[9px] font-bold flex-shrink-0" style={{ color: kCol }}>{val}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {isAdmin && (
        <ExecutiveSummaryPanel teamScores={teamScores} overallScore={overallScore} historyByTeam={historyByTeam} weeks={weeks} />
      )}

      {isAdmin && (
        <ManagementAnalyticsPanel historyByTeam={historyByTeam} weeks={weeks} submissions={submissions as any[]} />
      )}

      {/* Overall Score Hero — admin only */}
      {isAdmin && (
        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex flex-col items-center">
            <ScoreRing score={overallScore} size={140} strokeWidth={12} color={overallColor} />
            <div className="mt-2 text-sm text-white/40">Overall Score</div>
          </div>
          <div className="flex-1">
            <div className="text-2xl font-black text-white mb-1">
              SolarPak — Week {weeks}
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold mb-4 ${overallRag === "green" ? "bg-green-500/15 text-green-400" : overallRag === "amber" ? "bg-amber-500/15 text-amber-400" : "bg-red-500/15 text-red-400"}`}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: overallColor }} />
              {overallRag === "green" ? "On Track" : overallRag === "amber" ? "Needs Attention" : "Critical"}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Teams Scoring Green", value: teamScores.filter((t) => t.rag === "green").length },
                { label: "Teams At Risk", value: teamScores.filter((t) => t.rag === "amber").length },
                { label: "Teams Critical", value: teamScores.filter((t) => t.rag === "red").length },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-white/40 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Horizontal Bar Chart — admin: all teams vs 70% target */}
      {isAdmin && (
        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-1">Team Scores vs 70% Target</h3>
          <p className="text-xs text-white/25 mb-4">Weekly performance snapshot — target line at 70</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              layout="vertical"
              data={visibleScores.map((ts) => ({
                name: TEAM_META[ts.teamId]?.name.split(" ")[0],
                score: Math.round(ts.teamScore),
                color: TEAM_META[ts.teamId]?.color,
                rag: ts.rag,
              }))}
              margin={{ left: 8, right: 20, top: 4, bottom: 4 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
                contentStyle={{ background: "#1a2540", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 12 }}
                formatter={(v: any) => [`${v} / 100`, "Score"]}
              />
              <ReferenceLine x={70} stroke="#facc15" strokeDasharray="5 3" strokeWidth={2} label={{ value: "70 target", fill: "#facc15", fontSize: 10, position: "insideTopRight" }} />
              <Bar dataKey="score" radius={[0, 6, 6, 0]} maxBarSize={22}>
                {visibleScores.map((ts) => {
                  const c = ts.rag === "green" ? "#22c55e" : ts.rag === "amber" ? "#f59e0b" : "#ef4444";
                  return <Cell key={ts.teamId} fill={c} fillOpacity={0.85} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* KPI Heatmap Matrix — admin only */}
      {isAdmin && (
        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-1">KPI Status Matrix</h3>
          <p className="text-xs text-white/25 mb-5">Each cell = one KPI metric score, coloured by RAG status</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left text-white/30 font-medium pb-3 pr-4 w-32">Team</th>
                  {visibleScores[0]?.kpiScores.map((k) => (
                    <th key={k.name} className="text-center text-white/30 font-medium pb-3 px-1 min-w-[72px]">{k.name}</th>
                  ))}
                  <th className="text-center text-white/30 font-medium pb-3 px-1 min-w-[64px]">Score</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {visibleScores.map((ts) => {
                  const meta = TEAM_META[ts.teamId];
                  return (
                    <tr key={ts.teamId}>
                      <td className="pr-4 py-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: meta?.color }} />
                          <span className="text-white/60 truncate">{meta?.name.split(" ")[0]}</span>
                        </div>
                      </td>
                      {ts.kpiScores.map((kpi) => {
                        const bg = kpi.rag === "green" ? "rgba(34,197,94,0.18)" : kpi.rag === "amber" ? "rgba(245,158,11,0.18)" : "rgba(239,68,68,0.18)";
                        const txt = kpi.rag === "green" ? "#4ade80" : kpi.rag === "amber" ? "#fbbf24" : "#f87171";
                        return (
                          <td key={kpi.name} className="px-1 py-1 text-center">
                            <div className="rounded-lg py-1.5 px-2 font-bold" style={{ backgroundColor: bg, color: txt }}>
                              {Math.round(kpi.score)}
                            </div>
                          </td>
                        );
                      })}
                      <td className="px-1 py-1 text-center">
                        <div className="rounded-lg py-1.5 px-2 font-black text-white/80 bg-white/5 border border-white/8">
                          {Math.round(ts.teamScore)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* My Team — prominent single view for non-admin */}
      {!isAdmin && visibleScores.length === 1 && (() => {
        const ts = visibleScores[0];
        const meta = TEAM_META[ts.teamId];
        const ringColor = ts.rag === "green" ? "#22c55e" : ts.rag === "amber" ? "#f59e0b" : "#ef4444";
        return (
          <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: meta?.color }} />
              <h2 className="text-lg font-bold text-white">{meta?.name}</h2>
              <div className={`ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${ts.rag === "green" ? "bg-green-500/15 text-green-400" : ts.rag === "amber" ? "bg-amber-500/15 text-amber-400" : "bg-red-500/15 text-red-400"}`}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ringColor }} />
                {ts.rag === "green" ? "On Track" : ts.rag === "amber" ? "Needs Attention" : "Critical"}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Score Ring */}
              <div className="flex flex-col items-center gap-2">
                <ScoreRing score={ts.teamScore} size={140} strokeWidth={12} color={ringColor} />
                <div className="text-xs text-white/35">Weekly Score</div>
                <div className="text-xs text-white/25">Target: 70 / 100</div>
              </div>
              {/* Radar */}
              <div className="flex-1 w-full">
                <div className="text-xs text-white/35 uppercase tracking-widest mb-2 text-center">KPI Radar</div>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={ts.kpiScores.map((k) => ({ name: k.name, score: k.score, target: 70 }))}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Target" dataKey="target" stroke="#facc15" fill="#facc15" fillOpacity={0.06} strokeWidth={1} strokeDasharray="4 3" />
                    <Radar name="Score" dataKey="score" stroke={meta?.color} fill={meta?.color} fillOpacity={0.3} strokeWidth={2.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              {/* KPI list */}
              <div className="w-full md:w-56 space-y-3">
                {ts.kpiScores.map((kpi) => {
                  const kColor = kpi.rag === "green" ? "#22c55e" : kpi.rag === "amber" ? "#f59e0b" : "#ef4444";
                  return (
                    <div key={kpi.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-white/50">{kpi.name}</span>
                        <span className="text-xs font-bold" style={{ color: kColor }}>{Math.round(kpi.score)}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: kColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${kpi.score}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Team Score Cards — enhanced with progress bars (admin or multi-team view) */}
      {(isAdmin || visibleScores.length > 1) && (<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {visibleScores.map((ts) => {
          const meta = TEAM_META[ts.teamId];
          const rag = ragColors(ts.rag);
          const ringColor = ts.rag === "green" ? "#22c55e" : ts.rag === "amber" ? "#f59e0b" : "#ef4444";
          return (
            <motion.div
              key={ts.teamId}
              whileHover={{ scale: 1.02 }}
              className={`bg-[#0c1326] border rounded-2xl p-5 hover:border-white/20 transition-colors ${rag.border}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta?.color }} />
                    <span className="text-xs text-white/40 uppercase tracking-widest">Team</span>
                  </div>
                  <div className="font-bold text-white text-sm leading-tight">{meta?.name}</div>
                </div>
                <ScoreRing score={ts.teamScore} size={64} strokeWidth={6} color={ringColor} />
              </div>
              {/* KPI progress bars */}
              <div className="space-y-2.5">
                {ts.kpiScores.map((kpi) => {
                  const kColor = kpi.rag === "green" ? "#22c55e" : kpi.rag === "amber" ? "#f59e0b" : "#ef4444";
                  return (
                    <div key={kpi.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-white/45 truncate flex-1">{kpi.name}</span>
                        <span className="text-[11px] font-bold ml-2" style={{ color: kColor }}>{Math.round(kpi.score)}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: kColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${kpi.score}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Mini fill gauge at bottom */}
              <div className="mt-4 pt-3 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: ringColor, opacity: 0.7 }}
                      initial={{ width: 0 }}
                      animate={{ width: `${ts.teamScore}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    />
                  </div>
                  <span className="text-[10px] text-white/30">/ 100</span>
                </div>
                <div className="text-[10px] text-white/25 mt-1">
                  {ts.teamScore >= 80 ? "On Track" : ts.teamScore >= 50 ? "Needs Attention" : "Critical"} · target 70
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>)}
    </div>
  );
}

function InputTab({ selectedTeam, setSelectedTeam, teamScores, getInputs, setField, handleSubmit, isPending, saved, visibleTeamIds, isAdmin }: {
  selectedTeam: number;
  setSelectedTeam: (i: number) => void;
  teamScores: TeamScore[];
  getInputs: (teamId: string) => Record<string, any>;
  setField: (teamId: string, key: string, value: number) => void;
  handleSubmit: (teamId: string) => void;
  isPending: boolean;
  saved: boolean;
  visibleTeamIds: string[];
  isAdmin: boolean;
}) {
  const visibleIds = TEAM_IDS.filter((id) => visibleTeamIds.includes(id));
  const effectiveIndex = Math.min(selectedTeam, visibleIds.length - 1);
  const teamId = visibleIds[effectiveIndex] || visibleIds[0];
  const meta = TEAM_META[teamId];
  const fields = INPUT_FIELDS[teamId] || [];
  const inputs = getInputs(teamId);
  const ts = teamScores.find((t) => t.teamId === teamId);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Team Selector — only shown to admins or when multiple teams visible */}
      {isAdmin && (
        <div className="md:w-52 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {visibleIds.map((id, i) => {
            const m = TEAM_META[id];
            const ts2 = teamScores.find((t) => t.teamId === id);
            return (
              <button
                key={id}
                onClick={() => setSelectedTeam(i)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap md:w-full ${
                  effectiveIndex === i ? "text-white border" : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
                style={effectiveIndex === i ? { backgroundColor: `${m.color}18`, borderColor: `${m.color}40` } : {}}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                <span className="flex-1 text-left">{m.name}</span>
                {ts2 && <span className="font-bold text-white/50">{Math.round(ts2.teamScore)}</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* Input Form */}
      <div className="flex-1 space-y-4">
        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: meta.color }} />
                <span className="text-xs text-white/40 uppercase tracking-widest">Weekly Input</span>
              </div>
              <h2 className="text-lg font-bold text-white">{meta.name}</h2>
            </div>
            {ts && (
              <div className="flex flex-col items-end">
                <div className="text-3xl font-black text-white">{Math.round(ts.teamScore)}</div>
                <div className="text-xs text-white/40">Team Score</div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {fields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="text-xs font-medium text-white/70 flex-1">{field.label}</label>
                  {field.tag === "QUARTERLY" && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/25 uppercase tracking-wide flex-shrink-0">Quarterly</span>
                  )}
                  {field.tag === "EVENT-TRIGGERED" && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-400 border border-orange-500/25 uppercase tracking-wide flex-shrink-0">Event</span>
                  )}
                </div>
                {field.type === "binary" ? (
                  <div className="flex gap-2">
                    {[{ v: 0, label: "No" }, { v: 1, label: "Yes" }].map(({ v, label }) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setField(teamId, field.key, v)}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                          (inputs[field.key] ?? 0) === v
                            ? "bg-yellow-400/20 border-yellow-400/60 text-yellow-300"
                            : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/8"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="number"
                    min="0"
                    step={field.type === "decimal" ? "0.1" : "1"}
                    value={inputs[field.key] ?? ""}
                    onChange={(e) => setField(teamId, field.key, Number(e.target.value) || 0)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-yellow-400/50 transition-colors"
                    placeholder="0"
                  />
                )}
                <p className="text-[10px] text-white/30 leading-tight">{field.hint}</p>
              </div>
            ))}
          </div>

          {/* KPI Score Breakdown + Radar */}
          {ts && (
            <div className="border-t border-white/8 pt-4 mb-4">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Progress bars */}
                <div className="flex-1 space-y-2 w-full">
                  <div className="text-xs text-white/40 uppercase tracking-widest mb-3">Live Score Breakdown</div>
                  {ts.kpiScores.map((kpi) => {
                    const kColor = kpi.rag === "green" ? "#22c55e" : kpi.rag === "amber" ? "#f59e0b" : "#ef4444";
                    return (
                      <div key={kpi.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-white/50 truncate">{kpi.name}</span>
                          <span className="text-xs font-bold ml-2" style={{ color: kColor }}>{Math.round(kpi.score)}</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: kColor }}
                            initial={{ width: 0 }}
                            animate={{ width: `${kpi.score}%` }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Radar Chart */}
                <div className="md:w-56 flex-shrink-0">
                  <div className="text-xs text-white/40 uppercase tracking-widest mb-2 text-center">Radar View</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <RadarChart
                      data={ts.kpiScores.map((k) => ({ name: k.name.split(" ").slice(0, 2).join(" "), score: k.score, target: 70 }))}
                      margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
                    >
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Target" dataKey="target" stroke="#facc15" fill="#facc15" fillOpacity={0.06} strokeWidth={1} strokeDasharray="4 3" />
                      <Radar name="Score" dataKey="score" stroke={meta.color} fill={meta.color} fillOpacity={0.25} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-center gap-4 text-[10px] text-white/30">
                    <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded" style={{ backgroundColor: meta.color }} />Score</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-yellow-400" />Target</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => handleSubmit(teamId)}
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition-colors disabled:opacity-50"
          >
            {isPending ? "Saving..." : saved ? "✓ Saved!" : "Save Weekly Snapshot"}
          </button>
        </div>
      </div>
    </div>
  );
}

function HistoryTab({ historyByTeam, overallHistory, visibleTeamIds, isAdmin }: {
  historyByTeam: Record<string, any[]>;
  overallHistory: any[];
  visibleTeamIds: string[];
  isAdmin: boolean;
}) {
  const TEAM_COLORS = Object.entries(TEAM_META)
    .filter(([id]) => visibleTeamIds.includes(id))
    .map(([id, m]) => ({ id, color: m.color }));

  const combined: Record<string, any> = {};
  visibleTeamIds.forEach((id) => {
    (historyByTeam[id] || []).forEach((entry) => {
      if (!combined[entry.week]) combined[entry.week] = { week: entry.week };
      combined[entry.week][id] = entry.score;
    });
  });
  const combinedData = Object.values(combined).sort((a, b) => a.week.localeCompare(b.week));

  if (overallHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-white/30 text-center">
        <div className="text-4xl mb-4">◈</div>
        <div className="text-lg font-semibold mb-2">No history yet</div>
        <div className="text-sm">Submit weekly snapshots from the Weekly Input tab to see progress over time.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Line — admin only */}
      {isAdmin && (
        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">Overall SolarPak Score — Weekly</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={overallHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1a2540", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
              <Line type="monotone" dataKey="score" name="Overall" stroke="#facc15" strokeWidth={3} dot={{ fill: "#facc15", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Per-Team Lines */}
      {combinedData.length > 0 && (
        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
            {isAdmin ? "Team Scores — Weekly" : "Your Team Score — Weekly"}
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1a2540", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
              <Legend wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }} />
              {TEAM_COLORS.map(({ id, color }) => (
                historyByTeam[id]?.length > 0 && (
                  <Line key={id} type="monotone" dataKey={id} name={TEAM_META[id].name.split(" ")[0]} stroke={color} strokeWidth={2} dot={false} />
                )
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Per-team table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleTeamIds.map((id) => {
          const hist = historyByTeam[id];
          if (!hist?.length) return null;
          const latest = hist[0];
          const prev = hist[1];
          const delta = prev ? latest.score - prev.score : null;
          return (
            <div key={id} className="bg-[#0c1326] border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: TEAM_META[id].color }} />
                  <span className="text-sm font-semibold text-white">{TEAM_META[id].name.split(" ")[0]}</span>
                </div>
                <div className="flex items-center gap-2">
                  {delta !== null && (
                    <span className={`text-xs font-bold ${delta >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {delta >= 0 ? "+" : ""}{delta}
                    </span>
                  )}
                  <span className="text-lg font-black text-white">{latest.score}</span>
                </div>
              </div>
              <div className="flex gap-1 flex-wrap">
                {hist.slice(0, 8).reverse().map((h: any, i: number) => (
                  <div key={i} className="flex flex-col items-center gap-0.5">
                    <div className="w-6 h-8 bg-white/5 rounded flex items-end overflow-hidden">
                      <div className="w-full rounded" style={{ height: `${h.score}%`, backgroundColor: TEAM_META[id].color, opacity: 0.7 }} />
                    </div>
                    <span className="text-[9px] text-white/30">{h.week}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function toMonthKey(submittedAt: string | null | undefined): string {
  if (!submittedAt) return "unknown";
  const d = new Date(submittedAt);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function ImpactTab({ submissions, impactData, isAdmin, onSaveImpact }: {
  submissions: any[];
  impactData: any[];
  isAdmin: boolean;
  onSaveImpact: (month: string, familiesServed: number, co2AvoidedKg: number, adminToken: string) => void;
}) {
  const [impactMonth, setImpactMonth] = useState("");
  const [impactFamilies, setImpactFamilies] = useState("");
  const [impactCo2, setImpactCo2] = useState("");
  const [impactAdminToken, setImpactAdminToken] = useState("");

  // ── Monthly aggregation helpers ──────────────────────────────────────────
  function aggMonthlyLast<T>(teamId: string, mapFn: (s: any) => T): { month: string; data: T }[] {
    const filtered = submissions
      .filter((s: any) => s.teamId === teamId)
      .sort((a: any, b: any) => new Date(a.submittedAt ?? 0).getTime() - new Date(b.submittedAt ?? 0).getTime());
    const byMonth: Record<string, T> = {};
    for (const s of filtered) {
      const month = toMonthKey(s.submittedAt);
      if (month !== "unknown") byMonth[month] = mapFn(s);
    }
    return Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, data }));
  }

  const socialMonthly = aggMonthlyLast("marketing", (s: any) => ({
    followers: (s.inputs as any)?.total_followers ?? 0,
    engagement: (s.inputs as any)?.avg_engagement_rate ?? 0,
  }));

  const reachMonthly = aggMonthlyLast("partnerships", (s: any) => ({
    partners: (s.inputs as any)?.total_active_partners ?? 0,
    communities: (s.inputs as any)?.communities_reached ?? 0,
  }));

  const followerData = socialMonthly.map((d) => ({ month: d.month, ...d.data }));
  const partnerData = reachMonthly.map((d) => ({ month: d.month, ...d.data }));

  const latestFollowers = followerData.length > 0 ? followerData[followerData.length - 1].followers : 0;
  const latestPartners = partnerData.length > 0 ? partnerData[partnerData.length - 1].partners : 0;
  const latestEngagement = followerData.length > 0 ? followerData[followerData.length - 1].engagement : 0;
  const totalFamilies = impactData.reduce((sum, d) => sum + (d.familiesServed ?? 0), 0);
  const totalCo2 = impactData.reduce((sum, d) => sum + (d.co2AvoidedKg ?? 0), 0);

  const noSubmissionsYet = submissions.length === 0;

  return (
    <div className="space-y-6">

      {/* ── Live Metrics Strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Social Followers", value: latestFollowers > 0 ? latestFollowers.toLocaleString() : "—", sub: "latest month", color: "#7c3aed" },
          { label: "Avg Engagement", value: latestEngagement > 0 ? `${latestEngagement.toFixed(1)}%` : "—", sub: "latest month", color: "#7c3aed" },
          { label: "Active Partners", value: latestPartners > 0 ? String(latestPartners) : "—", sub: "latest month", color: "#0891b2" },
          { label: "Families Served", value: totalFamilies > 0 ? totalFamilies.toLocaleString() : "—", sub: "all time", color: "#22c55e" },
        ].map((m) => (
          <div key={m.label} className="bg-[#0c1326] border border-white/10 rounded-xl p-4 flex flex-col gap-1">
            <div className="text-[10px] text-white/35 uppercase tracking-widest">{m.label}</div>
            <div className="text-2xl font-black" style={{ color: m.color }}>{m.value}</div>
            <div className="text-[10px] text-white/25">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Social Following Growth (monthly) ── */}
      <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-5">
        <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Social Following Growth</div>
        <div className="text-[10px] text-white/20 mb-4">Total followers per month · aggregated from weekly submissions</div>
        {followerData.length === 0 ? (
          <div className="flex items-center justify-center h-[180px] text-white/30 text-xs text-center">
            {noSubmissionsYet
              ? "No data yet — submit weekly marketing inputs"
              : "No marketing submissions with follower data found"}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={followerData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 9 }} axisLine={false} tickLine={false}
                     interval={Math.max(0, Math.floor(followerData.length / 6) - 1)} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0d1526", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }}
                       itemStyle={{ color: "white" }} labelStyle={{ color: "rgba(255,255,255,0.45)" }}
                       formatter={(v: any) => [v.toLocaleString(), "Followers"]} />
              <ReferenceLine y={5000} stroke="#7c3aed" strokeDasharray="4 3" strokeOpacity={0.5}
                             label={{ value: "Y1 target 5k", position: "right", fill: "#a78bfa", fontSize: 8.5, opacity: 0.7 }} />
              <Line type="monotone" dataKey="followers" stroke="#7c3aed" strokeWidth={2.5}
                    dot={{ fill: "#7c3aed", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Engagement Rate Trend (monthly) ── */}
      <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-5">
        <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Engagement Rate Trend</div>
        <div className="text-[10px] text-white/20 mb-4">Average engagement rate (%) per month · from weekly marketing submissions</div>
        {followerData.length === 0 ? (
          <div className="flex items-center justify-center h-[150px] text-white/30 text-xs text-center">
            {noSubmissionsYet
              ? "No data yet — submit weekly marketing inputs"
              : "No marketing submissions with engagement data found"}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={followerData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 9 }} axisLine={false} tickLine={false}
                     interval={Math.max(0, Math.floor(followerData.length / 6) - 1)} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 9 }} axisLine={false} tickLine={false}
                     tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ background: "#0d1526", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }}
                       itemStyle={{ color: "white" }} labelStyle={{ color: "rgba(255,255,255,0.45)" }}
                       formatter={(v: any) => [`${Number(v).toFixed(2)}%`, "Engagement Rate"]} />
              <ReferenceLine y={5} stroke="#a855f7" strokeDasharray="4 3" strokeOpacity={0.5}
                             label={{ value: "Y1 target 5%", position: "right", fill: "#d8b4fe", fontSize: 8.5, opacity: 0.7 }} />
              <Line type="monotone" dataKey="engagement" stroke="#a855f7" strokeWidth={2.5}
                    dot={{ fill: "#a855f7", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Community Reach (monthly) ── */}
      <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-5">
        <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Community Reach — Partners & Communities</div>
        <div className="text-[10px] text-white/20 mb-4">Active institutional partners + communities reached per month · from partnerships submissions</div>
        {partnerData.length === 0 ? (
          <div className="flex items-center justify-center h-[160px] text-white/30 text-xs text-center">
            {noSubmissionsYet
              ? "No data yet — submit weekly partnerships inputs"
              : "No partnerships submissions with partner data found"}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={partnerData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 9 }} axisLine={false} tickLine={false}
                     interval={Math.max(0, Math.floor(partnerData.length / 6) - 1)} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0d1526", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }}
                       itemStyle={{ color: "white" }} labelStyle={{ color: "rgba(255,255,255,0.45)" }}
                       formatter={(v: any, name: string) => [v, name === "partners" ? "Active Partners" : "Communities Reached"]} />
              <Legend wrapperStyle={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }} formatter={(v) => v === "partners" ? "Active Partners" : "Communities Reached"} />
              <ReferenceLine y={6} stroke="#0891b2" strokeDasharray="4 3" strokeOpacity={0.5}
                             label={{ value: "Y1 partners 6", position: "right", fill: "#38bdf8", fontSize: 8.5, opacity: 0.7 }} />
              <Bar dataKey="partners" name="partners" fill="#0891b2" radius={[4, 4, 0, 0]} />
              <Bar dataKey="communities" name="communities" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Families Served & CO₂ Avoided (monthly time series) ── */}
      <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">Environmental & Social Impact</div>
            <div className="text-[10px] text-white/20">Families served & CO₂ avoided · monthly · admin-logged</div>
          </div>
          {totalCo2 > 0 && (
            <div className="text-right">
              <div className="text-xl font-black text-green-400">{(totalCo2 / 1000).toFixed(1)} t</div>
              <div className="text-[10px] text-white/30">CO₂ avoided total</div>
            </div>
          )}
        </div>

        {impactData.length === 0 ? (
          <div className="flex items-center justify-center h-[160px] text-white/30 text-xs text-center">
            {isAdmin
              ? "No data yet — use the form below to log monthly impact data"
              : "No impact data recorded yet"}
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={impactData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 9 }} axisLine={false} tickLine={false}
                       interval={Math.max(0, Math.floor(impactData.length / 6) - 1)} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0d1526", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }}
                         itemStyle={{ color: "white" }} labelStyle={{ color: "rgba(255,255,255,0.45)" }}
                         formatter={(v: any, name: string) => [
                           name === "familiesServed" ? `${v.toLocaleString()} families` : `${v.toLocaleString()} kg`,
                           name === "familiesServed" ? "Families Served" : "CO₂ Avoided",
                         ]} />
                <Legend wrapperStyle={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }} formatter={(v) => v === "familiesServed" ? "Families Served" : "CO₂ Avoided (kg)"} />
                <Bar dataKey="familiesServed" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="co2AvoidedKg" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-white/30 uppercase tracking-widest">
                    <th className="text-left pb-2 pr-4">Month</th>
                    <th className="text-right pb-2 px-4">Families Served</th>
                    <th className="text-right pb-2">CO₂ Avoided (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {impactData.map((d) => (
                    <tr key={d.month} className="border-t border-white/5">
                      <td className="py-2 pr-4 text-white/60">{d.month}</td>
                      <td className="py-2 px-4 text-right font-semibold text-green-400">{d.familiesServed.toLocaleString()}</td>
                      <td className="py-2 text-right font-semibold text-teal-400">{d.co2AvoidedKg.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {isAdmin && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Log Monthly Impact</div>
            <div className="text-[10px] text-white/20 mb-3">Enter admin token to save (set via KPI_ADMIN_TOKEN env var on server)</div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="month" value={impactMonth} onChange={e => setImpactMonth(e.target.value)}
                     className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-400/40 transition-colors flex-1" />
              <input type="number" placeholder="Families served" value={impactFamilies} onChange={e => setImpactFamilies(e.target.value)}
                     className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-400/40 transition-colors flex-1" min={0} />
              <input type="number" placeholder="CO₂ avoided (kg)" value={impactCo2} onChange={e => setImpactCo2(e.target.value)}
                     className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-400/40 transition-colors flex-1" min={0} />
              <input type="password" placeholder="Admin token" value={impactAdminToken} onChange={e => setImpactAdminToken(e.target.value)}
                     className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400/40 transition-colors flex-1" />
              <button
                onClick={() => {
                  if (!impactMonth || !impactAdminToken) return;
                  onSaveImpact(impactMonth, Number(impactFamilies) || 0, Number(impactCo2) || 0, impactAdminToken);
                  setImpactMonth(""); setImpactFamilies(""); setImpactCo2(""); setImpactAdminToken("");
                }}
                className="bg-green-500/15 hover:bg-green-500/25 border border-green-500/30 text-green-400 text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Year targets summary */}
      <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">3-Year KPI Targets — Key Highlights</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/30 text-xs uppercase tracking-widest">
                <th className="text-left pb-3 pr-4">KPI</th>
                <th className="text-right pb-3 px-4">Year 1</th>
                <th className="text-right pb-3 px-4">Year 2</th>
                <th className="text-right pb-3">Year 3</th>
              </tr>
            </thead>
            <tbody className="space-y-1">
              {[
                { name: "Total Social Following", y1: "5,000", y2: "15,000", y3: "40,000", color: "#7c3aed" },
                { name: "Avg Engagement Rate", y1: "4–6%", y2: "6–8%", y3: "8%+", color: "#7c3aed" },
                { name: "Active Partners", y1: "6", y2: "15", y3: "30", color: "#0891b2" },
                { name: "Communities Reached", y1: "5", y2: "12", y3: "25", color: "#0891b2" },
                { name: "Active Team Members", y1: "22", y2: "40", y3: "70", color: "#d97706" },
                { name: "Member Retention", y1: "80%", y2: "85%", y3: "90%", color: "#d97706" },
                { name: "Research Articles / yr", y1: "4", y2: "10", y3: "18", color: "#16a34a" },
                { name: "Data Accuracy Score", y1: "85%", y2: "92%", y3: "97%", color: "#16a34a" },
                { name: "Events / Year", y1: "3", y2: "7", y3: "15", color: "#db2777" },
                { name: "Total Event Attendees", y1: "300", y2: "1,000", y3: "3,000", color: "#db2777" },
              ].map((row) => (
                <tr key={row.name} className="border-t border-white/5">
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: row.color }} />
                      <span className="text-white/70">{row.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-right font-semibold text-yellow-400">{row.y1}</td>
                  <td className="py-2.5 px-4 text-right font-semibold text-blue-300">{row.y2}</td>
                  <td className="py-2.5 text-right font-semibold text-green-400">{row.y3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Social Following Growth Target</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[{ year: "Y1", value: 5000 }, { year: "Y2", value: 15000 }, { year: "Y3", value: 40000 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1a2540", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
              <Bar dataKey="value" name="Followers" radius={[6, 6, 0, 0]} fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Community Reach Targets</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { year: "Y1", partners: 6, communities: 5 },
              { year: "Y2", partners: 15, communities: 12 },
              { year: "Y3", partners: 30, communities: 25 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1a2540", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
              <Legend wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }} />
              <Bar dataKey="partners" name="Partners" radius={[4, 4, 0, 0]} fill="#0891b2" />
              <Bar dataKey="communities" name="Communities" radius={[4, 4, 0, 0]} fill="#d97706" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Event Attendance Targets</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={[
              { year: "Y1", attendees: 300 },
              { year: "Y2", attendees: 1000 },
              { year: "Y3", attendees: 3000 },
            ]}>
              <defs>
                <linearGradient id="evg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#db2777" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#db2777" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1a2540", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
              <Area type="monotone" dataKey="attendees" name="Attendees" stroke="#db2777" fill="url(#evg)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Team & Research Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={[
              { year: "Y1", members: 22, articles: 4 },
              { year: "Y2", members: 40, articles: 10 },
              { year: "Y3", members: 70, articles: 18 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1a2540", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
              <Legend wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }} />
              <Line type="monotone" dataKey="members" name="Team Members" stroke="#d97706" strokeWidth={3} dot={{ fill: "#d97706", r: 4 }} />
              <Line type="monotone" dataKey="articles" name="Research Articles" stroke="#16a34a" strokeWidth={3} dot={{ fill: "#16a34a", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ startDateDraft, setStartDateDraft, onSave, isPending, weeks, submissionCount, onExport, onReset, resetConfirm, setResetConfirm }: {
  startDateDraft: string;
  setStartDateDraft: (v: string) => void;
  onSave: () => void;
  isPending: boolean;
  weeks: number;
  submissionCount: number;
  onExport: () => void;
  onReset: () => void;
  resetConfirm: boolean;
  setResetConfirm: (v: boolean) => void;
}) {
  return (
    <div className="max-w-lg space-y-6">
      <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-1">Programme Settings</h2>
        <p className="text-xs text-white/30 mb-6">Set the programme start date. Week number is calculated automatically.</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Programme Start Date</label>
            <input
              type="date"
              value={startDateDraft}
              onChange={(e) => setStartDateDraft(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-4 p-4 bg-yellow-400/8 border border-yellow-400/20 rounded-xl">
            <div className="text-3xl font-black text-yellow-400">{weeks}</div>
            <div>
              <div className="text-sm font-semibold text-white">Weeks Elapsed</div>
              <div className="text-xs text-white/40">Based on selected start date</div>
            </div>
          </div>

          <button
            onClick={onSave}
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition-colors disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-1">Data Management</h2>
        <p className="text-xs text-white/30 mb-5">Export or reset all historical weekly input data.</p>

        <div className="flex items-center gap-3 p-3 bg-white/4 border border-white/8 rounded-xl mb-5">
          <div className="text-2xl font-black text-white">{submissionCount}</div>
          <div>
            <div className="text-sm font-semibold text-white">Weekly submissions stored</div>
            <div className="text-xs text-white/35">Full input history including all team fields</div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onExport}
            className="w-full py-2.5 rounded-xl border border-white/15 text-white/70 hover:text-white hover:border-white/30 text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            <span>↓</span> Export all history as JSON
          </button>

          {!resetConfirm ? (
            <button
              onClick={() => setResetConfirm(true)}
              className="w-full py-2.5 rounded-xl border border-red-500/25 text-red-400/70 hover:text-red-400 hover:border-red-500/50 text-sm font-medium transition-all"
            >
              Reset — clear all history
            </button>
          ) : (
            <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-xl space-y-3">
              <div className="text-sm font-semibold text-red-400">This will permanently delete all {submissionCount} submissions and analysis history. Are you sure?</div>
              <div className="flex gap-2">
                <button onClick={onReset} className="flex-1 py-2 rounded-lg bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors">
                  Yes, delete everything
                </button>
                <button onClick={() => setResetConfirm(false)} className="flex-1 py-2 rounded-lg border border-white/15 text-white/50 hover:text-white text-sm font-medium transition-all">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">Scoring Rules</h2>
        <div className="space-y-2 text-xs text-white/40">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" />80–100 = Green (On Track)</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500" />50–79 = Amber (Needs Attention)</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500" />0–49 = Red (Critical)</div>
          <div className="mt-3 pt-3 border-t border-white/8">Inputs are entered weekly by each team lead. Quarterly fields should be entered once per quarter (enter 0 in non-survey weeks). Event-triggered fields are only entered when an event closes.</div>
          <div>Each KPI is scored as (actual ÷ weekly target) × 100, capped at 100.</div>
          <div>Team score = average of its weekly KPI scores.</div>
          <div>Overall score = average of all 5 team scores. Target: 70%+</div>
          <div className="mt-2 pt-2 border-t border-white/8 text-white/30">
            <span className="font-medium">AI probability:</span> Click "Run AI Analysis" in the Scores tab to get year-end probability estimates from Claude Sonnet. Requires ANTHROPIC_API_KEY in Secrets.
          </div>
        </div>
      </div>
    </div>
  );
}
