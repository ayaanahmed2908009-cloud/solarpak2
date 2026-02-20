import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Target,
  Lightbulb,
  Globe,
  Briefcase,
  MapPin,
  Clock,
  ChevronRight,
  ArrowRight,
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
} from "lucide-react";

interface OrgRole {
  title: string;
  description: string;
  icon: any;
  members?: string[];
}

interface Department {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
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
  color: string;
}

const departments: Department[] = [
  {
    name: "Executive Leadership",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    description: "Guiding the vision and strategic direction of SolarPak across all operations.",
    roles: [
      { title: "Founder & CEO", description: "Sets overall vision, fundraising strategy, and organizational direction", icon: Target },
      { title: "Chief Operating Officer", description: "Oversees day-to-day operations, team coordination, and project delivery", icon: Shield },
      { title: "Chief Strategy Officer", description: "Develops long-term growth plans, partnerships, and expansion strategy", icon: TrendingUp },
    ],
  },
  {
    name: "Field Operations",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description: "Manages on-the-ground solar installations and community engagement in Pakistan.",
    roles: [
      { title: "Field Operations Director", description: "Coordinates installation teams, logistics, and community partnerships", icon: Globe },
      { title: "Installation Team Lead", description: "Supervises solar panel installation and quality assurance", icon: Zap },
      { title: "Community Liaison Officer", description: "Builds relationships with local communities and identifies beneficiary families", icon: Heart },
    ],
  },
  {
    name: "Impact & Research",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "Tracks outcomes, publishes research, and quantifies our real-world impact.",
    roles: [
      { title: "Impact Labs Director", description: "Leads research initiatives, data collection, and impact reporting", icon: BarChart3 },
      { title: "Data Analyst", description: "Analyzes energy output, cost savings, and environmental metrics", icon: Lightbulb },
      { title: "Research Writer", description: "Authors articles, case studies, and reports for Impact Labs", icon: BookOpen },
    ],
  },
  {
    name: "Marketing & Communications",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    description: "Amplifies our story, manages campaigns, and grows our supporter base worldwide.",
    roles: [
      { title: "Communications Director", description: "Oversees messaging, PR, and public-facing content strategy", icon: Megaphone },
      { title: "Social Media Manager", description: "Manages digital presence and community engagement online", icon: Globe },
      { title: "Content Creator", description: "Produces visual and written content across all platforms", icon: PenTool },
    ],
  },
  {
    name: "Technology",
    color: "text-sky-700",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
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
    color: "border-amber-300",
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
    color: "border-blue-300",
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
    color: "border-purple-300",
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
    color: "border-sky-300",
  },
];

function AnimatedCard({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function OrgChart() {
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {departments.map((dept, i) => (
        <AnimatedCard key={dept.name} delay={i * 100}>
          <div
            className={`rounded-xl border-2 ${dept.borderColor} overflow-hidden transition-all duration-300 ${expandedDept === dept.name ? "shadow-lg" : "shadow-sm hover:shadow-md"}`}
          >
            <button
              onClick={() => setExpandedDept(expandedDept === dept.name ? null : dept.name)}
              className={`w-full flex items-center justify-between p-6 ${dept.bgColor} transition-colors duration-200`}
            >
              <div className="flex items-center gap-4 text-left">
                <div className={`w-12 h-12 rounded-xl ${dept.bgColor} border-2 ${dept.borderColor} flex items-center justify-center`}>
                  <Users className={`w-6 h-6 ${dept.color}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${dept.color}`}>{dept.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{dept.description}</p>
                </div>
              </div>
              <ChevronRight
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${expandedDept === dept.name ? "rotate-90" : ""}`}
              />
            </button>

            <div
              className={`transition-all duration-300 overflow-hidden ${expandedDept === dept.name ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="p-6 pt-2 bg-white space-y-4">
                {dept.roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <div key={role.title} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{role.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </AnimatedCard>
      ))}
    </div>
  );
}

function JobCard({ job, index }: { job: JobOpportunity; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <AnimatedCard delay={index * 120}>
      <div className={`bg-white rounded-xl border-2 ${job.color} shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}>
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs font-medium bg-emerald-50 text-emerald-700 border-emerald-200">
              {job.type}
            </Badge>
            <Badge variant="outline" className="text-xs font-medium">
              {job.department}
            </Badge>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Flexible hours
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed mb-4">{job.description}</p>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-emerald-700 hover:text-emerald-800 font-medium text-sm flex items-center gap-1 transition-colors"
          >
            {expanded ? "Show less" : "View details"}
            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`} />
          </button>

          <div className={`transition-all duration-300 overflow-hidden ${expanded ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-600" /> Responsibilities
                </h4>
                <ul className="space-y-1.5">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-600" /> Qualifications
                </h4>
                <ul className="space-y-1.5">
                  {job.qualifications.map((q, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
}

export default function Opportunities() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 py-24 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2.5 rounded-full mb-6">
                <Briefcase className="w-4 h-4 text-emerald-300 mr-2" />
                <span className="text-emerald-100 font-medium text-sm uppercase tracking-wide">
                  Join Our Mission
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Opportunities at <span className="text-emerald-300">SolarPak</span>
              </h1>
              <p className="text-lg md:text-xl text-emerald-100/90 leading-relaxed mb-8 max-w-2xl">
                Discover how SolarPak is organized as a youth-led nonprofit and explore volunteer
                and internship opportunities to make a real difference in Pakistan's energy future.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-white text-emerald-800 hover:bg-emerald-50 font-semibold px-8 py-3 rounded-md"
                >
                  View Open Roles <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  onClick={() => document.getElementById("org-structure")?.scrollIntoView({ behavior: "smooth" })}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-md"
                >
                  Our Structure
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Stats */}
        <section className="py-16 bg-gray-50 border-b border-gray-100">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "5", label: "Departments", icon: Users },
                { value: "15+", label: "Team Members", icon: Heart },
                { value: "100%", label: "Youth-Led", icon: Zap },
                { value: "Global", label: "Volunteer Base", icon: Globe },
              ].map((stat, i) => (
                <AnimatedCard key={stat.label} delay={i * 100}>
                  <div className="text-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <stat.icon className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* Organizational Structure */}
        <section id="org-structure" className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <AnimatedCard>
                <Badge variant="outline" className="mb-4 text-emerald-700 border-emerald-200 bg-emerald-50 px-4 py-1">
                  Our Organisation
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  How SolarPak Is Structured
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                  SolarPak operates through five core departments, each led by dedicated young leaders
                  committed to bringing solar energy to communities across Pakistan.
                </p>
              </AnimatedCard>
            </div>
            <div className="max-w-3xl mx-auto">
              <OrgChart />
            </div>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <AnimatedCard>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Why Join SolarPak?
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                  As a volunteer or intern, you'll gain real-world experience while contributing
                  to meaningful change in communities that need it most.
                </p>
              </AnimatedCard>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
              ].map((item, i) => (
                <AnimatedCard key={item.title} delay={i * 150}>
                  <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
                    <div className="w-14 h-14 bg-emerald-50 border-2 border-emerald-200 rounded-xl flex items-center justify-center mx-auto mb-5">
                      <item.icon className="w-7 h-7 text-emerald-700" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{item.description}</p>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="jobs" className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <AnimatedCard>
                <Badge variant="outline" className="mb-4 text-emerald-700 border-emerald-200 bg-emerald-50 px-4 py-1">
                  Open Roles
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Current Opportunities
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                  We're always looking for passionate individuals to join our team. All positions
                  are volunteer-based or unpaid internships with flexible hours.
                </p>
              </AnimatedCard>
            </div>
            <div className="max-w-3xl mx-auto space-y-6">
              {jobOpportunities.map((job, i) => (
                <JobCard key={job.title} job={job} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <AnimatedCard>
                <Mail className="w-12 h-12 text-emerald-300 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Make a Difference?
                </h2>
                <p className="text-emerald-100/90 text-lg leading-relaxed mb-8">
                  Send us your interest along with a brief introduction about yourself and the role
                  you're interested in. We'd love to hear from you.
                </p>
                <Button
                  onClick={() => window.open("mailto:solarpakinitiative@gmail.com?subject=SolarPak Volunteer Interest", "_blank")}
                  className="bg-white text-emerald-800 hover:bg-emerald-50 font-semibold px-10 py-3 rounded-md text-base"
                >
                  <Mail className="w-4 h-4 mr-2" /> Get in Touch
                </Button>
                <p className="text-emerald-200/70 text-sm mt-4">solarpakinitiative@gmail.com</p>
              </AnimatedCard>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
