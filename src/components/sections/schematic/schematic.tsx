"use client";

import { Zap } from "lucide-react";
import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import {
  ELEMENT_DESCRIPTION,
  LOAD_KIND,
  boardReducer,
  buildCircuits,
  createInitialBoard,
  describeBoard,
  describeBreaker,
  findShortCircuitTarget,
  isBusLive,
  isCircuitLive,
  isEverythingOn,
  isLoadPowered,
  hasLightSwitch,
  isRcdFed,
  isThreePhase,
  type CircuitDefinition,
  type CircuitInput,
} from "./circuit-model";

/**
 * Interaktywny schemat jednokreskowy rozdzielnicy. Przy wejściu rysuje się raz,
 * potem można klikać rozłącznik, RCD i wyłączniki – prąd (żółte kreski) płynie
 * tylko tam, gdzie obwód jest zamknięty. Obwody przychodzą z CMS.
 */

const INK = "var(--ink)";
const PHASE = "var(--wire-l)";
const HEAT = "#e2572b";
const DIMMED_OPACITY = 0.28;
const DIMMED_LOAD_OPACITY = 0.55;
const INTRO_DURATION_MS = 3_600;
const SHORT_CIRCUIT_TRIP_DELAY_MS = 160;
const LABEL_CLASS = "fill-ink-soft";
const LABEL_STYLE: CSSProperties = { fontSize: 13.5, letterSpacing: "0.01em" };
const SMALL_LABEL_STYLE: CSSProperties = { fontSize: 12.5, letterSpacing: "0.01em" };
const STATE_STYLE: CSSProperties = { fontSize: 11, fontWeight: 700 };

const CENTER_X = 250;
const BUS_Y = 214;
const BUS_START_X = 70;
const BUS_END_X = 430;
const BREAKER_TOP = 244;
const BREAKER_HEIGHT = 40;
const BREAKER_BOTTOM = BREAKER_TOP + BREAKER_HEIGHT;
const LOAD_LABEL_Y = 406;

/** Łącznik światła wpięty między wyłącznik nadprądowy a lampę. */
const LIGHT_SWITCH = { TOP: 300, BOTTOM: 328 } as const;

const LOAD_TOP: Readonly<Record<CircuitDefinition["kind"], number>> = {
  [LOAD_KIND.SOCKETS]: 352,
  [LOAD_KIND.LIGHTING]: 352,
  [LOAD_KIND.THREE_PHASE]: 340,
  [LOAD_KIND.SERVER]: 338,
};

const LEVER_ANGLE = {
  MAIN_CLOSED: 8,
  MAIN_OPEN: 38,
  BREAKER_ON: 40,
  BREAKER_OFF: -40,
} as const;

const SEGMENT = {
  FEED: `M${CENTER_X} 20 V70`,
  MAIN_TO_RCD: `M${CENTER_X} 110 V140`,
  RCD_TO_BUS: `M${CENTER_X} 184 V${BUS_Y}`,
  BUS_LEFT: `M${CENTER_X} ${BUS_Y} H${BUS_START_X}`,
  BUS_RIGHT: `M${CENTER_X} ${BUS_Y} H${BUS_END_X}`,
} as const;

const delay = (seconds: number): CSSProperties => ({ ["--delay" as string]: `${seconds}s` });

const leverStyle = (angle: number, originX: number, originY: number): CSSProperties => ({
  transform: `rotate(${angle}deg)`,
  transformOrigin: `${originX}px ${originY}px`,
  transformBox: "view-box",
});

const circuitX = (index: number, count: number): number =>
  BUS_START_X + ((index + 0.5) * (BUS_END_X - BUS_START_X)) / count;

type HintHandler = (hint: string | null) => void;

/** Podpowiedź pokazuje się przy najechaniu myszą albo fokusie z klawiatury. */
const hintHandlers = (hint: string, onHint: HintHandler) => ({
  onPointerEnter: () => onHint(hint),
  onPointerLeave: () => onHint(null),
  onFocus: () => onHint(hint),
  onBlur: () => onHint(null),
});

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
  readonly hint: string;
  readonly onHint: HintHandler;
  readonly pressed: boolean;
  readonly onToggle: () => void;
  readonly hitArea: { readonly x: number; readonly y: number; readonly width: number; readonly height: number };
  readonly delaySeconds: number;
  readonly children: ReactNode;
}

/** Klikalny element schematu – działa myszką, dotykiem i klawiaturą (Enter / spacja). */
function Control({ label, hint, onHint, pressed, onToggle, hitArea, delaySeconds, children }: ControlProps) {
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
      {...hintHandlers(hint, onHint)}
    >
      <rect className="focus-ring" rx="6" {...hitArea} />
      {children}
    </g>
  );
}

function StateMark({ on, x, y, compact = false }: { readonly on: boolean; readonly x: number; readonly y: number; readonly compact?: boolean }) {
  const text = compact ? (on ? "I" : "0") : on ? "I – załączony" : "0 – wyłączony";
  return (
    <text x={x} y={y} style={STATE_STYLE} className={on ? "fill-ok" : "fill-danger"}>
      {text}
    </text>
  );
}

/** Trzy ukośne kreski na przewodzie – oznaczenie trzech faz na schemacie jednokreskowym. */
function ThreePhaseMark({ x, y }: { readonly x: number; readonly y: number }) {
  const offsets = [-7, 0, 7];
  return (
    <g stroke={INK} strokeWidth={1.5}>
      {offsets.map((offset) => (
        <path key={offset} d={`M${x - 5} ${y + offset + 3} L${x + 5} ${y + offset - 3}`} />
      ))}
    </g>
  );
}

interface LoadSymbolProps {
  readonly circuit: CircuitDefinition;
  readonly x: number;
  readonly live: boolean;
}

function LoadSymbol({ circuit, x, live }: LoadSymbolProps) {
  const top = LOAD_TOP[circuit.kind];
  switch (circuit.kind) {
    case LOAD_KIND.SOCKETS:
      return (
        <g className="load" style={{ opacity: live ? 1 : DIMMED_LOAD_OPACITY }}>
          <path d={`M${x - 16} ${top} A16 16 0 0 0 ${x + 16} ${top} Z`} className={cn("socket-fill", live && "socket-live")} />
          <path d={`M${x - 20} ${top} H${x + 20}`} stroke={INK} strokeWidth={1.75} />
          <path d={`M${x - 16} ${top} A16 16 0 0 0 ${x + 16} ${top}`} stroke={INK} strokeWidth={1.75} />
        </g>
      );
    case LOAD_KIND.LIGHTING:
      return (
        <g>
          <circle cx={x} cy={top + 16} r="27" className={cn("lamp-glow", live && "lamp-glow-on")} />
          <circle cx={x} cy={top + 16} r="16" stroke={INK} strokeWidth={1.75} className={live ? "fill-pe-yellow" : "fill-surface"} />
          <path
            d={`M${x - 11} ${top + 5} L${x + 11} ${top + 27} M${x + 11} ${top + 5} L${x - 11} ${top + 27}`}
            stroke={live ? "#16202c" : INK}
            strokeWidth={1.5}
          />
        </g>
      );
    case LOAD_KIND.THREE_PHASE:
      return (
        <g className="load" style={{ opacity: live ? 1 : DIMMED_LOAD_OPACITY }}>
          <rect x={x - 24} y={top} width="48" height="34" rx="4" stroke={INK} strokeWidth={1.75} className="fill-surface" />
          {[-11, 11].map((offset) => (
            <g key={offset}>
              <circle cx={x + offset} cy={top + 17} r="9" className={cn("burner-glow", live && "burner-glow-on")} fill={HEAT} />
              <circle cx={x + offset} cy={top + 17} r="6.5" stroke={live ? HEAT : INK} strokeWidth={1.5} />
            </g>
          ))}
        </g>
      );
    case LOAD_KIND.SERVER:
      return (
        <g>
          <rect
            x={x - 32}
            y={top}
            width="64"
            height="50"
            rx="5"
            strokeWidth={2}
            className="fill-surface"
            stroke={live ? "var(--wire-n)" : "var(--rule)"}
          />
          <text
            x={x}
            y={top + 31}
            textAnchor="middle"
            fill={live ? "var(--wire-n)" : "var(--ink-soft)"}
            style={{ fontSize: 17, fontWeight: 700 }}
          >
            {live ? "</>" : "zzz"}
          </text>
          <circle cx={x + 24} cy={top + 9} r="3" className={live ? "fill-ok led-blink" : "fill-rule"} />
        </g>
      );
  }
}

/** Iskra zwarcia – kilka promieni i błysk, odtwarzane raz przy każdej symulacji. */
function ShortCircuitBurst({ x, y }: { readonly x: number; readonly y: number }) {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <g className="burst" style={{ transformOrigin: `${x}px ${y}px`, transformBox: "view-box" }} aria-hidden="true">
      <circle cx={x} cy={y} r="14" fill="var(--pe-yellow)" opacity="0.9" />
      {rays.map((angle) => {
        const radians = (angle * Math.PI) / 180;
        return (
          <path
            key={angle}
            d={`M${x + Math.cos(radians) * 10} ${y + Math.sin(radians) * 10} L${x + Math.cos(radians) * 26} ${y + Math.sin(radians) * 26}`}
            stroke={HEAT}
            strokeWidth={3}
          />
        );
      })}
    </g>
  );
}

interface SchematicProps {
  readonly circuits?: readonly CircuitInput[] | null;
  readonly className?: string;
}

export function Schematic({ circuits: circuitInputs, className }: SchematicProps) {
  const circuits = useMemo(() => buildCircuits(circuitInputs), [circuitInputs]);
  const initialBoard = useMemo(() => createInitialBoard(circuits), [circuits]);
  const [board, dispatch] = useReducer(boardReducer, initialBoard);
  const [isIntroDone, setIntroDone] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [burstKey, setBurstKey] = useState(0);
  const tripTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroDone(true), INTRO_DURATION_MS);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(tripTimer.current);
    };
  }, []);

  const rcdFed = isRcdFed(board);
  const busLive = isBusLive(board);
  const hasThreePhase = circuits.some(isThreePhase);
  const shortTarget = findShortCircuitTarget(circuits);
  const shortTargetIndex = shortTarget ? circuits.indexOf(shortTarget) : -1;
  const serverPosition = circuits.findIndex((circuit) => circuit.kind === LOAD_KIND.SERVER);
  const serverIndex = serverPosition >= 0 ? serverPosition : circuits.length - 1;
  const sparkTarget = circuits[serverIndex];
  const sparkX = circuitX(serverIndex, circuits.length);
  const sparkPath = `M${CENTER_X} 20 V${BUS_Y} H${sparkX} V${LOAD_TOP[sparkTarget.kind]}`;
  const status = describeBoard(board, circuits);
  const title = `Interaktywny schemat rozdzielnicy: rozłącznik główny, wyłącznik różnicowoprądowy i obwody ${circuits
    .map((circuit) => circuit.label)
    .join(", ")}. Elementy można włączać i wyłączać.`;

  const simulateShortCircuit = () => {
    if (!shortTarget || !isCircuitLive(board, shortTarget.id)) {
      return;
    }
    setBurstKey((key) => key + 1);
    window.clearTimeout(tripTimer.current);
    tripTimer.current = window.setTimeout(
      () => dispatch({ type: "short-circuit", id: shortTarget.id }),
      SHORT_CIRCUIT_TRIP_DELAY_MS,
    );
  };

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
        <title id="schematic-title">{title}</title>

        {/* Zasilanie – zawsze pod napięciem */}
        <g {...hintHandlers(ELEMENT_DESCRIPTION.FEED, setHint)}>
          <rect x={CENTER_X - 10} y="14" width="180" height="40" className="hover-area" />
          <Wire d={SEGMENT.FEED} live flowing={isIntroDone} delaySeconds={0} />
          <text x={CENTER_X + 14} y="34" className={LABEL_CLASS} style={LABEL_STYLE}>
            {hasThreePhase ? "Zasilanie 4×400 V" : "Zasilanie 230 V"}
          </text>
        </g>

        {/* Rozłącznik główny */}
        <Control
          label={board.mainSwitchOn ? "Wyłącz rozłącznik główny" : "Załącz rozłącznik główny"}
          hint={ELEMENT_DESCRIPTION.MAIN}
          onHint={setHint}
          pressed={board.mainSwitchOn}
          onToggle={() => dispatch({ type: "toggle-main" })}
          hitArea={{ x: CENTER_X - 14, y: 62, width: 196, height: 56 }}
          delaySeconds={0.45}
        >
          <circle cx={CENTER_X} cy="70" r="2.5" fill={INK} />
          <circle cx={CENTER_X} cy="110" r="2.5" fill={INK} />
          <path
            className="lever"
            d={`M${CENTER_X} 110 V72`}
            stroke={INK}
            strokeWidth={2}
            style={leverStyle(board.mainSwitchOn ? LEVER_ANGLE.MAIN_CLOSED : LEVER_ANGLE.MAIN_OPEN, CENTER_X, 110)}
          />
          <text x={CENTER_X + 32} y="90" className={LABEL_CLASS} style={LABEL_STYLE}>Rozłącznik główny</text>
          <StateMark on={board.mainSwitchOn} x={CENTER_X + 32} y={106} />
        </Control>
        <Wire d={SEGMENT.MAIN_TO_RCD} live={rcdFed} flowing={isIntroDone} delaySeconds={0.7} />

        {/* RCD */}
        <Control
          label={board.rcdOn ? "Naciśnij TEST na wyłączniku różnicowoprądowym" : "Załącz ponownie wyłącznik różnicowoprądowy"}
          hint={ELEMENT_DESCRIPTION.RCD}
          onHint={setHint}
          pressed={board.rcdOn}
          onToggle={() => dispatch({ type: "toggle-rcd" })}
          hitArea={{ x: CENTER_X - 32, y: 134, width: 186, height: 56 }}
          delaySeconds={1}
        >
          <rect
            x={CENTER_X - 24}
            y="140"
            width="48"
            height="44"
            rx="3"
            stroke={INK}
            strokeWidth={1.75}
            className={board.rcdOn ? "fill-surface" : "fill-paper"}
          />
          <text
            x={CENTER_X}
            y="166"
            textAnchor="middle"
            className={board.rcdOn ? "fill-ink" : "fill-ink-soft"}
            style={{ fontSize: 14, fontWeight: 700 }}
          >
            ΔI
          </text>
          <circle cx={CENTER_X + 17} cy="177" r="4.5" stroke={INK} strokeWidth={1} className="fill-paper" />
          <text x={CENTER_X + 17} y="179.6" textAnchor="middle" className="fill-ink" style={{ fontSize: 6.5, fontWeight: 800 }}>T</text>
          <text x={CENTER_X + 36} y="160" className={LABEL_CLASS} style={LABEL_STYLE}>RCD 30 mA</text>
          <StateMark on={board.rcdOn} x={CENTER_X + 36} y={176} />
        </Control>
        <Wire d={SEGMENT.RCD_TO_BUS} live={busLive} flowing={isIntroDone} delaySeconds={1.2} />

        {/* Szyna – prąd rozchodzi się od środka na boki */}
        <Wire d={SEGMENT.BUS_LEFT} live={busLive} flowing={isIntroDone} delaySeconds={1.4} width={3} />
        <Wire d={SEGMENT.BUS_RIGHT} live={busLive} flowing={isIntroDone} delaySeconds={1.4} width={3} />

        {/* Obwody */}
        {circuits.map((circuit, index) => {
          const x = circuitX(index, circuits.length);
          const breakerOn = board.breakers[circuit.id] === true;
          const live = isCircuitLive(board, circuit.id);
          const powered = isLoadPowered(board, circuit);
          const loadTop = LOAD_TOP[circuit.kind];
          const withSwitch = hasLightSwitch(circuit);
          const switchOn = board.lightSwitches[circuit.id] === true;
          return (
            <g key={circuit.id}>
              <Wire d={`M${x} ${BUS_Y} V${BREAKER_TOP}`} live={busLive} flowing={isIntroDone} delaySeconds={1.8 + index * 0.1} />
              <Control
                label={`${breakerOn ? "Wyłącz" : "Załącz"} obwód ${circuit.label} (${circuit.breaker})`}
                hint={describeBreaker(circuit)}
                onHint={setHint}
                pressed={breakerOn}
                onToggle={() => dispatch({ type: "toggle-breaker", id: circuit.id })}
                hitArea={{ x: x - 17, y: BREAKER_TOP - 6, width: 70, height: BREAKER_HEIGHT + 12 }}
                delaySeconds={2.1 + index * 0.1}
              >
                <rect
                  x={x - 12}
                  y={BREAKER_TOP}
                  width="24"
                  height={BREAKER_HEIGHT}
                  rx="2"
                  stroke={INK}
                  strokeWidth={isThreePhase(circuit) ? 2.5 : 1.75}
                  className={breakerOn ? "fill-surface" : "fill-paper"}
                />
                <path
                  className="lever"
                  d={`M${x} 273 V255`}
                  stroke={INK}
                  strokeWidth={1.75}
                  style={leverStyle(breakerOn ? LEVER_ANGLE.BREAKER_ON : LEVER_ANGLE.BREAKER_OFF, x, 264)}
                />
                <text x={x + 16} y="262" className={LABEL_CLASS} style={SMALL_LABEL_STYLE}>{circuit.breaker}</text>
                <StateMark on={breakerOn} x={x + 16} y={278} compact />
              </Control>
              {withSwitch ? (
                <>
                  <Wire d={`M${x} ${BREAKER_BOTTOM} V${LIGHT_SWITCH.TOP}`} live={live} flowing={isIntroDone} delaySeconds={2.4 + index * 0.1} stroke={PHASE} />
                  <Control
                    label={`${switchOn ? "Zgaś" : "Zapal"} światło – łącznik obwodu ${circuit.label}`}
                    hint={ELEMENT_DESCRIPTION.LIGHT_SWITCH}
                    onHint={setHint}
                    pressed={switchOn}
                    onToggle={() => dispatch({ type: "toggle-light-switch", id: circuit.id })}
                    hitArea={{ x: x - 14, y: LIGHT_SWITCH.TOP - 6, width: 70, height: LIGHT_SWITCH.BOTTOM - LIGHT_SWITCH.TOP + 12 }}
                    delaySeconds={2.6 + index * 0.1}
                  >
                    <circle cx={x} cy={LIGHT_SWITCH.TOP} r="2.2" fill={INK} />
                    <circle cx={x} cy={LIGHT_SWITCH.BOTTOM} r="2.2" fill={INK} />
                    <path
                      className="lever"
                      d={`M${x} ${LIGHT_SWITCH.BOTTOM} V${LIGHT_SWITCH.TOP + 2}`}
                      stroke={INK}
                      strokeWidth={1.75}
                      style={leverStyle(switchOn ? LEVER_ANGLE.MAIN_CLOSED : LEVER_ANGLE.MAIN_OPEN, x, LIGHT_SWITCH.BOTTOM)}
                    />
                    <text x={x + 16} y={LIGHT_SWITCH.TOP + 13} className={LABEL_CLASS} style={SMALL_LABEL_STYLE}>Łącznik</text>
                    <StateMark on={switchOn} x={x + 16} y={LIGHT_SWITCH.TOP + 27} compact />
                  </Control>
                  <Wire d={`M${x} ${LIGHT_SWITCH.BOTTOM} V${loadTop}`} live={powered} flowing={isIntroDone} delaySeconds={2.7 + index * 0.1} stroke={PHASE} />
                </>
              ) : (
                <Wire d={`M${x} ${BREAKER_BOTTOM} V${loadTop}`} live={live} flowing={isIntroDone} delaySeconds={2.4 + index * 0.1} stroke={PHASE} />
              )}
              {isThreePhase(circuit) && <ThreePhaseMark x={x} y={(BREAKER_BOTTOM + loadTop) / 2} />}

              <g className="symbol" style={delay(2.9 + index * 0.1)} {...hintHandlers(circuit.description, setHint)}>
                <rect x={x - 36} y={loadTop - 8} width="72" height={LOAD_LABEL_Y - loadTop + 14} className="hover-area" />
                <LoadSymbol circuit={circuit} x={x} live={powered} />
                <text x={x} y={LOAD_LABEL_Y} textAnchor="middle" className={LABEL_CLASS} style={SMALL_LABEL_STYLE}>
                  {circuit.kind === LOAD_KIND.SERVER && !powered ? "offline" : circuit.label}
                </text>
              </g>
            </g>
          );
        })}

        {shortTarget && burstKey > 0 && (
          <ShortCircuitBurst
            key={burstKey}
            x={circuitX(shortTargetIndex, circuits.length)}
            y={LOAD_TOP[shortTarget.kind] + 6}
          />
        )}

        {/* Tabliczka rysunkowa */}
        <g className="symbol" style={delay(3.4)}>
          <rect x="244" y="432" width="200" height="40" stroke="var(--rule)" strokeWidth={1} />
          <path d="M244 452 H444" stroke="var(--rule)" strokeWidth={1} />
          <text x="252" y="446" className={LABEL_CLASS} style={{ fontSize: 11 }}>Rozdzielnica RG</text>
          <text x="252" y="466" className={LABEL_CLASS} style={{ fontSize: 11 }}>Rys. P. Zych, arkusz 1/1</text>
        </g>

        {/* Impuls prądu – jedna podróż od zasilania do ostatniego odbiornika przy wejściu */}
        <circle
          className="spark"
          r="4.5"
          fill="var(--pe-yellow)"
          stroke="var(--ink)"
          strokeWidth={1}
          style={{ ...delay(3.5), offsetPath: `path("${sparkPath}")` }}
        />
      </svg>

      <div className="mt-3 border-t border-rule pt-3">
        <p aria-live="polite" className={cn("min-h-[5.6rem] text-[0.9rem] leading-snug", hint ? "text-ink" : "text-ink-soft")}>
          {hint ?? status}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {shortTarget && (
            <button
              type="button"
              onClick={simulateShortCircuit}
              disabled={!isCircuitLive(board, shortTarget.id)}
              className="inline-flex items-center gap-1.5 rounded-md border border-rule px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Zap size={14} aria-hidden="true" className="text-[#e2572b]" />
              Symuluj zwarcie w gniazdku
            </button>
          )}
          {!isEverythingOn(board) && (
            <button
              type="button"
              onClick={() => dispatch({ type: "reset", initial: initialBoard })}
              className="rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-paper transition-colors hover:bg-ink/85"
            >
              Załącz wszystko
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
