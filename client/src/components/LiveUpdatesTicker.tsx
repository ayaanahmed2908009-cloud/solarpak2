const updates = [
  {
    tag: "UPCOMING",
    text: "SolarPak is exploring its first school solar installation — bringing clean energy to students in Sindh, Pakistan.",
  },
  {
    tag: "WE'RE HIRING",
    text: "Open volunteer & internship roles available across multiple departments.",
    link: "/opportunities",
    linkText: "See open roles →",
  },
];

export default function LiveUpdatesTicker() {
  const tickerContent = updates.map((u, i) => (
    <span key={i} className="inline-flex items-center gap-2 mx-10">
      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-400/40 px-1.5 py-0.5 rounded">
        {u.tag}
      </span>
      <span className="text-white/80 text-xs">{u.text}</span>
      {u.link && (
        <a
          href={u.link}
          className="text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors underline underline-offset-2"
        >
          {u.linkText}
        </a>
      )}
    </span>
  ));

  return (
    <div className="bg-slate-900 border-b border-white/10 overflow-hidden h-9 flex items-center">
      <div className="flex-shrink-0 flex items-center px-3 h-full border-r border-white/10 bg-emerald-800/50">
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 whitespace-nowrap">
          Live Updates
        </span>
      </div>
      <div className="overflow-hidden flex-1 relative">
        <div
          className="flex whitespace-nowrap animate-ticker"
          style={{ animationDuration: "30s" }}
        >
          {tickerContent}
          {tickerContent}
        </div>
      </div>
    </div>
  );
}
