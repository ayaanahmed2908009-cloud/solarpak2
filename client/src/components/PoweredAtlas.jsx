import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const ATLAS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRZdtqwuX0WFHRLIDvZj-bYUiqsWWIYGhP_dd-wgGwrcT5BzXtDS6Zc9eC46M9_CIsK0eqKBPIdONAR/pub?gid=77479870&single=true&output=csv"

const C = {
  navy: "#12352b",
  green: "#176b45",
  greenMid: "#2f8f62",
  greenLight: "#e8f4ed",
  white: "#ffffff",
  pageBg: "#f5f7f5",
  sectionBg: "#f1f4f2",
  border: "#dfe6e1",
  body: "#405048",
  subtle: "#7a8880",
  gold: "#b7791f",
  shadow: "0 2px 10px rgba(15,23,42,.06)",
  shadowMd: "0 6px 20px rgba(15,23,42,.09)",
  shadowLg: "0 15px 45px rgba(15,23,42,.14)"
};

const PROJECT_TYPE_COLORS = {
  home: "#2f8f62",
  school: "#2563eb",
  clinic: "#dc7a28",
  community: "#8b5cf6",
  business: "#0891b2",
  agriculture: "#65a30d",
  other: "#64748b"
};

const PROJECT_TYPE_LABELS = {
  home: "Home",
  school: "School",
  clinic: "Clinic",
  community: "Community",
  business: "Business",
  agriculture: "Agriculture",
  other: "Other"
};

const PROJECT_TYPE_ICONS = {
  home: "🏠",
  school: "🏫",
  clinic: "🏥",
  community: "🏘️",
  business: "🏢",
  agriculture: "🌾",
  other: "⚡"
};


// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function fmtShort(value) {
  const n = Number(value) || 0;

  if (Math.abs(n) >= 1000000) {
    return `${(n / 1000000).toFixed(1)}M`;
  }

  if (Math.abs(n) >= 1000) {
    return `${(n / 1000).toFixed(1)}k`;
  }

  return n.toLocaleString();
}

function Eyebrow({ text }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 800,
        color: C.green,
        letterSpacing: ".13em",
        textTransform: "uppercase",
        marginBottom: 8
      }}
    >
      {text}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// EXACT OLD CSV PARSER
// ═══════════════════════════════════════════════════════════════════════════════

function parseAtlasCSV(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      i++;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if (
      (char === "\n" || char === "\r") &&
      !inQuotes
    ) {
      if (char === "\r" && next === "\n") {
        i++;
      }

      row.push(cell);
      cell = "";

      if (row.some(v => v.trim() !== "")) {
        rows.push(row);
      }

      row = [];
      continue;
    }

    cell += char;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);

    if (row.some(v => v.trim() !== "")) {
      rows.push(row);
    }
  }

  if (rows.length < 2) {
    return [];
  }

  const hdrs = rows[0].map(h =>
    h
      .trim()
      .replace(/^\uFEFF/, "")
      .toLowerCase()
  );

  return rows
    .slice(1)
    .map(cols => {
      const row = {};

      hdrs.forEach((h, i) => {
        row[h] = (cols[i] || "").trim();
      });

      const kw = parseFloat(row.capacitykw || 0);

      const annualKwh = kw * 5 * 365;

      row.annualCO2 = parseFloat(
        (annualKwh * 0.50 / 1000).toFixed(2)
      );

      row.treeEquiv = Math.round(
        row.annualCO2 * 45
      );

      row.capacityKW = kw;

      row.peopleServed = parseInt(
        row.peopleserved || 0,
        10
      );

      row.latitude = parseFloat(
        row.latitude || 0
      );

      row.longitude = parseFloat(
        row.longitude || 0
      );

      row.photos = (row.photos || "")
        .split("|")
        .map(s => s.trim())
        .filter(Boolean);

      row.projectType = (
        row.projecttype || "home"
      ).toLowerCase();

      row.id =
        row.id ||
        String(Math.random());

      row.title = row.title || "";
      row.excerpt = row.excerpt || "";
      row.document = row.document || "";

      row.name = row.name || "SolarPak Installation";
      row.province = row.province || "";
      row.city = row.city || "";

      return row;
    })
    .filter(
      r =>
        r.latitude &&
        r.longitude
    );
}


// ═══════════════════════════════════════════════════════════════════════════════
// MAP MARKER
// ═══════════════════════════════════════════════════════════════════════════════

function getMarkerSVG(type) {
  const color =
    PROJECT_TYPE_COLORS[type] ||
    C.greenMid;

  return `
    <div
      style="
        width:28px;
        height:36px;
        position:relative;
        cursor:pointer;
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="36"
        viewBox="0 0 28 36"
      >
        <path
          d="
            M14 0
            C6.268 0 0 6.268 0 14
            C0 23.333 14 36 14 36
            S28 23.333 28 14
            C28 6.268 21.732 0 14 0
            Z
          "
          fill="${color}"
        />
        <circle
          cx="14"
          cy="14"
          r="6"
          fill="white"
          opacity=".9"
        />
      </svg>
    </div>
  `;
}


// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT RENDERER
// ═══════════════════════════════════════════════════════════════════════════════

function DocumentContent({ document }) {
  if (!document) {
    return (
      <p
        style={{
          color: C.subtle,
          fontSize: 14
        }}
      >
        No document content available.
      </p>
    );
  }

  const blocks = document
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/);

  return (
    <>
      {blocks.map((block, i) => {
        const text = block.trim();

        if (!text) {
          return null;
        }

        if (text.startsWith("### ")) {
          return (
            <h3
              key={i}
              style={{
                fontSize: 17,
                color: C.navy,
                fontWeight: 800,
                margin: "28px 0 10px"
              }}
            >
              {text.replace(/^### /, "")}
            </h3>
          );
        }

        if (text.startsWith("## ")) {
          return (
            <h2
              key={i}
              style={{
                fontSize: 21,
                color: C.navy,
                fontWeight: 800,
                margin: "32px 0 12px"
              }}
            >
              {text.replace(/^## /, "")}
            </h2>
          );
        }

        if (text.startsWith("# ")) {
          return (
            <h1
              key={i}
              style={{
                fontSize: 27,
                color: C.navy,
                fontWeight: 800,
                margin: "35px 0 14px"
              }}
            >
              {text.replace(/^# /, "")}
            </h1>
          );
        }

        const lines = text.split("\n");

        if (
          lines.every(line =>
            line.trim().startsWith("- ")
          )
        ) {
          return (
            <ul
              key={i}
              style={{
                paddingLeft: 24,
                margin: "12px 0 20px"
              }}
            >
              {lines.map((line, j) => (
                <li
                  key={j}
                  style={{
                    fontSize: 14,
                    lineHeight: 1.8,
                    color: C.body,
                    marginBottom: 6
                  }}
                >
                  {line
                    .replace(/^-\s*/, "")
                    .replace(/\*\*/g, "")}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p
            key={i}
            style={{
              fontSize: 14,
              lineHeight: 1.85,
              color: C.body,
              margin: "0 0 18px",
              whiteSpace: "pre-wrap"
            }}
          >
            {text}
          </p>
        );
      })}
    </>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT CARD
// ═══════════════════════════════════════════════════════════════════════════════

function ProjectCard({
  inst,
  onClose
}) {
  const [photoIdx, setPhotoIdx] =
    useState(0);

  const [documentOpen, setDocumentOpen] =
    useState(false);

  useEffect(() => {
    setPhotoIdx(0);
    setDocumentOpen(false);
  }, [inst.id]);

  const typeColor =
    PROJECT_TYPE_COLORS[
      inst.projectType
    ] || C.greenMid;

  const hasPhotos =
    inst.photos?.length > 0;

  const hasDoc =
    Boolean(
      inst.document &&
      inst.document.trim()
    );

  return (
    <>
      <div
        style={{
          background: C.white,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: C.shadowLg,
          width: "100%"
        }}
      >

        {/* PHOTO */}
        {hasPhotos ? (
          <div
            style={{
              height: 160,
              position: "relative",
              background: "#000",
              overflow: "hidden"
            }}
          >
            <img
              src={inst.photos[photoIdx]}
              alt={inst.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block"
              }}
            />

            {inst.photos.length > 1 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  display: "flex",
                  gap: 4
                }}
              >
                {inst.photos.map(
                  (_, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setPhotoIdx(i)
                      }
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius:
                          "50%",
                        border: "none",
                        cursor:
                          "pointer",
                        padding: 0,
                        background:
                          i === photoIdx
                            ? "#fff"
                            : "rgba(255,255,255,.4)"
                      }}
                    />
                  )
                )}
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              height: 80,
              background:
                `linear-gradient(
                  135deg,
                  ${typeColor},
                  ${C.navy}
                )`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12
            }}
          >
            <span
              style={{
                fontSize: 28
              }}
            >
              {PROJECT_TYPE_ICONS[
                inst.projectType
              ] || "⚡"}
            </span>

            <div>
              <div
                style={{
                  fontSize: 10,
                  color:
                    "rgba(255,255,255,.65)",
                  letterSpacing: ".1em",
                  textTransform:
                    "uppercase"
                }}
              >
                {PROJECT_TYPE_LABELS[
                  inst.projectType
                ] ||
                  inst.projectType}
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: "#fff",
                  fontWeight: 700
                }}
              >
                {inst.province}
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            padding:
              "16px 18px 18px"
          }}
        >

          {/* TITLE */}
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "flex-start",
              marginBottom: 12
            }}
          >
            <div
              style={{
                flex: 1,
                paddingRight: 8
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: C.navy,
                  lineHeight: 1.3,
                  marginBottom: 3
                }}
              >
                {inst.name}
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: C.subtle
                }}
              >
                📍{" "}
                {inst.city ||
                  inst.province}

                {(
                  inst.installationdate ||
                  inst.installationDate
                ) && (
                  <>
                    {" · "}
                    {inst.installationdate ||
                      inst.installationDate}
                  </>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background:
                  C.sectionBg,
                border: "none",
                borderRadius: 8,
                width: 26,
                height: 26,
                cursor: "pointer",
                color: C.subtle,
                fontSize: 16
              }}
            >
              ×
            </button>
          </div>


          {/* DOCUMENT CARD */}
          {hasDoc && (
            <div
              onClick={() =>
                setDocumentOpen(true)
              }
              style={{
                background: C.white,
                border:
                  `1px solid ${C.border}`,
                borderRadius: 12,
                padding:
                  "13px 14px",
                marginBottom: 12,
                cursor: "pointer",
                boxShadow: C.shadow
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow =
                  C.shadowMd;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow =
                  C.shadow;
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 11
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background:
                      C.greenLight,
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    fontSize: 17,
                    flexShrink: 0
                  }}
                >
                  📄
                </div>

                <div
                  style={{
                    minWidth: 0,
                    flex: 1
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      color: C.green,
                      textTransform:
                        "uppercase",
                      letterSpacing:
                        ".08em",
                      marginBottom: 4
                    }}
                  >
                    Research Document
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: C.navy,
                      lineHeight: 1.3,
                      marginBottom: 5
                    }}
                  >
                    {inst.title ||
                      "Project Document"}
                  </div>

                  {inst.excerpt && (
                    <div
                      style={{
                        fontSize: 11,
                        color: C.subtle,
                        lineHeight: 1.55,
                        display:
                          "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient:
                          "vertical",
                        overflow: "hidden"
                      }}
                    >
                      {inst.excerpt}
                    </div>
                  )}

                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 10,
                      fontWeight: 800,
                      color: C.green
                    }}
                  >
                    Read full document →
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* STATS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: 7,
              marginBottom: 12
            }}
          >
            {[
              [
                "⚡",
                "System Size",
                `${inst.capacityKW} kW`
              ],
              [
                "👥",
                "People Served",
                fmtShort(
                  inst.peopleServed
                )
              ],
              [
                "🌿",
                "CO₂ Avoided",
                `${inst.annualCO2} t/yr`
              ],
              [
                "🌳",
                "Tree Equiv.",
                `${fmtShort(
                  inst.treeEquiv
                )} trees`
              ]
            ].map(
              ([icon, label, value]) => (
                <div
                  key={label}
                  style={{
                    background:
                      C.sectionBg,
                    borderRadius: 9,
                    padding:
                      "9px 11px",
                    border:
                      `1px solid ${C.border}`
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: C.subtle,
                      marginBottom: 2
                    }}
                  >
                    {icon} {label}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: C.navy
                    }}
                  >
                    {value}
                  </div>
                </div>
              )
            )}
          </div>


          {/* TYPE */}
          <span
            style={{
              background:
                typeColor + "20",
              color: typeColor,
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 20,
              border:
                `1px solid ${typeColor}40`
            }}
          >
            {PROJECT_TYPE_ICONS[
              inst.projectType
            ] || "⚡"}{" "}
            {PROJECT_TYPE_LABELS[
              inst.projectType
            ] ||
              inst.projectType}
          </span>

        </div>
      </div>


      {/* DOCUMENT MODAL */}
      {documentOpen && (
        <div
          onClick={() =>
            setDocumentOpen(false)
          }
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(15,23,42,.68)",
            zIndex: 10000,
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            padding: 20
          }}
        >
          <div
            onClick={e =>
              e.stopPropagation()
            }
            style={{
              width:
                "min(950px,95vw)",
              height:
                "min(850px,92vh)",
              background: C.white,
              borderRadius: 18,
              overflow: "hidden",
              display: "flex",
              flexDirection:
                "column",
              boxShadow:
                "0 25px 90px rgba(0,0,0,.30)"
            }}
          >

            <div
              style={{
                padding:
                  "16px 22px",
                borderBottom:
                  `1px solid ${C.border}`,
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                gap: 15
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: C.navy
                  }}
                >
                  {inst.title ||
                    "Project Document"}
                </div>

                <div
                  style={{
                    fontSize: 10,
                    color: C.subtle,
                    marginTop: 3
                  }}
                >
                  {inst.name}
                </div>
              </div>

              <button
                onClick={() =>
                  setDocumentOpen(false)
                }
                style={{
                  background:
                    C.sectionBg,
                  border: "none",
                  borderRadius: 9,
                  width: 35,
                  height: 35,
                  cursor:
                    "pointer",
                  color: C.navy,
                  fontSize: 20
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                flex: 1,
                overflowY:
                  "auto",
                background:
                  "#f7f8f7",
                padding:
                  "30px 20px"
              }}
            >
              <article
                style={{
                  width:
                    "min(720px,100%)",
                  margin:
                    "0 auto",
                  background:
                    C.white,
                  border:
                    `1px solid ${C.border}`,
                  padding:
                    "45px clamp(24px,6vw,65px)",
                  boxShadow:
                    C.shadow
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: C.green,
                    textTransform:
                      "uppercase",
                    letterSpacing:
                      ".12em",
                    marginBottom:
                      10
                  }}
                >
                  SolarPak Research
                </div>

                <h1
                  style={{
                    fontSize: 30,
                    lineHeight: 1.2,
                    fontWeight: 800,
                    color: C.navy,
                    marginBottom:
                      12
                  }}
                >
                  {inst.title ||
                    "Project Document"}
                </h1>

                <div
                  style={{
                    height: 3,
                    width: 48,
                    background:
                      C.green,
                    borderRadius: 3,
                    marginBottom:
                      30
                  }}
                />

                <DocumentContent
                  document={
                    inst.document
                  }
                />
              </article>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// MAIN POWERED ATLAS
// ═══════════════════════════════════════════════════════════════════════════════

export default function PoweredAtlas() {
  const mapRef = useRef(null);
  const mapInstanceRef =
    useRef(null);
  const markersRef =
    useRef({});

  const [leafletLoaded, setLeafletLoaded] =
    useState(false);

  const [installations, setInstallations] =
    useState([]);

  const [loadingData, setLoadingData] =
    useState(true);

  const [csvError, setCsvError] =
    useState("");

  const [selected, setSelected] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [filterProvince, setFilterProvince] =
    useState("All");

  const [filterType, setFilterType] =
    useState("all");


  // ───────────────────────────────────────────────────────────────────────────
  // LOAD LEAFLET
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    const existingCss =
      document.querySelector(
        'link[href*="leaflet"]'
      );

    if (!existingCss) {
      const link =
        document.createElement(
          "link"
        );

      link.rel = "stylesheet";
      link.href =
        "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

      document.head.appendChild(
        link
      );
    }

    const existingScript =
      document.querySelector(
        'script[src*="leaflet"]'
      );

    if (existingScript) {
      existingScript.addEventListener(
        "load",
        () => setLeafletLoaded(true)
      );
      return;
    }

    const script =
      document.createElement(
        "script"
      );

    script.src =
      "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

    script.onload = () =>
      setLeafletLoaded(true);

    script.onerror = () =>
      console.error(
        "Unable to load Leaflet."
      );

    document.body.appendChild(
      script
    );
  }, []);


  // ───────────────────────────────────────────────────────────────────────────
  // LOAD CSV
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    async function loadCSV() {
      setLoadingData(true);
      setCsvError("");

      try {
        const response =
          await fetch(
            ATLAS_CSV,
            {
              cache: "no-store"
            }
          );

        if (!response.ok) {
          throw new Error(
            `CSV request failed with status ${response.status}`
          );
        }

        const text =
          await response.text();

        console.log(
          "Atlas CSV response:",
          text.slice(0, 1000)
        );

        const parsed =
          parseAtlasCSV(text);

        console.log(
          "Atlas parsed installations:",
          parsed.length
        );

        console.log(
          "First parsed installation:",
          parsed[0]
        );

        if (
          !cancelled
        ) {
          setInstallations(
            parsed
          );

          if (
            parsed.length === 0
          ) {
            setCsvError(
              "CSV loaded, but no valid installations were found."
            );
          }
        }
      } catch (error) {
        console.error(
          "Atlas CSV error:",
          error
        );

        if (!cancelled) {
          setCsvError(
            error.message ||
              "Unable to load Atlas CSV."
          );
        }
      }

      if (!cancelled) {
        setLoadingData(false);
      }
    }

    loadCSV();

    return () => {
      cancelled = true;
    };
  }, []);


  // ───────────────────────────────────────────────────────────────────────────
  // CREATE MAP
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (
      !leafletLoaded ||
      !mapRef.current ||
      mapInstanceRef.current
    ) {
      return;
    }

    const L = window.L;

    const PAK_BOUNDS =
      L.latLngBounds(
        [
          [23.5, 60.5],
          [37.0, 77.0]
        ]
      );

    const map = L.map(
      mapRef.current,
      {
        center: [
          27.0,
          68.0
        ],
        zoom: 6,
        minZoom: 5,
        maxZoom: 16,
        maxBounds:
          PAK_BOUNDS,
        maxBoundsViscosity: 1
      }
    );

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 18
      }
    ).addTo(map);

    mapInstanceRef.current =
      map;

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current =
        null;
    };
  }, [leafletLoaded]);


  // ───────────────────────────────────────────────────────────────────────────
  // CREATE MARKERS
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (
      !mapInstanceRef.current ||
      !window.L
    ) {
      return;
    }

    const L = window.L;

    Object.values(
      markersRef.current
    ).forEach(marker => {
      marker.remove();
    });

    markersRef.current = {};

    installations.forEach(inst => {
      const icon =
        L.divIcon({
          html: getMarkerSVG(
            inst.projectType
          ),
          iconSize: [
            28,
            36
          ],
          iconAnchor: [
            14,
            36
          ],
          popupAnchor: [
            0,
            -36
          ],
          className: ""
        });

      const marker =
        L.marker(
          [
            inst.latitude,
            inst.longitude
          ],
          {
            icon,
            title: inst.name
          }
        ).addTo(
          mapInstanceRef.current
        );

      marker.on(
        "click",
        () => {
          setSelected(inst);

          mapInstanceRef.current.flyTo(
            [
              inst.latitude,
              inst.longitude
            ],
            13,
            {
              duration: 1
            }
          );
        }
      );

      markersRef.current[
        inst.id
      ] = marker;
    });

  }, [installations]);


  // ───────────────────────────────────────────────────────────────────────────
  // FILTERING
  // ───────────────────────────────────────────────────────────────────────────

  const filtered =
    useMemo(() => {
      const s =
        search
          .trim()
          .toLowerCase();

      return installations.filter(
        inst => {
          const matchesSearch =
            !s ||
            inst.name
              ?.toLowerCase()
              .includes(s) ||
            inst.city
              ?.toLowerCase()
              .includes(s) ||
            inst.province
              ?.toLowerCase()
              .includes(s);

          const matchesProvince =
            filterProvince ===
              "All" ||
            inst.province ===
              filterProvince;

          const matchesType =
            filterType === "all" ||
            inst.projectType ===
              filterType;

          return (
            matchesSearch &&
            matchesProvince &&
            matchesType
          );
        }
      );
    }, [
      installations,
      search,
      filterProvince,
      filterType
    ]);


  // ───────────────────────────────────────────────────────────────────────────
  // SHOW/HIDE MARKERS
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (
      !mapInstanceRef.current ||
      !window.L
    ) {
      return;
    }

    const map =
      mapInstanceRef.current;

    const filteredIds =
      new Set(
        filtered.map(
          inst => inst.id
        )
      );

    Object.entries(
      markersRef.current
    ).forEach(
      ([id, marker]) => {
        if (
          filteredIds.has(id)
        ) {
          if (
            !map.hasLayer(
              marker
            )
          ) {
            marker.addTo(map);
          }
        } else {
          if (
            map.hasLayer(
              marker
            )
          ) {
            marker.remove();
          }
        }
      }
    );
  }, [filtered]);


  // ───────────────────────────────────────────────────────────────────────────
  // STATS
  // ───────────────────────────────────────────────────────────────────────────

  const provinces =
    useMemo(
      () => [
        "All",
        ...new Set(
          installations
            .map(
              i => i.province
            )
            .filter(Boolean)
        )
      ],
      [installations]
    );

  const totalPeople =
    installations.reduce(
      (sum, i) =>
        sum +
        (i.peopleServed ||
          0),
      0
    );

  const totalKW =
    installations.reduce(
      (sum, i) =>
        sum +
        (i.capacityKW ||
          0),
      0
    );

  const totalCO2 =
    installations.reduce(
      (sum, i) =>
        sum +
        (i.annualCO2 ||
          0),
      0
    );

  const totalTrees =
    installations.reduce(
      (sum, i) =>
        sum +
        (i.treeEquiv ||
          0),
      0
    );


  // ───────────────────────────────────────────────────────────────────────────
  // SELECT INSTALLATION
  // ───────────────────────────────────────────────────────────────────────────

  function selectInstallation(
    inst
  ) {
    setSelected(inst);

    if (
      mapInstanceRef.current
    ) {
      mapInstanceRef.current.flyTo(
        [
          inst.latitude,
          inst.longitude
        ],
        13,
        {
          duration: 1
        }
      );
    }
  }


  // ───────────────────────────────────────────────────────────────────────────
  // STYLES
  // ───────────────────────────────────────────────────────────────────────────

  const selectStyle = {
    padding: "9px 13px",
    border:
      `1px solid ${C.border}`,
    borderRadius: 11,
    fontSize: 12,
    fontFamily: "inherit",
    color: C.body,
    background: C.white,
    cursor: "pointer",
    outline: "none"
  };


  // ───────────────────────────────────────────────────────────────────────────
  // RENDER
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        display: "flex",
        flexDirection:
          "column",
        gap: 20,
        padding: "0 24px",
        fontFamily:
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        color: C.body
      }}
    >

      <style>{`
        .powered-atlas-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 16px;
          align-items: start;
        }

        .powered-atlas-stats {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
        }

        @media (max-width: 850px) {
          .powered-atlas-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .powered-atlas-stats {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 420px) {
          .powered-atlas-stats {
            grid-template-columns: 1fr;
          }
        }

        .powered-atlas-map {
          width: 100%;
          height: 650px;
          border-radius: 16px;
          overflow: hidden;
        }

        @media (max-width: 600px) {
          .powered-atlas-map {
            height: 430px;
          }
        }

        .leaflet-container {
          font-family: Inter, system-ui, sans-serif;
        }
      `}</style>


      {/* HEADER */}
      <div
        style={{
          textAlign: "center"
        }}
      >
        <Eyebrow text="Powered Atlas" />

        <h2
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: C.navy,
            margin:
              "0 0 8px",
            letterSpacing:
              "-.02em"
          }}
        >
          SolarPak Installation Map
        </h2>

        <p
          style={{
            fontSize: 14,
            color: C.body,
            maxWidth: 480,
            margin:
              "0 auto",
            lineHeight: 1.7
          }}
        >
          Every installation,
          every community,
          every watt —
          mapped across Pakistan.
        </p>
      </div>


      {/* ERROR */}
      {csvError && (
        <div
          style={{
            background:
              "#fff8e7",
            border:
              "1px solid #f1d58a",
            borderRadius: 14,
            padding: 16,
            textAlign: "center"
          }}
        >
          <div
            style={{
              fontSize: 20,
              marginBottom: 5
            }}
          >
            ⚠️
          </div>

          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#7a5b00",
              marginBottom: 5
            }}
          >
            Unable to load Atlas data
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#8a7440"
            }}
          >
            {csvError}
          </div>

          <div
            style={{
              fontSize: 11,
              color: C.subtle,
              marginTop: 8
            }}
          >
            Expected CSV location:
            {" "}
            <strong>
              public/atlas.csv
            </strong>
          </div>
        </div>
      )}


      {/* FILTERS */}
      <div
        style={{
          background: C.white,
          border:
            `1px solid ${C.border}`,
          borderRadius: 16,
          padding:
            "14px 18px",
          display: "flex",
          gap: 10,
          flexWrap:
            "wrap",
          alignItems:
            "center"
        }}
      >
        <div
          style={{
            position:
              "relative",
            flex: 1,
            minWidth: 180
          }}
        >
          <span
            style={{
              position:
                "absolute",
              left: 12,
              top: "50%",
              transform:
                "translateY(-50%)",
              fontSize: 13,
              color: C.subtle,
              pointerEvents:
                "none"
            }}
          >
            🔍
          </span>

          <input
            type="text"
            placeholder=
              "Search installations, cities…"
            value={search}
            onChange={e =>
              setSearch(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding:
                "9px 13px 9px 34px",
              border:
                `1px solid ${C.border}`,
              borderRadius: 11,
              fontSize: 12,
              fontFamily:
                "inherit",
              color: C.navy,
              background:
                C.white,
              outline:
                "none",
              boxSizing:
                "border-box"
            }}
          />
        </div>

        <select
          value={
            filterProvince
          }
          onChange={e =>
            setFilterProvince(
              e.target.value
            )
          }
          style={
            selectStyle
          }
        >
          {provinces.map(
            province => (
              <option
                key={province}
                value={province}
              >
                {province}
              </option>
            )
          )}
        </select>

        <select
          value={filterType}
          onChange={e =>
            setFilterType(
              e.target.value
            )
          }
          style={
            selectStyle
          }
        >
          <option value="all">
            All Types
          </option>

          {Object.entries(
            PROJECT_TYPE_LABELS
          ).map(
            ([key, label]) => (
              <option
                key={key}
                value={key}
              >
                {label}
              </option>
            )
          )}
        </select>

        <span
          style={{
            fontSize: 12,
            color: C.subtle,
            whiteSpace:
              "nowrap"
          }}
        >
          {filtered.length}
          {" of "}
          {installations.length}
          {" shown"}
        </span>
      </div>


      {/* MAP + LIST */}
      <div
        className="powered-atlas-grid"
      >

        {/* MAP */}
        <div
          style={{
            position:
              "relative"
          }}
        >
          <div
            ref={mapRef}
            className=
              "powered-atlas-map"
            style={{
              border:
                `1px solid ${C.border}`,
              boxShadow:
                C.shadow,
              background:
                C.sectionBg
            }}
          />

          {!leafletLoaded && (
            <div
              style={{
                position:
                  "absolute",
                inset: 0,
                display:
                  "flex",
                flexDirection:
                  "column",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                gap: 12,
                zIndex: 10,
                background:
                  C.sectionBg,
                borderRadius:
                  16
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  border:
                    `3px solid ${C.border}`,
                  borderTopColor:
                    C.green,
                  borderRadius:
                    "50%",
                  animation:
                    "atlasSpin .8s linear infinite"
                }}
              />

              <span
                style={{
                  fontSize: 13,
                  color:
                    C.subtle
                }}
              >
                Loading map…
              </span>
            </div>
          )}

          <style>{`
            @keyframes atlasSpin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>


          {/* LEGEND */}
          <div
            style={{
              position:
                "absolute",
              bottom: 14,
              left: 14,
              zIndex: 1000,
              background:
                "rgba(255,255,255,.96)",
              borderRadius: 11,
              padding:
                "9px 13px",
              border:
                `1px solid ${C.border}`
            }}
          >
            <div
              style={{
                display:
                  "flex",
                flexWrap:
                  "wrap",
                gap:
                  "6px 14px"
              }}
            >
              {Object.entries(
                PROJECT_TYPE_LABELS
              ).map(
                ([key, label]) => (
                  <div
                    key={key}
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: 5
                    }}
                  >
                    <div
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius:
                          "50%",
                        background:
                          PROJECT_TYPE_COLORS[
                            key
                          ]
                      }}
                    />

                    <span
                      style={{
                        fontSize: 11,
                        color:
                          C.body
                      }}
                    >
                      {PROJECT_TYPE_ICONS[
                        key
                      ]}{" "}
                      {label}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>


        {/* SIDE PANEL */}
        <div
          style={{
            display:
              "flex",
            flexDirection:
              "column",
            gap: 10
          }}
        >

          {selected && (
            <ProjectCard
              inst={selected}
              onClose={() =>
                setSelected(
                  null
                )
              }
            />
          )}

          <div
            style={{
              background:
                C.white,
              border:
                `1px solid ${C.border}`,
              borderRadius: 16,
              padding: 14,
              boxShadow:
                C.shadow
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.subtle,
                letterSpacing:
                  ".08em",
                textTransform:
                  "uppercase",
                marginBottom:
                  10
              }}
            >
              Installations
            </div>

            <div
              style={{
                display:
                  "flex",
                flexDirection:
                  "column",
                gap: 6,
                maxHeight:
                  selected
                    ? 200
                    : 420,
                overflowY:
                  "auto"
              }}
            >
              {filtered.length ===
                0 && (
                <div
                  style={{
                    textAlign:
                      "center",
                    padding: 20,
                    color:
                      C.subtle,
                    fontSize: 12
                  }}
                >
                  No installations
                  match filters.
                </div>
              )}

              {filtered.map(
                inst => {
                  const color =
                    PROJECT_TYPE_COLORS[
                      inst.projectType
                    ] ||
                    C.greenMid;

                  const isSelected =
                    selected?.id ===
                    inst.id;

                  return (
                    <button
                      key={
                        inst.id
                      }
                      onClick={() =>
                        selectInstallation(
                          inst
                        )
                      }
                      style={{
                        background:
                          isSelected
                            ? C.greenLight
                            : C.white,
                        border:
                          `1px solid ${
                            isSelected
                              ? C.green
                              : C.border
                          }`,
                        borderRadius:
                          12,
                        padding:
                          "10px 12px",
                        cursor:
                          "pointer",
                        textAlign:
                          "left",
                        fontFamily:
                          "inherit"
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: 9
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius:
                              8,
                            background:
                              color +
                              "20",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            fontSize: 14,
                            flexShrink:
                              0
                          }}
                        >
                          {PROJECT_TYPE_ICONS[
                            inst.projectType
                          ] ||
                            "⚡"}
                        </div>

                        <div
                          style={{
                            flex: 1,
                            minWidth: 0
                          }}
                        >
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color:
                                C.navy,
                              whiteSpace:
                                "nowrap",
                              overflow:
                                "hidden",
                              textOverflow:
                                "ellipsis"
                            }}
                          >
                            {inst.name}
                          </div>

                          <div
                            style={{
                              fontSize: 10,
                              color:
                                C.subtle
                            }}
                          >
                            {inst.city ||
                              inst.province}
                            {" · "}
                            {inst.capacityKW}
                            kW
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>


      {/* FOOTER */}
      <p
        style={{
          fontSize: 11,
          color: C.subtle,
          textAlign: "center",
          lineHeight: 1.7,
          margin: 0
        }}
      >
        Powered Atlas · SolarPak
        installation network ·
        Map © OpenStreetMap
      </p>
    </div>
  );
}