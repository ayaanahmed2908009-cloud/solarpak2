import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Accent, Clip, Dot, useReveal, useViewportProgress } from "./motion";

/* ------------------------------------------------------------------ */
/* The SolarPak Home System — a product page for the kit we install    */
/* ------------------------------------------------------------------ */

const PARTS = [
  {
    name: "c7931",
    step: "Capture",
    title: "Panel",
    body: "Mounted where the sun is strongest, usually a rooftop or a courtyard wall, and angled to catch the day's light.",
    label: "A solar panel installed against a brick wall",
  },
  {
    name: "c7671",
    step: "Store",
    title: "Battery & controller",
    body: "The controller manages charging. The battery holds the day's energy so the home keeps running after dark.",
    label: "A battery and charge controller mounted on a wall bracket",
  },
  {
    name: "c7969",
    step: "Distribute",
    title: "Wiring & switchboard",
    body: "Clean, conduit-run wiring and a proper switchboard. Built to be safe and to last.",
    label: "A switchboard being fitted on a brick wall",
  },
  {
    name: "c7973",
    step: "Use",
    title: "Fans & lights",
    body: "The first things families ask for: a fan through the hottest nights, and light to work and study by.",
    label: "A ceiling fan running on solar power",
  },
];

/** Index of the step whose block sits across the middle of the viewport. */
function useActiveStep(count: number) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    refs.current.slice(0, count).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [count]);
  return { refs, active };
}

export function SystemSection() {
  const ref = useReveal<HTMLDivElement>();
  const { refs, active } = useActiveStep(PARTS.length);
  const rail = useRef<HTMLDivElement>(null);
  const flow = useViewportProgress(rail);
  // Energy line fill: tracks the steps as they pass the middle of the screen.
  const fill = Math.min(1, Math.max(0, (flow - 0.22) / 0.56));

  return (
    <section data-sp id="system" ref={ref} className="sp-section sp-alt" aria-labelledby="system-title">
      <div className="sp-container">
        <div className="text-center mx-auto" style={{ maxWidth: 760 }}>
          <p className="sp-eyebrow sp-reveal">The SolarPak Home System</p>
          <h2 id="system-title" className="sp-headline mt-3 sp-reveal">
            Everything a home needs to run <Accent>after dark</Accent>
            <Dot />
          </h2>
          <p className="sp-lede mt-6 sp-reveal">
            One connected system, from the sun on the roof to the fan on the ceiling. Installed and wired on site by
            our field team, and logged to the Powered Atlas.
          </p>
        </div>

        {/* Desktop: one large clip stays in view while the four steps scroll past */}
        <div className="hidden md:grid mt-20 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-16 lg:gap-24">
          <div className="relative">
            <div className="sticky" style={{ top: "calc(50vh - min(36vh, 340px))" }}>
              <div className="sp-card mx-auto" style={{ height: "min(72vh, 680px)", aspectRatio: "9 / 16" }}>
                {PARTS.map((part, i) => (
                  <div
                    key={part.name}
                    className="absolute inset-0"
                    style={{ opacity: active === i ? 1 : 0, transition: "opacity .7s cubic-bezier(.28,.11,.32,1)" }}
                    aria-hidden={active !== i}
                  >
                    <Clip name={part.name} label={part.label} approxWidth={380} paused={active !== i} />
                  </div>
                ))}
                <div
                  className="absolute left-5 bottom-5 rounded-full px-3 py-1.5 text-[12px] font-semibold"
                  style={{ background: "rgba(0,0,0,.45)", color: "#fff", backdropFilter: "blur(10px)" }}
                >
                  {String(active + 1).padStart(2, "0")} · {PARTS[active].step}
                </div>
              </div>
            </div>
          </div>

          <div ref={rail} className="relative">
            {/* Energy line */}
            <div aria-hidden className="absolute left-[11px] top-[24vh] bottom-[24vh] w-[2px] bg-[#d2d2d7] rounded-full">
              <div
                className="absolute inset-x-0 top-0 rounded-full"
                style={{
                  height: `${fill * 100}%`,
                  background: "linear-gradient(180deg, #ffe08a, #fcb41f)",
                  boxShadow: "0 0 12px rgba(252,180,31,.6)",
                }}
              />
            </div>
            {PARTS.map((part, i) => (
              <article
                key={part.name}
                ref={(el) => (refs.current[i] = el)}
                data-step={i}
                className="relative flex items-center pl-14"
                style={{ minHeight: "48vh" }}
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 flex items-center justify-center"
                  style={{
                    borderColor: i <= active ? "#fcb41f" : "#d2d2d7",
                    background: i <= active ? "#fcb41f" : "#f5f5f7",
                    transition: "background-color .4s, border-color .4s",
                  }}
                />
                <div style={{ opacity: active === i ? 1 : 0.35, transition: "opacity .5s" }}>
                  <p className="text-[14px] font-semibold text-[#216b23]">
                    {String(i + 1).padStart(2, "0")} · {part.step}
                  </p>
                  <h3 className="sp-title mt-2">{part.title}</h3>
                  <p className="sp-body mt-3" style={{ maxWidth: 420 }}>
                    {part.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Phones: the same four steps, stacked, joined by the energy line */}
        <ol className="md:hidden mt-12 relative">
          <span aria-hidden className="absolute left-[11px] top-3 bottom-3 w-[2px] rounded-full" style={{ background: "linear-gradient(180deg, #fcb41f, #d2d2d7)" }} />
          {PARTS.map((part, i) => (
            <li key={part.name} className="relative pl-12 pb-12 last:pb-0 sp-reveal">
              <span aria-hidden className="absolute left-0 top-1 w-6 h-6 rounded-full" style={{ background: "#fcb41f" }} />
              <p className="text-[14px] font-semibold text-[#216b23]">
                {String(i + 1).padStart(2, "0")} · {part.step}
              </p>
              <h3 className="sp-title mt-1">{part.title}</h3>
              <p className="sp-body mt-2">{part.body}</p>
              <div className="sp-card mt-5" style={{ aspectRatio: "4 / 5" }}>
                <Clip name={part.name} label={part.label} approxWidth={340} />
              </div>
            </li>
          ))}
        </ol>

        <p className="sp-small mt-12 text-center sp-reveal">Components and capacity vary by household.</p>
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
            Measured, <Accent>not estimated</Accent>
            <Dot />
          </h2>
          <p className="sp-lede mt-6 sp-reveal">
            Every installation is logged and published. These are the numbers from our first year in the field.
          </p>
        </div>

        <dl className="mt-14 md:mt-20 grid grid-cols-2 lg:grid-cols-3 border-t border-[#d2d2d7]">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="sp-reveal py-8 md:py-10 pr-6 border-b border-[#d2d2d7]"
              style={{ ["--sp-delay" as string]: `${(i % 3) * 80}ms` }}
            >
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span
                  className="block font-semibold tracking-[-0.035em] text-[#0f1f11]"
                  style={{ fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1 }}
                >
                  {s.value}
                  <sup className="sp-fn">
                    <a href={`#fn-${s.fn}`} aria-label={`Footnote ${s.fn}`} className="text-inherit no-underline">
                      {s.fn}
                    </a>
                  </sup>
                </span>
                <span className="block mt-3 text-[17px] text-[#6e6e73]">{s.label}</span>
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
    name: "c9359",
    kicker: "Field Operations",
    line: "Every fitting prepared on site, room by room.",
    label: "A technician in a SolarPak shirt preparing a light fitting",
  },
  {
    name: "c9364",
    kicker: "Installation",
    line: "Wired, tested and handed over on site.",
    label: "A SolarPak technician wiring the battery and controller",
  },
  {
    name: "c7979",
    kicker: "The people we serve",
    line: "Built around the families who use it every day.",
    label: "Portrait of a woman whose home was powered by SolarPak",
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
            Built with the people <Accent>who use it</Accent>
            <Dot />
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
