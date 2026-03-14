import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, FunnelChart, Funnel, LabelList, Cell,
} from "recharts";
import { TEAMS, RISKS, IMPACT_DATA, SUMMARY_STATS } from "@/data/kpiData";

type Year = 0 | 1 | 2;
type Tab = "overview" | "teams" | "risks" | "impact";

const YEAR_LABELS = ["Year 1", "Year 2", "Year 3"];

function getRagStatus(actual: number, target: number): "green" | "amber" | "red" {
  if (target === 0) return "green";
  const pct = (actual / target) * 100;
  if (pct >= 90) return "green";
  if (pct >= 70) return "amber";
  return "red";
}

function getRagColor(status: "green" | "amber" | "red") {
  if (status === "green") return "#16a34a";
  if (status === "amber") return "#d97706";
  return "#dc2626";
}

function getRagBg(status: "green" | "amber" | "red") {
  if (status === "green") return "bg-green-100 text-green-700 border-green-300";
  if (status === "amber") return "bg-amber-100 text-amber-700 border-amber-300";
  return "bg-red-100 text-red-700 border-red-300";
}

function getRiskColor(score: number) {
  if (score >= 15) return "#dc2626";
  if (score >= 8) return "#ea580c";
  if (score >= 4) return "#d97706";
  return "#16a34a";
}

function getRiskBg(score: number) {
  if (score >= 15) return "bg-red-50 border-red-200";
  if (score >= 8) return "bg-orange-50 border-orange-200";
  if (score >= 4) return "bg-amber-50 border-amber-200";
  return "bg-green-50 border-green-200";
}

const STORAGE_KEY = "solarpak_kpi_actuals";

function loadActuals(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveActuals(actuals: Record<string, number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(actuals));
}

function formatValue(value: number, unit: string) {
  if (unit === "$") return `$${value.toLocaleString()}`;
  if (unit === "%") return `${value}%`;
  if (unit === "×") return `${value}×`;
  if (unit === "people" && value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return `${value.toLocaleString()} ${unit}`;
}

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function KPI() {
  const [year, setYear] = useState<Year>(0);
  const [tab, setTab] = useState<Tab>("overview");
  const [selectedTeam, setSelectedTeam] = useState(0);
  const [actuals, setActuals] = useState<Record<string, number>>(loadActuals);
  const [tooltip, setTooltip] = useState<{
    risk: (typeof RISKS)[0];
    x: number;
    y: number;
  } | null>(null);
  const [sortField, setSortField] = useState<"name" | "likelihood" | "impact" | "score">("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    saveActuals(actuals);
  }, [actuals]);

  function setActual(teamId: string, kpiName: string, value: number) {
    const key = `${teamId}__${kpiName}__${year}`;
    setActuals((prev) => ({ ...prev, [key]: value }));
  }

  function getActual(teamId: string, kpiName: string): number {
    const key = `${teamId}__${kpiName}__${year}`;
    return actuals[key] ?? 0;
  }

  function getTeamCompletion(teamId: string, yearIdx: Year) {
    const team = TEAMS.find((t) => t.id === teamId)!;
    let total = 0, count = 0;
    team.kpis.forEach((kpi) => {
      const target = kpi.targets[yearIdx];
      if (target === 0) return;
      const key = `${teamId}__${kpi.name}__${yearIdx}`;
      const actual = actuals[key] ?? 0;
      total += Math.min((actual / target) * 100, 100);
      count++;
    });
    return count > 0 ? total / count : 0;
  }

  const sortedRisks = [...RISKS].sort((a, b) => {
    const getVal = (r: (typeof RISKS)[0]) => {
      if (sortField === "score") return r.likelihood * r.impact;
      if (sortField === "likelihood") return r.likelihood;
      if (sortField === "impact") return r.impact;
      return 0;
    };
    if (sortField === "name") {
      return sortDir === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    return sortDir === "asc" ? getVal(a) - getVal(b) : getVal(b) - getVal(a);
  });

  function toggleSort(field: typeof sortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  }

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col">
      {/* Sidebar + Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-[#0d1528] border-r border-white/10 fixed top-0 left-0 h-full z-20">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-black text-black text-lg">S</div>
              <div>
                <div className="font-bold text-white text-sm">SolarPak</div>
                <div className="text-xs text-white/40">KPI Dashboard</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {(["overview", "teams", "risks", "impact"] as Tab[]).map((t) => {
              const icons: Record<Tab, string> = {
                overview: "⬡",
                teams: "◈",
                risks: "⚠",
                impact: "◉",
              };
              const labels: Record<Tab, string> = {
                overview: "Overview",
                teams: "Team KPIs",
                risks: "Risk Heatmap",
                impact: "Impact Summary",
              };
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    tab === t
                      ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-base">{icons[t]}</span>
                  {labels[t]}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10 space-y-2">
            <div className="text-xs text-white/30 uppercase tracking-widest mb-2">Teams</div>
            {TEAMS.map((team) => {
              const pct = getTeamCompletion(team.id as any, year);
              const rag = pct >= 90 ? "green" : pct >= 70 ? "amber" : "red";
              return (
                <div key={team.id} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getRagColor(rag) }}
                  />
                  <span className="text-white/60 truncate">{team.name.split(" ")[0]}</span>
                  <span className="ml-auto text-white/40">{Math.round(pct)}%</span>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
          {/* Top Bar */}
          <header className="sticky top-0 z-10 bg-[#0a0f1e]/90 backdrop-blur border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">
                {tab === "overview" && "Dashboard Overview"}
                {tab === "teams" && "Team KPI Tracker"}
                {tab === "risks" && "Risk Heatmap"}
                {tab === "impact" && "Impact Summary"}
              </h1>
              <p className="text-xs text-white/40 mt-0.5">SolarPak · Impact Operations</p>
            </div>
            <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/10">
              {YEAR_LABELS.map((lbl, i) => (
                <button
                  key={i}
                  onClick={() => setYear(i as Year)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    year === i
                      ? "bg-yellow-400 text-black shadow"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </header>

          {/* Page Body */}
          <main className="flex-1 p-6">
            <AnimatePresence mode="wait">
              {tab === "overview" && (
                <motion.div key="overview" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
                  <OverviewTab year={year} actuals={actuals} getTeamCompletion={getTeamCompletion} />
                </motion.div>
              )}
              {tab === "teams" && (
                <motion.div key="teams" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
                  <TeamsTab year={year} selectedTeam={selectedTeam} setSelectedTeam={setSelectedTeam} actuals={actuals} getActual={getActual} setActual={setActual} />
                </motion.div>
              )}
              {tab === "risks" && (
                <motion.div key="risks" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
                  <RisksTab sortedRisks={sortedRisks} sortField={sortField} sortDir={sortDir} toggleSort={toggleSort} tooltip={tooltip} setTooltip={setTooltip} />
                </motion.div>
              )}
              {tab === "impact" && (
                <motion.div key="impact" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
                  <ImpactTab year={year} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Footer */}
          <footer className="px-6 py-4 border-t border-white/10 flex items-center justify-between text-xs text-white/30">
            <span>SolarPak KPI Dashboard · Impact Labs Design System</span>
            <span>Last updated: {today}</span>
          </footer>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0d1528] border-t border-white/10 z-20 flex">
        {(["overview", "teams", "risks", "impact"] as Tab[]).map((t) => {
          const icons: Record<Tab, string> = { overview: "⬡", teams: "◈", risks: "⚠", impact: "◉" };
          const labels: Record<Tab, string> = { overview: "Overview", teams: "Teams", risks: "Risks", impact: "Impact" };
          return (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all ${tab === t ? "text-yellow-400" : "text-white/40"}`}>
              <span className="text-lg">{icons[t]}</span>
              {labels[t]}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, borderColor: color }}
      className="bg-[#0d1528] border border-white/10 rounded-2xl p-6 flex flex-col gap-2 transition-colors cursor-default"
    >
      <div className="text-xs text-white/40 uppercase tracking-widest">{label}</div>
      <div className="text-4xl font-black" style={{ color }}>{value}</div>
      {sub && <div className="text-xs text-white/30">{sub}</div>}
    </motion.div>
  );
}

function OverviewTab({ year, actuals, getTeamCompletion }: {
  year: Year;
  actuals: Record<string, number>;
  getTeamCompletion: (teamId: string, yearIdx: Year) => number;
}) {
  const completions = TEAMS.map((t) => ({
    name: t.name.split(" ")[0],
    pct: Math.round(getTeamCompletion(t.id, year)),
    color: t.color,
  }));

  return (
    <div className="space-y-8">
      {/* Stat Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Families Served" value="220" sub="Cumulative Y1–Y3" color="#facc15" />
        <StatCard label="Total CO₂ Avoided" value="110t" sub="Cumulative Y1–Y3" color="#34d399" />
        <StatCard label="Total Funds Raised" value="$70K" sub="Cumulative Y1–Y3" color="#60a5fa" />
        <StatCard label="Active Volunteers" value="80" sub="Year 3 target" color="#f472b6" />
      </div>

      {/* Progress Per Team */}
      <div className="bg-[#0d1528] border border-white/10 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-6">Team KPI Completion — {YEAR_LABELS[year]}</h2>
        <div className="space-y-4">
          {TEAMS.map((team) => {
            const pct = Math.round(getTeamCompletion(team.id, year));
            const rag = pct >= 90 ? "green" : pct >= 70 ? "amber" : "red";
            return (
              <div key={team.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80 font-medium">{team.name}</span>
                  <span className="font-bold" style={{ color: getRagColor(rag) }}>{pct}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: team.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Health RAG Pills */}
      <div className="bg-[#0d1528] border border-white/10 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">Health At A Glance — {YEAR_LABELS[year]}</h2>
        <div className="flex flex-wrap gap-3">
          {TEAMS.map((team) => {
            const pct = Math.round(getTeamCompletion(team.id, year));
            const rag = pct >= 90 ? "green" : pct >= 70 ? "amber" : "red";
            const labels = { green: "On Track", amber: "At Risk", red: "Behind" };
            return (
              <div key={team.id} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${getRagBg(rag)}`}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getRagColor(rag) }} />
                <span>{team.name.split(" ")[0]}</span>
                <span className="opacity-60">{labels[rag]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TeamsTab({ year, selectedTeam, setSelectedTeam, actuals, getActual, setActual }: {
  year: Year;
  selectedTeam: number;
  setSelectedTeam: (i: number) => void;
  actuals: Record<string, number>;
  getActual: (teamId: string, kpiName: string) => number;
  setActual: (teamId: string, kpiName: string, value: number) => void;
}) {
  const team = TEAMS[selectedTeam];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Team Selector */}
      <div className="md:w-56 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
        {TEAMS.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setSelectedTeam(i)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap md:w-full ${
              selectedTeam === i
                ? "text-white border"
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
            style={selectedTeam === i ? { backgroundColor: `${t.color}20`, borderColor: `${t.color}50` } : {}}
          >
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
            <span className="text-left">{t.name}</span>
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={team.id + year}
            className="contents"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {team.kpis.map((kpi) => {
              const target = kpi.targets[year];
              const actual = getActual(team.id, kpi.name);
              const pct = target > 0 ? Math.min(Math.round((actual / target) * 100), 100) : 0;
              const rag = target === 0 ? "green" : getRagStatus(actual, target);

              return (
                <motion.div
                  key={kpi.name}
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#0d1528] border border-white/10 rounded-2xl p-5 flex flex-col gap-4 hover:border-white/20 transition-colors"
                >
                  <div>
                    <div className="text-xs text-white/40 uppercase tracking-widest mb-1">KPI</div>
                    <div className="font-bold text-white">{kpi.name}</div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <div className="text-white/40 text-xs">Target</div>
                      <div className="font-semibold text-white">{formatValue(target, kpi.unit)}</div>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full border text-xs font-bold ${getRagBg(rag)}`}>
                      {pct}%
                    </div>
                  </div>

                  <div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: team.color }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-white/40 mb-1">Actual</div>
                    <input
                      type="number"
                      value={actual === 0 ? "" : actual}
                      placeholder="Enter actual"
                      onChange={(e) => setActual(team.id, kpi.name, Number(e.target.value) || 0)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-yellow-400/50 transition-colors"
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function RisksTab({ sortedRisks, sortField, sortDir, toggleSort, tooltip, setTooltip }: {
  sortedRisks: typeof RISKS;
  sortField: string;
  sortDir: "asc" | "desc";
  toggleSort: (f: any) => void;
  tooltip: any;
  setTooltip: (t: any) => void;
}) {
  const xLabels = ["Negligible", "Minor", "Moderate", "Significant", "Severe"];
  const yLabels = ["Rare", "Unlikely", "Possible", "Likely", "Critical"];

  function getRiskForCell(likelihood: number, impact: number) {
    return RISKS.filter((r) => r.likelihood === likelihood && r.impact === impact);
  }

  return (
    <div className="space-y-8">
      {/* Heatmap Grid */}
      <div className="bg-[#0d1528] border border-white/10 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-6">5×5 Risk Matrix</h2>
        <div className="relative overflow-x-auto">
          <div className="min-w-[460px]">
            {/* X labels */}
            <div className="flex ml-16 mb-1">
              {xLabels.map((l) => (
                <div key={l} className="flex-1 text-center text-xs text-white/30 px-1">{l}</div>
              ))}
            </div>
            {/* Grid rows (likelihood 5 → 1) */}
            <div className="flex flex-col gap-1">
              {[5, 4, 3, 2, 1].map((likelihood) => (
                <div key={likelihood} className="flex items-center gap-1">
                  <div className="w-16 text-xs text-white/30 text-right pr-2">{yLabels[likelihood - 1]}</div>
                  {[1, 2, 3, 4, 5].map((impact) => {
                    const score = likelihood * impact;
                    const risks = getRiskForCell(likelihood, impact);
                    const bg =
                      score >= 15 ? "bg-red-900/60 border-red-700/40" :
                      score >= 8 ? "bg-orange-900/60 border-orange-700/40" :
                      score >= 4 ? "bg-amber-900/40 border-amber-700/30" :
                      "bg-green-900/30 border-green-700/20";

                    return (
                      <div
                        key={impact}
                        className={`flex-1 aspect-square rounded-lg border ${bg} flex flex-wrap items-center justify-center gap-1 p-1 min-h-[52px]`}
                      >
                        {risks.map((risk) => (
                          <button
                            key={risk.id}
                            className="w-5 h-5 rounded-full border-2 border-white/30 cursor-pointer transition-transform hover:scale-125 flex items-center justify-center text-[8px] font-bold text-white"
                            style={{ backgroundColor: getRiskColor(risk.likelihood * risk.impact) }}
                            onMouseEnter={(e) => {
                              const rect = (e.target as HTMLElement).getBoundingClientRect();
                              setTooltip({ risk, x: rect.left, y: rect.top });
                            }}
                            onMouseLeave={() => setTooltip(null)}
                            title={risk.name}
                          >
                            {risk.id}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="ml-16 mt-1 text-center text-xs text-white/30">← Impact →</div>
          </div>
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-xs">
          {[
            { label: "Critical (≥15)", color: "bg-red-600" },
            { label: "High (8–14)", color: "bg-orange-500" },
            { label: "Medium (4–7)", color: "bg-amber-500" },
            { label: "Low (<4)", color: "bg-green-600" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-white/50">
              <span className={`w-3 h-3 rounded-full ${item.color}`} />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Risk Register Table */}
      <div className="bg-[#0d1528] border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">Risk Register</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {[
                  { key: "name", label: "Risk" },
                  { key: "category", label: "Category" },
                  { key: "likelihood", label: "Likelihood" },
                  { key: "impact", label: "Impact" },
                  { key: "score", label: "Score" },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    className="px-4 py-3 text-left text-xs text-white/40 uppercase tracking-widest cursor-pointer hover:text-white transition-colors select-none"
                    onClick={() => toggleSort(key as any)}
                  >
                    {label}
                    {sortField === key && (
                      <span className="ml-1 text-yellow-400">{sortDir === "desc" ? "↓" : "↑"}</span>
                    )}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs text-white/40 uppercase tracking-widest">Mitigation</th>
              </tr>
            </thead>
            <tbody>
              {sortedRisks.map((risk) => {
                const score = risk.likelihood * risk.impact;
                return (
                  <tr key={risk.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{risk.name}</td>
                    <td className="px-4 py-3 text-white/50">{risk.category}</td>
                    <td className="px-4 py-3 text-center text-white/70">{risk.likelihood}</td>
                    <td className="px-4 py-3 text-center text-white/70">{risk.impact}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-white text-sm"
                        style={{ backgroundColor: getRiskColor(score) }}
                      >
                        {score}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/40 text-xs max-w-xs">{risk.mitigation}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-[#1a2540] border border-white/20 rounded-xl p-4 shadow-2xl text-sm max-w-xs pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 100 }}
        >
          <div className="font-bold text-white mb-1">{tooltip.risk.name}</div>
          <div className="text-white/50 text-xs mb-2">{tooltip.risk.category}</div>
          <div className="flex gap-3 text-xs mb-2">
            <span className="text-white/60">Score: <span className="font-bold" style={{ color: getRiskColor(tooltip.risk.likelihood * tooltip.risk.impact) }}>{tooltip.risk.likelihood * tooltip.risk.impact}</span></span>
            <span className="text-white/60">L: {tooltip.risk.likelihood} · I: {tooltip.risk.impact}</span>
          </div>
          <div className="text-white/50 text-xs">{tooltip.risk.mitigation}</div>
        </div>
      )}
    </div>
  );
}

function ImpactTab({ year }: { year: Year }) {
  const COLORS = ["#facc15", "#34d399", "#60a5fa"];
  const FUNNEL_COLORS = ["#facc15", "#f59e0b", "#d97706", "#b45309"];

  return (
    <div className="space-y-8">
      {/* Families Served Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0d1528] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">Cumulative Families Served</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={IMPACT_DATA.familiesServed}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1a2540", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
              <Bar dataKey="value" name="Families" radius={[6, 6, 0, 0]} fill="#facc15" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0d1528] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">CO₂ Avoided (tonnes)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={IMPACT_DATA.co2Avoided}>
              <defs>
                <linearGradient id="co2grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1a2540", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
              <Area type="monotone" dataKey="value" name="CO₂ (t)" stroke="#34d399" fill="url(#co2grad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0d1528] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">Household Energy Saving (%)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={IMPACT_DATA.energySaving}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={{ background: "#1a2540", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
              <Line type="monotone" dataKey="value" name="Energy Saving" stroke="#a78bfa" strokeWidth={3} dot={{ fill: "#a78bfa", r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0d1528] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">Fundraising Breakdown ($)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={IMPACT_DATA.fundraising}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1a2540", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
              <Legend wrapperStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }} />
              <Bar dataKey="individual" name="Individual" stackId="a" fill="#facc15" radius={[0, 0, 0, 0]} />
              <Bar dataKey="events" name="Events" stackId="a" fill="#34d399" />
              <Bar dataKey="grants" name="Grants" stackId="a" fill="#60a5fa" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donor Pipeline */}
      <div className="bg-[#0d1528] border border-white/10 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-6">Donor Pipeline Funnel</h3>
        <div className="flex flex-col md:flex-row items-center gap-4">
          {IMPACT_DATA.donorPipeline.map((stage, i) => {
            const maxVal = IMPACT_DATA.donorPipeline[0].value;
            const widthPct = (stage.value / maxVal) * 100;
            return (
              <div key={stage.stage} className="w-full flex flex-col items-center gap-2">
                <div className="text-xs text-white/40 uppercase tracking-widest">{stage.stage}</div>
                <div
                  className="h-14 rounded-xl flex items-center justify-center font-bold text-white text-lg transition-all"
                  style={{
                    width: `${widthPct}%`,
                    minWidth: 80,
                    backgroundColor: FUNNEL_COLORS[i],
                    margin: "0 auto",
                  }}
                >
                  {stage.value.toLocaleString()}
                </div>
                {i < IMPACT_DATA.donorPipeline.length - 1 && (
                  <div className="text-white/20 text-xs hidden md:block">
                    {Math.round((IMPACT_DATA.donorPipeline[i + 1].value / stage.value) * 100)}% conversion
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
