import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Users,
  Target,
  Lightbulb,
  Globe,
  Briefcase,
  MapPin,
  Clock,
  ChevronRight,
  ChevronDown,
  Zap,
  BookOpen,
  BarChart3,
  Megaphone,
  Code,
  PenTool,
  Heart,
  Shield,
  TrendingUp,
  Mail,
  ArrowRight,
} from "lucide-react";

interface OrgRole {
  title: string;
  description: string;
  icon: any;
}

interface Department {
  name: string;
  description: string;
  roles: OrgRole[];
}

interface JobOpportunity {
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
}

const departments: Department[] = [
  {
    name: "Executive Leadership",
    description: "Guiding the vision and strategic direction of SolarPak across all operations.",
    roles: [
      { title: "Founder & CEO", description: "Sets overall vision, fundraising strategy, and organizational direction", icon: Target },
      { title: "Chief Operating Officer", description: "Oversees day-to-day operations, team coordination, and project delivery", icon: Shield },
      { title: "Chief Strategy Officer", description: "Develops long-term growth plans, partnerships, and expansion strategy", icon: TrendingUp },
    ],
  },
  {
    name: "Field Operations",
    description: "Manages on-the-ground solar installations and community engagement in Pakistan.",
    roles: [
      { title: "Field Operations Director", description: "Coordinates installation teams, logistics, and community partnerships", icon: Globe },
      { title: "Installation Team Lead", description: "Supervises solar panel installation and quality assurance", icon: Zap },
      { title: "Community Liaison Officer", description: "Builds relationships with local communities and identifies beneficiary families", icon: Heart },
    ],
  },
  {
    name: "Impact & Research",
    description: "Tracks outcomes, publishes research, and quantifies our real-world impact.",
    roles: [
      { title: "Impact Labs Director", description: "Leads research initiatives, data collection, and impact reporting", icon: BarChart3 },
      { title: "Data Analyst", description: "Analyzes energy output, cost savings, and environmental metrics", icon: Lightbulb },
      { title: "Research Writer", description: "Authors articles, case studies, and reports for Impact Labs", icon: BookOpen },
    ],
  },
  {
    name: "Marketing & Communications",
    description: "Amplifies our story, manages campaigns, and grows our supporter base worldwide.",
    roles: [
      { title: "Communications Director", description: "Oversees messaging, PR, and public-facing content strategy", icon: Megaphone },
      { title: "Social Media Manager", description: "Manages digital presence and community engagement online", icon: Globe },
      { title: "Content Creator", description: "Produces visual and written content across all platforms", icon: PenTool },
    ],
  },
  {
    name: "Technology",
    description: "Builds and maintains the digital infrastructure powering SolarPak's platform.",
    roles: [
      { title: "Tech Lead", description: "Architects the web platform, dashboards, and internal tools", icon: Code },
      { title: "Full-Stack Developer", description: "Develops features for the donation platform and worker portal", icon: Code },
      { title: "UI/UX Designer", description: "Designs intuitive interfaces and user experiences", icon: PenTool },
    ],
  },
];

const jobOpportunities: JobOpportunity[] = [
  {
    title: "Volunteer Field Coordinator",
    department: "Field Operations",
    type: "Volunteer",
    location: "Khairpur Mirs, Pakistan",
    description: "Help coordinate solar panel installations in rural communities. Work directly with families to assess energy needs and oversee the installation process from start to finish.",
    responsibilities: [
      "Coordinate with local communities to schedule installations",
      "Assist installation teams with logistics and on-site support",
      "Document installations with photos, reports, and feedback",
      "Maintain relationships with beneficiary families post-installation",
    ],
    qualifications: [
      "Based in or willing to travel to Sindh, Pakistan",
      "Strong communication skills in Urdu and/or Sindhi",
      "Passionate about renewable energy and community development",
      "Prior volunteer or fieldwork experience preferred",
    ],
  },
  {
    title: "Impact Research Intern",
    department: "Impact & Research",
    type: "Remote Internship",
    location: "Remote",
    description: "Contribute to SolarPak's Impact Labs by collecting and analyzing data on our solar installations. Help produce reports and articles that demonstrate our real-world outcomes.",
    responsibilities: [
      "Gather and organize data on energy production and cost savings",
      "Assist in writing research articles and case studies",
      "Create data visualizations and infographics for reports",
      "Support the Impact Labs publishing pipeline",
    ],
    qualifications: [
      "Currently enrolled in or recently graduated from university",
      "Strong analytical and writing skills",
      "Interest in renewable energy, sustainability, or international development",
      "Familiarity with data analysis tools is a plus",
    ],
  },
  {
    title: "Social Media & Content Volunteer",
    department: "Marketing & Communications",
    type: "Volunteer (Remote)",
    location: "Remote",
    description: "Help grow SolarPak's online presence by creating compelling content that tells our story. Manage social media accounts and engage with our growing global community of supporters.",
    responsibilities: [
      "Create and schedule social media posts across platforms",
      "Design graphics, short videos, and stories for campaigns",
      "Engage with followers and respond to inquiries",
      "Track engagement metrics and report on campaign performance",
    ],
    qualifications: [
      "Experience managing social media accounts",
      "Strong visual design or video editing skills",
      "Excellent written English",
      "Passionate about nonprofit storytelling and impact communication",
    ],
  },
  {
    title: "Web Developer Contributor",
    department: "Technology",
    type: "Volunteer (Remote)",
    location: "Remote",
    description: "Help build and improve SolarPak's web platform. Contribute to features across the donation system, worker portal, and public-facing site using modern web technologies.",
    responsibilities: [
      "Develop new features and fix bugs on the SolarPak platform",
      "Collaborate with the tech lead on architecture decisions",
      "Write clean, maintainable TypeScript/React code",
      "Participate in code reviews and team discussions",
    ],
    qualifications: [
      "Proficiency in React, TypeScript, and Node.js",
      "Familiarity with PostgreSQL and REST APIs",
      "Self-motivated with strong problem-solving skills",
      "Open-source or volunteer development experience is a plus",
    ],
  },
];

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function OrgChart() {
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {departments.map((dept, i) => {
        const { ref, visible } = useReveal();
        return (
          <div
            key={dept.name}
            ref={ref}
            className="transition-all duration-700"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transitionDelay: `${i * 80}ms`,
            }}
          >
            <div
              className={`rounded-xl overflow-hidden bg-white border transition-all duration-300 ${
                expandedDept === dept.name
                  ? "border-gray-200 shadow-xl shadow-green-900/5"
                  : "border-gray-100 hover:shadow-lg hover:shadow-green-900/5 hover:-translate-y-0.5"
              }`}
            >
              <button
                onClick={() => setExpandedDept(expandedDept === dept.name ? null : dept.name)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left transition-colors duration-200 hover:bg-gray-50/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-800 to-emerald-900 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 tracking-tight">{dept.name}</h3>
                    <p className="text-sm text-gray-400 mt-0.5 hidden md:block">{dept.description}</p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${
                    expandedDept === dept.name ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  expandedDept === dept.name ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-5 md:px-6 pb-5 md:pb-6 space-y-3 border-t border-gray-100 pt-4">
                  {dept.roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <div key={role.title} className="flex items-start gap-3.5 p-3.5 rounded-lg bg-gray-50/80">
                        <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800">{role.title}</h4>
                          <p className="text-sm text-gray-400 mt-0.5 leading-relaxed">{role.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function JobCard({ job, index }: { job: JobOpportunity; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <div
        className={`rounded-xl overflow-hidden bg-white border transition-all duration-500 ${
          expanded
            ? "border-gray-200 shadow-xl shadow-green-900/5"
            : "border-gray-100 hover:shadow-2xl hover:shadow-green-900/10 hover:-translate-y-1"
        }`}
      >
        <div className="p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
              {job.type}
            </span>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
              {job.department}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">{job.title}</h3>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Flexible hours
            </span>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed mb-4">{job.description}</p>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-green-700 hover:text-green-900 font-medium text-sm flex items-center gap-1 transition-colors group"
          >
            {expanded ? "Show less" : "View details"}
            <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 ${expanded ? "rotate-90" : ""}`} />
          </button>

          <div className={`transition-all duration-300 overflow-hidden ${expanded ? "max-h-[500px] opacity-100 mt-5" : "max-h-0 opacity-0"}`}>
            <div className="space-y-5 pt-5 border-t border-gray-100">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Responsibilities</h4>
                <ul className="space-y-2">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2.5 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Qualifications</h4>
                <ul className="space-y-2">
                  {job.qualifications.map((q, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2.5 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 flex-shrink-0" />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Opportunities() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeroVisible(true); },
      { threshold: 0.2 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-20">
        {/* Hero — matches Impact Labs dark slate-to-emerald gradient */}
        <div
          ref={heroRef}
          className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 py-24 md:py-32 overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-teal-500/8 to-cyan-500/8 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-green-400/5 to-transparent rounded-full" />
          </div>

          <div
            className="container mx-auto px-6 relative z-10 transition-all duration-1000"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <div className="max-w-2xl">
              <span className="text-green-400/80 font-medium text-xs uppercase tracking-[0.2em] mb-4 block">
                Join Our Mission
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-[1.1] tracking-tight">
                Opportunities
              </h1>
              <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
                Discover how SolarPak is structured as a youth-led nonprofit, and explore volunteer and internship roles to help power Pakistan's energy future.
              </p>
            </div>
          </div>
        </div>

        {/* Quick nav pills */}
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Organisation", target: "org-structure" },
              { label: "Why Join", target: "why-join" },
              { label: "Open Roles", target: "jobs" },
              { label: "Contact", target: "contact" },
            ].map((item) => (
              <button
                key={item.target}
                onClick={() => document.getElementById(item.target)?.scrollIntoView({ behavior: "smooth" })}
                className="text-sm px-4 py-2 rounded-full font-medium bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white transition-all duration-200"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-y border-gray-100">
          <div className="container mx-auto px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "5", label: "Departments" },
                { value: "15+", label: "Team Members" },
                { value: "100%", label: "Youth-Led" },
                { value: "Global", label: "Volunteer Base" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</div>
                  <div className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Organizational Structure */}
        <div id="org-structure" className="container mx-auto px-6 py-16 md:py-20">
          <div className="max-w-2xl mb-12">
            <span className="text-green-600 font-medium text-xs uppercase tracking-[0.2em] mb-3 block">
              Our Organisation
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight leading-[1.1]">
              How SolarPak Is Structured
            </h2>
            <p className="text-gray-400 text-base leading-relaxed">
              SolarPak operates through five core departments, each led by dedicated young leaders committed to bringing solar energy to communities across Pakistan.
            </p>
          </div>
          <div className="max-w-3xl">
            <OrgChart />
          </div>
        </div>

        {/* Why Join */}
        <div id="why-join" className="bg-gray-50/60 border-y border-gray-100">
          <div className="container mx-auto px-6 py-16 md:py-20">
            <div className="max-w-2xl mb-12">
              <span className="text-green-600 font-medium text-xs uppercase tracking-[0.2em] mb-3 block">
                Benefits
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight leading-[1.1]">
                Why Join SolarPak?
              </h2>
              <p className="text-gray-400 text-base leading-relaxed">
                As a volunteer or intern, you'll gain real-world experience while contributing to meaningful change in communities that need it most.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Globe,
                  title: "Real-World Impact",
                  description: "Your work directly translates into solar installations for families living without reliable electricity.",
                },
                {
                  icon: TrendingUp,
                  title: "Professional Growth",
                  description: "Build skills in project management, research, technology, and communications alongside passionate peers.",
                },
                {
                  icon: Users,
                  title: "Global Community",
                  description: "Join a network of young changemakers from around the world united by a shared mission for clean energy.",
                },
              ].map((item, i) => {
                const { ref, visible } = useReveal();
                return (
                  <div
                    key={item.title}
                    ref={ref}
                    className="transition-all duration-700"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(24px)",
                      transitionDelay: `${i * 100}ms`,
                    }}
                  >
                    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-2xl hover:shadow-green-900/10 hover:-translate-y-1 transition-all duration-500 h-full">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-800 to-emerald-900 flex items-center justify-center mb-5">
                        <item.icon className="w-5 h-5 text-green-400" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mb-2 tracking-tight">{item.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Open Positions */}
        <div id="jobs" className="container mx-auto px-6 py-16 md:py-20">
          <div className="max-w-2xl mb-12">
            <span className="text-green-600 font-medium text-xs uppercase tracking-[0.2em] mb-3 block">
              Open Roles
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight leading-[1.1]">
              Current Opportunities
            </h2>
            <p className="text-gray-400 text-base leading-relaxed">
              We're always looking for passionate individuals to join our team. All positions are volunteer-based or unpaid internships with flexible hours.
            </p>
          </div>
          <div className="max-w-3xl space-y-5">
            {jobOpportunities.map((job, i) => (
              <JobCard key={job.title} job={job} index={i} />
            ))}
          </div>
        </div>

        {/* CTA — dark gradient matching hero */}
        <div id="contact" className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-r from-green-500/8 to-emerald-500/8 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-6 py-20 md:py-24 relative z-10">
            <div className="max-w-xl">
              <span className="text-green-400/80 font-medium text-xs uppercase tracking-[0.2em] mb-4 block">
                Get Started
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight leading-[1.1]">
                Ready to Make a Difference?
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                Send us your interest along with a brief introduction about yourself and the role you're interested in. We'd love to hear from you.
              </p>
              <button
                onClick={() => window.open("mailto:solarpakinitiative@gmail.com?subject=SolarPak Volunteer Interest", "_blank")}
                className="inline-flex items-center bg-white text-gray-900 hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 group"
              >
                <Mail className="w-4 h-4 mr-2" />
                Get in Touch
                <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <p className="text-gray-500 text-sm mt-4">solarpakinitiative@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
