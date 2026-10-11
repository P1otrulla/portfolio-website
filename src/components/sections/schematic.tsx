import type { CSSProperties } from "react";

/**
 * Uproszczony schemat jednokreskowy rozdzielnicy. Ostatni obwód kończy się
 * „serwerem” z kodem – w jednym rysunku oba światy. Rysuje się raz przy wejściu.
 */

const STROKE = "var(--ink)";
const LABEL_CLASS = "fill-ink-soft";
const LABEL_STYLE: CSSProperties = { fontSize: 13.5, letterSpacing: "0.01em" };
const CURRENT_PATH = "M220 20 V214 H350 V338";

const delay = (seconds: number): CSSProperties => ({ ["--delay" as string]: `${seconds}s` });

interface Branch {
  readonly x: number;
  readonly breaker: string;
}

const BRANCHES: readonly Branch[] = Object.freeze([
  { x: 90, breaker: "B16" },
  { x: 220, breaker: "B10" },
  { x: 350, breaker: "B16" },
]);

export function Schematic({ className }: { readonly className?: string }) {
  return (
    <svg
      viewBox="50 8 400 470"
      className={`schematic ${className ?? ""}`}
      role="img"
      aria-labelledby="schematic-title"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title id="schematic-title">
        Schemat rozdzielnicy: zasilanie, rozłącznik, wyłącznik różnicowoprądowy i trzy obwody – gniazda, oświetlenie oraz
        serwer z kodem.
      </title>

      {/* Zasilanie */}
      <path className="trace" style={delay(0)} pathLength={1} d="M220 20 V70" stroke={STROKE} strokeWidth={1.75} />
      <text x="234" y="34" className={LABEL_CLASS} style={LABEL_STYLE}>Zasilanie 230 V</text>

      {/* Rozłącznik główny */}
      <g className="symbol" style={delay(0.45)}>
        <circle cx="220" cy="70" r="2.5" fill={STROKE} />
        <circle cx="220" cy="110" r="2.5" fill={STROKE} />
        <path d="M220 110 L240 76" stroke={STROKE} strokeWidth={1.75} />
        <text x="252" y="96" className={LABEL_CLASS} style={LABEL_STYLE}>Rozłącznik główny</text>
      </g>
      <path className="trace" style={delay(0.7)} pathLength={1} d="M220 110 V140" stroke={STROKE} strokeWidth={1.75} />

      {/* RCD */}
      <g className="symbol" style={delay(1)}>
        <rect x="196" y="140" width="48" height="44" rx="3" stroke={STROKE} strokeWidth={1.75} className="fill-surface" />
        <text x="220" y="167" textAnchor="middle" className="fill-ink" style={{ fontSize: 14, fontWeight: 700 }}>ΔI</text>
        <text x="256" y="167" className={LABEL_CLASS} style={LABEL_STYLE}>RCD 30 mA</text>
      </g>
      <path className="trace" style={delay(1.2)} pathLength={1} d="M220 184 V214" stroke={STROKE} strokeWidth={1.75} />

      {/* Szyna */}
      <path className="trace" style={delay(1.4)} pathLength={1} d="M60 214 H380" stroke={STROKE} strokeWidth={3} />

      {/* Obwody */}
      {BRANCHES.map((branch, index) => (
        <g key={branch.x}>
          <path
            className="trace"
            style={delay(1.8 + index * 0.1)}
            pathLength={1}
            d={`M${branch.x} 214 V244`}
            stroke={STROKE}
            strokeWidth={1.75}
          />
          <g className="symbol" style={delay(2.1 + index * 0.1)}>
            <rect x={branch.x - 12} y="244" width="24" height="40" rx="2" stroke={STROKE} strokeWidth={1.75} className="fill-surface" />
            <path d={`M${branch.x - 6} 270 L${branch.x + 6} 258`} stroke={STROKE} strokeWidth={1.5} />
            <text x={branch.x + 18} y="268" className={LABEL_CLASS} style={LABEL_STYLE}>{branch.breaker}</text>
          </g>
        </g>
      ))}
      <path className="trace" style={delay(2.4)} pathLength={1} d="M90 284 V352" stroke="var(--wire-l)" strokeWidth={1.75} />
      <path className="trace" style={delay(2.5)} pathLength={1} d="M220 284 V352" stroke="var(--wire-l)" strokeWidth={1.75} />
      <path className="trace" style={delay(2.6)} pathLength={1} d="M350 284 V338" stroke="var(--wire-l)" strokeWidth={1.75} />

      {/* Gniazda */}
      <g className="symbol" style={delay(2.9)}>
        <path d="M70 352 H110" stroke={STROKE} strokeWidth={1.75} />
        <path d="M74 352 A16 16 0 0 0 106 352" stroke={STROKE} strokeWidth={1.75} />
        <text x="90" y="398" textAnchor="middle" className={LABEL_CLASS} style={LABEL_STYLE}>Gniazda</text>
      </g>

      {/* Oświetlenie */}
      <g className="symbol" style={delay(3)}>
        <circle cx="220" cy="368" r="16" stroke={STROKE} strokeWidth={1.75} className="fill-surface" />
        <path d="M209 357 L231 379 M231 357 L209 379" stroke={STROKE} strokeWidth={1.5} />
        <text x="220" y="404" textAnchor="middle" className={LABEL_CLASS} style={LABEL_STYLE}>Oświetlenie</text>
      </g>

      {/* Serwer z kodem */}
      <g className="symbol" style={delay(3.1)}>
        <rect x="314" y="338" width="72" height="50" rx="5" stroke="var(--wire-n)" strokeWidth={2} className="fill-surface" />
        <text x="350" y="369" textAnchor="middle" fill="var(--wire-n)" style={{ fontSize: 17, fontWeight: 700 }}>&lt;/&gt;</text>
        <text x="350" y="410" textAnchor="middle" className={LABEL_CLASS} style={LABEL_STYLE}>Serwer</text>
      </g>

      {/* Tabliczka rysunkowa */}
      <g className="symbol" style={delay(3.3)}>
        <rect x="244" y="432" width="200" height="40" stroke="var(--rule)" strokeWidth={1} />
        <path d="M244 452 H444" stroke="var(--rule)" strokeWidth={1} />
        <text x="252" y="446" className={LABEL_CLASS} style={{ fontSize: 11 }}>Rozdzielnica RG</text>
        <text x="252" y="466" className={LABEL_CLASS} style={{ fontSize: 11 }}>Rys. P. Zych, arkusz 1/1</text>
      </g>

      {/* Impuls prądu – jedna podróż od zasilania do serwera */}
      <circle
        className="spark"
        r="4.5"
        fill="var(--pe-yellow)"
        stroke="var(--ink)"
        strokeWidth={1}
        style={{ ...delay(3.4), offsetPath: `path("${CURRENT_PATH}")` }}
      />
    </svg>
  );
}
