import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ArrowRight, Mail } from "lucide-react";

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const upcomingEvents = [
  {
    id: 1,
    title: "The Light Gala 2026",
    date: "August 2026",
    location: "New York, NY",
    description:
      "An intimate evening uniting New York's philanthropic community around clean energy access. Keynotes, curated dinners, and live impact updates from Pakistan.",
    status: "upcoming" as const,
    ctaLabel: "Join the Announcement List",
    ctaHref: "#subscribe",
  },
  {
    id: 2,
    title: "SolarPak Summit — Chicago",
    date: "Fall 2026",
    location: "Chicago, IL",
    description:
      "A half-day policy and innovation forum bringing together diaspora leaders, climate advocates, and youth changemakers to shape SolarPak's next chapter.",
    status: "upcoming" as const,
    ctaLabel: "Join the Announcement List",
    ctaHref: "#subscribe",
  },
  {
    id: 3,
    title: "More events coming soon.",
    date: "",
    location: "",
    description:
      "We're building our 2026 calendar. Join the announcement list to be first to know when new events are confirmed.",
    status: "placeholder" as const,
    ctaLabel: "Get Notified",
    ctaHref: "#subscribe",
  },
];

const pastEvents = [
  {
    id: 1,
    title: "The Light Gala 2025",
    stats: "120 guests · Raised $12,400 · Powered 4 family installations",
  },
  {
    id: 2,
    title: "Diaspora Leadership Night 2025",
    stats: "Placeholder — SolarPak team to fill in details",
  },
  {
    id: 3,
    title: "SolarPak x University Tour 2024",
    stats: "Placeholder — SolarPak team to fill in details",
  },
];

const pillars = [
  {
    label: "Alignment",
    body: "Every event is built around SolarPak's core mission. We don't host events for the sake of hosting — each gathering is a deliberate extension of our work powering Pakistan with clean energy.",
  },
  {
    label: "Youth Empowerment",
    body: "As the world's largest youth-led solar nonprofit, our events are designed, run, and led by young people. Every gala, panel, and networking night is a platform for the next generation of changemakers to step into leadership.",
  },
  {
    label: "Impact",
    body: "Events are not promotion — they are a funding engine. Every dollar raised translates directly into solar installations, lit homes, and powered classrooms. We measure success in rooftops, not RSVPs.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function EventCard({
  event,
  index,
}: {
  event: (typeof upcomingEvents)[number];
  index: number;
}) {
  const { ref, visible } = useReveal();
  const [, setLocation] = useLocation();

  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${index * 90}ms`,
      }}
    >
      {event.status === "placeholder" ? (
        <div className="h-full rounded-xl border border-dashed border-gray-200 bg-gray-50 flex flex-col items-start justify-between p-8 min-h-[280px]">
          <div>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-3">
              More Events
            </p>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </div>
          <a
            href={event.ctaHref}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors group"
          >
            {event.ctaLabel}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      ) : (
        <div className="h-full rounded-xl bg-white border border-gray-100 hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-500 hover:-translate-y-1 overflow-hidden flex flex-col">
          {/* Subtle image placeholder — team replaces with real event photos */}
          <div className="h-48 bg-gradient-to-br from-slate-800 via-slate-700 to-emerald-900 flex items-end p-5">
            <span className="text-xs font-medium text-white/70 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full uppercase tracking-wide">
              {event.date}
            </span>
          </div>
          <div className="p-6 flex flex-col flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-1 leading-snug">
              {event.title}
            </h3>
            {event.location && (
              <span className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                <MapPin className="w-3 h-3" />
                {event.location}
              </span>
            )}
            <p className="text-gray-500 text-sm leading-relaxed flex-1">
              {event.description}
            </p>
            <a
              href={event.ctaHref}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors group"
            >
              {event.ctaLabel}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function PillarItem({
  pillar,
  index,
}: {
  pillar: (typeof pillars)[number];
  index: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div className="border-t border-gray-200 pt-8">
        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-3">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="text-lg font-bold text-gray-900 mb-3 tracking-tight">
          {pillar.label}
        </h3>
        <p className="text-gray-600 leading-relaxed text-sm">{pillar.body}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Events() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const beyondRef = useReveal();
  const pillarsRef = useReveal(0.08);
  const pastRef = useReveal(0.08);
  const hostRef = useReveal(0.1);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSubscribed(true);
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── 1. Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 overflow-hidden pt-20">
        {/* Ambient light blobs — very subtle */}
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-gradient-to-r from-green-500/8 to-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-teal-500/6 to-cyan-500/6 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 py-28 md:py-36 relative z-10">
          <div className="max-w-3xl">
            {/* Sub-brand label */}
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-6">
              SolarPak Events
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-6">
              Premium experiences.{" "}
              <span className="text-emerald-400">Powerful impact.</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              Every ticket, every table, every sponsorship powers another
              rooftop in Pakistan.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#upcoming"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-7 py-3 rounded-md text-sm uppercase tracking-wide transition-colors duration-200"
              >
                Explore Upcoming Events
              </a>
              <a
                href="#host"
                className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 text-white font-semibold px-7 py-3 rounded-md text-sm uppercase tracking-wide transition-colors duration-200"
              >
                Partner With Us
              </a>
            </div>
          </div>
        </div>

        {/* Bottom fade into white */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/5 to-transparent" />
      </section>

      {/* ── 2. Beyond Donations ──────────────────────────────────────────────── */}
      <section className="section-container bg-white">
        <div
          ref={beyondRef.ref}
          className="container mx-auto px-6 transition-all duration-700"
          style={{
            opacity: beyondRef.visible ? 1 : 0,
            transform: beyondRef.visible ? "translateY(0)" : "translateY(28px)",
          }}
        >
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-start max-w-5xl mx-auto">
            <div>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-4">
                About SolarPak Events
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-6 leading-tight">
                Beyond Donations
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  SolarPak Events is the experiential arm of the world's largest
                  youth-led solar nonprofit. We host curated gatherings —
                  galas, panels, networking nights, and signature experiences —
                  that bring together changemakers, business leaders, and the
                  global Pakistani diaspora around a shared mission.
                </p>
                <p>
                  Sustainable impact requires sustainable funding. By
                  diversifying our revenue beyond individual donations, SolarPak
                  ensures that every family on our waitlist gets powered — not
                  just the ones we can fund this quarter.
                </p>
              </div>
            </div>
            <div className="md:pt-12">
              <div className="border-l-4 border-emerald-700 pl-8 py-2">
                <blockquote className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
                  "100% of net proceeds fund solar installations across
                  Pakistan."
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    SolarPak Events
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Three Pillars ─────────────────────────────────────────────────── */}
      <section className="section-container bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div
            ref={pillarsRef.ref}
            className="transition-all duration-700 max-w-5xl mx-auto"
            style={{
              opacity: pillarsRef.visible ? 1 : 0,
              transform: pillarsRef.visible
                ? "translateY(0)"
                : "translateY(20px)",
            }}
          >
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-10 text-center">
              What We Stand For
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {pillars.map((p, i) => (
              <PillarItem key={p.label} pillar={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Upcoming Events ───────────────────────────────────────────────── */}
      <section id="upcoming" className="section-container bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-3">
              On the Calendar
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-12">
              Upcoming Events
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {upcomingEvents.map((ev, i) => (
                <EventCard key={ev.id} event={ev} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Past Events ───────────────────────────────────────────────────── */}
      <section className="section-container bg-slate-900">
        <div className="container mx-auto px-6">
          <div
            ref={pastRef.ref}
            className="max-w-5xl mx-auto transition-all duration-700"
            style={{
              opacity: pastRef.visible ? 1 : 0,
              transform: pastRef.visible ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">
              Track Record
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-12">
              Past Events
            </h2>
            {/* Photo strip */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {pastEvents.map((ev, i) => (
                <div
                  key={ev.id}
                  className="transition-all duration-700"
                  style={{
                    opacity: pastRef.visible ? 1 : 0,
                    transitionDelay: `${i * 80}ms`,
                  }}
                >
                  {/* Image placeholder — team replaces with real photos */}
                  <div className="h-48 bg-gradient-to-br from-slate-700 via-slate-600 to-emerald-800 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-white/20 text-xs uppercase tracking-widest">
                      Photo
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    {ev.title}
                  </h4>
                  <p className="text-xs text-white/50 leading-relaxed">
                    {ev.stats}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-white/30 italic">
              Numbers sourced by SolarPak team — placeholder data shown above.
            </p>
          </div>
        </div>
      </section>

      {/* ── 6. Host an Event ─────────────────────────────────────────────────── */}
      <section id="host" className="section-container bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div
            ref={hostRef.ref}
            className="max-w-3xl mx-auto transition-all duration-700"
            style={{
              opacity: hostRef.visible ? 1 : 0,
              transform: hostRef.visible ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-4">
              Partnerships
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-5 leading-tight">
              Host an Event With Us
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Have a venue, a network, or an idea?
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              SolarPak Events partners with hosts, brands, and community leaders
              to co-create experiences that raise meaningful funds for clean
              energy access.
            </p>
            <a
              href="mailto:events@solarpak.org"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-7 py-3 rounded-md text-sm uppercase tracking-wide transition-colors duration-200"
            >
              <Mail className="w-4 h-4" />
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* ── 7. Footer CTA / Subscribe ────────────────────────────────────────── */}
      <section id="subscribe" className="py-20 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <p className="text-gray-500 text-sm italic mb-8 leading-relaxed">
            Every event is a rooftop. Every guest is a household. Every sponsor
            is a generation lit.
          </p>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6">
            Stay in the loop
          </h3>
          {subscribed ? (
            <p className="text-emerald-700 font-semibold text-sm">
              You're on the list. We'll be in touch.
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border border-gray-200 rounded-md px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition"
              />
              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-2.5 rounded-md text-sm uppercase tracking-wide transition-colors duration-200 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
