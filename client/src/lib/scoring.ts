export function cap(score: number): number {
  return Math.min(100, Math.max(0, score));
}

export function weeksElapsed(startDate: string): number {
  const start = new Date(startDate).getTime();
  const now = Date.now();
  return Math.max(1, Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000)) + 1);
}

export function yearFromWeeks(weeks: number): number {
  if (weeks <= 52) return 1;
  if (weeks <= 104) return 2;
  return 3;
}

function progressScore(current: number, y1: number, y2: number, y3: number, year: number): number {
  const target = year === 1 ? y1 : year === 2 ? y2 : y3;
  if (target <= 0) return 100;
  return cap((current / target) * 100);
}

export interface MarketingInputs {
  total_social_following: number;
  avg_engagement_rate_pct: number;
  posts_per_month: number;
  press_mentions_per_year: number;
}

export interface PartnershipsInputs {
  active_partners: number;
  communities_reached: number;
  outreach_meetings_per_month: number;
  conversion_rate_pct: number;
}

export interface ManagementInputs {
  active_team_members: number;
  retention_rate_pct: number;
  okr_completion_pct: number;
  team_leads_in_place: number;
  total_teams: number;
}

export interface ImpactLabsInputs {
  impact_reports_published: number;
  research_articles: number;
  data_accuracy_pct: number;
  external_citations: number;
}

export interface EventsInputs {
  events_per_year: number;
  total_attendees: number;
  avg_attendees_per_event: number;
  satisfaction_score: number;
  repeat_attendee_rate_pct: number;
  events_with_sponsor: number;
}

export type TeamInputs =
  | { team: "marketing"; inputs: MarketingInputs }
  | { team: "partnerships"; inputs: PartnershipsInputs }
  | { team: "management"; inputs: ManagementInputs }
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

export function scoreMarketing(inputs: MarketingInputs, year: number): KpiScore[] {
  const following = progressScore(inputs.total_social_following, 5000, 15000, 40000, year);
  const engagement = progressScore(inputs.avg_engagement_rate_pct, 5, 7, 8, year);
  const posts = progressScore(inputs.posts_per_month, 12, 20, 30, year);
  const press = progressScore(inputs.press_mentions_per_year, 4, 10, 20, year);
  return [
    { name: "Total Social Following", score: following, rag: ragStatus(following) },
    { name: "Avg Engagement Rate", score: engagement, rag: ragStatus(engagement) },
    { name: "Posts Per Month", score: posts, rag: ragStatus(posts) },
    { name: "Press / Media Mentions", score: press, rag: ragStatus(press) },
  ];
}

export function scorePartnerships(inputs: PartnershipsInputs, year: number): KpiScore[] {
  const partners = progressScore(inputs.active_partners, 6, 15, 30, year);
  const communities = progressScore(inputs.communities_reached, 5, 12, 25, year);
  const meetings = progressScore(inputs.outreach_meetings_per_month, 2, 5, 10, year);
  const conversion = progressScore(inputs.conversion_rate_pct, 30, 35, 40, year);
  return [
    { name: "Active Institutional Partners", score: partners, rag: ragStatus(partners) },
    { name: "Communities Reached", score: communities, rag: ragStatus(communities) },
    { name: "Outreach Meetings / Month", score: meetings, rag: ragStatus(meetings) },
    { name: "Partnership Conversion Rate", score: conversion, rag: ragStatus(conversion) },
  ];
}

export function scoreManagement(inputs: ManagementInputs, year: number): KpiScore[] {
  const members = progressScore(inputs.active_team_members, 22, 40, 70, year);
  const retention = progressScore(inputs.retention_rate_pct, 80, 85, 90, year);
  const okr = progressScore(inputs.okr_completion_pct, 70, 75, 80, year);
  const leads = inputs.total_teams > 0
    ? cap((inputs.team_leads_in_place / inputs.total_teams) * 100)
    : 100;
  return [
    { name: "Active Team Members", score: members, rag: ragStatus(members) },
    { name: "Member Retention Rate", score: retention, rag: ragStatus(retention) },
    { name: "OKR Completion Rate", score: okr, rag: ragStatus(okr) },
    { name: "Team Leads in Place", score: leads, rag: ragStatus(leads) },
  ];
}

export function scoreImpactLabs(inputs: ImpactLabsInputs, year: number): KpiScore[] {
  const reports = inputs.impact_reports_published >= 1 ? 100 : 0;
  const articles = progressScore(inputs.research_articles, 4, 10, 18, year);
  const accuracy = progressScore(inputs.data_accuracy_pct, 85, 92, 97, year);
  const citations = progressScore(inputs.external_citations, 2, 8, 20, year);
  return [
    { name: "Impact Report Published", score: reports, rag: ragStatus(reports) },
    { name: "Research Articles", score: articles, rag: ragStatus(articles) },
    { name: "Data Accuracy Score", score: accuracy, rag: ragStatus(accuracy) },
    { name: "External Citations", score: citations, rag: ragStatus(citations) },
  ];
}

export function scoreEvents(inputs: EventsInputs, year: number): KpiScore[] {
  const events = progressScore(inputs.events_per_year, 3, 7, 15, year);
  const attendees = progressScore(inputs.total_attendees, 300, 1000, 3000, year);
  const avgAttendees = progressScore(inputs.avg_attendees_per_event, 100, 140, 200, year);
  const satisfaction = progressScore(inputs.satisfaction_score, 4.0, 4.3, 4.5, year);
  const repeat = progressScore(inputs.repeat_attendee_rate_pct, 15, 25, 35, year);
  const sponsored = progressScore(inputs.events_with_sponsor, 1, 4, 10, year);
  return [
    { name: "Events per Year", score: events, rag: ragStatus(events) },
    { name: "Total Attendees", score: attendees, rag: ragStatus(attendees) },
    { name: "Avg Attendees / Event", score: avgAttendees, rag: ragStatus(avgAttendees) },
    { name: "Satisfaction Score", score: satisfaction, rag: ragStatus(satisfaction) },
    { name: "Repeat Attendee Rate", score: repeat, rag: ragStatus(repeat) },
    { name: "Events with Sponsor", score: sponsored, rag: ragStatus(sponsored) },
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
  const year = yearFromWeeks(weeks);

  const mkt = inputs["marketing"] as MarketingInputs | undefined;
  if (mkt) {
    const kpiScores = scoreMarketing(mkt, year);
    const teamScore = calcTeamScore(kpiScores);
    results.push({ teamId: "marketing", teamScore, rag: ragStatus(teamScore), kpiScores });
  }

  const prt = inputs["partnerships"] as PartnershipsInputs | undefined;
  if (prt) {
    const kpiScores = scorePartnerships(prt, year);
    const teamScore = calcTeamScore(kpiScores);
    results.push({ teamId: "partnerships", teamScore, rag: ragStatus(teamScore), kpiScores });
  }

  const mgmt = inputs["management"] as ManagementInputs | undefined;
  if (mgmt) {
    const kpiScores = scoreManagement(mgmt, year);
    const teamScore = calcTeamScore(kpiScores);
    results.push({ teamId: "management", teamScore, rag: ragStatus(teamScore), kpiScores });
  }

  const labs = inputs["impactlabs"] as ImpactLabsInputs | undefined;
  if (labs) {
    const kpiScores = scoreImpactLabs(labs, year);
    const teamScore = calcTeamScore(kpiScores);
    results.push({ teamId: "impactlabs", teamScore, rag: ragStatus(teamScore), kpiScores });
  }

  const ev = inputs["events"] as EventsInputs | undefined;
  if (ev) {
    const kpiScores = scoreEvents(ev, year);
    const teamScore = calcTeamScore(kpiScores);
    results.push({ teamId: "events", teamScore, rag: ragStatus(teamScore), kpiScores });
  }

  return results;
}

export const DEFAULT_INPUTS: Record<string, any> = {
  marketing: {
    total_social_following: 0,
    avg_engagement_rate_pct: 0,
    posts_per_month: 0,
    press_mentions_per_year: 0,
  } as MarketingInputs,
  partnerships: {
    active_partners: 0,
    communities_reached: 0,
    outreach_meetings_per_month: 0,
    conversion_rate_pct: 0,
  } as PartnershipsInputs,
  management: {
    active_team_members: 0,
    retention_rate_pct: 0,
    okr_completion_pct: 0,
    team_leads_in_place: 0,
    total_teams: 4,
  } as ManagementInputs,
  impactlabs: {
    impact_reports_published: 0,
    research_articles: 0,
    data_accuracy_pct: 0,
    external_citations: 0,
  } as ImpactLabsInputs,
  events: {
    events_per_year: 0,
    total_attendees: 0,
    avg_attendees_per_event: 0,
    satisfaction_score: 0,
    repeat_attendee_rate_pct: 0,
    events_with_sponsor: 0,
  } as EventsInputs,
};
