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
  weeksElapsed, scoreAllTeams, calcOverallScore, ragStatus,
  DEFAULT_INPUTS,
  type TeamScore,
} from "@/lib/scoring";
import { IMPACT_DATA } from "@/data/kpiData";

type Tab = "scores" | "input" | "history" | "impact" | "settings";

const TEAM_META: Record<string, { name: string; color: string }> = {
  operations: { name: "Operations & Installations", color: "#16a34a" },
  fundraising: { name: "Fundraising & Donations", color: "#2563eb" },
  marketing: { name: "Marketing & Outreach", color: "#7c3aed" },
  volunteers: { name: "Volunteer Management", color: "#d97706" },
  impactlabs: { name: "Impact Labs", color: "#0891b2" },
  events: { name: "Events & Community Outreach", color: "#db2777" },
};

const TEAM_IDS = ["operations", "fundraising", "marketing", "volunteers", "impactlabs", "events"];

const INPUT_FIELDS: Record<string, { key: string; label: string; type: "number" | "pct" }[]> = {
  operations: [
    { key: "families_served_to_date", label: "Families Served (to date)", type: "number" },
    { key: "completion_rate_pct", label: "Same-Day Completion Rate (%)", type: "pct" },
    { key: "uptime_failures", label: "Uptime Failures (0 = perfect)", type: "number" },
    { key: "co2_reports_submitted", label: "CO₂ Reports Submitted", type: "number" },
    { key: "co2_rounds_completed", label: "CO₂ Rounds Completed", type: "number" },
    { key: "install_reports_published", label: "Install Reports Published", type: "number" },
    { key: "install_rounds_completed", label: "Install Rounds Completed", type: "number" },
  ],
  fundraising: [
    { key: "funds_raised_to_date", label: "Funds Raised to Date ($)", type: "number" },
    { key: "retained_donors", label: "Retained Donors", type: "number" },
    { key: "total_prior_donors", label: "Total Prior Donors", type: "number" },
    { key: "new_funding_sources", label: "New Funding Sources", type: "number" },
    { key: "cost_per_family_last_round", label: "Cost Per Family ($)", type: "number" },
  ],
  marketing: [
    { key: "follower_count_start", label: "Follower Count (Baseline)", type: "number" },
    { key: "follower_count_now", label: "Follower Count (Now)", type: "number" },
    { key: "avg_monthly_reach", label: "Avg Monthly Reach", type: "number" },
    { key: "media_mentions_to_date", label: "Media Mentions (to date)", type: "number" },
    { key: "donor_conversion_pct", label: "Website Donor Conversion (%)", type: "pct" },
  ],
  volunteers: [
    { key: "active_volunteers", label: "Active Volunteers", type: "number" },
    { key: "tasks_on_time_pct", label: "Tasks Completed On Time (%)", type: "pct" },
    { key: "meetings_held_pct", label: "Weekly Meetings Held (%)", type: "pct" },
  ],
  impactlabs: [
    { key: "surveys_completed_pct", label: "Follow-Up Survey Completion (%)", type: "pct" },
    { key: "reports_published", label: "Reports Published", type: "number" },
    { key: "reports_due", label: "Reports Due", type: "number" },
    { key: "co2_documented_rounds", label: "CO₂ Rounds Documented", type: "number" },
    { key: "total_rounds", label: "Total Rounds", type: "number" },
    { key: "energy_saving_pct", label: "Avg Household Energy Saving (%)", type: "pct" },
  ],
  events: [
    { key: "events_hosted_to_date", label: "Events Hosted (to date)", type: "number" },
    { key: "attendee_growth_pct", label: "Attendee Growth vs Prior Event (%)", type: "pct" },
    { key: "fundraising_raised_to_date", label: "Event Fundraising ($)", type: "number" },
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
  const [tab, setTab] = useState<Tab>("scores");
  const [selectedInputTeam, setSelectedInputTeam] = useState(0);
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
  const weekNums = [...new Set((submissions as any[]).map((s) => s.weekNumber))].sort((a, b) => a - b);
  weekNums.forEach((wk) => {
    const weekSubs = (submissions as any[]).filter((s) => s.weekNumber === wk);
    const avg = weekSubs.reduce((sum, s) => sum + s.teamScore, 0) / (weekSubs.length || 1);
    overallHistory.push({ week: `W${wk}`, score: Math.round(avg) });
  });

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
            {(["scores", "input", "history", "impact", "settings"] as Tab[]).map((t) => {
              const meta: Record<Tab, { icon: string; label: string }> = {
                scores: { icon: "◉", label: "Scores" },
                input: { icon: "✎", label: "Weekly Input" },
                history: { icon: "◈", label: "History" },
                impact: { icon: "⬡", label: "Impact Charts" },
                settings: { icon: "⚙", label: "Settings" },
              };
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    tab === t
                      ? "bg-yellow-400/15 text-yellow-300 border border-yellow-400/25"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{meta[t].icon}</span>{meta[t].label}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/8">
            <div className="text-[10px] text-white/25 uppercase tracking-widest mb-2">Week {weeks}</div>
            {teamScores.map((ts) => {
              const meta = TEAM_META[ts.teamId];
              return (
                <div key={ts.teamId} className="flex items-center gap-2 py-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ragColors(ts.rag).badge === "bg-green-500" ? "#22c55e" : ts.rag === "amber" ? "#f59e0b" : "#ef4444" }} />
                  <span className="text-[11px] text-white/50 truncate flex-1">{meta?.name.split(" ")[0]}</span>
                  <span className="text-[11px] font-bold text-white/60">{Math.round(ts.teamScore)}</span>
                </div>
              );
            })}
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
              <p className="text-[11px] text-white/35 mt-0.5">Week {weeks} · Started {startDate}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold ${ragColors2.bg} ${ragColors2.border} ${ragColors2.text}`}>
                <span>Overall</span>
                <span className="text-xl font-black">{Math.round(overallScore)}</span>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            <AnimatePresence mode="wait">
              {tab === "scores" && (
                <motion.div key="scores" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
                  <ScoresTab teamScores={teamScores} overallScore={overallScore} overallRag={overallRag} weeks={weeks} />
                </motion.div>
              )}
              {tab === "input" && (
                <motion.div key="input" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
                  <InputTab
                    selectedTeam={selectedInputTeam}
                    setSelectedTeam={setSelectedInputTeam}
                    teamScores={teamScores}
                    getInputs={getInputs}
                    setField={setField}
                    handleSubmit={handleSubmitTeam}
                    isPending={submitMutation.isPending}
                    saved={saved}
                  />
                </motion.div>
              )}
              {tab === "history" && (
                <motion.div key="history" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
                  <HistoryTab historyByTeam={historyByTeam} overallHistory={overallHistory} />
                </motion.div>
              )}
              {tab === "impact" && (
                <motion.div key="impact" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
                  <ImpactTab />
                </motion.div>
              )}
              {tab === "settings" && (
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
            <span>SolarPak KPI System · Year 1</span>
            <span>Last updated: {today}</span>
          </footer>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0c1326] border-t border-white/8 z-20 flex">
        {(["scores", "input", "history", "impact", "settings"] as Tab[]).map((t) => {
          const icons: Record<Tab, string> = { scores: "◉", input: "✎", history: "◈", impact: "⬡", settings: "⚙" };
          const labels: Record<Tab, string> = { scores: "Scores", input: "Input", history: "History", impact: "Impact", settings: "Settings" };
          return (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-all ${tab === t ? "text-yellow-400" : "text-white/35"}`}>
              <span className="text-base">{icons[t]}</span>
              {labels[t]}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function ScoresTab({ teamScores, overallScore, overallRag, weeks }: {
  teamScores: TeamScore[];
  overallScore: number;
  overallRag: "green" | "amber" | "red";
  weeks: number;
}) {
  const overallColor = overallRag === "green" ? "#22c55e" : overallRag === "amber" ? "#f59e0b" : "#ef4444";

  return (
    <div className="space-y-6">
      {/* Overall Score Hero */}
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

      {/* Team Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {teamScores.map((ts) => {
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

function InputTab({ selectedTeam, setSelectedTeam, teamScores, getInputs, setField, handleSubmit, isPending, saved }: {
  selectedTeam: number;
  setSelectedTeam: (i: number) => void;
  teamScores: TeamScore[];
  getInputs: (teamId: string) => Record<string, any>;
  setField: (teamId: string, key: string, value: number) => void;
  handleSubmit: (teamId: string) => void;
  isPending: boolean;
  saved: boolean;
}) {
  const teamId = TEAM_IDS[selectedTeam];
  const meta = TEAM_META[teamId];
  const fields = INPUT_FIELDS[teamId] || [];
  const inputs = getInputs(teamId);
  const ts = teamScores.find((t) => t.teamId === teamId);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Team Selector */}
      <div className="md:w-52 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
        {TEAM_IDS.map((id, i) => {
          const m = TEAM_META[id];
          const ts2 = teamScores.find((t) => t.teamId === id);
          return (
            <button
              key={id}
              onClick={() => setSelectedTeam(i)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap md:w-full ${
                selectedTeam === i ? "text-white border" : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
              style={selectedTeam === i ? { backgroundColor: `${m.color}18`, borderColor: `${m.color}40` } : {}}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
              <span className="flex-1 text-left">{m.name}</span>
              {ts2 && <span className="font-bold text-white/50">{Math.round(ts2.teamScore)}</span>}
            </button>
          );
        })}
      </div>

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
            {fields.map((field) => {
              const kpi = ts?.kpiScores.find((k) =>
                k.name.toLowerCase().includes(field.label.split(" ")[0].toLowerCase().replace("₂", "").replace("(", "").trim())
              );
              return (
                <div key={field.key} className="space-y-1.5">
                  <label className="text-xs text-white/50">{field.label}</label>
                  <input
                    type="number"
                    min="0"
                    step={field.type === "pct" ? "0.1" : "1"}
                    value={inputs[field.key] ?? ""}
                    onChange={(e) => setField(teamId, field.key, Number(e.target.value) || 0)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-yellow-400/50 transition-colors"
                    placeholder="0"
                  />
                </div>
              );
            })}
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

function HistoryTab({ historyByTeam, overallHistory }: { historyByTeam: Record<string, any[]>; overallHistory: any[] }) {
  const TEAM_COLORS = Object.entries(TEAM_META).map(([id, m]) => ({ id, color: m.color }));

  const combined: Record<string, any> = {};
  TEAM_IDS.forEach((id) => {
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
      {/* Overall Line */}
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

      {/* Per-Team Lines */}
      {combinedData.length > 0 && (
        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">Team Scores — Weekly</h3>
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
        {TEAM_IDS.map((id) => {
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Cumulative Families Served</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={IMPACT_DATA.familiesServed}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1a2540", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
              <Bar dataKey="value" name="Families" radius={[6, 6, 0, 0]} fill="#facc15" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">CO₂ Avoided (tonnes)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={IMPACT_DATA.co2Avoided}>
              <defs>
                <linearGradient id="co2g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1a2540", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
              <Area type="monotone" dataKey="value" name="CO₂ (t)" stroke="#34d399" fill="url(#co2g)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Energy Saving (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={IMPACT_DATA.energySaving}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={{ background: "#1a2540", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
              <Line type="monotone" dataKey="value" name="Saving %" stroke="#a78bfa" strokeWidth={3} dot={{ fill: "#a78bfa", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#0c1326] border border-white/10 rounded-2xl p-6">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Fundraising Breakdown ($)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={IMPACT_DATA.fundraising}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1a2540", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
              <Legend wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }} />
              <Bar dataKey="individual" name="Individual" stackId="a" fill="#facc15" />
              <Bar dataKey="events" name="Events" stackId="a" fill="#34d399" />
              <Bar dataKey="grants" name="Grants" stackId="a" fill="#60a5fa" radius={[6, 6, 0, 0]} />
            </BarChart>
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
          <div className="mt-3 pt-3 border-t border-white/8">All scores are capped at 100 and floored at 0.</div>
          <div>Team score = average of its KPI scores.</div>
          <div>Overall score = average of all 6 team scores.</div>
        </div>
      </div>
    </div>
  );
}
