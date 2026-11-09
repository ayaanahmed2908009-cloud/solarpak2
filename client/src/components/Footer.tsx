import { Link } from "wouter";
import "@/components/premium/premium.css";

const DONATE_URL = "https://ko-fi.com/solarpak";

type Item = { label: string; href: string; external?: boolean };

const COLUMNS: { title: string; items: Item[] }[] = [
  {
    title: "Our Work",
    items: [
      { label: "The SolarPak Home System", href: "/#system" },
      { label: "Where we work", href: "/#work" },
      { label: "Impact", href: "/#impact" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Data & Research",
    items: [
      { label: "Impact Dashboard", href: "/impact-dashboard" },
      { label: "Powered Atlas", href: "/powered-atlas" },
      { label: "Impact Labs", href: "/impact-labs" },
      { label: "Annual Report FY1", href: "/annual-report" },
    ],
  },
  {
    title: "Get Involved",
    items: [
      { label: "Fund a system", href: DONATE_URL, external: true },
      { label: "Monthly membership", href: "/membership" },
      { label: "Open roles", href: "/opportunities" },
      { label: "Hackathon", href: "/hackathon" },
    ],
  },
  {
    title: "Connect",
    items: [
      { label: "Instagram", href: "https://www.instagram.com/solarpak.org_/", external: true },
      { label: "LinkedIn", href: "https://linkedin.com/company/solarpakorg", external: true },
      { label: "X", href: "https://x.com/Solarpakn", external: true },
      { label: "solarpakorg@gmail.com", href: "mailto:solarpakorg@gmail.com", external: true },
    ],
  },
];

function FooterLink({ item }: { item: Item }) {
  const cls = "text-[12px] leading-[2] text-[#424245] hover:underline underline-offset-2";
  if (item.external || item.href.includes("#")) {
    return (
      <a
        href={item.href}
        className={cls}
        {...(item.external && !item.href.startsWith("mailto:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} className={cls}>
      {item.label}
    </Link>
  );
}

export default function Footer({ footnotes }: { footnotes?: React.ReactNode }) {
  return (
    <footer className="sp" style={{ background: "#f5f5f7" }}>
      <div className="mx-auto" style={{ maxWidth: 1024, padding: "20px 22px 24px" }}>
        {footnotes && (
          <div className="border-b border-[#d2d2d7] pb-4 mb-5 text-[12px] leading-[1.5] text-[#6e6e73] space-y-2">
            {footnotes}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6 pt-2">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[12px] font-semibold text-[#0f1f11] mb-1.5">{col.title}</h3>
              <ul>
                {col.items.map((item) => (
                  <li key={item.label}>
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-[#d2d2d7] flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-[12px] text-[#6e6e73]">
          <p>Copyright © {new Date().getFullYear()} SolarPak. A youth-led energy organisation. Khairpur Mirs, Sindh, Pakistan.</p>
          <Link href="/worker/login" className="hover:underline underline-offset-2">
            Team Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
