---
title: Enable AI probability analysis
---
# Enable AI Probability Analysis

## What & Why
The "Run AI Analysis" button on the KPI dashboard calls the Anthropic Claude API to predict each team's probability of hitting annual targets. Currently this returns a 503 error because the `ANTHROPIC_API_KEY` environment secret has not been configured. This task sets up the key and verifies the full end-to-end flow works.

## Done looks like
- The `ANTHROPIC_API_KEY` is set as a project secret.
- Clicking "Run AI Analysis" as an admin returns a valid JSON probability report within a reasonable time.
- Each team shows an AI-calculated probability percentage alongside their scores.
- If the key is missing, the UI shows a clear "AI analysis unavailable — API key not configured" message rather than a generic error.

## Out of scope
- Changing the AI prompt or the analysis logic itself
- Scheduling automatic analysis runs

## Tasks
1. **Configure Anthropic API key** — Add `ANTHROPIC_API_KEY` as a project environment secret using the secrets manager.

2. **Verify and harden the AI route** — Test the `/api/kpi/analysis` endpoint end-to-end. Add a graceful error message in the frontend when the key is absent or the API call fails, so users see a clear "unavailable" state instead of a raw error.

## Relevant files
- `server/routes.ts:1495-1647`
- `client/src/pages/KPI.tsx`