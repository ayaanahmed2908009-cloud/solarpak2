import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  weeksElapsed, yearFromWeeks, scoreAllTeams, calcOverallScore, ragStatus,
  DEFAULT_INPUTS,
  type TeamScore,
} from "@/lib/scoring";

type Tab = "scores" | "input" | "history" | "impact" | "settings";

type UserRole = "admin" | "team";

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

const INPUT_FIELDS: Record<string, { key: string; label: string; hint: string; type: "number" | "decimal" | "binary" }[]> = {
  marketing: [
    { key: "posts_this_week", label: "Posts published this week", hint: "Target: 3 posts/week", type: "number" },
    { key: "follower_gain_this_week", label: "Total follower gain this week", hint: "Target: 50 new followers/week", type: "number" },
    { key: "press_contacts_this_week", label: "Press contacts reached out to this week", hint: "Target: at least 1 outreach (1 = 100%)", type: "number" },
  ],
  partnerships: [
    { key: "outreach_meetings_this_week", label: "Outreach meetings held this week", hint: "Target: 0.5/week — 1 meeting = 200% (surplus banked)", type: "number" },
    { key: "partnerships_formalised_this_week", label: "New partnerships formalised this week", hint: "Target: 0.12/week — ~1 new partner every 8 weeks", type: "number" },
    { key: "communities_engaged_this_week", label: "New communities engaged this week", hint: "Target: 0.1/week — ~1 new community every 10 weeks", type: "number" },
  ],
  management: [
    { key: "new_members_this_week", label: "New members who joined SolarPak this week", hint: "Target: 0.15/week — ~8 new members needed over the year (14 → 22)", type: "number" },
    { key: "member_departures_this_week", label: "Members who left or became inactive this week", hint: "Target: 0 departures — each departure costs 25 points", type: "number" },
    { key: "okr_tasks_completed", label: "OKR tasks completed this week", hint: "Target: 70% of tasks due — enter total tasks due below", type: "number" },
    { key: "okr_tasks_total", label: "Total OKR tasks due this week", hint: "Required to calculate completion rate", type: "number" },
  ],
  impactlabs: [
    { key: "articles_in_progress", label: "Research articles or drafts actively worked on", hint: "Target: at least 1 in progress at all times (1 = 100%)", type: "number" },
    { key: "data_points_verified", label: "Data points or KPIs verified this week", hint: "Target: 3 data points/week", type: "number" },
    { key: "findings_shared_externally", label: "Were SolarPak findings shared externally? (1 = yes, 0 = no)", hint: "Target: 1 every 6 weeks — binary yes/no", type: "binary" },
  ],
  events: [
    { key: "event_planning_hours", label: "Hours spent on event planning this week", hint: "Target: 3 hours/week", type: "number" },
    { key: "sponsor_conversations", label: "Sponsor or partner conversations held this week", hint: "Target: 0.5/week — 1 conversation every fortnight", type: "number" },
    { key: "registrations_this_week", label: "People registered for upcoming events this week", hint: "Target: 6 registrations/week", type: "number" },
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
  const visibleTeamIds = isAdmin ? TEAM_IDS : (session.teamId ? [session.teamId] : TEAM_IDS);
  const allowedTabs: Tab[] = isAdmin
    ? ["scores", "input", "history", "impact", "settings"]
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
  const qc = useQueryClient();

  const { data: settings } = useQuery<{ startDate: string }>({
    queryKey: ["/api/kpi/settings"],
  });

  const { data: submissions = [] } = useQuery<any[]>({
    queryKey: ["/api/kpi/submissions"],
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
                <div className="text-[10px] text-white/30">{isAdmin ? "Full Access" : "Team View"}</div>
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
                  <ImpactTab />
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
                  />
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

function ScoresTab({ teamScores, overallScore, overallRag, weeks, visibleTeamIds, isAdmin }: {
  teamScores: TeamScore[];
  overallScore: number;
  overallRag: "green" | "amber" | "red";
  weeks: number;
  visibleTeamIds: string[];
  isAdmin: boolean;
}) {
  const overallColor = overallRag === "green" ? "#22c55e" : overallRag === "amber" ? "#f59e0b" : "#ef4444";
  const visibleScores = teamScores.filter((t) => visibleTeamIds.includes(t.teamId));

  return (
    <div className="space-y-6">
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

      {/* Team Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
              <div className="space-y-1.5">
                {ts.kpiScores.map((kpi) => {
                  const kRag = kpi.rag === "green" ? "#22c55e" : kpi.rag === "amber" ? "#f59e0b" : "#ef4444";
                  return (
                    <div key={kpi.name} className="flex items-center gap-2 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: kRag }} />
                      <span className="text-white/50 flex-1 truncate">{kpi.name}</span>
                      <span className="font-bold text-white/70">{Math.round(kpi.score)}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
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
                <label className="text-xs font-medium text-white/70">{field.label}</label>
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

          {/* KPI Score Breakdown */}
          {ts && (
            <div className="border-t border-white/8 pt-4 mb-4">
              <div className="text-xs text-white/40 uppercase tracking-widest mb-3">Live Score Breakdown</div>
              <div className="space-y-2">
                {ts.kpiScores.map((kpi) => {
                  const kColor = kpi.rag === "green" ? "#22c55e" : kpi.rag === "amber" ? "#f59e0b" : "#ef4444";
                  return (
                    <div key={kpi.name} className="flex items-center gap-3">
                      <span className="text-xs text-white/50 w-40 truncate">{kpi.name}</span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${kpi.score}%`, backgroundColor: kColor }} />
                      </div>
                      <span className="text-xs font-bold w-8 text-right" style={{ color: kColor }}>{Math.round(kpi.score)}</span>
                    </div>
                  );
                })}
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

function ImpactTab() {
  return (
    <div className="space-y-6">
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

function SettingsTab({ startDateDraft, setStartDateDraft, onSave, isPending, weeks }: {
  startDateDraft: string;
  setStartDateDraft: (v: string) => void;
  onSave: () => void;
  isPending: boolean;
  weeks: number;
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

      <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">Scoring Rules</h2>
        <div className="space-y-2 text-xs text-white/40">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" />80–100 = Green (On Track)</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500" />50–79 = Amber (Needs Attention)</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500" />0–49 = Red (Critical)</div>
          <div className="mt-3 pt-3 border-t border-white/8">Inputs are entered weekly by each team lead.</div>
          <div>Each KPI is scored as (actual ÷ weekly target) × 100, capped at 100.</div>
          <div>Team score = average of its weekly KPI scores.</div>
          <div>Overall score = average of all 5 team scores. Target: 70%+</div>
          <div className="mt-2 pt-2 border-t border-white/8 space-y-1">
            <div className="font-medium text-white/50 mb-1">Weekly targets per team:</div>
            <div>Marketing: 3 posts · 50 followers · 1 press contact</div>
            <div>Partnerships: 0.5 meetings · 0.12 partnerships · 0.1 communities</div>
            <div>Management: 0.15 new members · 0 departures · 70% OKR rate</div>
            <div>Impact Labs: 1 article in progress · 3 data points · findings shared</div>
            <div>Events: 3 planning hours · 0.5 sponsor convos · 6 registrations</div>
          </div>
        </div>
      </div>
    </div>
  );
}
