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
    memberCount: 4, // 1 director + 3 members
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "sponsorships",
    name: "Sponsorships & Fundraising",
    description: "Securing partnerships and funding to expand our solar energy impact",
    icon: "💰",
    memberCount: 2, // 1 director + 1 member
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "predictive-healthcare",
    name: "Predictive Systems & Healthcare",
    description: "Leveraging data analytics and health initiatives to maximize community impact",
    icon: "🔬",
    memberCount: 2, // 1 director + 1 member
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
    name: "[Social Media Director Name]",
    role: "Director of Social Media",
    description: "Leading digital strategy and online community engagement to amplify SolarPak's impact story across social platforms.",
    location: "Pakistan",
    joinedDate: "2024-07-01",
    expertise: ["Social Media Strategy", "Content Creation", "Digital Marketing", "Community Management"],
    achievements: [
      "Built social media presence from ground up",
      "Increased online engagement by 300%",
      "Created viral impact content",
      "Managed team of 3 content creators"
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
  
  // Events & Community Outreach Team Members (3 additional)
  { id: 9, name: "[Outreach Coordinator 1]", role: "Community Liaison", description: "Building relationships with local communities", location: "Pakistan", joinedDate: "2024-09-01", expertise: ["Community Relations", "Local Languages"], achievements: ["Connected with 50+ families"], image: "/api/placeholder/150/150", teamId: "events-outreach", social: {} },
  { id: 10, name: "[Outreach Coordinator 2]", role: "Event Coordinator", description: "Organizing and executing community events", location: "Pakistan", joinedDate: "2024-09-15", expertise: ["Event Planning", "Logistics"], achievements: ["Organized 12 successful events"], image: "/api/placeholder/150/150", teamId: "events-outreach", social: {} },
  { id: 11, name: "[Outreach Coordinator 3]", role: "Volunteer Manager", description: "Recruiting and managing volunteer networks", location: "Pakistan", joinedDate: "2024-10-01", expertise: ["Volunteer Management", "Training"], achievements: ["Built network of 30+ volunteers"], image: "/api/placeholder/150/150", teamId: "events-outreach", social: {} },
  
  // Sponsorships & Fundraising Team Member (1 additional)
  { id: 12, name: "[Fundraising Specialist]", role: "Grant Writer", description: "Securing grants and institutional funding", location: "Pakistan", joinedDate: "2024-10-01", expertise: ["Grant Writing", "Research"], achievements: ["Secured 3 major grants"], image: "/api/placeholder/150/150", teamId: "sponsorships", social: {} },
  
  // Predictive Systems & Healthcare Team Member (1 additional)
  { id: 13, name: "[Data Analyst]", role: "Research Associate", description: "Supporting data analysis and health research initiatives", location: "Pakistan", joinedDate: "2024-10-15", expertise: ["Statistical Analysis", "Health Research"], achievements: ["Analyzed impact on 100+ families"], image: "/api/placeholder/150/150", teamId: "predictive-healthcare", social: {} }
];

const organizationStats = [
  { label: "Solar Panels Installed", value: "8", description: "Across Pakistan" },
  { label: "Families Empowered", value: "8", description: "With clean energy" },
  { label: "Lives Transformed", value: "35", description: "Including children" },
  { label: "CO₂ Prevented", value: "120kg", description: "Environmental impact" },
  { label: "Team Members", value: "13", description: "Dedicated professionals" },
  { label: "Specialized Teams", value: "4", description: "Expert departments" }
];

export default function Team() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

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
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Four expert teams working together to maximize SolarPak's impact across Pakistan
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {teams.map((team, index) => (
                <Card 
                  key={team.id}
                  className={`overflow-hidden hover:shadow-xl transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <CardContent className="p-0">
                    <div className={`bg-gradient-to-r ${team.color} p-6 text-white`}>
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
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 mb-4">{team.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          1 Director + {team.memberCount - 1} {team.memberCount === 2 ? 'Member' : 'Members'}
                        </span>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                          Active Team
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Directors Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Department Directors</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experienced leaders guiding each specialized team toward maximum impact
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {teamDirectors.map((director, index) => {
                const team = teams.find(t => t.id === director.teamId);
                return (
                  <Card 
                    key={director.id}
                    className={`overflow-hidden hover:shadow-xl transition-all duration-700 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${(index + 1) * 200}ms` }}
                  >
                    <CardContent className="p-0">
                      <div className={`bg-gradient-to-r ${team?.color || 'from-gray-500 to-gray-600'} p-6 text-white`}>
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-gray-700">
                            {director.name.includes('[') ? '👤' : director.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold">{director.name}</h3>
                            <p className="text-white/90 font-medium mb-2">{director.role}</p>
                            <div className="flex items-center gap-1 text-sm text-white/80">
                              <span className="w-2 h-2 bg-white rounded-full"></span>
                              {team?.name} Team
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <p className="text-gray-600 mb-6">{director.description}</p>

                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Award className="h-4 w-4 text-gray-600" />
                            Expertise
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {director.expertise.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="secondary" className="bg-gray-50 text-gray-700 border-gray-200">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Heart className="h-4 w-4 text-gray-600" />
                            Key Achievements
                          </h4>
                          <ul className="space-y-2">
                            {director.achievements.map((achievement, achIndex) => (
                              <li key={achIndex} className="text-sm text-gray-600 flex items-start gap-2">
                                <span className="text-gray-400 mt-1">•</span>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                          {director.social.email && (
                            <Button size="sm" variant="outline" className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              Email
                            </Button>
                          )}
                          {director.social.linkedin && (
                            <Button size="sm" variant="outline" className="flex items-center gap-2">
                              <Linkedin className="h-4 w-4" />
                              LinkedIn
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

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