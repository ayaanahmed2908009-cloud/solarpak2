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

export interface MarketingInputs {
  posts_this_week: number;
  follower_gain_this_week: number;
  press_contacts_this_week: number;
}

export interface PartnershipsInputs {
  outreach_meetings_this_week: number;
  partnerships_formalised_this_week: number;
  communities_engaged_this_week: number;
}

export interface ManagementInputs {
  new_members_this_week: number;
  member_departures_this_week: number;
  okr_tasks_completed: number;
  okr_tasks_total: number;
}

export interface ImpactLabsInputs {
  articles_in_progress: number;
  data_points_verified: number;
  findings_shared_externally: number;
}

export interface EventsInputs {
  event_planning_hours: number;
  sponsor_conversations: number;
  registrations_this_week: number;
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

export function scoreMarketing(inputs: MarketingInputs): KpiScore[] {
  const posts = cap((inputs.posts_this_week / 3) * 100);
  const followers = cap((inputs.follower_gain_this_week / 50) * 100);
  const press = cap((inputs.press_contacts_this_week / 1) * 100);
  return [
    { name: "Posts Published", score: posts, rag: ragStatus(posts) },
    { name: "Follower Gain", score: followers, rag: ragStatus(followers) },
    { name: "Press Contacts", score: press, rag: ragStatus(press) },
  ];
}

export function scorePartnerships(inputs: PartnershipsInputs): KpiScore[] {
  const meetings = cap((inputs.outreach_meetings_this_week / 0.5) * 100);
  const partnerships = cap((inputs.partnerships_formalised_this_week / 0.12) * 100);
  const communities = cap((inputs.communities_engaged_this_week / 0.1) * 100);
  return [
    { name: "Outreach Meetings", score: meetings, rag: ragStatus(meetings) },
    { name: "Partnerships Formalised", score: partnerships, rag: ragStatus(partnerships) },
    { name: "Communities Engaged", score: communities, rag: ragStatus(communities) },
  ];
}

export function scoreManagement(inputs: ManagementInputs): KpiScore[] {
  const members = cap((inputs.new_members_this_week / 0.15) * 100);
  const retention = cap(100 - (inputs.member_departures_this_week * 25));
  const okr = inputs.okr_tasks_total > 0
    ? cap((inputs.okr_tasks_completed / (inputs.okr_tasks_total * 0.7)) * 100)
    : 100;
  return [
    { name: "New Members", score: members, rag: ragStatus(members) },
    { name: "Member Retention", score: retention, rag: ragStatus(retention) },
    { name: "OKR Completion", score: okr, rag: ragStatus(okr) },
  ];
}

export function scoreImpactLabs(inputs: ImpactLabsInputs): KpiScore[] {
  const articles = inputs.articles_in_progress >= 1 ? 100 : 0;
  const dataPoints = cap((inputs.data_points_verified / 3) * 100);
  const shared = inputs.findings_shared_externally >= 1 ? 100 : 0;
  return [
    { name: "Article in Progress", score: articles, rag: ragStatus(articles) },
    { name: "Data Points Verified", score: dataPoints, rag: ragStatus(dataPoints) },
    { name: "Findings Shared", score: shared, rag: ragStatus(shared) },
  ];
}

export function scoreEvents(inputs: EventsInputs): KpiScore[] {
  const planning = cap((inputs.event_planning_hours / 3) * 100);
  const sponsors = cap((inputs.sponsor_conversations / 0.5) * 100);
  const registrations = cap((inputs.registrations_this_week / 6) * 100);
  return [
    { name: "Planning Hours", score: planning, rag: ragStatus(planning) },
    { name: "Sponsor Conversations", score: sponsors, rag: ragStatus(sponsors) },
    { name: "Registrations", score: registrations, rag: ragStatus(registrations) },
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
  _weeks: number
): TeamScore[] {
  const results: TeamScore[] = [];

  const mkt = inputs["marketing"] as MarketingInputs | undefined;
  if (mkt) {
    const kpiScores = scoreMarketing(mkt);
    const teamScore = calcTeamScore(kpiScores);
    results.push({ teamId: "marketing", teamScore, rag: ragStatus(teamScore), kpiScores });
  }

  const prt = inputs["partnerships"] as PartnershipsInputs | undefined;
  if (prt) {
    const kpiScores = scorePartnerships(prt);
    const teamScore = calcTeamScore(kpiScores);
    results.push({ teamId: "partnerships", teamScore, rag: ragStatus(teamScore), kpiScores });
  }

  const mgmt = inputs["management"] as ManagementInputs | undefined;
  if (mgmt) {
    const kpiScores = scoreManagement(mgmt);
    const teamScore = calcTeamScore(kpiScores);
    results.push({ teamId: "management", teamScore, rag: ragStatus(teamScore), kpiScores });
  }

  const labs = inputs["impactlabs"] as ImpactLabsInputs | undefined;
  if (labs) {
    const kpiScores = scoreImpactLabs(labs);
    const teamScore = calcTeamScore(kpiScores);
    results.push({ teamId: "impactlabs", teamScore, rag: ragStatus(teamScore), kpiScores });
  }

  const ev = inputs["events"] as EventsInputs | undefined;
  if (ev) {
    const kpiScores = scoreEvents(ev);
    const teamScore = calcTeamScore(kpiScores);
    results.push({ teamId: "events", teamScore, rag: ragStatus(teamScore), kpiScores });
  }

  return results;
}

export const DEFAULT_INPUTS: Record<string, any> = {
  marketing: {
    posts_this_week: 0,
    follower_gain_this_week: 0,
    press_contacts_this_week: 0,
  } as MarketingInputs,
  partnerships: {
    outreach_meetings_this_week: 0,
    partnerships_formalised_this_week: 0,
    communities_engaged_this_week: 0,
  } as PartnershipsInputs,
  management: {
    new_members_this_week: 0,
    member_departures_this_week: 0,
    okr_tasks_completed: 0,
    okr_tasks_total: 0,
  } as ManagementInputs,
  impactlabs: {
    articles_in_progress: 0,
    data_points_verified: 0,
    findings_shared_externally: 0,
  } as ImpactLabsInputs,
  events: {
    event_planning_hours: 0,
    sponsor_conversations: 0,
    registrations_this_week: 0,
  } as EventsInputs,
};
