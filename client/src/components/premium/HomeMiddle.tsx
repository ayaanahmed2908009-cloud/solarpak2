import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Clip, useReveal } from "./motion";

/* ------------------------------------------------------------------ */
/* The SolarPak Home System — a product page for the kit we install    */
/* ------------------------------------------------------------------ */

const PARTS = [
  {
    name: "c7931",
    title: "Panel",
    body: "Mounted where the sun is strongest, usually a rooftop or courtyard wall.",
    label: "A solar panel installed against a brick wall",
  },
  {
    name: "c9364",
    title: "Battery & controller",
    body: "Stores the day's energy so lights and fans keep running after dark.",
    label: "A SolarPak technician wiring a battery and charge controller",
  },
  {
    name: "c7969",
    title: "Wiring & switchboard",
    body: "Clean, conduit-run wiring and a proper switchboard. Built to be safe and to last.",
    label: "A switchboard being fitted on a brick wall",
  },
  {
    name: "c7973",
    title: "Fans & lights",
    body: "The first things families ask for: a fan for 45°C nights and light to work and study by.",
    label: "A ceiling fan running on solar power",
  },
];

export function SystemSection() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section data-sp id="system" ref={ref} className="sp-section sp-alt" aria-labelledby="system-title">
      <div className="sp-container">
        <div className="text-center mx-auto" style={{ maxWidth: 760 }}>
          <p className="sp-eyebrow sp-reveal">The SolarPak Home System</p>
          <h2 id="system-title" className="sp-headline mt-3 sp-reveal">
            Everything a home needs to run after dark.
          </h2>
          <p className="sp-lede mt-6 sp-reveal">
            A complete kit, sized for each household, installed and wired on site by our field team, and logged to
            the Powered Atlas.
          </p>
        </div>

        <div className="mt-14 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {PARTS.map((part, i) => (
            <article
              key={part.name}
              className="sp-tile sp-reveal flex flex-col"
              style={{ ["--sp-delay" as string]: `${i * 90}ms` }}
            >
              <div className="sp-card" style={{ aspectRatio: "4 / 5", borderRadius: 0 }}>
                <Clip name={part.name} label={part.label} approxWidth={280} />
              </div>
              <div className="p-6 pb-7">
                <h3 className="text-[21px] font-semibold tracking-[-0.02em] text-[#216b23]">{part.title}</h3>
                <p className="sp-body mt-2" style={{ fontSize: 15 }}>
                  {part.body}
                </p>
              </div>
            </article>
          ))}
        </div>

        <p className="sp-small mt-8 text-center sp-reveal">
          Components and capacity vary by household and are specified during each site survey.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Impact in numbers                                                   */
/* ------------------------------------------------------------------ */

type Stat = { value: string; label: string; fn: number };

const STATS: Stat[] = [
  { value: "35", label: "solar installations completed", fn: 1 },
  { value: "500+", label: "people reached directly", fn: 1 },
  { value: "3", label: "villages powered", fn: 2 },
  { value: "1", label: "school powered", fn: 2 },
  { value: "1,900 kg", label: "CO₂ avoided each year", fn: 1 },
  { value: "PKR 12.7L", label: "raised in our first year", fn: 1 },
];

export function ImpactNumbers() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section data-sp id="impact" ref={ref} className="sp-section" aria-labelledby="impact-title">
      <div className="sp-container">
        <div className="max-w-[760px]">
          <p className="sp-eyebrow sp-reveal">Impact</p>
          <h2 id="impact-title" className="sp-headline mt-3 sp-reveal">
            Measured, not estimated.
          </h2>
          <p className="sp-lede mt-6 sp-reveal">
            Every installation is logged and published. These are the numbers from our first year in the field.
          </p>
        </div>

        <dl className="mt-14 md:mt-20 grid grid-cols-2 lg:grid-cols-3 border-t border-[#d5ddd3]">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="sp-reveal py-8 md:py-10 pr-6 border-b border-[#d5ddd3]"
              style={{ ["--sp-delay" as string]: `${(i % 3) * 80}ms` }}
            >
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span
                  className="block font-semibold tracking-[-0.035em] text-[#216b23]"
                  style={{ fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1 }}
                >
                  {s.value}
                  <sup className="sp-fn">
                    <a href={`#fn-${s.fn}`} aria-label={`Footnote ${s.fn}`} className="text-inherit no-underline">
                      {s.fn}
                    </a>
                  </sup>
                </span>
                <span className="block mt-3 text-[17px] text-[#56665a]">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 sp-reveal">
          <Link href="/impact-dashboard" className="sp-link">
            Explore the live Impact Dashboard
          </Link>
          <Link href="/annual-report" className="sp-link">
            Read Annual Report FY1
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* From the field — a rail of tall clips                               */
/* ------------------------------------------------------------------ */

const STORIES = [
  {
    name: "c9342",
    kicker: "Field Operations",
    line: "Our team carries the kit in, lane by lane.",
    label: "SolarPak team walking through a village lane carrying a solar panel",
  },
  {
    name: "c9359",
    kicker: "Installation",
    line: "Wired, tested and handed over on site.",
    label: "A technician in a SolarPak shirt preparing a light fitting",
  },
  {
    name: "c7979",
    kicker: "The people we serve",
    line: "Built around the families who use it every day.",
    label: "Portrait of a woman whose home was powered by SolarPak",
  },
  {
    name: "c7976",
    kicker: "Handover",
    line: "The moment the power comes on.",
    label: "A resident switching on power for the first time",
  },
  {
    name: "c9390",
    kicker: "Impact Labs",
    line: "Field interviews feed the research we publish.",
    label: "Portrait of a man interviewed after his home was powered",
  },
];

export function FieldStories() {
  const ref = useReveal<HTMLDivElement>();
  const rail = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const on = () =>
      setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
    on();
    el.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      el.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 20), behavior: "smooth" });
  };

  return (
    <section ref={ref} className="sp-section sp-alt overflow-hidden" aria-labelledby="field-title">
      <div className="sp-container flex items-end justify-between gap-6">
        <div>
          <p className="sp-eyebrow sp-reveal">From the field</p>
          <h2 id="field-title" className="sp-headline mt-3 sp-reveal">
            Built with the people who use it.
          </h2>
        </div>
      </div>

      <div className="mt-12 md:mt-16 sp-reveal" style={{ ["--sp-delay" as string]: "120ms" }}>
        <div
          ref={rail}
          className="sp-rail"
          style={{
            paddingLeft: "max(var(--sp-gutter), calc((100vw - var(--sp-max)) / 2 + var(--sp-gutter)))",
            scrollPaddingLeft: "max(var(--sp-gutter), calc((100vw - var(--sp-max)) / 2 + var(--sp-gutter)))",
          }}
          aria-label="Field stories"
        >
          {STORIES.map((s) => (
            <figure key={s.name} data-card className="m-0" style={{ width: "min(78vw, 340px)" }}>
              <div className="sp-card" style={{ aspectRatio: "9 / 16" }}>
                <Clip name={s.name} label={s.label} approxWidth={340} />
                <figcaption
                  className="absolute inset-x-0 top-0 p-6"
                  style={{ background: "linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,0))" }}
                >
                  <p className="text-[12px] font-semibold text-[#fcb41f]">{s.kicker}</p>
                  <p className="mt-1 text-[21px] leading-[1.2] font-semibold tracking-[-0.02em] text-white">{s.line}</p>
                </figcaption>
              </div>
            </figure>
          ))}
          <div aria-hidden style={{ width: 1 }} />
        </div>

        <div className="sp-container mt-6 flex justify-end gap-3">
          <button type="button" className="sp-round-btn" aria-label="Previous" disabled={edge.start} onClick={() => step(-1)}>
            <svg width="10" height="16" viewBox="0 0 10 16" aria-hidden>
              <path d="M8 2 2 8l6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" className="sp-round-btn" aria-label="Next" disabled={edge.end} onClick={() => step(1)}>
            <svg width="10" height="16" viewBox="0 0 10 16" aria-hidden>
              <path d="m2 2 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
