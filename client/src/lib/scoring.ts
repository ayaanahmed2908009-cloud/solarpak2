export function cap(score: number): number {
  return Math.min(100, Math.max(0, score));
}

export function weeksElapsed(startDate: string): number {
  const start = new Date(startDate).getTime();
  const now = Date.now();
  return Math.max(1, Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000)) + 1);
}

export interface OperationsInputs {
  families_served_to_date: number;
  completion_rate_pct: number;
  uptime_failures: number;
  co2_reports_submitted: number;
  co2_rounds_completed: number;
  install_reports_published: number;
  install_rounds_completed: number;
}

export interface FundraisingInputs {
  funds_raised_to_date: number;
  retained_donors: number;
  total_prior_donors: number;
  new_funding_sources: number;
  cost_per_family_last_round: number;
}

export interface MarketingInputs {
  follower_count_start: number;
  follower_count_now: number;
  avg_monthly_reach: number;
  media_mentions_to_date: number;
  donor_conversion_pct: number;
}

export interface VolunteerInputs {
  active_volunteers: number;
  tasks_on_time_pct: number;
  meetings_held_pct: number;
}

export interface ImpactLabsInputs {
  surveys_completed_pct: number;
  reports_published: number;
  reports_due: number;
  co2_documented_rounds: number;
  total_rounds: number;
  energy_saving_pct: number;
}

export interface EventsInputs {
  events_hosted_to_date: number;
  attendee_growth_pct: number;
  fundraising_raised_to_date: number;
}

export type TeamInputs =
  | { team: "operations"; inputs: OperationsInputs }
  | { team: "fundraising"; inputs: FundraisingInputs }
  | { team: "marketing"; inputs: MarketingInputs }
  | { team: "volunteers"; inputs: VolunteerInputs }
  | { team: "impactlabs"; inputs: ImpactLabsInputs }
  | { team: "events"; inputs: EventsInputs };

export interface KpiScore {
  name: string;
  score: number;
  rag: "green" | "amber" | "red";
}

export interface TeamScore {
  teamId: string;
  teamScore: number;
  rag: "green" | "amber" | "red";
  kpiScores: KpiScore[];
}

export function ragStatus(score: number): "green" | "amber" | "red" {
  if (score >= 80) return "green";
  if (score >= 50) return "amber";
  return "red";
}

export function scoreOperations(inputs: OperationsInputs, weeks: number): KpiScore[] {
  const familiesTarget = (40 / 52) * weeks;
  const families = cap((inputs.families_served_to_date / familiesTarget) * 100);
  const completion = cap((inputs.completion_rate_pct / 90) * 100);
  const uptime = inputs.uptime_failures === 0 ? 100 : 0;
  const co2 = inputs.co2_rounds_completed > 0
    ? cap((inputs.co2_reports_submitted / inputs.co2_rounds_completed) * 100)
    : 100;
  const installReports = inputs.install_rounds_completed > 0
    ? cap((inputs.install_reports_published / inputs.install_rounds_completed) * 100)
    : 100;

  return [
    { name: "Families Served", score: families, rag: ragStatus(families) },
    { name: "Completion Rate", score: completion, rag: ragStatus(completion) },
    { name: "System Uptime", score: uptime, rag: ragStatus(uptime) },
    { name: "CO₂ Reports", score: co2, rag: ragStatus(co2) },
    { name: "Install Reports", score: installReports, rag: ragStatus(installReports) },
  ];
}

export function scoreFundraising(inputs: FundraisingInputs, weeks: number): KpiScore[] {
  const fundsTarget = (10000 / 52) * weeks;
  const funds = cap((inputs.funds_raised_to_date / fundsTarget) * 100);
  const retention = inputs.total_prior_donors > 0
    ? cap((inputs.retained_donors / inputs.total_prior_donors) * 100)
    : 100;
  const sources = cap((inputs.new_funding_sources / 1) * 100);
  const cost = inputs.cost_per_family_last_round > 0
    ? cap((120 / inputs.cost_per_family_last_round) * 100)
    : 100;

  return [
    { name: "Funds Raised", score: funds, rag: ragStatus(funds) },
    { name: "Donor Retention", score: retention, rag: ragStatus(retention) },
    { name: "New Funding Sources", score: sources, rag: ragStatus(sources) },
    { name: "Cost Per Family", score: cost, rag: ragStatus(cost) },
  ];
}

export function scoreMarketing(inputs: MarketingInputs, weeks: number): KpiScore[] {
  const followerGrowth = inputs.follower_count_start > 0
    ? cap(((inputs.follower_count_now - inputs.follower_count_start) / inputs.follower_count_start) / 1.0 * 100)
    : 0;
  const reach = cap((inputs.avg_monthly_reach / 5000) * 100);
  const mentionsTarget = (2 / 52) * weeks;
  const mentions = cap((inputs.media_mentions_to_date / mentionsTarget) * 100);
  const conversion = cap((inputs.donor_conversion_pct / 2) * 100);

  return [
    { name: "Follower Growth", score: followerGrowth, rag: ragStatus(followerGrowth) },
    { name: "Monthly Reach", score: reach, rag: ragStatus(reach) },
    { name: "Media Mentions", score: mentions, rag: ragStatus(mentions) },
    { name: "Donor Conversion", score: conversion, rag: ragStatus(conversion) },
  ];
}

export function scoreVolunteers(inputs: VolunteerInputs): KpiScore[] {
  const volunteers = cap((inputs.active_volunteers / 30) * 100);
  const tasks = cap((inputs.tasks_on_time_pct / 80) * 100);
  const meetings = cap((inputs.meetings_held_pct / 85) * 100);

  return [
    { name: "Active Volunteers", score: volunteers, rag: ragStatus(volunteers) },
    { name: "Tasks On Time", score: tasks, rag: ragStatus(tasks) },
    { name: "Meetings Held", score: meetings, rag: ragStatus(meetings) },
  ];
}

export function scoreImpactLabs(inputs: ImpactLabsInputs): KpiScore[] {
  const surveys = cap((inputs.surveys_completed_pct / 70) * 100);
  const reports = inputs.reports_due > 0
    ? cap((inputs.reports_published / inputs.reports_due) * 100)
    : 100;
  const co2 = inputs.total_rounds > 0
    ? cap((inputs.co2_documented_rounds / inputs.total_rounds) * 100)
    : 100;
  const energy = cap((inputs.energy_saving_pct / 20) * 100);
  const institutionalFunding = 100;

  return [
    { name: "Survey Completion", score: surveys, rag: ragStatus(surveys) },
    { name: "Reports Published", score: reports, rag: ragStatus(reports) },
    { name: "CO₂ Documented", score: co2, rag: ragStatus(co2) },
    { name: "Energy Saving", score: energy, rag: ragStatus(energy) },
    { name: "Institutional Funding", score: institutionalFunding, rag: ragStatus(institutionalFunding) },
  ];
}

export function scoreEvents(inputs: EventsInputs, weeks: number): KpiScore[] {
  const eventsTarget = (4 / 52) * weeks;
  const events = cap((inputs.events_hosted_to_date / eventsTarget) * 100);
  const attendees = cap((inputs.attendee_growth_pct / 20) * 100);
  const fundraisingTarget = (5000 / 52) * weeks;
  const fundraising = cap((inputs.fundraising_raised_to_date / fundraisingTarget) * 100);

  return [
    { name: "Events Hosted", score: events, rag: ragStatus(events) },
    { name: "Attendee Growth", score: attendees, rag: ragStatus(attendees) },
    { name: "Event Fundraising", score: fundraising, rag: ragStatus(fundraising) },
  ];
}

export function calcTeamScore(kpiScores: KpiScore[]): number {
  if (kpiScores.length === 0) return 0;
  return kpiScores.reduce((sum, k) => sum + k.score, 0) / kpiScores.length;
}

export function calcOverallScore(teamScores: TeamScore[]): number {
  if (teamScores.length === 0) return 0;
  return teamScores.reduce((sum, t) => sum + t.teamScore, 0) / teamScores.length;
}

export function scoreAllTeams(
  inputs: Record<string, any>,
  weeks: number
): TeamScore[] {
  const results: TeamScore[] = [];

  const ops = inputs["operations"] as OperationsInputs | undefined;
  if (ops) {
    const kpiScores = scoreOperations(ops, weeks);
    const teamScore = calcTeamScore(kpiScores);
    results.push({ teamId: "operations", teamScore, rag: ragStatus(teamScore), kpiScores });
  }

  const fund = inputs["fundraising"] as FundraisingInputs | undefined;
  if (fund) {
    const kpiScores = scoreFundraising(fund, weeks);
    const teamScore = calcTeamScore(kpiScores);
    results.push({ teamId: "fundraising", teamScore, rag: ragStatus(teamScore), kpiScores });
  }

  const mkt = inputs["marketing"] as MarketingInputs | undefined;
  if (mkt) {
    const kpiScores = scoreMarketing(mkt, weeks);
    const teamScore = calcTeamScore(kpiScores);
    results.push({ teamId: "marketing", teamScore, rag: ragStatus(teamScore), kpiScores });
  }

  const vol = inputs["volunteers"] as VolunteerInputs | undefined;
  if (vol) {
    const kpiScores = scoreVolunteers(vol);
    const teamScore = calcTeamScore(kpiScores);
    results.push({ teamId: "volunteers", teamScore, rag: ragStatus(teamScore), kpiScores });
  }

  const labs = inputs["impactlabs"] as ImpactLabsInputs | undefined;
  if (labs) {
    const kpiScores = scoreImpactLabs(labs);
    const teamScore = calcTeamScore(kpiScores);
    results.push({ teamId: "impactlabs", teamScore, rag: ragStatus(teamScore), kpiScores });
  }

  const ev = inputs["events"] as EventsInputs | undefined;
  if (ev) {
    const kpiScores = scoreEvents(ev, weeks);
    const teamScore = calcTeamScore(kpiScores);
    results.push({ teamId: "events", teamScore, rag: ragStatus(teamScore), kpiScores });
  }

  return results;
}

export const DEFAULT_INPUTS: Record<string, any> = {
  operations: {
    families_served_to_date: 0,
    completion_rate_pct: 0,
    uptime_failures: 0,
    co2_reports_submitted: 0,
    co2_rounds_completed: 0,
    install_reports_published: 0,
    install_rounds_completed: 0,
  } as OperationsInputs,
  fundraising: {
    funds_raised_to_date: 0,
    retained_donors: 0,
    total_prior_donors: 0,
    new_funding_sources: 0,
    cost_per_family_last_round: 120,
  } as FundraisingInputs,
  marketing: {
    follower_count_start: 1000,
    follower_count_now: 1000,
    avg_monthly_reach: 0,
    media_mentions_to_date: 0,
    donor_conversion_pct: 0,
  } as MarketingInputs,
  volunteers: {
    active_volunteers: 0,
    tasks_on_time_pct: 0,
    meetings_held_pct: 0,
  } as VolunteerInputs,
  impactlabs: {
    surveys_completed_pct: 0,
    reports_published: 0,
    reports_due: 1,
    co2_documented_rounds: 0,
    total_rounds: 1,
    energy_saving_pct: 0,
  } as ImpactLabsInputs,
  events: {
    events_hosted_to_date: 0,
    attendee_growth_pct: 0,
    fundraising_raised_to_date: 0,
  } as EventsInputs,
};
