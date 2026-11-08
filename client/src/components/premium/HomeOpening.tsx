import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { Accent, Clip, Dot, POSTER, prefersReducedMotion, seg, useReveal, useScrollProgress, useViewportProgress } from "./motion";
import { PK_PATH, PK_VIEWBOX, projectLngLat } from "./pakistanGeo";
import { SSEP_POLICY_ANALYSIS_SLUG } from "@/data/ssepPolicyAnalysis";

export const DONATE_URL = "https://ko-fi.com/solarpak";

/* ------------------------------------------------------------------ */
/* Ribbon                                                              */
/* ------------------------------------------------------------------ */

export function Ribbon() {
  return (
    <div className="text-center px-6 py-3 text-[14px] leading-[1.45]" style={{ background: "#f5f5f7" }}>
      <span className="text-[#6e6e73]">New from Impact Labs: a policy review of the Sindh Solar Energy Project.</span>{" "}
      <Link href={`/impact-labs/${SSEP_POLICY_ANALYSIS_SLUG}`} className="sp-link" style={{ fontSize: 14 }}>
        Read the analysis
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const TRIPTYCH = [
  { name: "c9342", label: "SolarPak field team carrying a solar panel through a village lane in Sindh" },
  { name: "c7976", label: "A resident switching on power from a newly installed switchboard" },
  { name: "c7683", label: "A father and daughter looking up at their new ceiling fan, running on solar power" },
];

export function Hero() {
  const ref = useReveal<HTMLDivElement>();
  const wrap = useRef<HTMLDivElement>(null);
  const p = useViewportProgress(wrap);
  // Centre clip rises, outer clips settle: a gentle depth cue, zero at rest.
  const lift = prefersReducedMotion() ? 0 : Math.max(0, p - 0.35);
  // Desktop and phone layouts both mount; only the visible one loads eagerly.
  const wide = typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

  return (
    <section ref={ref} className="relative sp-hero" aria-labelledby="hero-title">
      <div className="sp-container text-center relative" style={{ paddingTop: "clamp(48px, 7vw, 96px)" }}>
        <h1
          id="hero-title"
          className="sp-hero-title sp-reveal"
          style={{ color: "var(--sp-ink-strong)", ["--sp-delay" as string]: "80ms" }}
        >
          Power, where
          <br />
          <Accent>the grid ends</Accent>
          <Dot />
        </h1>
        <p
          className="sp-lede mx-auto mt-6 sp-reveal"
          style={{ maxWidth: 640, color: "#6e6e73", ["--sp-delay" as string]: "160ms" }}
        >
          We design, fund and install solar energy systems for homes and schools across rural Sindh, and publish the
          data on every one.
        </p>
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sp-reveal"
          style={{ ["--sp-delay" as string]: "240ms" }}
        >
          <a href={DONATE_URL} target="_blank" rel="noopener noreferrer" className="sp-btn sp-btn-green">
            Fund a system
          </a>
          <a href="#work" className="sp-link">
            See the work
          </a>
        </div>
      </div>

      {/* Triptych: three vertical field clips that read as one wide frame */}
      <div ref={wrap} className="mt-14 md:mt-20 pb-16 md:pb-24">
        <div className="sp-container hidden md:block">
          <div className="grid grid-cols-3 gap-4 lg:gap-5 sp-reveal" style={{ ["--sp-delay" as string]: "320ms" }}>
            {TRIPTYCH.map((c, i) => (
              <div
                key={c.name}
                className="sp-card"
                style={{
                  aspectRatio: "9 / 16",
                  transform: `translate3d(0, ${(i === 1 ? -1 : 0.5) * lift * 60}px, 0)`,
                  willChange: "transform",
                }}
              >
                <Clip name={c.name} eager={wide} approxWidth={360} label={c.label} />
              </div>
            ))}
          </div>
        </div>

        {/* Phones: one swipeable rail; the first clip fills the screen naturally */}
        <div className="md:hidden sp-rail sp-reveal" style={{ ["--sp-delay" as string]: "320ms" }}>
          {TRIPTYCH.map((c, i) => (
            <div key={c.name} className="sp-card" style={{ width: "78vw", maxWidth: 360, aspectRatio: "9 / 16" }}>
              <Clip name={c.name} eager={!wide && i === 0} label={c.label} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Night → light: the bulb clip grows and brightens as you scroll      */
/* ------------------------------------------------------------------ */

export function NightToLight() {
  const track = useRef<HTMLDivElement>(null);
  const p = useScrollProgress(track);
  const reduced = useMemo(() => !!prefersReducedMotion(), []);

  // The light switches on at the midpoint (with a short flicker, see CSS),
  // rather than fading up, so the scroll has a single clear moment.
  const on = reduced || p >= 0.5;
  const intro = reduced ? 1 : seg(p, 0, 0.12);

  // An evening passing: 6:30 PM → 7:12 PM across the scroll.
  const minutes = 18 * 60 + 30 + Math.round((reduced ? 0.6 : p) * 42);
  const hh = Math.floor(minutes / 60) % 12 || 12;
  const mm = String(minutes % 60).padStart(2, "0");

  return (
    <section className="sp-dark relative" aria-label="Night to light">
      <div ref={track} style={{ height: reduced ? "auto" : "200vh" }}>
        <div className={reduced ? "py-24" : "sticky top-0 h-screen overflow-hidden"}>
          {/* Warm light spilling across the page once the bulb is on */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(55% 65% at var(--sp-glow-x, 75%) 52%, rgba(252,180,31,0.22), rgba(252,180,31,0.06) 45%, rgba(0,0,0,0) 75%)",
              opacity: on ? 1 : 0,
              transition: "opacity 1.4s cubic-bezier(.28,.11,.32,1)",
            }}
          />

          <div className="sp-container relative h-full grid md:grid-cols-2 content-center md:items-center gap-6 md:gap-16 py-6 md:py-0">
            {/* Words */}
            <div className="order-1 text-center md:text-left">
              <p className="text-[13px] font-semibold tracking-[0.02em] text-[#a1a1a6]">Khairpur Mirs, Sindh</p>
              <p
                className="mt-1 font-semibold tracking-[-0.03em] tabular-nums"
                style={{
                  fontSize: "clamp(40px, 6vw, 80px)",
                  lineHeight: 1,
                  color: on ? "var(--sp-yellow)" : "#f5f5f7",
                  transition: "color .6s",
                }}
                aria-hidden
              >
                {hh}:{mm} <span style={{ fontSize: "0.4em", letterSpacing: 0 }}>PM</span>
              </p>

              <div className="relative mt-4 md:mt-10" style={{ minHeight: "clamp(96px, 16vw, 210px)" }}>
                <p
                  className="sp-title text-white absolute inset-x-0 top-0 md:max-w-[460px]"
                  style={{
                    opacity: on ? 0 : intro,
                    transform: `translateY(${on ? -12 : (1 - intro) * 16}px)`,
                    transition: "opacity .5s, transform .5s",
                  }}
                >
                  In much of rural Sindh, the day ends when the sun does.
                </p>
                <div
                  className="absolute inset-x-0 top-0 md:max-w-[460px]"
                  style={{
                    opacity: on ? 1 : 0,
                    transform: `translateY(${on ? 0 : 16}px)`,
                    transition: "opacity .6s .15s, transform .6s .15s",
                  }}
                >
                  <p className="sp-title">
                    <span className="sp-sun-text">Now it doesn't have to.</span>
                  </p>
                  <p className="sp-body mt-4 hidden md:block" style={{ color: "#a1a1a6", maxWidth: 400 }}>
                    Light to study by. A fan through the hottest nights. Evenings that belong to families again.
                  </p>
                </div>
              </div>
            </div>

            {/* The room */}
            <div className="order-2 flex justify-center">
              <div
                className={`sp-card sp-n2l-card relative ${on && !reduced ? "sp-flicker" : ""}`}
                style={{
                  aspectRatio: "9 / 16",
                  opacity: 0.4 + intro * 0.6,
                  transform: `scale(${0.94 + intro * 0.06})`,
                  boxShadow: on ? "0 40px 160px -30px rgba(252,180,31,0.45)" : "0 40px 160px -30px rgba(252,180,31,0)",
                  transition: "box-shadow 1.2s cubic-bezier(.28,.11,.32,1)",
                }}
              >
                <Clip name="c9388" hd approxWidth={420} label="A single bulb lighting a room after a SolarPak installation" />
                {/* Night grade: cool and dim until the switch */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(180deg, rgba(8,18,48,0.78), rgba(4,10,30,0.86))",
                    opacity: on ? 0 : 1,
                    transition: "opacity .35s",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Where we work: live sites from the Powered Atlas sheet              */
/* ------------------------------------------------------------------ */

const ATLAS_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRZdtqwuX0WFHRLIDvZj-bYUiqsWWIYGhP_dd-wgGwrcT5BzXtDS6Zc9eC46M9_CIsK0eqKBPIdONAR/pub?gid=77479870&single=true&output=csv";

function parseCsvLine(line: string) {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') q = false;
      else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

type Site = { x: number; y: number; key: string };

function useAtlasSites() {
  const [sites, setSites] = useState<Site[] | null>(null);
  useEffect(() => {
    let alive = true;
    fetch(ATLAS_CSV)
      .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
      .then((text) => {
        const lines = text.split(/\r?\n/).filter((l) => l.trim());
        if (lines.length < 2) return setSites([]);
        const head = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase().replace(/[^a-z]/g, ""));
        const latI = head.findIndex((h) => h === "latitude" || h === "lat");
        const lngI = head.findIndex((h) => h === "longitude" || h === "lng" || h === "lon" || h === "long");
        if (latI < 0 || lngI < 0) return setSites([]);
        const seen = new Set<string>();
        const out: Site[] = [];
        for (const line of lines.slice(1)) {
          const cells = parseCsvLine(line);
          const lat = parseFloat(cells[latI]);
          const lng = parseFloat(cells[lngI]);
          if (!isFinite(lat) || !isFinite(lng) || lat < 23 || lat > 38 || lng < 60 || lng > 78) continue;
          const [x, y] = projectLngLat(lng, lat);
          const key = `${x.toFixed(1)},${y.toFixed(1)}`;
          if (seen.has(key)) continue;
          seen.add(key);
          out.push({ x, y, key });
        }
        if (alive) setSites(out);
      })
      .catch(() => alive && setSites([]));
    return () => {
      alive = false;
    };
  }, []);
  return sites;
}

export function WhereWeWork() {
  const ref = useReveal<HTMLDivElement>();
  const sites = useAtlasSites();
  const [lit, setLit] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setLit(true), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const vb = `-20 -20 ${PK_VIEWBOX.w + 40} ${PK_VIEWBOX.h + 40}`;
  const fallback = [projectLngLat(68.76, 27.53)]; // Khairpur Mirs, our base

  return (
    <section data-sp id="work" ref={ref} className="sp-section" aria-labelledby="work-title">
      <div className="sp-container grid md:grid-cols-[1fr_1.15fr] gap-12 md:gap-16 items-center">
        <div>
          <p className="sp-eyebrow sp-reveal">Where we work</p>
          <h2 id="work-title" className="sp-headline mt-3 sp-reveal">
            Sindh <Accent>first</Accent>
            <Dot />
          </h2>
          <p className="sp-lede mt-6 sp-reveal" style={{ maxWidth: 460 }}>
            We start where the grid is weakest: villages where outages can last 12 hours a day and summers pass 45°C.
            Each point on this map is a SolarPak installation, pulled live from our field records.
          </p>
          <div className="mt-8 flex flex-col gap-3 sp-reveal">
            <Link href="/powered-atlas" className="sp-link">
              Open the Powered Atlas
            </Link>
            <Link href="/impact-dashboard" className="sp-link">
              View the Impact Dashboard
            </Link>
          </div>
        </div>

        <div ref={mapRef} className="sp-reveal" style={{ ["--sp-delay" as string]: "120ms" }}>
          <div className="sp-tile" style={{ background: "#f5f5f7", padding: "clamp(16px, 3vw, 32px)" }}>
            <svg viewBox={vb} className="w-full h-auto" role="img" aria-label="Map of Pakistan with SolarPak installation sites">
              <path d={PK_PATH} fill="#e6eee3" stroke="#bfd1bc" strokeWidth={1.2} strokeLinejoin="round" />
              {(sites && sites.length ? sites.map((s) => [s.x, s.y] as [number, number]) : sites ? fallback : []).map(
                ([x, y], i) => {
                  const delay = `${(i * 90) % 2800}ms`;
                  return (
                    <g key={`${x}-${y}`}>
                      {lit && (
                        <circle
                          cx={x}
                          cy={y}
                          r={4}
                          fill="#fcb41f"
                          className="sp-site-pulse"
                          style={{ animationDelay: delay }}
                        />
                      )}
                      <circle
                        cx={x}
                        cy={y}
                        r={6}
                        fill="#fcb41f"
                        stroke="#fff"
                        strokeWidth={1.4}
                        style={{
                          opacity: lit ? 1 : 0,
                          transform: lit ? "scale(1)" : "scale(0.2)",
                          transformBox: "fill-box",
                          transformOrigin: "center",
                          transition: `opacity .6s ${i * 40}ms, transform .8s cubic-bezier(.28,.11,.32,1) ${i * 40}ms`,
                        }}
                      />
                    </g>
                  );
                }
              )}
              {[
                { n: "Karachi", c: projectLngLat(67.0, 24.86) },
                { n: "Sukkur", c: projectLngLat(68.86, 27.7) },
                { n: "Lahore", c: projectLngLat(74.35, 31.55) },
                { n: "Islamabad", c: projectLngLat(73.05, 33.68) },
              ].map(({ n, c }) => (
                <g key={n}>
                  <circle cx={c[0]} cy={c[1]} r={3} fill="#86868b" />
                  <text x={c[0] + 8} y={c[1] + 5} fontSize={17} fill="#6e6e73" fontFamily="inherit">
                    {n}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <p className="sp-small mt-3 text-center">
            {sites === null
              ? "Loading installation sites…"
              : sites.length
                ? `${sites.length} mapped installation sites. Live from the Powered Atlas.`
                : "Khairpur Mirs, Sindh. Our base of operations."}
          </p>
        </div>
      </div>
    </section>
  );
}

export { POSTER };
