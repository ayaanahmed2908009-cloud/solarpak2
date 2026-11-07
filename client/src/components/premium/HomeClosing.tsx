import { useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import type { ImpactLabsArticle } from "@shared/schema";
import { SSEP_POLICY_ANALYSIS_SLUG } from "@/data/ssepPolicyAnalysis";
import { prefersReducedMotion, seg, useReveal, useScrollProgress } from "./motion";
import { DONATE_URL } from "./HomeOpening";

/* ------------------------------------------------------------------ */
/* The reveal: who built all of this                                   */
/* ------------------------------------------------------------------ */

const REVEAL_LEAD = "Every system on this page was planned, funded and delivered by one organisation.";
const REVEAL_PAYOFF = "Run entirely by people under 18.";

export function TeamReveal() {
  const track = useRef<HTMLDivElement>(null);
  const p = useScrollProgress(track);
  const reduced = useMemo(() => !!prefersReducedMotion(), []);
  const words = REVEAL_LEAD.split(" ");

  return (
    <section data-sp id="team" className="sp-dark" aria-label="Who we are">
      <div ref={track} style={{ height: reduced ? "auto" : "220vh" }}>
        <div className={reduced ? "py-32" : "sticky top-0 h-screen flex items-center"}>
          <div className="sp-container">
            <p className="sp-headline" style={{ maxWidth: 980 }}>
              {words.map((w, i) => {
                const on = reduced ? 1 : seg(p, 0.05 + (i / words.length) * 0.5, 0.1 + (i / words.length) * 0.5);
                return (
                  <span key={i} style={{ color: `rgba(245,245,247,${0.18 + on * 0.82})`, transition: "color .2s linear" }}>
                    {w}{" "}
                  </span>
                );
              })}
            </p>
            <p
              className="sp-headline mt-6"
              style={{
                opacity: reduced ? 1 : seg(p, 0.62, 0.78),
                transform: `translateY(${reduced ? 0 : (1 - seg(p, 0.62, 0.78)) * 24}px)`,
              }}
            >
              <span className="sp-sun-text">{REVEAL_PAYOFF}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How we're organised                                                 */
/* ------------------------------------------------------------------ */

const TEAM_STATS = [
  { value: "24", label: "team members" },
  { value: "7", label: "departments" },
  { value: "2", label: "cities: Karachi and Riyadh" },
  { value: "100%", label: "student-run" },
];

const DEPARTMENTS = [
  { name: "Field Operations", desc: "Coordinates installations across Sindh, manages logistics and works directly with families." },
  { name: "Impact Labs", desc: "Our research and publishing arm. Collects field data and produces evidence-based analysis." },
  { name: "Predictive Systems", desc: "Models energy demand to plan installations and measure long-term impact." },
  { name: "Sales & Sponsorships", desc: "Builds partnerships with businesses, foundations and sponsors." },
  { name: "Events & Community Outreach", desc: "Runs fundraising and community programmes in Karachi and Riyadh." },
  { name: "Social Media", desc: "Tells SolarPak's story and builds awareness of Pakistan's energy gap." },
  { name: "General Management", desc: "Coordinates every department and keeps the organisation running." },
];

export function Organisation() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section ref={ref} className="sp-section sp-dark" style={{ paddingTop: 0 }} aria-labelledby="org-title">
      <div className="sp-container">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 sp-reveal">
          {TEAM_STATS.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block text-[48px] md:text-[56px] leading-none font-semibold tracking-[-0.035em] text-white">
                  {s.value}
                </span>
                <span className="block mt-2 text-[15px] text-[#a1a1a6]">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-24 md:mt-32 grid md:grid-cols-[1fr_1.6fr] gap-10 md:gap-16">
          <div>
            <h2 id="org-title" className="sp-title sp-reveal">
              Organised like the institution we're becoming.
            </h2>
            <div className="mt-6 sp-reveal">
              <Link href="/opportunities" className="sp-link">
                See open roles
              </Link>
            </div>
          </div>
          <ul className="border-t border-white/15">
            {DEPARTMENTS.map((d, i) => (
              <li
                key={d.name}
                className="sp-reveal py-5 border-b border-white/15 grid sm:grid-cols-[220px_1fr] gap-1 sm:gap-6"
                style={{ ["--sp-delay" as string]: `${i * 50}ms` }}
              >
                <span className="text-[17px] font-semibold text-white">{d.name}</span>
                <span className="text-[15px] leading-[1.5] text-[#a1a1a6]">{d.desc}</span>
              </li>
            ))}
          </ul>
        </div>

        <figure className="mt-24 md:mt-32 grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center sp-reveal">
          <img
            src="/ayaan-ahmed.jpg"
            alt="Ayaan Ahmed, Co-Founder and CEO of SolarPak"
            className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover object-top"
            style={{ filter: "grayscale(1) contrast(1.05)" }}
            loading="lazy"
          />
          <div>
            <blockquote className="text-[24px] md:text-[32px] leading-[1.25] font-semibold tracking-[-0.022em] text-white">
              “We started SolarPak because we were tired of being told to wait until we were older to make a
              difference. Every panel we install is proof that young people don't just care about the future. We're
              building it right now.”
            </blockquote>
            <figcaption className="mt-5 text-[15px] text-[#a1a1a6]">Ayaan Ahmed, Co-Founder & CEO</figcaption>
          </div>
        </figure>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Research                                                            */
/* ------------------------------------------------------------------ */

type Paper = { href: string; kind: string; title: string; meta: string; external?: boolean };

export function Research() {
  const ref = useReveal<HTMLDivElement>();
  const { data: articles } = useQuery<ImpactLabsArticle[]>({
    queryKey: ["/api/impact-labs/articles"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const papers: Paper[] = [
    {
      href: `/impact-labs/${SSEP_POLICY_ANALYSIS_SLUG}`,
      kind: "Policy analysis",
      title: "The Sindh Solar Energy Project: Implementation Review & Policy Assessment",
      meta: "Impact Labs",
    },
    {
      href: "/annual-report",
      kind: "Annual report",
      title: "SolarPak Annual Report, FY1",
      meta: "April 2025 – May 2026",
    },
    ...(articles ?? [])
      .filter((a) => a.slug !== SSEP_POLICY_ANALYSIS_SLUG)
      .slice(0, 1)
      .map((a) => ({
        href: `/impact-labs/${a.slug}`,
        kind: "Field report",
        title: a.title,
        meta: "Impact Labs",
      })),
  ];

  return (
    <section ref={ref} className="sp-section" aria-labelledby="research-title">
      <div className="sp-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div style={{ maxWidth: 680 }}>
            <p className="sp-eyebrow sp-reveal">Impact Labs</p>
            <h2 id="research-title" className="sp-headline mt-3 sp-reveal">
              We publish what we learn.
            </h2>
            <p className="sp-lede mt-6 sp-reveal">
              Field data, policy analysis and annual reporting, open for anyone to read and check.
            </p>
            <p className="sp-small mt-4 sp-reveal" style={{ fontSize: 14 }}>
              Research guided by faculty at LUMS and Carnegie Mellon University.
            </p>
          </div>
          <Link href="/impact-labs" className="sp-link sp-reveal">
            All research
          </Link>
        </div>

        <div className={`mt-14 grid gap-4 lg:gap-5 ${papers.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {papers.map((p, i) => (
            <Link
              key={p.href}
              href={p.href}
              className="sp-tile sp-reveal group block p-8 md:p-10 no-underline"
              style={{ background: "#f5f5f7", minHeight: 280, ["--sp-delay" as string]: `${i * 90}ms` }}
            >
              <div className="flex h-full flex-col">
                <p className="text-[12px] font-semibold text-[#b45309]">{p.kind}</p>
                <h3 className="mt-3 text-[24px] leading-[1.18] font-semibold tracking-[-0.022em] text-[#1d1d1f]">
                  {p.title}
                </h3>
                <p className="mt-auto pt-8 text-[14px] text-[#6e6e73] flex items-center justify-between">
                  <span>{p.meta}</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                    →
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Fund a system                                                       */
/* ------------------------------------------------------------------ */

export function Fund() {
  const ref = useReveal<HTMLDivElement>();
  const ways = [
    {
      title: "Give once",
      body: "Fund lights, fans and storage for a family. Funds raised are reported in our annual report.",
      cta: "Donate",
      href: DONATE_URL,
      external: true,
      primary: true,
    },
    {
      title: "Give monthly",
      body: "Become a member and receive regular updates from the field as installations go in.",
      cta: "Become a member",
      href: "/membership",
    },
    {
      title: "Partner with us",
      body: "Sponsor a village, a school or a whole deployment. We'll report back on the systems you fund.",
      cta: "Get in touch",
      href: "mailto:solarpakorg@gmail.com?subject=Partnering%20with%20SolarPak",
      external: true,
    },
  ];

  return (
    <section data-sp id="fund" ref={ref} className="sp-section sp-alt" aria-labelledby="fund-title">
      <div className="sp-container">
        <div className="text-center mx-auto" style={{ maxWidth: 720 }}>
          <h2 id="fund-title" className="sp-headline sp-reveal">
            Fund a system.
          </h2>
          <p className="sp-lede mt-6 sp-reveal">Choose how you'd like to power the next home.</p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-4 lg:gap-5">
          {ways.map((w, i) => (
            <div
              key={w.title}
              className="sp-tile sp-reveal p-8 md:p-10 flex flex-col"
              style={{ ["--sp-delay" as string]: `${i * 90}ms` }}
            >
              <h3 className="text-[28px] font-semibold tracking-[-0.024em] text-[#1d1d1f]">{w.title}</h3>
              <p className="sp-body mt-3 flex-1">{w.body}</p>
              <div className="mt-8">
                {w.external ? (
                  <a
                    href={w.href}
                    className={w.primary ? "sp-btn" : "sp-link"}
                    {...(w.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {w.cta}
                  </a>
                ) : (
                  <Link href={w.href} className="sp-link">
                    {w.cta}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <Newsletter />
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setState("error");
      return;
    }
    setState("sending");
    try {
      await apiRequest("POST", "/api/subscribe", { email });
      setState("done");
      setEmail("");
    } catch {
      setState("error");
    }
  };

  return (
    <form onSubmit={submit} className="mt-20 mx-auto text-center" style={{ maxWidth: 520 }} noValidate>
      <h3 className="text-[21px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">Get updates from the field.</h3>
      <p className="sp-body mt-2" style={{ fontSize: 15 }}>
        New installations, research and reports.
      </p>
      <div className="mt-5 flex items-center gap-2 rounded-full bg-white p-1.5 pl-5 border border-[#d2d2d7] focus-within:border-[#86868b]">
        <label htmlFor="sp-email" className="sr-only">
          Email address
        </label>
        <input
          id="sp-email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== "sending") setState("idle");
          }}
          placeholder="Email address"
          className="flex-1 min-w-0 bg-transparent text-[17px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none"
          style={{ outline: "none" }}
        />
        <button type="submit" className="sp-btn" style={{ minHeight: 40 }} disabled={state === "sending"}>
          {state === "sending" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      <p className="mt-3 text-[13px] min-h-[1.5em]" aria-live="polite" style={{ color: state === "error" ? "#b42318" : "#6e6e73" }}>
        {state === "done" && "Thanks. You're on the list."}
        {state === "error" && "Please enter a valid email address and try again."}
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Footnotes                                                           */
/* ------------------------------------------------------------------ */

export function HomeFootnotes() {
  return (
    <ol className="list-none space-y-2">
      <li id="fn-1">
        1. Figures from the SolarPak Annual Report FY1, covering April 2025 to May 2026. CO₂ avoided is an annual
        estimate.
      </li>
      <li id="fn-2">2. From SolarPak field records, as published on the Impact Dashboard.</li>
    </ol>
  );
}
