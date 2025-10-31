import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Award, Users, Heart } from "lucide-react";
import hamzaMemonPhoto from "@assets/hamza_1761940364390.jpeg";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  location: string;
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

const founder: TeamMember = {
  id: 1,
  name: "Ayaan Ahmed",
  role: "Founder & CEO",
  description: "Visionary leader passionate about bringing sustainable energy solutions to underserved communities across Pakistan. Founded SolarPak to address the electricity crisis through innovative solar installations and community-driven impact.",
  location: "Riyadh, Saudi Arabia",
  expertise: ["Strategic Leadership", "Solar Energy Systems", "Community Development", "Renewable Energy Policy", "Social Impact"],
  achievements: [
    "Founded SolarPak and established mission-driven approach",
    "Led 11 successful solar installations across Pakistan",
    "Transformed 70 lives through clean energy access",
    "Built partnerships with local communities and suppliers",
    "Certified Solar Energy Specialist and Social Entrepreneur",
    "Website developer"
  ],
  image: "/ayaan-ahmed.jpg",
  social: { email: "ayaan@solarpak.com" }
};

const teamDirectors: TeamMember[] = [
  {
    id: 2,
    name: "Ibrahim Murtaza",
    role: "Director of Social Media",
    description: "Leading digital strategy and online community engagement to amplify SolarPak's impact story across social platforms.",
    location: "Pakistan",
    expertise: ["Social Media Strategy", "Content Creation", "Digital Marketing", "Community Management"],
    achievements: ["Built upon established social media presence from founder", "Increased online engagement by 5%", "Member of board of directors", "Influences major strategic decisions through board participation"],
    image: "/ibrahim-murtaza.jpg",
    teamId: "social-media",
    isDirector: true,
    social: { email: "social@solarpak.com" }
  },
  {
    id: 3,
    name: "Ayaan Omer",
    role: "Director of Events & Community Outreach",
    description: "Orchestrating community events and building grassroots connections to expand SolarPak's reach across Pakistani communities.",
    location: "Pakistan",
    expertise: ["Event Planning", "Community Outreach", "Strategic Partnerships", "Stakeholder Management"],
    achievements: ["Organized 10 community events", "Helped host a Clash Royale competition", "Member of board of directors", "Influences major strategic decisions through board participation"],
    image: "/ayaan-omer.jpg",
    teamId: "events-outreach",
    isDirector: true,
    social: { email: "events@solarpak.com", linkedin: "https://www.linkedin.com/in/ayaan-omer" }
  },
  {
    id: 4,
    name: "Ramin Tihami",
    role: "Director of Sponsorships & Fundraising",
    description: "Driving strategic partnerships and fundraising initiatives to accelerate SolarPak's mission across Pakistan.",
    location: "Pakistan",
    expertise: ["Strategic Negotiations", "Partnership Development", "AI-Powered Outreach", "Corporate Relations"],
    achievements: ["Member of board of directors", "Influences major strategic decisions through board participation"],
    image: "/ramin-tihami.jpg",
    teamId: "sponsorships",
    isDirector: true,
    social: { email: "fundraising@solarpak.com" }
  },
  {
    id: 5,
    name: "Moiz Ali",
    role: "Director of Predictive Systems & Healthcare",
    description: "Leveraging data analytics and health initiatives to maximize community impact and drive evidence-based decision making.",
    location: "Pakistan",
    expertise: ["Data Analytics", "Healthcare Strategy", "Predictive Systems", "Impact Measurement"],
    achievements: ["Led healthcare expansion initiatives", "Member of board of directors", "Influences major strategic decisions through board participation"],
    image: "/moiz-ali.jpg",
    teamId: "predictive-healthcare",
    isDirector: true,
    social: { email: "research@solarpak.com" }
  },
  {
    id: 11,
    name: "Marwa",
    role: "Director of International Expansion",
    description: "Leading SolarPak's global growth strategy and expanding our clean energy mission to new countries and communities worldwide.",
    location: "Pakistan",
    expertise: ["International Strategy", "Market Expansion", "Global Partnerships", "Cross-Cultural Management"],
    achievements: ["Leading Morocco expansion initiative", "Member of board of directors", "Influences major strategic decisions through board participation"],
    image: "/marwa.jpg",
    teamId: "international-expansion",
    isDirector: true,
    social: { email: "international@solarpak.com" }
  },
  {
    id: 12,
    name: "Hamza Memon",
    role: "Director of General Management",
    description: "Overseeing day-to-day operations and ensuring seamless coordination across all departments to maximize organizational efficiency.",
    location: "Pakistan",
    expertise: ["Operations Management", "Team Coordination", "Strategic Planning", "Process Optimization"],
    achievements: ["Streamlined organizational operations", "Member of board of directors", "Influences major strategic decisions through board participation"],
    image: hamzaMemonPhoto,
    teamId: "general-management",
    isDirector: true,
    social: { email: "operations@solarpak.com" }
  }
];

const teamMembers: TeamMember[] = [
  { id: 7, name: "Roham Jan", role: "Social Media Manager", description: "Managing social media presence and engagement across multiple platforms with creative content and strategic posting.", location: "Pakistan", expertise: ["Editing", "CapCut", "Content Creation", "Engagement"], achievements: ["Posted over 4 times", "Grew social media account by 30% in likes", "Maintained posts over both platforms"], image: "/roham-jan.jpg", teamId: "social-media", social: {} },
  { id: 6, name: "Jonathan Joseph", role: "Head of Event and Brand Promotion", description: "Specializing in creating brand promotion content for events and marketing initiatives to amplify SolarPak's message.", location: "Pakistan", expertise: ["Graphic Design", "Canva", "Cold Outreach", "Brand Image"], achievements: ["Created 2 flyers for future events", "Actively shows willingness to produce content for SolarPak"], image: "/jonathan-joseph.jpg", teamId: "social-media", social: {} },
  { id: 9, name: "Adnan Syed", role: "Community Liaison", description: "Building relationships with local communities and recruiting talented individuals for the organization.", location: "Pakistan", expertise: ["Community Relations", "Organisation", "Talent Acquisition"], achievements: ["Helped organise 10 events", "Helped recruit talent"], image: "/adnan-syed.jpg", teamId: "events-outreach", social: { email: "adnan@solarpak.com" } },
  { id: 10, name: "Zaid Afal", role: "Event Coordinator", description: "Organizing and executing community events with focus on community relations and impactful engagement.", location: "Pakistan", expertise: ["Community Relations", "Organisation"], achievements: ["Helped organise 10 events"], image: "/zaid-afal.jpg", teamId: "events-outreach", social: { email: "zaid@solarpak.com", linkedin: "https://www.linkedin.com/in/zaid-afal-501030303" } }
];

export default function Team() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const allMembers = [founder, ...teamDirectors, ...teamMembers];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-purple-50">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full mb-8">
                <span className="font-bold text-white text-sm uppercase tracking-wide">
                  🌟 World's Largest Youth-Led Solar Nonprofit
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                Meet Our Team
              </h1>
              <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed mb-12" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                11 passionate young leaders transforming Pakistani communities through clean, sustainable solar energy
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 hover:bg-white/20 transition-all duration-300">
                  <div className="text-4xl font-bold text-amber-300 mb-2">11</div>
                  <div className="text-white/90">Solar Panels Installed</div>
                </div>
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 hover:bg-white/20 transition-all duration-300">
                  <div className="text-4xl font-bold text-amber-300 mb-2">70</div>
                  <div className="text-white/90">Lives Transformed</div>
                </div>
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 hover:bg-white/20 transition-all duration-300">
                  <div className="text-4xl font-bold text-amber-300 mb-2">11</div>
                  <div className="text-white/90">Team Members</div>
                </div>
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 hover:bg-white/20 transition-all duration-300">
                  <div className="text-4xl font-bold text-amber-300 mb-2">4</div>
                  <div className="text-white/90">Departments</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-amber-100 border border-amber-300 px-6 py-3 rounded-full mb-6">
                <Award className="w-5 h-5 text-amber-700 mr-2" />
                <span className="font-bold text-amber-700 uppercase tracking-wide">Leadership</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
                Our Founder
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                The visionary behind SolarPak's mission to transform communities through sustainable energy
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative h-96 md:h-auto bg-gradient-to-br from-amber-200 to-orange-200">
                    <img 
                      src={founder.image} 
                      alt={founder.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-8xl font-bold text-amber-500">AA</div>`;
                        }
                      }}
                    />
                    <div className="absolute top-6 left-6 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                      👑 Founder & CEO
                    </div>
                  </div>
                  <div className="p-8 md:p-12">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{founder.name}</h3>
                    <p className="text-amber-600 font-semibold text-lg mb-6">{founder.role}</p>
                    <p className="text-gray-700 leading-relaxed mb-8">{founder.description}</p>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Award className="w-5 h-5 text-amber-600" />
                          Key Achievements
                        </h4>
                        <ul className="space-y-2">
                          {founder.achievements.slice(0, 3).map((achievement, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-700">
                              <span className="text-green-500 mt-1">✓</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {founder.social.email && (
                        <a
                          href={`mailto:${founder.social.email}`}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <Mail className="w-5 h-5" />
                          Contact Founder
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Members Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-blue-100 border border-blue-300 px-6 py-3 rounded-full mb-6">
                <Users className="w-5 h-5 text-blue-700 mr-2" />
                <span className="font-bold text-blue-700 uppercase tracking-wide">Our Team</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Youth Leaders Making Impact
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Meet the passionate students and young professionals driving SolarPak's mission forward
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[...teamDirectors, ...teamMembers].map((member, index) => (
                <div
                  key={member.id}
                  className={`bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-64 bg-gradient-to-br from-blue-100 to-purple-100">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const initials = member.name.split(' ').map(n => n[0]).join('');
                          parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-6xl font-bold text-blue-400">${initials}</div>`;
                        }
                      }}
                    />
                    {member.isDirector && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        📌 Director
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-blue-600 font-semibold mb-4">{member.role}</p>
                    <p className="text-gray-600 leading-relaxed mb-6">{member.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {member.expertise.slice(0, 3).map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      {member.social.email && (
                        <a
                          href={`mailto:${member.social.email}`}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-4 py-2 rounded-full transition-all duration-300"
                        >
                          <Mail className="w-4 h-4" />
                          Email
                        </a>
                      )}
                      {member.social.linkedin && (
                        <a
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-all duration-300"
                        >
                          LinkedIn
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
        <section className="py-20 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-8 left-8 w-32 h-32 bg-white/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-8 right-8 w-40 h-40 bg-yellow-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full mb-8">
              <Heart className="w-5 h-5 text-white mr-2 animate-pulse" />
              <span className="font-bold text-white uppercase tracking-wide">Join Our Mission</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              Be Part of the Solution
            </h2>
            <p className="text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              Passionate about renewable energy and community impact? We're always looking for dedicated young leaders to join our team.
            </p>
            
            <a 
              href="mailto:solarpakinitiative@gmail.com"
              className="inline-flex items-center gap-3 bg-white text-blue-600 hover:bg-gray-100 font-bold px-10 py-5 rounded-full text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
            >
              <Mail className="w-6 h-6" />
              solarpakinitiative@gmail.com
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
