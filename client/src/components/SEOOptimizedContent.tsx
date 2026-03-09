import React from 'react';

interface SEOContentProps {
  title: string;
  description: string;
  keywords?: string[];
  children: React.ReactNode;
}

export function SEOOptimizedContent({ title, description, keywords, children }: SEOContentProps) {
  return (
    <main role="main">
      {/* Organization Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "SolarPak",
          "alternateName": "World's Largest Youth-Led Solar Nonprofit",
          "description": "The world's largest youth-led solar nonprofit bringing clean energy to Pakistani families. Student-run organization transforming lives through renewable energy.",
          "foundingDate": "2025-03",
          "foundingLocation": "Riyadh, Saudi Arabia",
          "areaServed": "Pakistan",
          "url": "https://solarpak.replit.app",
          "logo": "https://solarpak.replit.app/favicon.png",
          "sameAs": [
            "https://www.linkedin.com/company/solarpak",
            "https://ko-fi.com/solarpak"
          ],
          "founder": {
            "@type": "Person",
            "name": "Ayaan Ahmed",
            "jobTitle": "Founder & Director"
          },
          "keywords": "youth-led solar nonprofit, student-run renewable energy, world's largest youth solar organization, solar panels Pakistan, clean energy charity",
          "nonprofitStatus": "Youth-Led Nonprofit Organization",
          "mission": "To bring clean, affordable solar energy to Pakistani families through youth leadership and community support"
        })}
      </script>
      
      {/* Hidden SEO content for search engines */}
      <div className="sr-only">
        <h1>{title}</h1>
        <p>{description}</p>
        {keywords && (
          <div>
            Keywords: {keywords.join(', ')}
          </div>
        )}
      </div>
      
      {/* Visible content */}
      {children}
      
      {/* Structured content for SEO */}
      <article className="sr-only">
        <header>
          <h1>SolarPak: Transforming Lives Through Solar Energy in Pakistan</h1>
          <h2>Addressing Pakistan's Electricity Crisis with Sustainable Solutions</h2>
        </header>
        
        <section>
          <h3>Our Mission</h3>
          <p>
            SolarPak is the world's largest youth-led solar nonprofit dedicated to providing sustainable 
            solar energy solutions to Pakistani families facing electricity shortages. Led by passionate 
            young leaders and students, we install solar panels through community donations that provide 
            24/7 clean electricity to homes in need.
          </p>
        </section>
        
        <section>
          <h3>Youth Leadership</h3>
          <p>
            As the world's largest youth-led solar nonprofit, SolarPak is powered by young leaders committed 
            to making a difference. Our student-run organization brings fresh perspectives, innovative approaches, 
            and boundless energy to solving Pakistan's energy crisis through renewable solar solutions.
          </p>
        </section>
        
        <section>
          <h3>Our Impact</h3>
          <p>
            We have successfully installed 23 solar panel systems, empowering 23 families and transforming 
            120 lives across Pakistan. Our installations generate 270 kWh of clean energy and prevent 
            1,900 kg of CO₂ emissions, equivalent to planting 95 trees.
          </p>
        </section>
        
        <section>
          <h3>How Solar Energy Helps Pakistani Families</h3>
          <ul>
            <li>Provides reliable 24/7 electricity during frequent power outages</li>
            <li>Reduces dependency on expensive generators and fuel costs</li>
            <li>Enables children to study and adults to work during evening hours</li>
            <li>Powers essential appliances like fans, lights, and mobile chargers</li>
            <li>Creates opportunities for small businesses and economic growth</li>
            <li>Contributes to environmental sustainability and clean energy adoption</li>
          </ul>
        </section>
        
        <section>
          <h3>Pakistan's Energy Challenge</h3>
          <p>
            Pakistan faces severe electricity shortages with families experiencing 12+ hours of daily 
            blackouts in extreme temperatures reaching 45°C. Rural areas like Khairpur Mirs in Sindh 
            are particularly affected, where reliable grid electricity is often unavailable.
          </p>
        </section>
        
        <section>
          <h3>Sustainable Development Goals</h3>
          <p>
            Our work directly supports UN Sustainable Development Goals including affordable clean energy, 
            poverty reduction, and climate action. Every solar panel installation creates lasting positive 
            impact for Pakistani communities.
          </p>
        </section>
        
        <section>
          <h3>Islamic Values in Giving</h3>
          <p>
            SolarPak embraces Islamic principles of charity (Sadaqah) and community support. We believe 
            in the Prophet Muhammad's (PBUH) teaching that "The believer is not one who eats his fill 
            while his neighbor goes hungry."
          </p>
        </section>
      </article>
    </main>
  );
}

// SEO-optimized FAQ component
export function SEOFAQSection() {
  return (
    <section className="sr-only" itemScope itemType="https://schema.org/FAQPage">
      <h2>Frequently Asked Questions About Solar Energy Donations in Pakistan</h2>
      
      <div itemScope itemType="https://schema.org/Question">
        <h3 itemProp="name">How does donating for solar panels help Pakistani families?</h3>
        <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
          <div itemProp="text">
            Donating for solar panels provides Pakistani families with reliable 24/7 electricity, 
            reducing their dependency on unreliable grid power and expensive generators. This enables 
            children to study, families to run small businesses, and improves overall quality of life.
          </div>
        </div>
      </div>
      
      <div itemScope itemType="https://schema.org/Question">
        <h3 itemProp="name">What is the electricity situation in Pakistan?</h3>
        <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
          <div itemProp="text">
            Pakistan faces severe electricity shortages with many areas experiencing 12+ hours of daily 
            blackouts. Rural regions like Khairpur Mirs in Sindh are particularly affected, with 
            temperatures reaching 45°C during power outages.
          </div>
        </div>
      </div>
      
      <div itemScope itemType="https://schema.org/Question">
        <h3 itemProp="name">How much does it cost to provide solar panels to a Pakistani family?</h3>
        <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
          <div itemProp="text">
            A complete solar panel system for a Pakistani family costs approximately $500. This includes 
            solar panels, battery storage, inverter, and installation. Smaller contributions of $25-$100 
            can provide partial solar solutions or contribute to larger installations.
          </div>
        </div>
      </div>
      
      <div itemScope itemType="https://schema.org/Question">
        <h3 itemProp="name">What impact have your solar installations had in Pakistan?</h3>
        <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
          <div itemProp="text">
            We have successfully installed 23 solar panel systems, empowering 23 families and transforming 
            120 lives. Our installations generate 270 kWh of clean energy and prevent 1,900 kg of CO₂ emissions, 
            contributing to both social and environmental impact.
          </div>
        </div>
      </div>
      
      <div itemScope itemType="https://schema.org/Question">
        <h3 itemProp="name">What is the world's largest youth-led solar nonprofit?</h3>
        <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
          <div itemProp="text">
            SolarPak is the world's largest youth-led solar nonprofit, founded and run by passionate young 
            leaders dedicated to bringing clean energy to Pakistani families. Our student-run organization 
            combines youth innovation with practical solar solutions to address Pakistan's electricity crisis.
          </div>
        </div>
      </div>
      
      <div itemScope itemType="https://schema.org/Question">
        <h3 itemProp="name">Who runs SolarPak?</h3>
        <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
          <div itemProp="text">
            SolarPak is led by young leaders and students committed to renewable energy and social impact. 
            Founded by Ayaan Ahmed in March 2025, our youth-led team includes directors, coordinators, and 
            specialists across events, social media, sponsorships, and healthcare departments.
          </div>
        </div>
      </div>
      
      <div itemScope itemType="https://schema.org/Question">
        <h3 itemProp="name">How is SolarPak different from other solar charities?</h3>
        <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
          <div itemProp="text">
            As the world's largest youth-led solar nonprofit, SolarPak brings fresh, innovative approaches 
            to renewable energy charity. Our student-run model ensures passionate, dedicated leadership while 
            our focus on Pakistan addresses critical energy needs in underserved communities. We combine 
            youth energy with proven solar technology to create lasting impact.
          </div>
        </div>
      </div>
    </section>
  );
}