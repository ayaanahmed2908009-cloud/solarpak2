import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Linkedin } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  location: string;
  joinedDate: string;
  expertise: string[];
  achievements: string[];
  image: string;
  teamId?: string;
  isDirector?: boolean;
  social: {
    email?: string;
    linkedin?: string;
  };
}

interface Team {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const teams: Team[] = [
  {
    id: "all",
    name: "All Team",
    description: "View all team members",
    icon: "👥",
    color: "from-gray-500 to-slate-500"
  },
  {
    id: "social-media",
    name: "Social Media",
    description: "Digital storytelling and community building",
    icon: "📱",
    color: "from-pink-500 to-rose-500"
  },
  {
    id: "events-outreach",
    name: "Events & Outreach",
    description: "Community connections across Pakistan",
    icon: "🤝",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "sponsorships",
    name: "Sponsorships",
    description: "Partnerships and funding",
    icon: "💰",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "predictive-healthcare",
    name: "Healthcare",
    description: "Data analytics and health initiatives",
    icon: "🔬",
    color: "from-purple-500 to-indigo-500"
  }
];

// Founder
const founder: TeamMember = {
  id: 1,
  name: "Ayaan Ahmed",
  role: "Founder & CEO",
  description: "Visionary leader bringing sustainable energy solutions to underserved communities across Pakistan.",
  location: "Riyadh, Saudi Arabia",
  joinedDate: "2025-03-01",
  expertise: ["Strategic Leadership", "Solar Energy Systems", "Community Development"],
  achievements: [
    "Founded SolarPak and established mission-driven approach",
    "Led 11 successful solar installations across Pakistan",
    "Transformed 70 lives through clean energy access"
  ],
  image: "/ayaan-ahmed.jpg",
  social: { email: "ayaan@solarpak.com" }
};

const teamDirectors: TeamMember[] = [
  {
    id: 2,
    name: "Ibrahim Murtaza",
    role: "Director of Social Media",
    description: "Leading digital strategy and online community engagement.",
    location: "Pakistan",
    joinedDate: "2025-07-01",
    expertise: ["Social Media Strategy", "Content Creation", "Digital Marketing"],
    achievements: ["Increased online engagement by 5%", "Member of board of directors"],
    image: "/ibrahim-murtaza.jpg",
    teamId: "social-media",
    isDirector: true,
    social: { email: "social@solarpak.com" }
  },
  {
    id: 3,
    name: "Ayaan Omer",
    role: "Director of Events & Outreach",
    description: "Orchestrating community events and building grassroots connections.",
    location: "Pakistan",
    joinedDate: "2025-07-15",
    expertise: ["Event Planning", "Community Outreach", "Partnerships"],
    achievements: ["Organized 10 events", "Member of board of directors"],
    image: "/ayaan-omer.jpg",
    teamId: "events-outreach",
    isDirector: true,
    social: { email: "events@solarpak.com", linkedin: "https://www.linkedin.com/in/ayaan-omer" }
  },
  {
    id: 4,
    name: "Ramin Tihami",
    role: "Director of Sponsorships",
    description: "Driving strategic partnerships and fundraising initiatives.",
    location: "Pakistan",
    joinedDate: "2025-07-01",
    expertise: ["Strategic Negotiations", "Partnership Development", "AI-Powered Outreach"],
    achievements: ["Member of board of directors"],
    image: "/ramin-tihami.jpg",
    teamId: "sponsorships",
    isDirector: true,
    social: { email: "fundraising@solarpak.com" }
  },
  {
    id: 5,
    name: "Moiz Ali",
    role: "Director of Healthcare",
    description: "Leveraging data analytics and health initiatives.",
    location: "Pakistan",
    joinedDate: "2025-07-15",
    expertise: ["Data Analytics", "Healthcare Strategy", "Predictive Systems"],
    achievements: ["Member of board of directors"],
    image: "/moiz-ali.jpg",
    teamId: "predictive-healthcare",
    isDirector: true,
    social: { email: "research@solarpak.com" }
  }
];

const teamMembers: TeamMember[] = [
  { id: 7, name: "Roham Jan", role: "Social Media Manager", description: "Managing social media presence and engagement", location: "Pakistan", joinedDate: "2025-07-15", expertise: ["Editing", "CapCut", "Content Creation"], achievements: ["Grew social media by 30% in likes"], image: "/roham-jan.jpg", teamId: "social-media", social: {} },
  { id: 6, name: "Jonathan Joseph", role: "Head of Event and Brand Promotion", description: "Creating brand promotion content for events", location: "Pakistan", joinedDate: "2025-07-01", expertise: ["Graphic Design", "Canva", "Cold Outreach"], achievements: ["Created 2 flyers for future events"], image: "/jonathan-joseph.jpg", teamId: "social-media", social: {} },
  { id: 9, name: "Adnan Syed", role: "Community Liaison", description: "Building relationships with local communities", location: "Pakistan", joinedDate: "2025-07-01", expertise: ["Community Relations", "Organisation", "Talent Acquisition"], achievements: ["Helped organize 10 events", "Helped recruit talent"], image: "/adnan-syed.jpg", teamId: "events-outreach", social: { email: "adnan@solarpak.com" } },
  { id: 10, name: "Zaid Afal", role: "Event Coordinator", description: "Organizing and executing community events", location: "Pakistan", joinedDate: "2025-07-15", expertise: ["Community Relations", "Organisation"], achievements: ["Helped organize 10 events"], image: "/zaid-afal.jpg", teamId: "events-outreach", social: { email: "zaid@solarpak.com", linkedin: "https://www.linkedin.com/in/zaid-afal-501030303" } }
];

export default function Team() {
  const [activeTab, setActiveTab] = useState("all");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const allMembers = [founder, ...teamDirectors, ...teamMembers];
  const filteredMembers = activeTab === "all" 
    ? allMembers 
    : allMembers.filter(m => m.teamId === activeTab || (activeTab === "all" && !m.teamId));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-purple-50">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Header */}
        <section className="py-16 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4">
            <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full mb-6">
                <span className="font-bold text-sm uppercase tracking-wide">
                  🌟 World's Largest Youth-Led Solar Nonprofit
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Meet Our Team
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
                11 passionate young leaders transforming lives through solar energy
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="text-3xl font-bold">11</div>
                  <div className="text-sm text-white/80">Solar Panels</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="text-3xl font-bold">70</div>
                  <div className="text-sm text-white/80">Lives Transformed</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="text-3xl font-bold">11</div>
                  <div className="text-sm text-white/80">Team Members</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="text-3xl font-bold">4</div>
                  <div className="text-sm text-white/80">Departments</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Filter Tabs */}
        <section className="py-8 bg-white sticky top-20 z-40 shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setActiveTab(team.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ${
                    activeTab === team.id
                      ? `bg-gradient-to-r ${team.color} text-white shadow-lg scale-105`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xl">{team.icon}</span>
                  <span>{team.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Team Members Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMembers.map((member, index) => (
                <div
                  key={member.id}
                  className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {/* Image */}
                  <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const initials = member.name.split(' ').map(n => n[0]).join('');
                          parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-5xl font-bold text-gray-400">${initials}</div>`;
                        }
                      }}
                    />
                    {member.id === 1 && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        👑 Founder
                      </div>
                    )}
                    {member.isDirector && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        📌 Director
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm font-semibold text-green-600 mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {member.description}
                    </p>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.expertise.slice(0, 2).map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {member.expertise.length > 2 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                          +{member.expertise.length - 2} more
                        </span>
                      )}
                    </div>

                    {/* Contact */}
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      {member.social.email && (
                        <a
                          href={`mailto:${member.social.email}`}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                          Email
                        </a>
                      )}
                      {member.social.linkedin && (
                        <a
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join CTA */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Join Our Mission</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Passionate about renewable energy? We're always looking for dedicated individuals.
            </p>
            <a 
              href="mailto:solarpakinitiative@gmail.com"
              className="inline-flex items-center gap-2 bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <Mail className="h-5 w-5" />
              solarpakinitiative@gmail.com
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
