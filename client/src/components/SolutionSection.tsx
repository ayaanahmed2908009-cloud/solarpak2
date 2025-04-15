import { Sun, Leaf, Banknote, CheckCircle } from "lucide-react";

export default function SolutionSection() {
  return (
    <section id="solution" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-800 mb-4">Our Solution</h2>
          <p className="text-gray-600 text-lg">Bringing sustainable solar power to families across Pakistan</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1611365892117-0ab8956fdaa1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Solar panel installation in Pakistan" 
                className="w-full h-auto"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg shadow-md text-center">
                <div className="text-primary text-2xl mb-2 flex justify-center">
                  <Sun className="w-6 h-6" />
                </div>
                <h4 className="font-heading font-semibold text-sm">Renewable Energy</h4>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg shadow-md text-center">
                <div className="text-primary text-2xl mb-2 flex justify-center">
                  <Leaf className="w-6 h-6" />
                </div>
                <h4 className="font-heading font-semibold text-sm">Zero Emissions</h4>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg shadow-md text-center">
                <div className="text-primary text-2xl mb-2 flex justify-center">
                  <Banknote className="w-6 h-6" />
                </div>
                <h4 className="font-heading font-semibold text-sm">Cost Effective</h4>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-2xl mb-4 text-secondary">Fundraising for Solar Solutions</h3>
            <p className="text-gray-700 mb-4">
              Our initiative raises funds to install solar panels for families in Pakistan who cannot afford them. Each installation provides a reliable, clean energy source that operates independently from the unstable power grid.
            </p>
            <p className="text-gray-700 mb-4">
              Solar energy offers a sustainable solution that:
            </p>
            
            <ul className="mb-6 space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">
                  <CheckCircle className="w-5 h-5" />
                </span>
                <span className="text-gray-700">Provides consistent electricity during load shedding periods</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">
                  <CheckCircle className="w-5 h-5" />
                </span>
                <span className="text-gray-700">Eliminates the need for expensive, polluting diesel generators</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">
                  <CheckCircle className="w-5 h-5" />
                </span>
                <span className="text-gray-700">Creates long-term savings for families on electricity bills</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">
                  <CheckCircle className="w-5 h-5" />
                </span>
                <span className="text-gray-700">Reduces carbon emissions and environmental impact</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">
                  <CheckCircle className="w-5 h-5" />
                </span>
                <span className="text-gray-700">Provides energy independence and reliability</span>
              </li>
            </ul>
            
            <div className="bg-secondary bg-opacity-10 p-6 rounded-lg mb-4">
              <h4 className="font-heading font-semibold text-lg mb-2 text-secondary">Our Approach</h4>
              <p className="text-gray-700 mb-3">
                We partner with local Pakistani solar installation companies to ensure proper setup and maintenance. Each donation directly funds solar panel installations for families in need.
              </p>
              <p className="text-gray-700">
                Every installation includes battery storage for 24/7 power availability, even during nighttime hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
