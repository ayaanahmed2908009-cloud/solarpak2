import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import "@/components/premium/premium.css";

const DONATE_URL = "https://ko-fi.com/solarpak";

const LINKS: { href: string; label: string }[] = [
  { href: "/#work", label: "Our Work" },
  { href: "/#system", label: "The System" },
  { href: "/#impact", label: "Impact" },
  { href: "/impact-labs", label: "Research" },
  { href: "/#team", label: "Team" },
  { href: "/annual-report", label: "Annual Report" },
  { href: "/opportunities", label: "Join" },
];

const MORE_LINKS: { href: string; label: string }[] = [
  { href: "/impact-dashboard", label: "Impact Dashboard" },
  { href: "/powered-atlas", label: "Powered Atlas" },
  { href: "/membership", label: "Membership" },
  { href: "/gallery", label: "Gallery" },
  { href: "/worker/login", label: "Team Login" },
];

function useGo() {
  const [location, setLocation] = useLocation();
  return (href: string) => {
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      const scroll = () => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 44;
        window.scrollTo({ top, behavior: "smooth" });
      };
      if (location !== "/") {
        setLocation("/");
        setTimeout(scroll, 120);
      } else {
        scroll();
      }
      history.replaceState(null, "", href);
      return;
    }
    setLocation(href);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };
}

function Wordmark() {
  return (
    <span className="flex items-center gap-2">
      <img src="/favicon.png" alt="" className="h-[18px] w-[20px] object-contain" />
      <span className="text-[15px] font-semibold tracking-[-0.02em]">SolarPak</span>
    </span>
  );
}

/** True while the nav bar sits over a `.sp-dark` section. */
function useOverDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const els = document.elementsFromPoint(window.innerWidth / 2, 30);
      const under = els.find((el) => !el.closest("[data-sp-nav]"));
      setDark(!!under?.closest(".sp-dark"));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return dark;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const go = useGo();
  const overDark = useOverDark();
  const dark = overDark && !open;
  const ink = dark ? "#f5f5f7" : "#1d1d1f";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const nav = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    go(href);
  };

  return (
    <div className="sp">
      <header
        data-sp-nav
        className="fixed inset-x-0 top-0 z-[60]"
        style={{
          height: 44,
          color: ink,
          background: open ? "rgba(251,251,253,1)" : dark ? "rgba(22,22,23,0.8)" : "rgba(251,251,253,0.78)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          borderBottom: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
          transition: "background-color .3s",
        }}
      >
        <nav
          aria-label="Global"
          className="mx-auto flex h-full items-center justify-between"
          style={{ maxWidth: 1024, padding: "0 22px" }}
        >
          <a href="/" onClick={nav("/")} aria-label="SolarPak home">
            <Wordmark />
          </a>

          <ul className="hidden lg:flex items-center gap-8">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={nav(l.href)}
                  className="text-[12px] opacity-80 hover:opacity-100 transition-opacity"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <a
              href="/impact-dashboard"
              onClick={nav("/impact-dashboard")}
              data-testid="link-impact-dashboard"
              className="hidden sm:inline text-[12px] opacity-80 hover:opacity-100 transition-opacity"
            >
              Impact Dashboard
            </a>
            <a
              href={DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="sp-btn sp-btn-sm"
              style={dark ? { background: "#f5f5f7", color: "#1d1d1f" } : undefined}
            >
              Fund a system
            </a>
            <button
              type="button"
              className="lg:hidden -mr-2 p-2"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              data-testid="button-mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="relative block h-[12px] w-[18px]">
                <span
                  className="absolute left-0 block h-[1.5px] w-full transition-transform duration-300"
                  style={{ background: ink, top: 2, transform: open ? "translateY(3.5px) rotate(45deg)" : "none" }}
                />
                <span
                  className="absolute left-0 block h-[1.5px] w-full transition-transform duration-300"
                  style={{ background: ink, top: 9, transform: open ? "translateY(-3.5px) rotate(-45deg)" : "none" }}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile / tablet sheet */}
      <div
        className="fixed inset-x-0 bottom-0 z-[59] lg:hidden overflow-y-auto"
        style={{
          top: 44,
          background: "#fbfbfd",
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          transition: "opacity .35s cubic-bezier(.28,.11,.32,1), visibility .35s",
        }}
        aria-hidden={!open}
      >
        <div className="px-10 pt-6 pb-16">
          <ul className="flex flex-col gap-1">
            {LINKS.map((l, i) => (
              <li
                key={l.href}
                style={{
                  transform: open ? "none" : "translateY(-8px)",
                  opacity: open ? 1 : 0,
                  transition: `transform .5s cubic-bezier(.28,.11,.32,1) ${open ? i * 25 : 0}ms, opacity .5s ${open ? i * 25 : 0}ms`,
                }}
              >
                <a
                  href={l.href}
                  onClick={nav(l.href)}
                  tabIndex={open ? 0 : -1}
                  className="block py-1.5 text-[28px] font-semibold tracking-[-0.02em] text-[#1d1d1f]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-10 mb-3 text-[12px] text-[#6e6e73]">More from SolarPak</p>
          <ul className="flex flex-col gap-2">
            {MORE_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={nav(l.href)}
                  tabIndex={open ? 0 : -1}
                  className="text-[17px] text-[#1d1d1f]/80"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Reserve space for the fixed bar */}
      <div aria-hidden style={{ height: 44 }} />
    </div>
  );
}
