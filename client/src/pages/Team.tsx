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
  social: {
    email?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Ayaan Ahmed",
    role: "Founder & CEO",
    description: "Passionate about bringing sustainable energy solutions to underserved communities across Pakistan. Led multiple successful solar installation projects in rural Sindh.",
    location: "Karachi, Pakistan",
    joinedDate: "2024-06-01",
    expertise: ["Solar Energy Systems", "Community Development", "Project Management", "Renewable Energy Policy"],
    achievements: [
      "8 successful solar installations completed",
      "35 lives directly impacted",
      "Featured in local sustainability initiatives",
      "Certified Solar Energy Specialist"
    ],
    image: "/api/placeholder/150/150",
    social: {
      email: "ayaan@solarpak.com",
      linkedin: "#",
      twitter: "#"
    }
  },
  {
    id: 2,
    name: "Fatima Khan",
    role: "Operations Director",
    description: "Experienced project coordinator specializing in rural development and community outreach. Ensures every solar installation meets quality standards and serves families effectively.",
    location: "Khairpur Mirs, Sindh",
    joinedDate: "2024-07-15",
    expertise: ["Project Coordination", "Community Relations", "Quality Assurance", "Rural Development"],
    achievements: [
      "Coordinated 6 community solar projects",
      "Established partnerships with 12 local suppliers",
      "Trained 15+ local technicians",
      "98% customer satisfaction rate"
    ],
    image: "/api/placeholder/150/150",
    social: {
      email: "fatima@solarpak.com",
      linkedin: "#"
    }
  },
  {
    id: 3,
    name: "Muhammad Hassan",
    role: "Technical Lead",
    description: "Solar engineering specialist with 8+ years experience in renewable energy systems. Designs and oversees installation of solar panel systems optimized for Pakistan's climate.",
    location: "Lahore, Pakistan",
    joinedDate: "2024-08-01",
    expertise: ["Solar Panel Installation", "Electrical Engineering", "System Optimization", "Technical Training"],
    achievements: [
      "Designed 10+ custom solar solutions",
      "Reduced installation costs by 25%",
      "Zero system failures in deployed projects",
      "Certified Professional Engineer (PE)"
    ],
    image: "/api/placeholder/150/150",
    social: {
      email: "hassan@solarpak.com",
      linkedin: "#",
      github: "#"
    }
  },
  {
    id: 4,
    name: "Zara Malik",
    role: "Community Impact Coordinator",
    description: "Dedicated to documenting and sharing the real impact of our solar installations. Connects with families to capture their stories and ensure continued project success.",
    location: "Hyderabad, Pakistan",
    joinedDate: "2024-09-10",
    expertise: ["Impact Documentation", "Family Relations", "Content Creation", "Social Media Management"],
    achievements: [
      "Documented 100+ family impact stories",
      "Created 50+ impact videos and photos",
      "Maintained 95% family follow-up rate",
      "Social Media reach: 10k+ engaged followers"
    ],
    image: "/api/placeholder/150/150",
    social: {
      email: "zara@solarpak.com",
      twitter: "#",
      linkedin: "#"
    }
  }
];

const organizationStats = [
  { label: "Solar Panels Installed", value: "8", description: "Across Pakistan" },
  { label: "Families Empowered", value: "8", description: "With clean energy" },
  { label: "Lives Transformed", value: "35", description: "Including children" },
  { label: "CO₂ Prevented", value: "120kg", description: "Environmental impact" },
  { label: "Team Members", value: "4", description: "Dedicated professionals" },
  { label: "Active Regions", value: "4", description: "Pakistani provinces" }
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

        {/* Team Members Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              {teamMembers.map((member, index) => (
                <Card 
                  key={member.id}
                  className={`overflow-hidden hover:shadow-xl transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${(index + 1) * 200}ms` }}
                >
                  <CardContent className="p-0">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-green-600">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{member.name}</h3>
                          <p className="text-green-100 font-medium">{member.role}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-green-100">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {member.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Joined {new Date(member.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Description */}
                      <p className="text-gray-600 mb-6">{member.description}</p>

                      {/* Expertise */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Award className="h-4 w-4 text-green-600" />
                          Expertise
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {member.expertise.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Key Achievements */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Heart className="h-4 w-4 text-green-600" />
                          Key Achievements
                        </h4>
                        <ul className="space-y-2">
                          {member.achievements.map((achievement, achIndex) => (
                            <li key={achIndex} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Social Links */}
                      <div className="flex gap-3 pt-4 border-t border-gray-100">
                        {member.social.email && (
                          <Button size="sm" variant="outline" className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </Button>
                        )}
                        {member.social.linkedin && (
                          <Button size="sm" variant="outline" className="flex items-center gap-2">
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                          </Button>
                        )}
                        {member.social.github && (
                          <Button size="sm" variant="outline" className="flex items-center gap-2">
                            <Github className="h-4 w-4" />
                            GitHub
                          </Button>
                        )}
                        {member.social.twitter && (
                          <Button size="sm" variant="outline" className="flex items-center gap-2">
                            <Twitter className="h-4 w-4" />
                            Twitter
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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