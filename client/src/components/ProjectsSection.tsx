import { useQuery } from "@tanstack/react-query";
import { MapPin, Calendar, Users, LightbulbIcon, ArrowRight } from "lucide-react";
import type { Project } from "@shared/schema";
import { Link } from "wouter";
import { useState } from "react";

export default function ProjectsSection() {
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);
  
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  if (isLoading) {
    return (
      <section id="projects" className="section-container bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">Support Our Work</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-800 mb-4">
              <span className="gradient-text">Current Projects</span>
            </h2>
            <p className="text-gray-600 text-lg">Support our ongoing solar installation initiatives</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse shimmer bg-white rounded-xl h-[400px] shadow-lg border border-gray-100"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="section-container bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">Support Our Work</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-800 mb-4">
            <span className="gradient-text">Current Projects</span>
          </h2>
          <p className="text-gray-600 text-lg">Support our ongoing solar installation initiatives across Pakistan</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {projects && projects.map(project => {
            const progressPercentage = (project.currentFunding / project.totalFundingGoal) * 100;
            const isHovered = hoveredProjectId === project.id;
            
            return (
              <div 
                key={project.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover-card"
                onMouseEnter={() => setHoveredProjectId(project.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
              >
                <div className="relative h-64">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                    {project.isActive ? 'Active' : 'Completed'}
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>Sindh Province, Pakistan</span>
                    </div>
                    <h4 className="font-heading font-bold text-xl mb-1">{project.name}</h4>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-wrap justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center mb-2 mr-4">
                      <Calendar className="h-4 w-4 mr-1 text-primary" />
                      <span>2023-2024</span>
                    </div>
                    <div className="flex items-center mb-2 mr-4">
                      <Users className="h-4 w-4 mr-1 text-primary" />
                      <span>25 Families</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <LightbulbIcon className="h-4 w-4 mr-1 text-primary" />
                      <span>10kW Systems</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700 font-medium">Funding Progress</span>
                      <span className="font-semibold text-primary">{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mb-6 text-sm">
                    <span className="text-gray-700">
                      <span className="font-semibold text-primary">
                        ${project.currentFunding.toLocaleString()}
                      </span> raised
                    </span>
                    <span className="text-gray-700">
                      Goal: <span className="font-semibold">${project.totalFundingGoal.toLocaleString()}</span>
                    </span>
                  </div>
                  
                  <Link 
                    href={`/checkout?projectId=${project.id}`}
                    className="group block text-center bg-primary hover:bg-primary/90 text-white font-heading font-semibold px-6 py-3 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <span className="flex items-center justify-center">
                      Support This Project 
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center">
          <Link 
            href="/#projects" 
            className="group inline-flex items-center text-primary font-heading font-medium hover:text-primary/80 transition-all duration-300 px-6 py-3 rounded-lg hover:bg-primary/5"
          >
            View all projects
            <ArrowRight className="h-5 w-5 ml-2 transition-transform duration-300 transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}