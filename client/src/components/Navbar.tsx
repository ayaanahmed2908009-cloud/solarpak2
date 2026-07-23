import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Menu, X, Users, Camera, Zap } from "lucide-react";

function NavLink({
  href,
  children,
  className,
  onNavigate,
  external,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
  external?: boolean;
}) {
  const [, setLocation] = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    if (external) return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "instant" });
    if (href.startsWith("/#")) {
      setLocation("/");
      setTimeout(() => {
        const id = href.replace("/#", "");
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 100);
    } else {
      setLocation(href);
    }
    onNavigate?.();
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <style>{`
        @keyframes drawerIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* Floating menu button */}
      <button
        onClick={() => setOpen(true)}
        data-testid="button-mobile-menu"
        style={{
          transform: visible ? "translateX(0)" : "translateX(80px)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease",
          background: "rgba(5, 10, 24, 0.65)",
          border: "1px solid rgba(255,255,255,0.14)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
        className="fixed top-10 right-6 z-50 p-3.5 rounded-xl"
      >
        <Menu className="w-7 h-7 text-white" />
      </button>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-[60]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 cursor-pointer"
            style={{ animation: "fadeIn 0.3s ease both", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div
            className="absolute right-0 top-0 h-full w-[300px] flex flex-col bg-white"
            style={{
              animation: "drawerIn 0.42s cubic-bezier(0.22, 1, 0.36, 1) both",
              borderLeft: "1px solid #e5e7eb",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.18)",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
              <NavLink href="/" onNavigate={() => setOpen(false)} className="flex items-center gap-2.5">
                <img src="/favicon.png" alt="SolarPak" className="h-8 w-9 object-contain" />
                <span className="font-bold text-gray-900 text-sm tracking-tight">SolarPak</span>
              </NavLink>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg transition-colors hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Live Dashboard — amber hero CTA */}
            <div className="px-4 pt-4 pb-2">
              <a
                href="/impact-dashboard/"
                data-testid="link-impact-dashboard"
                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-bold transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  color: "#0a0f1e",
                  boxShadow: "0 4px 24px rgba(245,158,11,0.28)",
                }}
              >
                <Zap className="w-4 h-4" style={{ color: "#92400e" }} />
                Live Impact Dashboard
              </a>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-0.5">

              <p className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                Explore
              </p>
              {[
                { href: "/",          label: "Home" },
                { href: "/#solution", label: "What We Do" },
                { href: "/#impact",   label: "Our Impact" },
              ].map(({ href, label }) => (
                <NavLink key={href} href={href} onNavigate={() => setOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg transition-colors hover:bg-gray-50"
                >
                  {label}
                </NavLink>
              ))}

              <p className="px-4 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                Programs
              </p>
              {[
                { href: "/impact-labs",   label: "Impact Labs" },
                { href: "/opportunities", label: "Opportunities" },
              ].map(({ href, label }) => (
                <NavLink key={href} href={href} onNavigate={() => setOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg transition-colors hover:bg-gray-50"
                >
                  {label}
                </NavLink>
              ))}

              <p className="px-4 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                About
              </p>
              {[
                { href: "/annual-report", label: "Annual Report" },
                { href: "/membership",    label: "Membership" },
                { href: "/gallery",       label: "Gallery" },
              ].map(({ href, label }) => (
                <NavLink key={href} href={href} onNavigate={() => setOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 rounded-lg transition-colors hover:bg-gray-50"
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Footer */}
            <div className="px-4 pb-6 pt-3 flex flex-col gap-2.5 border-t border-gray-100">
              <button
                onClick={() => { window.open("https://ko-fi.com/solarpak", "_blank"); setOpen(false); }}
                className="w-full py-3 rounded-xl text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white transition-all active:scale-95"
              >
                Donate
              </button>
              <NavLink
                href="/worker/login"
                onNavigate={() => setOpen(false)}
                className="w-full py-2 text-center text-xs text-gray-400 hover:text-gray-600 rounded-lg transition-colors hover:bg-gray-50"
              >
                Team Login
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
