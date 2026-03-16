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

// ─── Full input interfaces per spec ──────────────────────────────────────────

export interface MarketingInputs {
  posts_this_week: number;
  videos_this_week: number;
  follower_gain_this_week: number;
  total_followers: number;
  avg_engagement_rate: number;
  press_contacts_this_week: number;
  press_mentions_this_week: number;
}

export interface PartnershipsInputs {
  outreach_meetings_this_week: number;
  prospects_outreach: number;
  prospects_meeting: number;
  new_partnerships_this_week: number;
  total_active_partners: number;
  funds_raised_this_week: number;
  total_funds_ytd: number;
}

export interface ManagementInputs {
  new_members_this_week: number;
  members_left_this_week: number;
  total_active_members: number;
  okr_tasks_completed: number;
  okr_tasks_due: number;
  probability_self_assessed: number;
  worker_satisfaction_pct: number;
  survey_respondents: number;
}

export interface ImpactLabsInputs {
  articles_research_stage: number;
  articles_draft_stage: number;
  articles_review_stage: number;
  articles_published_this_week: number;
  total_articles_ytd: number;
  ai_quality_score: number;
  data_points_verified: number;
  data_accuracy_audit_score: number;
  external_citations_this_week: number;
  findings_submitted_externally: number;
  annual_report_pct_complete: number;
}

export interface EventsInputs {
  planning_hours_this_week: number;
  event_active: number;
  events_completed_ytd: number;
  new_registrations_this_week: number;
  total_attendees_ytd: number;
  sponsor_conversations_this_week: number;
  events_with_sponsor_ytd: number;
  post_event_satisfaction: number;
  repeat_attendees_at_event: number;
  total_attendees_at_event: number;
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

// ─── Scoring functions (weekly snapshot scores) ───────────────────────────────

export function scoreMarketing(inputs: MarketingInputs): KpiScore[] {
  const posts = cap((inputs.posts_this_week / 3) * 100);
  const followers = cap((inputs.follower_gain_this_week / 50) * 100);
  const engagement = inputs.avg_engagement_rate > 0 ? cap((inputs.avg_engagement_rate / 5) * 100) : 0;
  const press = cap(((inputs.press_contacts_this_week + inputs.press_mentions_this_week * 2) / 3) * 100);
  return [
    { name: "Posts Published", score: posts, rag: ragStatus(posts) },
    { name: "Follower Gain", score: followers, rag: ragStatus(followers) },
    { name: "Engagement Rate", score: engagement, rag: ragStatus(engagement) },
    { name: "Press Activity", score: press, rag: ragStatus(press) },
  ];
}

export function scorePartnerships(inputs: PartnershipsInputs): KpiScore[] {
  const meetings = cap((inputs.outreach_meetings_this_week / 0.5) * 100);
  const partnerships = cap((inputs.new_partnerships_this_week / 0.12) * 100);
  const pipeline = inputs.prospects_outreach + inputs.prospects_meeting > 0
    ? cap(((inputs.prospects_outreach + inputs.prospects_meeting) / 5) * 100)
    : 0;
  const funds = inputs.funds_raised_this_week > 0 ? cap((inputs.funds_raised_this_week / 5000) * 100) : 0;
  return [
    { name: "Outreach Meetings", score: meetings, rag: ragStatus(meetings) },
    { name: "Partnerships Formalised", score: partnerships, rag: ragStatus(partnerships) },
    { name: "Pipeline Health", score: pipeline, rag: ragStatus(pipeline) },
    { name: "Funds Raised", score: funds, rag: ragStatus(funds) },
  ];
}

export function scoreManagement(inputs: ManagementInputs): KpiScore[] {
  const members = cap((inputs.new_members_this_week / 0.15) * 100);
  const retention = cap(100 - (inputs.members_left_this_week * 25));
  const okr = inputs.okr_tasks_due > 0
    ? cap((inputs.okr_tasks_completed / (inputs.okr_tasks_due * 0.7)) * 100)
    : 100;
  const satisfaction = inputs.worker_satisfaction_pct > 0
    ? cap((inputs.worker_satisfaction_pct / 90) * 100)
    : 100;
  return [
    { name: "New Members", score: members, rag: ragStatus(members) },
    { name: "Member Retention", score: retention, rag: ragStatus(retention) },
    { name: "OKR Completion", score: okr, rag: ragStatus(okr) },
    { name: "Team Satisfaction", score: satisfaction, rag: ragStatus(satisfaction) },
  ];
}

export function scoreImpactLabs(inputs: ImpactLabsInputs): KpiScore[] {
  const pipeline = inputs.articles_research_stage + inputs.articles_draft_stage + inputs.articles_review_stage;
  const pipelineScore = pipeline > 0 ? cap((pipeline / 3) * 100) : 0;
  const articles = cap((inputs.articles_published_this_week / 0.15) * 100);
  const quality = inputs.ai_quality_score > 0 ? cap((inputs.ai_quality_score / 90) * 100) : 100;
  const dataAccuracy = inputs.data_points_verified > 0 ? cap((inputs.data_points_verified / 3) * 100) : 0;
  return [
    { name: "Article Pipeline", score: pipelineScore, rag: ragStatus(pipelineScore) },
    { name: "Articles Published", score: articles, rag: ragStatus(articles) },
    { name: "AI Quality Score", score: quality, rag: ragStatus(quality) },
    { name: "Data Accuracy", score: dataAccuracy, rag: ragStatus(dataAccuracy) },
  ];
}

export function scoreEvents(inputs: EventsInputs): KpiScore[] {
  const planning = cap((inputs.planning_hours_this_week / 3) * 100);
  const registrations = cap((inputs.new_registrations_this_week / 6) * 100);
  const sponsors = cap((inputs.sponsor_conversations_this_week / 0.5) * 100);
  const satisfaction = inputs.post_event_satisfaction > 0
    ? cap((inputs.post_event_satisfaction / 4.0) * 100)
    : 100;
  return [
    { name: "Planning Hours", score: planning, rag: ragStatus(planning) },
    { name: "Registrations", score: registrations, rag: ragStatus(registrations) },
    { name: "Sponsor Conversations", score: sponsors, rag: ragStatus(sponsors) },
    { name: "Post-Event Satisfaction", score: satisfaction, rag: ragStatus(satisfaction) },
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
    videos_this_week: 0,
    follower_gain_this_week: 0,
    total_followers: 0,
    avg_engagement_rate: 0,
    press_contacts_this_week: 0,
    press_mentions_this_week: 0,
  } as MarketingInputs,
  partnerships: {
    outreach_meetings_this_week: 0,
    prospects_outreach: 0,
    prospects_meeting: 0,
    new_partnerships_this_week: 0,
    total_active_partners: 0,
    funds_raised_this_week: 0,
    total_funds_ytd: 0,
  } as PartnershipsInputs,
  management: {
    new_members_this_week: 0,
    members_left_this_week: 0,
    total_active_members: 0,
    okr_tasks_completed: 0,
    okr_tasks_due: 0,
    probability_self_assessed: 0,
    worker_satisfaction_pct: 0,
    survey_respondents: 0,
  } as ManagementInputs,
  impactlabs: {
    articles_research_stage: 0,
    articles_draft_stage: 0,
    articles_review_stage: 0,
    articles_published_this_week: 0,
    total_articles_ytd: 0,
    ai_quality_score: 0,
    data_points_verified: 0,
    data_accuracy_audit_score: 0,
    external_citations_this_week: 0,
    findings_submitted_externally: 0,
    annual_report_pct_complete: 0,
  } as ImpactLabsInputs,
  events: {
    planning_hours_this_week: 0,
    event_active: 0,
    events_completed_ytd: 0,
    new_registrations_this_week: 0,
    total_attendees_ytd: 0,
    sponsor_conversations_this_week: 0,
    events_with_sponsor_ytd: 0,
    post_event_satisfaction: 0,
    repeat_attendees_at_event: 0,
    total_attendees_at_event: 0,
  } as EventsInputs,
};
