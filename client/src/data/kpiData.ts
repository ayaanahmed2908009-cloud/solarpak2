export const TEAMS = [
  {
    id: "marketing",
    name: "Marketing & Social Media",
    color: "#7c3aed",
    kpis: [
      {
        name: "Total Social Following",
        unit: "followers",
        targets: [5000, 15000, 40000],
      },
      {
        name: "Avg Engagement Rate",
        unit: "%",
        targets: [5, 7, 8],
      },
      {
        name: "Posts Per Month",
        unit: "posts",
        targets: [12, 20, 30],
      },
      {
        name: "Press / Media Mentions",
        unit: "mentions/yr",
        targets: [4, 10, 20],
      },
    ],
  },
  {
    id: "partnerships",
    name: "Partnerships & Outreach",
    color: "#0891b2",
    kpis: [
      {
        name: "Active Institutional Partners",
        unit: "partners",
        targets: [6, 15, 30],
      },
      {
        name: "Communities Reached",
        unit: "communities",
        targets: [5, 12, 25],
      },
      {
        name: "Outreach Meetings / Month",
        unit: "meetings",
        targets: [2, 5, 10],
      },
      {
        name: "Partnership Conversion Rate",
        unit: "%",
        targets: [30, 35, 40],
      },
    ],
  },
  {
    id: "management",
    name: "General Management",
    color: "#d97706",
    kpis: [
      {
        name: "Active Team Members",
        unit: "people",
        targets: [22, 40, 70],
      },
      {
        name: "Member Retention Rate",
        unit: "%",
        targets: [80, 85, 90],
      },
      {
        name: "OKR Completion Rate",
        unit: "%",
        targets: [70, 75, 80],
      },
      {
        name: "Team Leads in Place",
        unit: "leads",
        targets: [4, 8, 12],
      },
    ],
  },
  {
    id: "impactlabs",
    name: "Impact Labs",
    color: "#16a34a",
    kpis: [
      {
        name: "Annual Impact Report",
        unit: "reports",
        targets: [1, 1, 1],
      },
      {
        name: "Research Articles Published",
        unit: "articles/yr",
        targets: [4, 10, 18],
      },
      {
        name: "Data Accuracy Audit Score",
        unit: "%",
        targets: [85, 92, 97],
      },
      {
        name: "External Citations",
        unit: "citations",
        targets: [2, 8, 20],
      },
    ],
  },
  {
    id: "events",
    name: "Events & Community Outreach",
    color: "#db2777",
    kpis: [
      {
        name: "Events Organised / Year",
        unit: "events",
        targets: [3, 7, 15],
      },
      {
        name: "Total Event Attendees",
        unit: "attendees",
        targets: [300, 1000, 3000],
      },
      {
        name: "Avg Attendees / Event",
        unit: "attendees",
        targets: [100, 140, 200],
      },
      {
        name: "Post-Event Satisfaction",
        unit: "/ 5",
        targets: [4.0, 4.3, 4.5],
      },
      {
        name: "Repeat Attendee Rate",
        unit: "%",
        targets: [15, 25, 35],
      },
      {
        name: "Events with a Sponsor",
        unit: "events",
        targets: [1, 4, 10],
      },
    ],
  },
];

export const IMPACT_DATA = {
  familiesServed: [
    { month: "Jan", value: 0 },
    { month: "Feb", value: 0 },
    { month: "Mar", value: 0 },
    { month: "Apr", value: 0 },
    { month: "May", value: 0 },
    { month: "Jun", value: 0 },
  ],
  co2Avoided: [
    { month: "Jan", value: 0 },
    { month: "Feb", value: 0 },
    { month: "Mar", value: 0 },
    { month: "Apr", value: 0 },
    { month: "May", value: 0 },
    { month: "Jun", value: 0 },
  ],
  communityReach: [
    { month: "Jan", partners: 0, communities: 0 },
    { month: "Feb", partners: 0, communities: 0 },
    { month: "Mar", partners: 0, communities: 0 },
    { month: "Apr", partners: 0, communities: 0 },
    { month: "May", partners: 0, communities: 0 },
    { month: "Jun", partners: 0, communities: 0 },
  ],
  socialGrowth: [
    { month: "Jan", following: 0, engagement: 0 },
    { month: "Feb", following: 0, engagement: 0 },
    { month: "Mar", following: 0, engagement: 0 },
    { month: "Apr", following: 0, engagement: 0 },
    { month: "May", following: 0, engagement: 0 },
    { month: "Jun", following: 0, engagement: 0 },
  ],
};
