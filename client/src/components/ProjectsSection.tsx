import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import type { Project } from "@shared/schema";
import { Link } from "wouter";

export default function ProjectsSection() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  if (isLoading) {
    return (
      <section id="projects" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-800 mb-4">Current Projects</h2>
            <p className="text-gray-600 text-lg">Support our ongoing solar installation initiatives</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-lg h-96 shadow-md border border-gray-100"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-800 mb-4">Current Projects</h2>
          <p className="text-gray-600 text-lg">Support our ongoing solar installation initiatives</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects && projects.map(project => {
            const progressPercentage = (project.currentFunding / project.totalFundingGoal) * 100;

            return (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                <div className="relative h-48"> {/* Replacement div */}
                  <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
                    {project.isActive ? 'Active' : 'Completed'}
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="font-heading font-bold text-xl mb-2">{project.name}</h4>
                  <p className="text-gray-600 mb-4">
                    {project.description}
                  </p>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between mb-6 text-sm">
                    <span className="text-gray-600">
                      <span className="font-medium text-secondary">
                        ${project.currentFunding.toLocaleString()}
                      </span> raised
                    </span>
                    <span className="text-gray-600">
                      Goal: <span className="font-medium">${project.totalFundingGoal.toLocaleString()}</span>
                    </span>
                  </div>

                  <Link 
                    href={`/checkout?projectId=${project.id}`}
                    className="block text-center bg-primary hover:bg-primary/90 text-white font-heading font-semibold px-6 py-2 rounded-md transition"
                  >
                    Support This Project
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link 
            href="/#projects" 
            className="inline-flex items-center text-secondary font-heading font-medium hover:text-primary transition"
          >
            View all projects
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 ml-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}