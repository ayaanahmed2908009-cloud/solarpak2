import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import col1 from "@assets/col3-community.jpg"; // replace with impactdriven.jpeg when ready
import col2 from "@assets/youthleader.jpeg";
import col3 from "@assets/communtiyengagement.jpeg";

const columns = [
  {
    id: "impact",
    label: "IMPACT DRIVEN",
    title: "Real Change,\nReal Lives",
    image: col1,
    summary: "Every panel we install is a promise kept to a family in need.",
    body: "SolarPak was built on a simple belief: sustainable energy should not be a privilege. From day one, every decision we make is measured by the tangible difference it creates — homes powered through blackouts, children able to study at night, families freed from the cost of diesel. Our impact-driven approach means we don't just install solar panels; we track, report, and iterate on every installation to maximise long-term benefit for the communities we serve across Pakistan.",
  },
  {
    id: "youth",
    label: "YOUTH LED",
    title: "Students\nLeading the Way",
    image: col2,
    summary: "Powered by the next generation of changemakers.",
    body: "SolarPak is entirely student-run — founded, managed, and driven forward by high-school students who believe young people don't have to wait to make a difference. Our team spans multiple countries and schools, united by a shared mission to bring clean energy to underserved communities. We handle everything from fundraising and donor relations to on-the-ground logistics, proving that age is no barrier to meaningful impact.",
  },
  {
    id: "community",
    label: "COMMUNITY ENGAGEMENT",
    title: "Engaging\nCommunities",
    image: col3,
    summary: "Bringing people together in Karachi and Riyadh through events and leadership building.",
    body: "SolarPak doesn't just operate in communities — we grow with them. Across Karachi and Riyadh, we host events, workshops, and leadership programmes that bring young people together around a shared mission. From school outreach to community gatherings, we create spaces where the next generation can learn, connect, and take ownership of the clean energy movement. Our goal is to build a culture of action that outlasts any single project.",
  },
];

export default function ProgramsSection() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row">
        {columns.map((col, i) => {
          const isExpanded = expanded === col.id;
          return (
            <div
              key={col.id}
              className="relative overflow-hidden flex flex-col justify-end cursor-pointer group"
              style={{
                minHeight: "85vh",
                flex: isExpanded ? "2 1 0%" : "1 1 0%",
                transition: "flex 0.5s cubic-bezier(0.4,0,0.2,1)",
              }}
              onClick={() => setExpanded(isExpanded ? null : col.id)}
            >
              {/* Background image — no tint */}
              <img
                src={col.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-center"
                style={{ transition: "transform 0.6s ease" }}
              />

              {/* Dark tint matching impact section */}
              <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.62)" }} />
              {/* Extra bottom gradient for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Top label */}
              <div className="absolute top-8 left-8 z-10">
                {i === 0 && (
                  <span className="text-white/60 text-xs font-semibold uppercase tracking-[0.2em] block mb-1">
                    What We Do
                  </span>
                )}
                <span className="text-white/80 text-[10px] font-semibold uppercase tracking-[0.2em]">
                  {col.label}
                </span>
              </div>

              {/* Column number */}
              <div className="absolute top-6 right-8 z-10">
                <span className="text-white/20 font-bold text-6xl leading-none select-none">
                  0{i + 1}
                </span>
              </div>

              {/* Bottom content */}
              <div className="relative z-10 p-8 pb-10">
                <h3 className="text-white font-bold text-3xl md:text-4xl leading-tight mb-3 whitespace-pre-line">
                  {col.title}
                </h3>

                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  {col.summary}
                </p>

                {/* Expandable body */}
                <div
                  className="overflow-hidden transition-all duration-500"
                  style={{ maxHeight: isExpanded ? "300px" : "0px" }}
                >
                  <p className="text-white/80 text-sm leading-relaxed mb-6 pt-1">
                    {col.body}
                  </p>
                </div>

                {/* Toggle button */}
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-white/40 text-white hover:border-white transition-colors duration-200"
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
