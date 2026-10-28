import { useRef, useState } from "react";
import { Download, ExternalLink, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const documentRoot = "/documents/ssep-recognition";

// Transcribed from the supplied letters. Dates below are the signature dates;
// the Cheema letter also carries an earlier typed date on its first page.
const letters = [
  {
    id: "maaz-mahboob",
    name: "Maaz Mahboob",
    constituency: "PS-127 · Karachi Central-VI",
    date: "26 September 2026",
    dateTime: "2026-09-26",
    quote: "The report is well researched and properly sourced.",
    pageSizes: [[1200, 1553], [1200, 1553]],
  },
  {
    id: "shahid-rasool-cheema",
    name: "Shahid Rasool Cheema",
    constituency: "PS-31 · Khairpur-VI",
    date: "28 September 2026",
    dateTime: "2026-09-28",
    quote: "The findings recorded are material and merit attention at the provincial level.",
    pageSizes: [[1200, 1801], [1200, 1854]],
  },
] as const;

type RecognitionLetter = (typeof letters)[number];

export default function SsepRecognition() {
  const [activeLetter, setActiveLetter] = useState<RecognitionLetter | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  function openLetter(letter: RecognitionLetter, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    setActiveLetter(letter);
  }

  return (
    <>
      <section
        aria-labelledby="ssep-recognition-title"
        className="mb-14"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50">
            <FileText className="h-4 w-4 text-emerald-700" aria-hidden="true" />
          </div>
          <div>
            <h2 id="ssep-recognition-title" className="text-lg font-semibold text-gray-900">
              Credentials & Recognition
            </h2>
            <p className="text-xs text-gray-500">Letters of appreciation · September 2026</p>
          </div>
        </div>
        <p className="mb-5 text-sm leading-6 text-gray-600">
          Our SSEP policy analysis received letters of appreciation from two members
          of the Provincial Assembly of Sindh, recognising its research quality and
          relevance to provincial energy policy.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {letters.map((letter) => (
            <article key={letter.id} className="flex min-w-0 flex-col rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={(event) => openLetter(letter, event.currentTarget)}
                  className="h-20 w-14 shrink-0 overflow-hidden rounded border border-gray-200 bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-4"
                  aria-label={`Preview letter from ${letter.name}`}
                >
                  <img
                    src={`${documentRoot}/${letter.id}-page-1.jpg`}
                    alt=""
                    width={letter.pageSizes[0][0]}
                    height={letter.pageSizes[0][1]}
                    loading="lazy"
                    className="h-full w-full object-cover object-top"
                  />
                </button>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold leading-snug text-gray-900">{letter.name}</h3>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Member, Provincial Assembly of Sindh
                    <br />
                    {letter.constituency}
                  </p>
                </div>
              </div>
              <div className="my-5 flex-1">
                <blockquote className="border-l-2 border-emerald-200 pl-3 text-sm leading-6 text-gray-600">
                  “{letter.quote}”
                </blockquote>
              </div>
              <p className="mb-3 text-xs leading-5 text-gray-500">
                Signed <time dateTime={letter.dateTime}>{letter.date}</time> · 2 pages
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={(event) => openLetter(letter, event.currentTarget)}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
                  aria-label={`Read letter from ${letter.name}`}
                >
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  Read letter
                </button>
                <a
                  href={`${documentRoot}/${letter.id}.pdf`}
                  download={`SolarPak-SSEP-Letter-${letter.id}.pdf`}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
                  aria-label={`Download letter from ${letter.name} (PDF)`}
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  Download
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Dialog open={activeLetter !== null} onOpenChange={(open) => { if (!open) setActiveLetter(null); }}>
        <DialogContent
          className="flex max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl flex-col gap-0 overflow-hidden rounded-xl p-0"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            triggerRef.current?.focus();
          }}
        >
          {activeLetter && (
            <>
              <DialogHeader className="shrink-0 border-b bg-white p-5 pr-12 text-left">
                <DialogTitle className="text-lg leading-snug text-gray-900">{activeLetter.name}</DialogTitle>
                <DialogDescription className="text-xs leading-5">
                  Letter of appreciation · Signed {activeLetter.date} · 2 pages
                </DialogDescription>
                <a
                  href={`${documentRoot}/${activeLetter.id}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-9 w-fit items-center gap-1.5 rounded text-xs font-medium text-emerald-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                >
                  Open original PDF
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </DialogHeader>
              <div
                className="min-h-0 overflow-y-auto overscroll-contain bg-slate-100 p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-700 sm:p-5"
                role="region"
                aria-label={`Letter pages from ${activeLetter.name}`}
                tabIndex={0}
              >
                {activeLetter.pageSizes.map(([width, height], index) => (
                  <figure key={`${activeLetter.id}-${index}`} className="mb-5 last:mb-0">
                    <figcaption className="mb-2 text-center text-xs text-slate-500">
                      Page {index + 1} of 2
                    </figcaption>
                    <img
                      src={`${documentRoot}/${activeLetter.id}-page-${index + 1}.jpg`}
                      alt={`${activeLetter.name}’s letter of appreciation, page ${index + 1}${index === 1 ? ", including signature and date" : ""}`}
                      width={width}
                      height={height}
                      className="h-auto w-full bg-white shadow-sm"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </figure>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
