import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

const stats = [
  { value: "100%", label: "Student-run" },
  { value: "16", label: "Team members" },
  { value: "7", label: "Departments" },
  { value: "2", label: "Cities" },
];

const departments = [
  { name: "Field Operations", desc: "Works on the ground across Sindh, coordinating solar panel installations, managing logistics, and working directly with families." },
  { name: "Social Media", desc: "Manages SolarPak's digital presence, creating content that tells our story and drives awareness of Pakistan's energy crisis." },
  { name: "Events & Community Outreach", desc: "Organises fundraising events and community engagement initiatives in Karachi and Riyadh, building relationships with local leaders and schools." },
  { name: "Sales & Sponsorships", desc: "Identifies and secures partnerships with businesses, foundations, and sponsors to create sustainable revenue for SolarPak." },
  { name: "Predictive Systems", desc: "Uses data analysis and modelling to forecast energy demand, optimise installation planning, and measure long-term impact." },
  { name: "Impact Labs", desc: "SolarPak's research and publishing arm — collecting field data, writing reports, and producing evidence-based impact analysis." },
  { name: "General Management", desc: "Oversees day-to-day operations, coordinates across all departments, and ensures SolarPak runs smoothly as an organisation." },
];

export default function YouthLeadershipSection() {
  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-14">
            <span className="text-emerald-600 font-medium text-xs uppercase tracking-widest mb-4 block">
              Why We're Different
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
              Youth-Led, Impact-Obsessed,<br className="hidden md:block" /> Built Different
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">
              SolarPak is founded and run entirely by students who refused to wait. From Karachi to Riyadh, we're proving that age is no barrier to real, measurable change.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100 border border-gray-100 rounded-xl overflow-hidden mb-14">
            {stats.map((s) => (
              <div key={s.label} className="bg-white px-8 py-8">
                <div className="text-3xl font-bold text-gray-900 mb-1">{s.value}</div>
                <div className="text-sm text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Departments */}
          <div className="mb-14">
            <div className="flex items-end justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Our Departments</h3>
              <Link href="/opportunities" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                See open roles <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="border-t border-gray-100">
              {departments.map((dept) => (
                <div key={dept.name} className="border-b border-gray-100 py-5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8 group">
                  <div className="sm:w-56 flex-shrink-0">
                    <span className="text-sm font-semibold text-gray-900">{dept.name}</span>
                  </div>
                  <div className="flex-1 flex items-start justify-between gap-4">
                    <p className="text-sm text-gray-500 leading-relaxed">{dept.desc}</p>
                    <Link
                      href="/opportunities"
                      className="flex-shrink-0 text-xs font-medium text-emerald-600 hover:text-emerald-800 flex items-center gap-1 transition-colors mt-0.5"
                    >
                      Learn more <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div className="border border-gray-100 rounded-xl p-10 md:p-12 bg-gray-50">
            <blockquote className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-8 max-w-3xl">
              "We started SolarPak because we were tired of being told to wait until we were older to make a difference. Every panel we install is proof that young people don't just care about the future — we're building it right now."
            </blockquote>
            <div className="flex items-center gap-4">
              <img
                src="/ayaan-ahmed.jpg"
                alt="Ayaan Ahmed"
                className="w-11 h-11 rounded-full object-cover object-top"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">Ayaan Ahmed</p>
                <p className="text-xs text-gray-400">Co-Founder & CEO, SolarPak</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
