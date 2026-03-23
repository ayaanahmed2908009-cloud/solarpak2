---
title: Wire KPI charts to live submission data
---
# Wire KPI Dashboard to Live Data

## What & Why
Several charts in the KPI dashboard currently display hardcoded placeholder data instead of real values from the database. This makes the dashboard misleading — team leaders are seeing fake numbers. All charts need to pull from the actual weekly submissions stored in `kpi_submissions`.

Specifically:
- The **weekly score heatmap** (OKR Matrix) uses a hardcoded `OKR_MATRIX` constant instead of actual per-team scores per week from submission history.
- The **headcount chart and trend** in the Management tab uses a hardcoded `HEADCOUNT_SEED` array instead of `total_active_members`, `new_members_this_week`, and `members_left_this_week` from real management submissions.
- The **satisfaction donut and trend chart** uses a hardcoded `SATISFACTION_HISTORY` array instead of real `worker_satisfaction_pct` / `survey_respondents` values from management submissions.
- The **Impact tab** has all-zero charts. Social growth and community reach can be derived from marketing/partnerships submissions. Families served and CO2 avoided need a dedicated admin-only input form.

## Done looks like
- The weekly score heatmap shows real team scores by week, populated from submission history.
- The headcount chart in the Management tab reflects real member counts from weekly inputs.
- The satisfaction chart shows real satisfaction percentages from management submissions.
- The Impact tab social growth chart reflects real follower/engagement data from marketing submissions.
- The Impact tab community reach chart reflects real partner/community data from partnerships submissions.
- An admin-only form on the Impact tab (or Settings tab) lets the CEO enter monthly "Families Served" and "CO2 Avoided" figures, which are persisted to the database and shown in the charts.
- All charts gracefully show an empty/zero state when no submissions have been entered yet.

## Out of scope
- Changing the scoring logic itself
- Adding new KPI input fields
- AI analysis (separate task)

## Tasks
1. **Derive heatmap from submissions** — Replace the hardcoded `OKR_MATRIX` constant with a computed map built from the fetched submission history: group submissions by teamId and weekNumber, extract `teamScore` for each, and render the heatmap from that structure.

2. **Derive headcount & satisfaction from submissions** — Replace `HEADCOUNT_SEED` and `SATISFACTION_HISTORY` with values computed from management team submissions. Extract `total_active_members`, `new_members_this_week`, `members_left_this_week`, and `worker_satisfaction_pct` from each management submission ordered by week.

3. **Derive social growth and community reach from submissions** — On the Impact tab, compute monthly social growth (followers, engagement) from marketing submissions and monthly community reach (partners, communities) from partnerships submissions by aggregating submission data per month.

4. **Admin impact input form + API** — Add a new database table `impact_data` (or extend `kpi_settings`) to store monthly manual impact metrics (families served, CO2 avoided per month). Add a backend route to read/write this data. Add an admin-only form on the Impact tab for entering these monthly figures.

5. **Empty state handling** — Ensure all charts display a clear "No data yet — submit weekly inputs to populate this chart" placeholder when the submission history is empty.

## Relevant files
- `client/src/pages/KPI.tsx`
- `client/src/data/kpiData.ts`
- `client/src/lib/scoring.ts`
- `server/routes.ts:1432-1495`
- `server/storage.ts`
- `shared/schema.ts:287-317`