import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { Clip, POSTER, prefersReducedMotion, seg, useReveal, useScrollProgress, useViewportProgress } from "./motion";
import { PK_PATH, PK_VIEWBOX, projectLngLat } from "./pakistanGeo";
import { SSEP_POLICY_ANALYSIS_SLUG } from "@/data/ssepPolicyAnalysis";

export const DONATE_URL = "https://ko-fi.com/solarpak";

/* ------------------------------------------------------------------ */
/* Ribbon                                                              */
/* ------------------------------------------------------------------ */

export function Ribbon() {
  return (
    <div className="text-center px-6 py-3 text-[14px] leading-[1.45]" style={{ background: "#f5f5f7" }}>
      <span className="text-[#56665a]">New from Impact Labs: a policy review of the Sindh Solar Energy Project.</span>{" "}
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
  { name: "c9388", label: "A bulb lit inside a home after installation" },
];

export function Hero() {
  const ref = useReveal<HTMLDivElement>();
  const wrap = useRef<HTMLDivElement>(null);
  const p = useViewportProgress(wrap);
  // Centre clip rises, outer clips settle: a gentle depth cue, zero at rest.
  const lift = prefersReducedMotion() ? 0 : Math.max(0, p - 0.35);

  return (
    <section ref={ref} className="relative" aria-labelledby="hero-title">
      <div className="sp-container text-center" style={{ paddingTop: "clamp(56px, 9vw, 112px)" }}>
        <p className="sp-eyebrow sp-reveal">SolarPak</p>
        <h1 id="hero-title" className="sp-hero-title mt-3 sp-reveal" style={{ ["--sp-delay" as string]: "80ms" }}>
          Power, where
          <br />
          <span className="sp-mark">the grid ends.</span>
        </h1>
        <p
          className="sp-lede mx-auto mt-6 sp-reveal"
          style={{ maxWidth: 640, ["--sp-delay" as string]: "160ms" }}
        >
          We design, fund and install solar energy systems for homes and schools across rural Sindh, and publish the
          data on every one.
        </p>
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sp-reveal"
          style={{ ["--sp-delay" as string]: "240ms" }}
        >
          <a href={DONATE_URL} target="_blank" rel="noopener noreferrer" className="sp-btn">
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
                <Clip name={c.name} hd approxWidth={360} label={c.label} />
              </div>
            ))}
          </div>
        </div>

        {/* Phones: one swipeable rail; the first clip fills the screen naturally */}
        <div className="md:hidden sp-rail sp-reveal" style={{ ["--sp-delay" as string]: "320ms" }}>
          {TRIPTYCH.map((c) => (
            <div key={c.name} className="sp-card" style={{ width: "78vw", maxWidth: 360, aspectRatio: "9 / 16" }}>
              <Clip name={c.name} label={c.label} />
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

  const grow = reduced ? 1 : seg(p, 0.05, 0.6);
  const light = reduced ? 1 : seg(p, 0.25, 0.7);
  const first = reduced ? 0 : 1 - seg(p, 0.18, 0.32);
  const second = reduced ? 1 : seg(p, 0.62, 0.78);

  const height = 46 + grow * 46; // vh
  const brightness = 0.18 + light * 0.82;

  return (
    <section className="sp-dark relative" aria-label="Night to light">
      <div ref={track} style={{ height: reduced ? "auto" : "260vh" }}>
        <div
          className={reduced ? "py-24" : "sticky top-0 h-screen"}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
        >
          <div
            className="sp-card relative"
            style={{
              height: reduced ? "80vh" : `${height}vh`,
              aspectRatio: "9 / 16",
              maxWidth: "92vw",
              filter: `brightness(${brightness}) saturate(${0.6 + light * 0.4})`,
              transition: reduced ? undefined : "filter .2s linear",
              boxShadow: `0 0 ${120 * light}px ${20 * light}px rgba(252,180,31,${0.18 * light})`,
            }}
          >
            <Clip name="c9388" hd approxWidth={520} label="A single bulb lighting a room after a SolarPak installation" />
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 text-center px-6"
            style={{ top: "14vh", opacity: first, transform: `translateY(${(1 - first) * -16}px)` }}
          >
            <p className="sp-headline text-white mx-auto" style={{ maxWidth: 820 }}>
              In much of rural Sindh, the day ends when the sun does.
            </p>
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 text-center px-6"
            style={{ bottom: "9vh", opacity: second, transform: `translateY(${(1 - second) * 20}px)` }}
          >
            <p className="sp-headline mx-auto" style={{ maxWidth: 820 }}>
              <span className="sp-sun-text">Now it doesn't have to.</span>
            </p>
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
            Sindh first.
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
                  <circle cx={c[0]} cy={c[1]} r={3} fill="#7d8b80" />
                  <text x={c[0] + 8} y={c[1] + 5} fontSize={17} fill="#56665a" fontFamily="inherit">
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
