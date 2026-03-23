import { ArrowLeft, MapPin, Thermometer, Zap, Users, Calendar, Target } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function CaseStudy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              Case Study
            </Badge>
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-6">
              Bringing Light to Khairpur Mirs Sindh
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
              A personal mission to transform my hometown through sustainable solar energy
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Khairpur Mirs, Sindh, Pakistan
              </div>
              <div className="flex items-center">
                <Thermometer className="h-4 w-4 mr-2" />
                45°C Daily Temperatures
              </div>
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                12 Hours Daily Blackouts
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* About Khairpur Mirs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <MapPin className="h-6 w-6 mr-3 text-primary" />
                About Khairpur Mirs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Khairpur Mirs is a historic city in the Sindh province of Pakistan, located in the heart of the Indus Valley. 
                Known for its rich cultural heritage and agricultural significance, this city has been home to generations of families 
                who have built their livelihoods around farming and traditional crafts.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The city serves as a district headquarters and is strategically positioned along major transportation routes, 
                making it a vital hub for the surrounding rural communities. With a population of over 200,000 people, 
                Khairpur Mirs represents the challenges faced by many medium-sized cities across Pakistan.
              </p>
            </CardContent>
          </Card>

          {/* Personal Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Users className="h-6 w-6 mr-3 text-primary" />
                Why We Started Here
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                This isn't just another project location for us—Khairpur Mirs is home. Having grown up in this community, 
                I've witnessed firsthand the daily struggles families face during the scorching summer months when temperatures 
                soar to 45°C and power outages last up to 12 hours daily.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We believe that meaningful change starts close to home. By beginning our solar initiative in Khairpur Mirs, 
                we can work directly with families we know and trust, ensuring that every solar panel installed creates 
                immediate, tangible impact in our own community.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Starting locally also allows us to perfect our approach, learn from real-world implementation challenges, 
                and build a model that can be replicated across Pakistan. Our hometown becomes the foundation for a 
                nationwide movement toward energy independence.
              </p>
            </CardContent>
          </Card>

          {/* The Crisis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Zap className="h-6 w-6 mr-3 text-red-500" />
                The Energy Crisis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-gray-800">Daily Blackouts</h4>
                  <p className="text-gray-700">
                    Families in Khairpur Mirs endure 12+ hours of power outages every single day. These blackouts are 
                    not occasional disruptions—they're a predictable part of daily life that forces families to 
                    plan their entire schedules around electricity availability.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-gray-800">Extreme Heat</h4>
                  <p className="text-gray-700">
                    With temperatures reaching 45°C (113°F) regularly during summer months, air conditioning and 
                    fans become necessities, not luxuries. Without reliable electricity, families suffer through 
                    dangerous heat levels that threaten health and productivity.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-gray-800">Impact on Daily Life</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Children cannot study after sunset, limiting educational opportunities
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Food spoils quickly without refrigeration, causing financial loss and health risks
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Small businesses lose productivity and income during power outages
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Healthcare facilities struggle to maintain essential services
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Government Neglect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Target className="h-6 w-6 mr-3 text-orange-500" />
                Government Neglect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Despite being a district headquarters, Khairpur Mirs has been consistently overlooked by the Sindh 
                provincial government when it comes to infrastructure investment and energy solutions. While major 
                cities receive attention and resources, smaller cities like ours are left to struggle with outdated 
                power grids and insufficient capacity.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The provincial government's focus remains on Karachi and other major urban centers, leaving rural 
                and semi-urban areas like Khairpur Mirs with inadequate power supply that hasn't kept pace with 
                growing demand. Promises of grid improvements and new power plants remain unfulfilled year after year.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This systematic neglect has created a situation where communities must find their own solutions. 
                Solar energy represents not just an alternative, but a path to energy independence that doesn't 
                rely on government action or promises.
              </p>
            </CardContent>
          </Card>

          {/* Our Solution */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-primary">
                <Calendar className="h-6 w-6 mr-3" />
                Our Solar Solution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                By installing solar panel systems in Khairpur Mirs, we're providing families with reliable, 
                clean electricity that works even during grid outages. Each system is designed to meet the 
                essential needs of a typical household, including lighting, fans, refrigeration, and device charging.
              </p>
              <div className="bg-primary/5 p-6 rounded-lg">
                <h4 className="font-semibold text-lg text-primary mb-3">Project Goals</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Install solar systems for 50 families in Phase 1
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Provide 8-10 hours of backup power daily
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Reduce electricity costs by 60-80%
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Create a replicable model for other cities
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-primary to-primary/80 text-white p-8 rounded-xl">
            <h3 className="font-heading font-bold text-2xl mb-4">
              Help Us Light Up Khairpur Mirs
            </h3>
            <p className="text-lg mb-6 text-primary-foreground/90">
              Your support will directly impact families in our hometown, providing them with reliable, 
              clean energy and a brighter future.
            </p>
            <a
              href="https://ko-fi.com/solarpak"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Support This Project
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}