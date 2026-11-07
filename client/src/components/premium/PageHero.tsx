import type React from "react";
import "./premium.css";
import { Dot, useReveal } from "./motion";

export { Accent } from "./motion";

type Props = {
  eyebrow?: string;
  /** Headline. Wrap the one key phrase in <Accent>. The sun full stop is added automatically. */
  title: React.ReactNode;
  lede?: React.ReactNode;
  /** Buttons / links under the lede. */
  actions?: React.ReactNode;
  /** Anything else that belongs in the header (meta rows, partner logos). */
  children?: React.ReactNode;
  /** Omit the sun full stop (e.g. titles ending in a name). */
  noDot?: boolean;
};

/**
 * The landing page's hero, for every other page: near-black headline with one
 * green phrase, the logo's sun as the full stop, neutral lede, and a faint
 * sunrise wash.
 */
export default function PageHero({ eyebrow, title, lede, actions, children, noDot }: Props) {
  const ref = useReveal<HTMLElement>();
  return (
    <header ref={ref} className="sp-hero relative">
      <div
        className="sp-container text-center relative"
        style={{ paddingTop: "clamp(56px, 8vw, 104px)", paddingBottom: "clamp(56px, 8vw, 96px)" }}
      >
        {eyebrow && <p className="sp-eyebrow sp-reveal">{eyebrow}</p>}
        <h1
          className="sp-headline mt-3 mx-auto sp-reveal"
          style={{ maxWidth: 900, ["--sp-delay" as string]: "80ms" }}
        >
          {title}
          {!noDot && <Dot />}
        </h1>
        {lede && (
          <p className="sp-lede mx-auto mt-6 sp-reveal" style={{ maxWidth: 640, ["--sp-delay" as string]: "160ms" }}>
            {lede}
          </p>
        )}
        {actions && (
          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sp-reveal"
            style={{ ["--sp-delay" as string]: "240ms" }}
          >
            {actions}
          </div>
        )}
        {children && (
          <div className="mt-10 sp-reveal" style={{ ["--sp-delay" as string]: "300ms" }}>
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
