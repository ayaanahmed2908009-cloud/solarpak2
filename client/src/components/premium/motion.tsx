import type React from "react";
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

/** The logo's sun as a full stop. */
export function Dot() {
  return (
    <>
      <span className="sp-sun-dot" aria-hidden />
      <span className="sr-only">.</span>
    </>
  );
}

/** The one phrase of a headline set in logo green (yellow on dark sections). */
export function Accent({ children }: { children: React.ReactNode }) {
  return <span className="sp-accent">{children}</span>;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/** Adds `.is-in` to every `.sp-reveal` inside the returned ref once it scrolls into view. */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>(".sp-reveal"));
    if (root.classList.contains("sp-reveal")) targets.push(root);
    if (!("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
  return ref;
}

/**
 * Progress (0 → 1) of a tall element scrolling past a sticky viewport:
 * 0 when its top reaches the top of the viewport, 1 when its bottom reaches the bottom.
 */
export function useScrollProgress(ref: RefObject<HTMLElement>) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const range = r.height - window.innerHeight;
      const next = range <= 0 ? 1 : Math.min(1, Math.max(0, -r.top / range));
      setP((prev) => (Math.abs(prev - next) > 0.001 ? next : prev));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
  return p;
}

/** Progress (0 → 1) from an element's top entering the viewport bottom to its bottom leaving the top. */
export function useViewportProgress(ref: RefObject<HTMLElement>) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const next = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      setP((prev) => (Math.abs(prev - next) > 0.001 ? next : prev));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
  return p;
}

/** Maps progress `p` from [a, b] onto [0, 1], clamped. */
export function seg(p: number, a: number, b: number) {
  return Math.min(1, Math.max(0, (p - a) / (b - a)));
}

export const MEDIA = (name: string, size: 720 | 1080 = 720) => `/media/${name}-${size}.mp4`;
export const POSTER = (name: string) => `/media/${name}-poster.jpg`;

type ClipProps = {
  name: string;
  /** Clip has a 1080p rendition; used when the card is large on a dense screen. */
  hd?: boolean;
  /** Approximate rendered width in CSS px, used to pick the rendition. */
  approxWidth?: number;
  /** Start downloading on mount (above-the-fold clips). */
  eager?: boolean;
  className?: string;
  style?: CSSProperties;
  label: string;
};

/**
 * Muted, looping, inline video. Above-the-fold clips (`eager`) download as soon
 * as the page mounts; the rest start downloading about a screen and a half
 * before they scroll into view, so they are already buffered when they arrive.
 * Plays only while on screen and shows its poster for reduced motion.
 */
export function Clip({ name, hd = false, approxWidth = 400, eager = false, className, style, label }: ClipProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return; // poster only
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const url = MEDIA(name, hd && approxWidth * dpr > 760 ? 1080 : 720);
    const load = () => setSrc((s) => s ?? url);

    if (eager) load();

    // Prefetch well ahead of the viewport (sideways too, for carousels).
    const prefetch = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          load();
          prefetch.disconnect();
        }
      },
      { rootMargin: "150% 100%" }
    );
    // Play only while actually visible.
    const visibility = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          load();
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.01 }
    );
    prefetch.observe(el);
    visibility.observe(el);
    return () => {
      prefetch.disconnect();
      visibility.disconnect();
    };
  }, [name, hd, approxWidth, eager]);

  return (
    <video
      ref={ref}
      className={className}
      style={style}
      src={src ?? undefined}
      poster={POSTER(name)}
      muted
      loop
      playsInline
      autoPlay={eager}
      preload={src ? "auto" : "none"}
      aria-label={label}
      disablePictureInPicture
      disableRemotePlayback
    />
  );
}
