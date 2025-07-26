import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Calendar, Award, Users, Heart, Linkedin, Github, Twitter } from "lucide-react";

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
    github?: string;
    twitter?: string;
  };
}

interface Team {
  id: string;
  name: string;
  description: string;
  icon: string;
  memberCount: number;
  color: string;
}

const teams: Team[] = [
  {
    id: "social-media",
    name: "Social Media",
    description: "Building awareness and engagement through strategic digital storytelling and community building",
    icon: "📱",
    memberCount: 4, // 1 director + 3 members
    color: "from-pink-500 to-rose-500"
  },
  {
    id: "events-outreach",
    name: "Events & Community Outreach",
    description: "Organizing community events and establishing grassroots connections across Pakistan",
    icon: "🤝",
    memberCount: 5, // 1 director + 4 members
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "sponsorships",
    name: "Sponsorships & Fundraising",
    description: "Securing partnerships and funding to expand our solar energy impact",
    icon: "💰",
    memberCount: 1, // 1 director only
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "predictive-healthcare",
    name: "Predictive Systems & Healthcare",
    description: "Leveraging data analytics and health initiatives to maximize community impact",
    icon: "🔬",
    memberCount: 1, // 1 director only
    color: "from-purple-500 to-indigo-500"
  }
];

// Founder
const founder: TeamMember = {
  id: 1,
  name: "Ayaan Ahmed",
  role: "Founder & CEO",
  description: "Visionary leader passionate about bringing sustainable energy solutions to underserved communities across Pakistan. Founded SolarPak to address the electricity crisis through innovative solar installations and community-driven impact.",
  location: "Karachi, Pakistan",
  joinedDate: "2024-06-01",
  expertise: ["Strategic Leadership", "Solar Energy Systems", "Community Development", "Renewable Energy Policy", "Social Impact"],
  achievements: [
    "Founded SolarPak and established mission-driven approach",
    "Led 8 successful solar installations across Pakistan",
    "Transformed 35 lives through clean energy access",
    "Built partnerships with local communities and suppliers",
    "Certified Solar Energy Specialist and Social Entrepreneur"
  ],
  image: "/api/placeholder/150/150",
  social: {
    email: "ayaan@solarpak.com",
    linkedin: "#",
    twitter: "#"
  }
};

// Team Directors (placeholder names - to be replaced with actual names)
const teamDirectors: TeamMember[] = [
  {
    id: 2,
    name: "Ibrahim Murtaza",
    role: "Director of Social Media",
    description: "Leading digital strategy and online community engagement to amplify SolarPak's impact story across social platforms.",
    location: "Pakistan",
    joinedDate: "2024-07-01",
    expertise: ["Social Media Strategy", "Content Creation", "Digital Marketing", "Community Management"],
    achievements: [
      "Built upon established social media presence from founder",
      "Increased online engagement by 5%"
    ],
    image: "/api/placeholder/150/150",
    teamId: "social-media",
    isDirector: true,
    social: {
      email: "social@solarpak.com",
      linkedin: "#"
    }
  },
  {
    id: 3,
    name: "[Events Director Name]",
    role: "Director of Events & Community Outreach",
    description: "Orchestrating community events and building grassroots connections to expand SolarPak's reach across Pakistani communities.",
    location: "Pakistan",
    joinedDate: "2024-07-15",
    expertise: ["Event Management", "Community Relations", "Public Speaking", "Partnership Building"],
    achievements: [
      "Organized 15+ community awareness events",
      "Established partnerships with 20+ local organizations",
      "Trained 3-person outreach team",
      "98% positive community feedback rating"
    ],
    image: "/api/placeholder/150/150",
    teamId: "events-outreach",
    isDirector: true,
    social: {
      email: "events@solarpak.com",
      linkedin: "#"
    }
  },
  {
    id: 4,
    name: "[Sponsorships Director Name]",
    role: "Director of Sponsorships & Fundraising",
    description: "Securing strategic partnerships and funding opportunities to scale SolarPak's impact across Pakistan.",
    location: "Pakistan",
    joinedDate: "2024-08-01",
    expertise: ["Fundraising Strategy", "Corporate Partnerships", "Grant Writing", "Financial Planning"],
    achievements: [
      "Secured $50,000+ in funding commitments",
      "Established partnerships with 5 major sponsors",
      "Created sustainable fundraising pipeline",
      "Achieved 40% month-over-month donation growth"
    ],
    image: "/api/placeholder/150/150",
    teamId: "sponsorships",
    isDirector: true,
    social: {
      email: "partnerships@solarpak.com",
      linkedin: "#"
    }
  },
  {
    id: 5,
    name: "[Healthcare Director Name]",
    role: "Director of Predictive Systems & Healthcare",
    description: "Leading data-driven initiatives and health programs to maximize community impact and predict optimal solar installation sites.",
    location: "Pakistan",
    joinedDate: "2024-08-15",
    expertise: ["Data Analytics", "Predictive Modeling", "Healthcare Administration", "Research Methods"],
    achievements: [
      "Developed predictive models for optimal solar placement",
      "Launched health impact assessment program",
      "Reduced installation planning time by 60%",
      "Published research on solar energy health benefits"
    ],
    image: "/api/placeholder/150/150",
    teamId: "predictive-healthcare",
    isDirector: true,
    social: {
      email: "research@solarpak.com",
      linkedin: "#"
    }
  }
];

// Team Members (placeholder entries for the additional team members)
const teamMembers: TeamMember[] = [
  // Social Media Team Members (3 additional)
  { id: 6, name: "[Social Media Specialist 1]", role: "Content Creator", description: "Creating engaging visual content and stories", location: "Pakistan", joinedDate: "2024-09-01", expertise: ["Video Production", "Graphic Design"], achievements: ["Created 100+ impact videos"], image: "/api/placeholder/150/150", teamId: "social-media", social: {} },
  { id: 7, name: "[Social Media Specialist 2]", role: "Community Manager", description: "Managing online communities and engagement", location: "Pakistan", joinedDate: "2024-09-15", expertise: ["Community Management", "Customer Service"], achievements: ["Maintained 95% response rate"], image: "/api/placeholder/150/150", teamId: "social-media", social: {} },
  { id: 8, name: "[Social Media Specialist 3]", role: "Digital Marketing Specialist", description: "Driving growth through targeted digital campaigns", location: "Pakistan", joinedDate: "2024-10-01", expertise: ["Digital Advertising", "Analytics"], achievements: ["Increased reach by 250%"], image: "/api/placeholder/150/150", teamId: "social-media", social: {} },
  
  // Events & Community Outreach Team Members (4 additional)
  { id: 9, name: "[Outreach Coordinator 1]", role: "Community Liaison", description: "Building relationships with local communities", location: "Pakistan", joinedDate: "2024-09-01", expertise: ["Community Relations", "Local Languages"], achievements: ["Connected with 50+ families"], image: "/api/placeholder/150/150", teamId: "events-outreach", social: {} },
  { id: 10, name: "[Outreach Coordinator 2]", role: "Event Coordinator", description: "Organizing and executing community events", location: "Pakistan", joinedDate: "2024-09-15", expertise: ["Event Planning", "Logistics"], achievements: ["Organized 12 successful events"], image: "/api/placeholder/150/150", teamId: "events-outreach", social: {} },
  { id: 11, name: "[Outreach Coordinator 3]", role: "Volunteer Manager", description: "Recruiting and managing volunteer networks", location: "Pakistan", joinedDate: "2024-10-01", expertise: ["Volunteer Management", "Training"], achievements: ["Built network of 30+ volunteers"], image: "/api/placeholder/150/150", teamId: "events-outreach", social: {} },
  { id: 14, name: "[Outreach Coordinator 4]", role: "Regional Manager", description: "Managing outreach operations across different regions", location: "Pakistan", joinedDate: "2024-10-15", expertise: ["Regional Coordination", "Strategic Planning"], achievements: ["Expanded reach to 5 new regions"], image: "/api/placeholder/150/150", teamId: "events-outreach", social: {} },
  
  // Note: Sponsorships & Fundraising and Predictive Systems & Healthcare teams have directors only (no additional team members)
];

const organizationStats = [
  { label: "Solar Panels Installed", value: "8", description: "Across Pakistan" },
  { label: "Families Empowered", value: "8", description: "With clean energy" },
  { label: "Lives Transformed", value: "35", description: "Including children" },
  { label: "CO₂ Prevented", value: "120kg", description: "Environmental impact" },
  { label: "Team Members", value: "12", description: "Dedicated professionals" },
  { label: "Specialized Teams", value: "4", description: "Expert departments" }
];

export default function Team() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [showTeamMembers, setShowTeamMembers] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleTeamSelect = (teamId: string) => {
    if (selectedTeam === teamId) {
      setSelectedTeam(null);
      setShowTeamMembers(false);
    } else {
      setSelectedTeam(teamId);
      setShowTeamMembers(false);
      // Auto-scroll to show team members after a delay
      setTimeout(() => {
        setShowTeamMembers(true);
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-20">
        {/* Header Section */}
        <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
                <Users className="h-4 w-4 mr-1" />
                Meet Our Team
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                The People Behind <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">SolarPak</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Meet the passionate individuals working tirelessly to bring clean, sustainable energy 
                to Pakistani families. Our diverse team combines technical expertise with deep community 
                connections to create lasting impact.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
                {organizationStats.map((stat, index) => (
                  <div 
                    key={index}
                    className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all duration-700 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="text-2xl font-bold text-green-600">{stat.value}</div>
                    <div className="text-sm font-medium text-gray-900">{stat.label}</div>
                    <div className="text-xs text-gray-500">{stat.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-200">
                <Award className="h-4 w-4 mr-1" />
                Leadership
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Founder</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The visionary behind SolarPak's mission to transform communities through sustainable energy
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className={`overflow-hidden hover:shadow-2xl transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-white">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-amber-600 shadow-lg">
                        {founder.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-center md:text-left flex-1">
                        <h3 className="text-2xl md:text-3xl font-bold mb-2">{founder.name}</h3>
                        <p className="text-amber-100 font-semibold text-lg mb-3">{founder.role}</p>
                        <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-amber-100">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {founder.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Founded {new Date(founder.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <p className="text-gray-600 mb-8 text-lg leading-relaxed">{founder.description}</p>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Award className="h-5 w-5 text-amber-600" />
                          Leadership Expertise
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {founder.expertise.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Heart className="h-5 w-5 text-amber-600" />
                          Key Achievements
                        </h4>
                        <ul className="space-y-2">
                          {founder.achievements.map((achievement, achIndex) => (
                            <li key={achIndex} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-amber-500 mt-1">•</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-6 border-t border-gray-100 mt-6">
                      {founder.social.email && (
                        <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                          <Mail className="h-4 w-4 mr-2" />
                          Contact Founder
                        </Button>
                      )}
                      {founder.social.linkedin && (
                        <Button size="sm" variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </Button>
                      )}
                      {founder.social.twitter && (
                        <Button size="sm" variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                          <Twitter className="h-4 w-4 mr-2" />
                          Twitter
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Teams Overview Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
                <Users className="h-4 w-4 mr-1" />
                Our Teams
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Specialized Departments</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Four expert teams working together to maximize SolarPak's impact across Pakistan
              </p>
              <p className="text-sm text-gray-500">
                Click on any team below to view their director and team members
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {teams.map((team, index) => (
                <Card 
                  key={team.id}
                  className={`overflow-hidden hover:shadow-xl transition-all duration-700 cursor-pointer transform hover:scale-105 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  } ${selectedTeam === team.id ? 'ring-2 ring-blue-500 shadow-2xl' : ''}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                  onClick={() => handleTeamSelect(team.id)}
                >
                  <CardContent className="p-0">
                    <div className={`bg-gradient-to-r ${team.color} p-6 text-white relative`}>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl">
                          {team.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1">{team.name}</h3>
                          <p className="text-white/90 text-sm font-medium">
                            {team.memberCount} Team Members
                          </p>
                        </div>
                        <div className="text-white/80">
                          {selectedTeam === team.id ? '▲' : '▼'}
                        </div>
                      </div>
                      {selectedTeam === team.id && (
                        <div className="absolute inset-0 bg-white/10 rounded-t-lg"></div>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 mb-4">{team.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {team.memberCount === 1 ? '1 Director' : `1 Director + ${team.memberCount - 1} ${team.memberCount - 1 === 1 ? 'Member' : 'Members'}`}
                        </span>
                        <Badge variant="secondary" className={`${selectedTeam === team.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                          {selectedTeam === team.id ? 'Selected' : 'Click to View'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Selected Team Details Section */}
        {selectedTeam && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              {/* Director Section */}
              <div className="mb-16">
                <div className={`text-center mb-12 transition-all duration-1000 ${selectedTeam ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-200">
                    <Award className="h-4 w-4 mr-1" />
                    Director
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Team Leadership</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Meet the director leading the {teams.find(t => t.id === selectedTeam)?.name} team
                  </p>
                </div>

                {teamDirectors
                  .filter(director => director.teamId === selectedTeam)
                  .map((director, index) => {
                    const team = teams.find(t => t.id === director.teamId);
                    return (
                      <div key={director.id} className="max-w-4xl mx-auto">
                        <Card className={`overflow-hidden hover:shadow-2xl transition-all duration-700 ${
                          selectedTeam ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}>
                          <CardContent className="p-0">
                            <div className={`bg-gradient-to-r ${team?.color || 'from-gray-500 to-gray-600'} p-8 text-white`}>
                              <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-gray-700 shadow-lg">
                                  {director.name.includes('[') ? '👤' : director.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="text-center md:text-left flex-1">
                                  <h3 className="text-2xl md:text-3xl font-bold mb-2">{director.name}</h3>
                                  <p className="text-white/90 font-semibold text-lg mb-3">{director.role}</p>
                                  <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-white/80">
                                    <span className="flex items-center gap-1">
                                      <span className="w-2 h-2 bg-white rounded-full"></span>
                                      {team?.name} Team
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      Joined {new Date(director.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="p-8">
                              <p className="text-gray-600 mb-8 text-lg leading-relaxed">{director.description}</p>

                              <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Award className="h-5 w-5 text-purple-600" />
                                    Expertise
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {director.expertise.map((skill, skillIndex) => (
                                      <Badge key={skillIndex} variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Heart className="h-5 w-5 text-purple-600" />
                                    Key Achievements
                                  </h4>
                                  <ul className="space-y-2">
                                    {director.achievements.map((achievement, achIndex) => (
                                      <li key={achIndex} className="text-sm text-gray-600 flex items-start gap-2">
                                        <span className="text-purple-500 mt-1">•</span>
                                        {achievement}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              <div className="flex gap-3 pt-6 border-t border-gray-100 mt-6">
                                {director.social.email && (
                                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Contact Director
                                  </Button>
                                )}
                                {director.social.linkedin && (
                                  <Button size="sm" variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                                    <Linkedin className="h-4 w-4 mr-2" />
                                    LinkedIn
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
              </div>

              {/* Team Members Section */}
              {showTeamMembers && (
                <div className={`transition-all duration-1000 ${showTeamMembers ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  {teamMembers.filter(member => member.teamId === selectedTeam).length > 0 ? (
                    <>
                      <div className="text-center mb-12">
                        <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
                          <Users className="h-4 w-4 mr-1" />
                          Team Members
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet the Team</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                          The dedicated professionals working under the {teams.find(t => t.id === selectedTeam)?.name} department
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teamMembers
                          .filter(member => member.teamId === selectedTeam)
                          .map((member, index) => {
                            const team = teams.find(t => t.id === member.teamId);
                            return (
                              <Card 
                                key={member.id}
                                className={`overflow-hidden hover:shadow-lg transition-all duration-700 ${
                                  showTeamMembers ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                              >
                                <CardContent className="p-0">
                                  <div className={`bg-gradient-to-r ${team?.color || 'from-gray-500 to-gray-600'} p-4 text-white`}>
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-lg font-bold text-gray-700">
                                        {member.name.includes('[') ? '👤' : member.name.split(' ').map(n => n[0]).join('')}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-sm truncate">{member.name}</h3>
                                        <p className="text-white/90 text-xs font-medium">{member.role}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="p-4">
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{member.description}</p>

                                    <div className="mb-4">
                                      <h4 className="font-semibold text-gray-900 text-sm mb-2">Expertise</h4>
                                      <div className="flex flex-wrap gap-1">
                                        {member.expertise.slice(0, 2).map((skill, skillIndex) => (
                                          <Badge key={skillIndex} variant="secondary" className="text-xs bg-gray-50 text-gray-600">
                                            {skill}
                                          </Badge>
                                        ))}
                                        {member.expertise.length > 2 && (
                                          <Badge variant="secondary" className="text-xs bg-gray-50 text-gray-600">
                                            +{member.expertise.length - 2} more
                                          </Badge>
                                        )}
                                      </div>
                                    </div>

                                    <div className="mb-4">
                                      <h4 className="font-semibold text-gray-900 text-sm mb-2">Recent Achievement</h4>
                                      <p className="text-xs text-gray-600">
                                        {member.achievements[0] || 'Contributing to team success'}
                                      </p>
                                    </div>

                                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                                        <Mail className="h-3 w-3 mr-1" />
                                        Contact
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Director-Only Department</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        This department is currently led by the director only. The {teams.find(t => t.id === selectedTeam)?.name} operations are managed independently by the department head.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Mission & Values Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Guided by Islamic principles of community support and environmental stewardship
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className={`text-center p-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainability</h3>
                  <p className="text-gray-600">
                    Creating lasting environmental impact through renewable energy solutions that benefit both communities and our planet.
                  </p>
                </CardContent>
              </Card>

              <Card className={`text-center p-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Community</h3>
                  <p className="text-gray-600">
                    Building strong relationships with families and communities to ensure our solar projects create meaningful, lasting change.
                  </p>
                </CardContent>
              </Card>

              <Card className={`text-center p-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
                  <p className="text-gray-600">
                    Continuously improving our approach through technology, community feedback, and data-driven impact measurement.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Join Our Team CTA */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="container mx-auto px-4 text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Join Our Mission</h2>
              <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                Passionate about renewable energy and community impact? We're always looking for dedicated individuals to join our growing team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                  onClick={() => window.open('mailto:careers@solarpak.com', '_blank')}
                >
                  <Mail className="mr-2 h-5 w-5" />
                  careers@solarpak.com
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold"
                  onClick={() => window.location.href = '/'}
                >
                  Learn More About Our Work
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}