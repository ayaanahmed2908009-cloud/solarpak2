import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import type { Stats, ImpactStory } from "@shared/schema";

export default function ImpactSection() {
  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({ 
    queryKey: ['/api/stats'],
  });

  const { data: impactStories, isLoading: storiesLoading } = useQuery<ImpactStory[]>({
    queryKey: ['/api/impact-stories'],
  });

  if (statsLoading || storiesLoading) {
    return (
      <section id="impact" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-800 mb-4">Our Impact</h2>
            <p className="text-gray-600 text-lg">Transforming lives through sustainable solar energy</p>
          </div>
          <div className="animate-pulse bg-white rounded-xl h-64 shadow-lg mb-12"></div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-lg h-96 shadow-md"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const percentComplete = stats ? (stats.amountRaised / stats.goal) * 100 : 0;

  return (
    <section id="impact" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-800 mb-4">Our Impact</h2>
          <p className="text-gray-600 text-lg">Transforming lives through sustainable solar energy</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div>
                <h3 className="font-heading font-bold text-2xl text-gray-800 mb-2">Campaign Progress</h3>
                <p className="text-gray-600">Help us reach our goal of 200 homes by the end of 2023</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="font-heading font-bold text-2xl text-primary">
                  ${stats?.amountRaised.toLocaleString()}
                </span>
                <span className="text-gray-600 font-medium"> raised of </span>
                <span className="font-heading font-medium text-gray-700">
                  ${stats?.goal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${percentComplete}%` }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between text-center mb-4">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-500 text-sm mb-1">Homes Powered</p>
                <div className="font-heading font-bold text-2xl text-secondary">
                  {stats?.homesHelped}
                </div>
                <p className="text-gray-600 text-sm">of 200 goal</p>
              </div>

              <div className="mb-4 md:mb-0">
                <p className="text-gray-500 text-sm mb-1">CO₂ Reduced</p>
                <div className="font-heading font-bold text-2xl text-secondary">
                  {stats?.co2Reduced}
                </div>
                <p className="text-gray-600 text-sm">tons annually</p>
              </div>

              <div className="mb-4 md:mb-0">
                <p className="text-gray-500 text-sm mb-1">People Impacted</p>
                <div className="font-heading font-bold text-2xl text-secondary">
                  {stats?.peopleImpacted}
                </div>
                <p className="text-gray-600 text-sm">lives improved</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-1">Clean Energy</p>
                <div className="font-heading font-bold text-2xl text-secondary">
                  {stats?.cleanEnergy}
                </div>
                <p className="text-gray-600 text-sm">MWh generated</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {impactStories && impactStories.map(story => (
            <div 
              key={story.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-4"></div>
              <div className="p-6">
                <h4 className="font-heading font-bold text-xl mb-2">{story.title}</h4>
                <p className="text-gray-600 mb-4">
                  {story.description}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{story.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}