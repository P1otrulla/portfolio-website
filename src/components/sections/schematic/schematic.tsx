"use client";

import { useEffect, useReducer, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  CIRCUIT_ID,
  CIRCUITS,
  INITIAL_BOARD,
  boardReducer,
  describeBoard,
  isBusLive,
  isCircuitLive,
  isEverythingOn,
  isRcdFed,
  type CircuitDefinition,
} from "./circuit-model";

/**
 * Interaktywny schemat jednokreskowy rozdzielnicy. Przy wejściu rysuje się raz,
 * potem można klikać rozłącznik, RCD i wyłączniki – prąd (żółte kreski) płynie
 * tylko tam, gdzie obwód jest zamknięty.
 */

const INK = "var(--ink)";
const PHASE = "var(--wire-l)";
const DIMMED_OPACITY = 0.28;
const DIMMED_LOAD_OPACITY = 0.55;
const INTRO_DURATION_MS = 3_600;
const LABEL_CLASS = "fill-ink-soft";
const LABEL_STYLE: CSSProperties = { fontSize: 13.5, letterSpacing: "0.01em" };
const STATE_STYLE: CSSProperties = { fontSize: 11, fontWeight: 700 };
const SPARK_PATH = "M220 20 V214 H350 V338";

const BUS_Y = 214;
const BREAKER_TOP = 244;
const BREAKER_HEIGHT = 40;
const LOAD_Y = 352;
const SERVER_TOP = 338;

const LEVER_ANGLE = {
  MAIN_CLOSED: 8,
  MAIN_OPEN: 38,
  BREAKER_ON: 40,
  BREAKER_OFF: -40,
} as const;

const SEGMENT = {
  FEED: "M220 20 V70",
  MAIN_TO_RCD: "M220 110 V140",
  RCD_TO_BUS: `M220 184 V${BUS_Y}`,
  BUS_LEFT: `M220 ${BUS_Y} H60`,
  BUS_RIGHT: `M220 ${BUS_Y} H380`,
} as const;

const delay = (seconds: number): CSSProperties => ({ ["--delay" as string]: `${seconds}s` });

const leverStyle = (angle: number, originX: number, originY: number): CSSProperties => ({
  transform: `rotate(${angle}deg)`,
  transformOrigin: `${originX}px ${originY}px`,
  transformBox: "view-box",
});

const loadWirePath = (circuit: CircuitDefinition): string =>
  `M${circuit.x} ${BREAKER_TOP + BREAKER_HEIGHT} V${circuit.id === CIRCUIT_ID.SERVER ? SERVER_TOP : LOAD_Y}`;

interface WireProps {
  readonly d: string;
  readonly live: boolean;
  readonly flowing: boolean;
  readonly delaySeconds: number;
  readonly stroke?: string;
  readonly width?: number;
}

function Wire({ d, live, flowing, delaySeconds, stroke = INK, width = 1.75 }: WireProps) {
  return (
    <>
      <path
        className="trace wire-base"
        pathLength={1}
        d={d}
        stroke={stroke}
        strokeWidth={width}
        style={{ ...delay(delaySeconds), opacity: live ? 1 : DIMMED_OPACITY }}
      />
      <path className={cn("flow", live && flowing && "flow-on")} d={d} stroke="var(--pe-yellow)" strokeWidth={width} />
    </>
  );
}

interface ControlProps {
  readonly label: string;
  readonly pressed: boolean;
  readonly onToggle: () => void;
  readonly hitArea: { readonly x: number; readonly y: number; readonly width: number; readonly height: number };
  readonly delaySeconds: number;
  readonly children: ReactNode;
}

/** Klikalny element schematu – działa myszką, dotykiem i klawiaturą (Enter / spacja). */
function Control({ label, pressed, onToggle, hitArea, delaySeconds, children }: ControlProps) {
  const onKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  };
  return (
    <g
      className="control symbol"
      style={delay(delaySeconds)}
      role="button"
      tabIndex={0}
      aria-pressed={pressed}
      aria-label={label}
      onClick={onToggle}
      onKeyDown={onKeyDown}
    >
      <rect className="focus-ring" rx="6" {...hitArea} />
      {children}
    </g>
  );
}

function StateMark({ on, x, y }: { readonly on: boolean; readonly x: number; readonly y: number }) {
  return (
    <text x={x} y={y} style={STATE_STYLE} className={on ? "fill-ok" : "fill-danger"}>
      {on ? "I – załączony" : "0 – wyłączony"}
    </text>
  );
}

export function Schematic({ className }: { readonly className?: string }) {
  const [board, dispatch] = useReducer(boardReducer, INITIAL_BOARD);
  const [isIntroDone, setIntroDone] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroDone(true), INTRO_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const rcdFed = isRcdFed(board);
  const busLive = isBusLive(board);
  const socketsLive = isCircuitLive(board, CIRCUIT_ID.SOCKETS);
  const lightingLive = isCircuitLive(board, CIRCUIT_ID.LIGHTING);
  const serverLive = isCircuitLive(board, CIRCUIT_ID.SERVER);
  const status = describeBoard(board);

  return (
    <div className={className}>
      <svg
        viewBox="50 8 400 470"
        className="schematic h-auto w-full select-none"
        role="group"
        aria-labelledby="schematic-title"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title id="schematic-title">
          Interaktywny schemat rozdzielnicy: rozłącznik główny, wyłącznik różnicowoprądowy i trzy obwody – gniazda,
          oświetlenie oraz serwer z kodem. Elementy można włączać i wyłączać.
        </title>

        {/* Zasilanie – zawsze pod napięciem */}
        <Wire d={SEGMENT.FEED} live flowing={isIntroDone} delaySeconds={0} />
        <text x="234" y="34" className={LABEL_CLASS} style={LABEL_STYLE}>Zasilanie 230 V</text>

        {/* Rozłącznik główny */}
        <Control
          label={board.mainSwitchOn ? "Wyłącz rozłącznik główny" : "Załącz rozłącznik główny"}
          pressed={board.mainSwitchOn}
          onToggle={() => dispatch({ type: "toggle-main" })}
          hitArea={{ x: 206, y: 62, width: 200, height: 56 }}
          delaySeconds={0.45}
        >
          <circle cx="220" cy="70" r="2.5" fill={INK} />
          <circle cx="220" cy="110" r="2.5" fill={INK} />
          <path
            className="lever"
            d="M220 110 V72"
            stroke={INK}
            strokeWidth={2}
            style={leverStyle(board.mainSwitchOn ? LEVER_ANGLE.MAIN_CLOSED : LEVER_ANGLE.MAIN_OPEN, 220, 110)}
          />
          <text x="252" y="90" className={LABEL_CLASS} style={LABEL_STYLE}>Rozłącznik główny</text>
          <StateMark on={board.mainSwitchOn} x={252} y={106} />
        </Control>
        <Wire d={SEGMENT.MAIN_TO_RCD} live={rcdFed} flowing={isIntroDone} delaySeconds={0.7} />

        {/* RCD */}
        <Control
          label={board.rcdOn ? "Naciśnij TEST na wyłączniku różnicowoprądowym" : "Załącz ponownie wyłącznik różnicowoprądowy"}
          pressed={board.rcdOn}
          onToggle={() => dispatch({ type: "toggle-rcd" })}
          hitArea={{ x: 188, y: 134, width: 190, height: 56 }}
          delaySeconds={1}
        >
          <rect
            x="196"
            y="140"
            width="48"
            height="44"
            rx="3"
            stroke={INK}
            strokeWidth={1.75}
            className={board.rcdOn ? "fill-surface" : "fill-paper"}
          />
          <text x="220" y="166" textAnchor="middle" className={board.rcdOn ? "fill-ink" : "fill-ink-soft"} style={{ fontSize: 14, fontWeight: 700 }}>
            ΔI
          </text>
          <circle cx="237" cy="177" r="4.5" stroke={INK} strokeWidth={1} className="fill-paper" />
          <text x="237" y="179.6" textAnchor="middle" className="fill-ink" style={{ fontSize: 6.5, fontWeight: 800 }}>T</text>
          <text x="256" y="160" className={LABEL_CLASS} style={LABEL_STYLE}>RCD 30 mA</text>
          <StateMark on={board.rcdOn} x={256} y={176} />
        </Control>
        <Wire d={SEGMENT.RCD_TO_BUS} live={busLive} flowing={isIntroDone} delaySeconds={1.2} />

        {/* Szyna – prąd rozchodzi się od środka na boki */}
        <Wire d={SEGMENT.BUS_LEFT} live={busLive} flowing={isIntroDone} delaySeconds={1.4} width={3} />
        <Wire d={SEGMENT.BUS_RIGHT} live={busLive} flowing={isIntroDone} delaySeconds={1.4} width={3} />

        {/* Obwody */}
        {CIRCUITS.map((circuit, index) => {
          const breakerOn = board.breakers[circuit.id];
          const circuitLive = isCircuitLive(board, circuit.id);
          return (
            <g key={circuit.id}>
              <Wire d={`M${circuit.x} ${BUS_Y} V${BREAKER_TOP}`} live={busLive} flowing={isIntroDone} delaySeconds={1.8 + index * 0.1} />
              <Control
                label={`${breakerOn ? "Wyłącz" : "Załącz"} obwód ${circuit.label} (${circuit.breaker})`}
                pressed={breakerOn}
                onToggle={() => dispatch({ type: "toggle-breaker", id: circuit.id })}
                hitArea={{ x: circuit.x - 18, y: BREAKER_TOP - 6, width: 88, height: BREAKER_HEIGHT + 12 }}
                delaySeconds={2.1 + index * 0.1}
              >
                <rect
                  x={circuit.x - 12}
                  y={BREAKER_TOP}
                  width="24"
                  height={BREAKER_HEIGHT}
                  rx="2"
                  stroke={INK}
                  strokeWidth={1.75}
                  className={breakerOn ? "fill-surface" : "fill-paper"}
                />
                <path
                  className="lever"
                  d={`M${circuit.x} 273 V255`}
                  stroke={INK}
                  strokeWidth={1.75}
                  style={leverStyle(breakerOn ? LEVER_ANGLE.BREAKER_ON : LEVER_ANGLE.BREAKER_OFF, circuit.x, 264)}
                />
                <text x={circuit.x + 18} y="262" className={LABEL_CLASS} style={LABEL_STYLE}>{circuit.breaker}</text>
                <text x={circuit.x + 18} y="278" style={STATE_STYLE} className={breakerOn ? "fill-ok" : "fill-danger"}>
                  {breakerOn ? "I" : "0"}
                </text>
              </Control>
              <Wire d={loadWirePath(circuit)} live={circuitLive} flowing={isIntroDone} delaySeconds={2.4 + index * 0.1} stroke={PHASE} />
            </g>
          );
        })}

        {/* Gniazda */}
        <g className="symbol" style={delay(2.9)}>
         <g className="load" style={{ opacity: socketsLive ? 1 : DIMMED_LOAD_OPACITY }}>
          <path
            d="M74 352 A16 16 0 0 0 106 352 Z"
            className={cn("socket-fill", socketsLive && "socket-live")}
          />
          <path d="M70 352 H110" stroke={INK} strokeWidth={1.75} />
          <path d="M74 352 A16 16 0 0 0 106 352" stroke={INK} strokeWidth={1.75} />
          <text x="90" y="398" textAnchor="middle" className={LABEL_CLASS} style={LABEL_STYLE}>Gniazda</text>
         </g>
        </g>

        {/* Oświetlenie */}
        <g className="symbol load" style={delay(3)}>
          <circle cx="220" cy="368" r="27" className={cn("lamp-glow", lightingLive && "lamp-glow-on")} />
          <circle
            cx="220"
            cy="368"
            r="16"
            stroke={INK}
            strokeWidth={1.75}
            className={lightingLive ? "fill-pe-yellow" : "fill-surface"}
          />
          <path
            d="M209 357 L231 379 M231 357 L209 379"
            stroke={lightingLive ? "#16202c" : INK}
            strokeWidth={1.5}
          />
          <text x="220" y="404" textAnchor="middle" className={LABEL_CLASS} style={LABEL_STYLE}>Oświetlenie</text>
        </g>

        {/* Serwer z kodem */}
        <g className="symbol load" style={delay(3.1)}>
          <rect
            x="314"
            y={SERVER_TOP}
            width="72"
            height="50"
            rx="5"
            strokeWidth={2}
            className="fill-surface"
            stroke={serverLive ? "var(--wire-n)" : "var(--rule)"}
          />
          <text
            x="350"
            y="369"
            textAnchor="middle"
            fill={serverLive ? "var(--wire-n)" : "var(--ink-soft)"}
            style={{ fontSize: 17, fontWeight: 700 }}
          >
            {serverLive ? "</>" : "zzz"}
          </text>
          <circle cx="377" cy="347" r="3" className={serverLive ? "fill-ok led-blink" : "fill-rule"} />
          <text x="350" y="410" textAnchor="middle" className={LABEL_CLASS} style={LABEL_STYLE}>
            {serverLive ? "Serwer" : "Serwer offline"}
          </text>
        </g>

        {/* Tabliczka rysunkowa */}
        <g className="symbol" style={delay(3.3)}>
          <rect x="244" y="432" width="200" height="40" stroke="var(--rule)" strokeWidth={1} />
          <path d="M244 452 H444" stroke="var(--rule)" strokeWidth={1} />
          <text x="252" y="446" className={LABEL_CLASS} style={{ fontSize: 11 }}>Rozdzielnica RG</text>
          <text x="252" y="466" className={LABEL_CLASS} style={{ fontSize: 11 }}>Rys. P. Zych, arkusz 1/1</text>
        </g>

        {/* Impuls prądu – jedna podróż od zasilania do serwera przy wejściu */}
        <circle
          className="spark"
          r="4.5"
          fill="var(--pe-yellow)"
          stroke="var(--ink)"
          strokeWidth={1}
          style={{ ...delay(3.4), offsetPath: `path("${SPARK_PATH}")` }}
        />
      </svg>

      <div className="mt-3 flex min-h-[4.5rem] flex-col gap-2 border-t border-rule pt-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <p aria-live="polite" className="text-[0.9rem] leading-snug text-ink-soft">
          {status}
        </p>
        {!isEverythingOn(board) && (
          <button
            type="button"
            onClick={() => dispatch({ type: "reset" })}
            className="shrink-0 self-start rounded-md border border-rule px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-ink"
          >
            Załącz wszystko
          </button>
        )}
      </div>
    </div>
  );
}
