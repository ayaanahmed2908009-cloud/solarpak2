import { useQuery } from "@tanstack/react-query";
import { MapPin, Lightbulb, Users, Battery, PanelTop, Leaf } from "lucide-react";
import type { Stats, ImpactStory } from "@shared/schema";
import { useState, useEffect } from "react";

export default function ImpactSection() {
  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({ 
    queryKey: ['/api/stats'],
  });

  const { data: impactStories, isLoading: storiesLoading } = useQuery<ImpactStory[]>({
    queryKey: ['/api/impact-stories'],
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const [activeStory, setActiveStory] = useState<number | null>(null);

  // Add intersection observer for animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("impact");
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  // Animated counter effect for stats
  const [countedStats, setCountedStats] = useState({
    homesHelped: 0,
    co2Reduced: 0,
    peopleImpacted: 0,
    cleanEnergy: 0
  });

  useEffect(() => {
    if (!stats || !isVisible) return;

    const duration = 2000; // ms
    const frameRate = 60;
    const framesCount = duration / (1000 / frameRate);
    
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / framesCount;
      
      setCountedStats({
        homesHelped: Math.round(progress * stats.homesHelped),
        co2Reduced: Math.round(progress * stats.co2Reduced),
        peopleImpacted: Math.round(progress * stats.peopleImpacted),
        cleanEnergy: Math.round(progress * stats.cleanEnergy)
      });
      
      if (frame === framesCount) {
        clearInterval(interval);
      }
    }, 1000 / frameRate);
    
    return () => clearInterval(interval);
  }, [stats, isVisible]);

  if (statsLoading || storiesLoading) {
    return (
      <section id="impact" className="section-container bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">Our Progress</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-800 mb-4">
              <span className="gradient-text">Our Impact</span>
            </h2>
            <p className="text-gray-600 text-lg">Transforming lives through sustainable solar energy</p>
          </div>
          <div className="animate-pulse shimmer bg-white rounded-xl h-64 shadow-lg mb-16"></div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse shimmer bg-white rounded-lg h-96 shadow-md"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const percentComplete = stats ? (stats.amountRaised / stats.goal) * 100 : 0;

  return (
    <section id="impact" className="section-container bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-primary/5"></div>
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/5"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">Our Progress</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-800 mb-4">
            <span className="gradient-text">Our Impact</span>
          </h2>
          <p className="text-gray-600 text-lg">Transforming lives through sustainable solar energy</p>
        </div>
        
        <div className={`bg-white rounded-xl shadow-xl overflow-hidden mb-20 border border-gray-100 transition-all duration-1000 ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
        }`}>
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
              <div>
                <h3 className="font-heading font-bold text-2xl md:text-3xl text-gray-800 mb-2">Campaign Progress</h3>
                <p className="text-gray-600">Help us reach our goal of 200 homes by the end of 2023</p>
              </div>
              <div className="mt-4 md:mt-0 px-6 py-3 bg-gray-50 rounded-lg shadow-inner">
                <span className="font-heading font-bold text-2xl md:text-3xl text-primary">
                  ${stats?.amountRaised.toLocaleString()}
                </span>
                <span className="text-gray-600 font-medium"> raised of </span>
                <span className="font-heading font-medium text-gray-700">
                  ${stats?.goal.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="mb-8 relative">
              <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-1500 ease-out"
                  style={{ width: isVisible ? `${percentComplete}%` : '0%' }}
                ></div>
              </div>
              <div className="absolute -right-2 top-0 transform translate-x-full mt-1">
                <span className="bg-primary text-white text-sm font-bold px-2 py-1 rounded-md shadow-md">
                  {Math.round(percentComplete)}%
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl shadow-md text-center transform transition-all hover:scale-105 duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10 text-primary">
                  <PanelTop className="w-6 h-6" />
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">Homes Powered</p>
                <div className="font-heading font-bold text-3xl text-primary mb-1">
                  {countedStats.homesHelped}
                </div>
                <p className="text-gray-600 text-sm">of 200 goal</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl shadow-md text-center transform transition-all hover:scale-105 duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10 text-primary">
                  <Leaf className="w-6 h-6" />
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">CO₂ Reduced</p>
                <div className="font-heading font-bold text-3xl text-primary mb-1">
                  {countedStats.co2Reduced}
                </div>
                <p className="text-gray-600 text-sm">tons annually</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl shadow-md text-center transform transition-all hover:scale-105 duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10 text-primary">
                  <Users className="w-6 h-6" />
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">People Impacted</p>
                <div className="font-heading font-bold text-3xl text-primary mb-1">
                  {countedStats.peopleImpacted}
                </div>
                <p className="text-gray-600 text-sm">lives improved</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl shadow-md text-center transform transition-all hover:scale-105 duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10 text-primary">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">Clean Energy</p>
                <div className="font-heading font-bold text-3xl text-primary mb-1">
                  {countedStats.cleanEnergy}
                </div>
                <p className="text-gray-600 text-sm">MWh generated</p>
              </div>
            </div>
          </div>
        </div>
        
        <h3 className="font-heading font-bold text-2xl md:text-3xl text-center mb-10">Success Stories</h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          {impactStories && impactStories.map((story, index) => (
            <div 
              key={story.id} 
              className={`bg-white rounded-xl shadow-lg overflow-hidden hover-card transform transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseEnter={() => setActiveStory(story.id)}
              onMouseLeave={() => setActiveStory(null)}
            >
              <div className="relative h-52 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <div className="w-full h-full bg-gray-200"></div>
                <div className="absolute bottom-3 left-4 z-20">
                  <div className="flex items-center text-sm text-white/90 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{story.location}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-heading font-bold text-xl mb-3">{story.title}</h4>
                <p className="text-gray-600 mb-4 line-clamp-4">
                  {story.description}
                </p>
                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-auto">
                  <span className="text-sm text-primary font-medium">Read their story</span>
                  <span className="text-xs text-gray-500">2 months ago</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}