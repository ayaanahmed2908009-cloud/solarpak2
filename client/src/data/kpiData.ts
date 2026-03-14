export const TEAMS = [
  {
    id: "operations",
    name: "Operations & Installations",
    color: "#16a34a",
    kpis: [
      {
        name: "Families Served",
        unit: "families",
        targets: [40, 70, 110],
      },
      {
        name: "Same-Day Completion Rate",
        unit: "%",
        targets: [90, 93, 97],
      },
      {
        name: "System Uptime at 6 Months",
        unit: "%",
        targets: [100, 100, 100],
      },
      {
        name: "CO₂ Avoided",
        unit: "tonnes",
        targets: [20, 35, 55],
      },
      {
        name: "Post-Round Install Report",
        unit: "reports",
        targets: [1, 1, 1],
      },
    ],
  },
  {
    id: "fundraising",
    name: "Fundraising & Donations",
    color: "#2563eb",
    kpis: [
      {
        name: "Annual Funds Raised",
        unit: "$",
        targets: [10000, 20000, 40000],
      },
      {
        name: "Donor Retention Rate",
        unit: "%",
        targets: [20, 30, 50],
      },
      {
        name: "New Funding Sources",
        unit: "sources",
        targets: [1, 3, 5],
      },
      {
        name: "Cost Per Family",
        unit: "$",
        targets: [120, 120, 120],
      },
    ],
  },
  {
    id: "marketing",
    name: "Marketing & Outreach",
    color: "#7c3aed",
    kpis: [
      {
        name: "Follower Growth",
        unit: "×",
        targets: [2, 3, 2],
      },
      {
        name: "Avg Monthly Reach",
        unit: "people",
        targets: [5000, 10000, 20000],
      },
      {
        name: "Media Mentions",
        unit: "mentions",
        targets: [2, 4, 15],
      },
      {
        name: "Website Donor Conversion",
        unit: "%",
        targets: [2, 3, 4],
      },
    ],
  },
  {
    id: "volunteers",
    name: "Volunteer Management",
    color: "#d97706",
    kpis: [
      {
        name: "Active Volunteers",
        unit: "people",
        targets: [30, 55, 80],
      },
      {
        name: "Tasks Completed On Time",
        unit: "%",
        targets: [80, 85, 90],
      },
      {
        name: "Weekly Meetings Held",
        unit: "%",
        targets: [85, 90, 95],
      },
    ],
  },
  {
    id: "impactlabs",
    name: "Impact Labs",
    color: "#0891b2",
    kpis: [
      {
        name: "Follow-Up Survey Completion",
        unit: "%",
        targets: [70, 80, 90],
      },
      {
        name: "Reporting Cadence Score",
        unit: "/3",
        targets: [1, 2, 3],
      },
      {
        name: "CO₂ Data Documented",
        unit: "rounds",
        targets: [1, 1, 1],
      },
      {
        name: "Institutional Funding Sources",
        unit: "sources",
        targets: [0, 1, 2],
      },
      {
        name: "Avg Household Energy Saving",
        unit: "%",
        targets: [20, 35, 50],
      },
    ],
  },
  {
    id: "events",
    name: "Events & Community Outreach",
    color: "#db2777",
    kpis: [
      {
        name: "Events Hosted",
        unit: "events",
        targets: [4, 6, 10],
      },
      {
        name: "Attendee Growth vs Prior Event",
        unit: "%",
        targets: [20, 30, 40],
      },
      {
        name: "Fundraising via Events",
        unit: "$",
        targets: [5000, 10000, 15000],
      },
    ],
  },
];

export const RISKS = [
  {
    id: 1,
    name: "Panel Failure Post-Installation",
    category: "Operational",
    likelihood: 5,
    impact: 3,
    mitigation: "Rigorous QC checklist and mandatory post-install test",
  },
  {
    id: 2,
    name: "Donor Dropout",
    category: "Financial",
    likelihood: 5,
    impact: 3,
    mitigation: "Diversify to grants and corporate sponsors, build 3-month reserve",
  },
  {
    id: 3,
    name: "Supply Delays",
    category: "Operational",
    likelihood: 4,
    impact: 3,
    mitigation: "Maintain buffer stock and identify 2 alternate suppliers",
  },
  {
    id: 4,
    name: "Volunteer Burnout",
    category: "People & Volunteers",
    likelihood: 4,
    impact: 2,
    mitigation: "Rotate roles, enforce rest periods, recognise contributions",
  },
  {
    id: 5,
    name: "Negative Press Coverage",
    category: "Reputational",
    likelihood: 2,
    impact: 4,
    mitigation: "Proactive media relations and rapid response protocol",
  },
  {
    id: 6,
    name: "Regulatory/Permit Issues",
    category: "Compliance",
    likelihood: 2,
    impact: 4,
    mitigation: "Engage legal counsel early, build govt relations",
  },
  {
    id: 7,
    name: "Tech Failure During Event",
    category: "Operational",
    likelihood: 3,
    impact: 2,
    mitigation: "Backup equipment on site and tested run-through before event",
  },
  {
    id: 8,
    name: "Currency / FX Risk",
    category: "Financial",
    likelihood: 3,
    impact: 3,
    mitigation: "Hold USD reserve, invoice in hard currency where possible",
  },
  {
    id: 9,
    name: "Data Privacy Breach",
    category: "Compliance",
    likelihood: 1,
    impact: 5,
    mitigation: "End-to-end encryption, access controls, annual security audit",
  },
];

export const IMPACT_DATA = {
  familiesServed: [
    { year: "Year 1", value: 40 },
    { year: "Year 2", value: 70 },
    { year: "Year 3", value: 110 },
  ],
  co2Avoided: [
    { year: "Year 1", value: 20 },
    { year: "Year 2", value: 35 },
    { year: "Year 3", value: 55 },
  ],
  energySaving: [
    { year: "Year 1", value: 20 },
    { year: "Year 2", value: 35 },
    { year: "Year 3", value: 50 },
  ],
  fundraising: [
    { year: "Year 1", individual: 4000, events: 5000, grants: 1000 },
    { year: "Year 2", individual: 7000, events: 10000, grants: 3000 },
    { year: "Year 3", individual: 15000, events: 15000, grants: 10000 },
  ],
  donorPipeline: [
    { stage: "Reached", value: 2400 },
    { stage: "Approached", value: 1200 },
    { stage: "Committed", value: 480 },
    { stage: "Retained", value: 180 },
  ],
};

export const SUMMARY_STATS = {
  totalFamilies: 220,
  totalCo2: "110t",
  totalFunds: "$70K",
  activeVolunteers: 80,
};
