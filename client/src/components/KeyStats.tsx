import { useQuery } from "@tanstack/react-query";
import { Bolt, Thermometer, Home, PanelTop } from "lucide-react";
import type { Stats } from "@shared/schema";

export default function KeyStats() {
  const { data: stats, isLoading } = useQuery<Stats>({ 
    queryKey: ['/api/stats'],
  });

  if (isLoading) {
    return (
      <section className="bg-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="mx-auto mb-2 w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="h-8 bg-gray-200 rounded w-24 mx-auto mb-1"></div>
                <div className="h-4 bg-gray-100 rounded w-32 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          <div className="text-center">
            <div className="text-primary text-4xl mb-2 flex justify-center">
              <Bolt className="w-8 h-8" />
            </div>
            <div className="font-heading font-bold text-3xl md:text-4xl">
              12+
            </div>
            <p className="text-gray-600">Hours without power daily</p>
          </div>
          
          <div className="text-center">
            <div className="text-primary text-4xl mb-2 flex justify-center">
              <Thermometer className="w-8 h-8" />
            </div>
            <div className="font-heading font-bold text-3xl md:text-4xl">
              45°C+
            </div>
            <p className="text-gray-600">Summer temperatures</p>
          </div>
          
          <div className="text-center">
            <div className="text-primary text-4xl mb-2 flex justify-center">
              <Home className="w-8 h-8" />
            </div>
            <div className="font-heading font-bold text-3xl md:text-4xl">
              {stats?.homesHelped}
            </div>
            <p className="text-gray-600">Homes helped so far</p>
          </div>
          
          <div className="text-center">
            <div className="text-primary text-4xl mb-2 flex justify-center">
              <PanelTop className="w-8 h-8" />
            </div>
            <div className="font-heading font-bold text-3xl md:text-4xl">
              {stats?.solarPanelsInstalled}
            </div>
            <p className="text-gray-600">Solar panels installed</p>
          </div>
        </div>
      </div>
    </section>
  );
}
