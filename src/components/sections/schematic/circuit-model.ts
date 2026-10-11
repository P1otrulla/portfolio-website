/**
 * Model rozdzielnicy z hero – czysta logika bez Reacta.
 * Prąd płynie: zasilanie → rozłącznik główny → RCD → szyna → wyłącznik nadprądowy → odbiornik.
 */

export const LOAD_KIND = {
  SOCKETS: "sockets",
  LIGHTING: "lighting",
  THREE_PHASE: "three-phase",
  SERVER: "server",
} as const;

export type LoadKind = (typeof LOAD_KIND)[keyof typeof LOAD_KIND];

export const LOAD_KINDS: readonly LoadKind[] = Object.freeze(Object.values(LOAD_KIND));

export const LOAD_KIND_LABEL: Readonly<Record<LoadKind, string>> = Object.freeze({
  [LOAD_KIND.SOCKETS]: "Gniazda",
  [LOAD_KIND.LIGHTING]: "Oświetlenie",
  [LOAD_KIND.THREE_PHASE]: "Odbiornik 3-fazowy (np. płyta)",
  [LOAD_KIND.SERVER]: "Serwer (kod)",
});

export const MAX_CIRCUITS = 5;
export const CIRCUIT_LABEL_MAX_LENGTH = 14;

export interface CircuitDefinition {
  readonly id: string;
  readonly kind: LoadKind;
  readonly label: string;
  readonly breaker: string;
  readonly description: string;
}

export interface CircuitInput {
  readonly kind: LoadKind;
  readonly label: string;
  readonly breaker: string;
  readonly description?: string | null;
}

const DEFAULT_DESCRIPTION: Readonly<Record<LoadKind, string>> = Object.freeze({
  [LOAD_KIND.SOCKETS]:
    "Obwód gniazd. Kuchnia, łazienka i pokoje dostają osobne obwody, żeby jedna usterka nie wyłączała całego domu.",
  [LOAD_KIND.LIGHTING]: "Oświetlenie na osobnym obwodzie – gdy wybije gniazda, nie zostajesz po ciemku.",
  [LOAD_KIND.THREE_PHASE]: "Odbiornik trójfazowy 400 V, np. płyta indukcyjna. Trzy kreski na przewodzie to trzy fazy.",
  [LOAD_KIND.SERVER]: "Serwer z kodem – tu kończy się prąd, a zaczyna programowanie.",
});

export const DEFAULT_CIRCUITS: readonly CircuitInput[] = Object.freeze([
  { kind: LOAD_KIND.SOCKETS, label: "Gniazda", breaker: "B16" },
  { kind: LOAD_KIND.LIGHTING, label: "Oświetlenie", breaker: "B10" },
  { kind: LOAD_KIND.THREE_PHASE, label: "Indukcja", breaker: "C20 3P" },
  { kind: LOAD_KIND.SERVER, label: "Serwer", breaker: "B16" },
]);

const isLoadKind = (value: unknown): value is LoadKind => LOAD_KINDS.includes(value as LoadKind);

/** Normalizuje dane z CMS: odrzuca puste wpisy, przycina długość, w razie braku – domyślna rozdzielnica. */
export function buildCircuits(inputs: readonly CircuitInput[] | null | undefined): readonly CircuitDefinition[] {
  const valid = (inputs ?? []).filter(
    (input) => isLoadKind(input.kind) && input.label.trim().length > 0 && input.breaker.trim().length > 0,
  );
  const source = valid.length > 0 ? valid : DEFAULT_CIRCUITS;
  return Object.freeze(
    source.slice(0, MAX_CIRCUITS).map((input, index) => ({
      id: `circuit-${index}`,
      kind: input.kind,
      label: input.label.trim().slice(0, CIRCUIT_LABEL_MAX_LENGTH),
      breaker: input.breaker.trim(),
      description: input.description?.trim() || DEFAULT_DESCRIPTION[input.kind],
    })),
  );
}

export const isThreePhase = (circuit: CircuitDefinition): boolean => circuit.kind === LOAD_KIND.THREE_PHASE;

/** Obwody oświetleniowe mają za wyłącznikiem nadprądowym łącznik (włącznik światła). */
export const hasLightSwitch = (circuit: CircuitDefinition): boolean => circuit.kind === LOAD_KIND.LIGHTING;

/** Opis wyłącznika nadprądowego – litera to charakterystyka, liczba to prąd znamionowy. */
export function describeBreaker(circuit: CircuitDefinition): string {
  const poles = isThreePhase(circuit) ? "trójbiegunowy wyłącznik nadprądowy" : "wyłącznik nadprądowy";
  return `${circuit.breaker} – ${poles} obwodu „${circuit.label}”. Chroni przewód przed przeciążeniem i zwarciem. Litera to charakterystyka (B – obwody domowe, C – silniki i grzałki), liczba to prąd w amperach.`;
}

export const ELEMENT_DESCRIPTION = Object.freeze({
  FEED: "Przyłącze z licznika. Od tego miejsca zaczyna się Twoja instalacja.",
  MAIN: "Rozłącznik główny odcina całą instalację naraz. Wyłącza się go przed każdą pracą w rozdzielnicy.",
  RCD: "Wyłącznik różnicowoprądowy 30 mA chroni ludzi przed porażeniem. Raz w miesiącu warto nacisnąć na nim przycisk TEST.",
  LIGHT_SWITCH:
    "Łącznik oświetlenia, czyli zwykły włącznik światła na ścianie. Przerywa przewód fazowy idący do lampy – przewody przed nim dalej są pod napięciem.",
});

export type BoardEvent = "short-circuit" | "light-switch" | null;

export interface BoardState {
  readonly mainSwitchOn: boolean;
  readonly rcdOn: boolean;
  readonly breakers: Readonly<Record<string, boolean>>;
  readonly lightSwitches: Readonly<Record<string, boolean>>;
  readonly lastEvent: BoardEvent;
}

export function createInitialBoard(circuits: readonly CircuitDefinition[]): BoardState {
  return Object.freeze({
    mainSwitchOn: true,
    rcdOn: true,
    breakers: Object.freeze(Object.fromEntries(circuits.map((circuit) => [circuit.id, true]))),
    lightSwitches: Object.freeze(
      Object.fromEntries(circuits.filter(hasLightSwitch).map((circuit) => [circuit.id, true])),
    ),
    lastEvent: null,
  });
}

export type BoardAction =
  | { readonly type: "toggle-main" }
  | { readonly type: "toggle-rcd" }
  | { readonly type: "toggle-breaker"; readonly id: string }
  | { readonly type: "toggle-light-switch"; readonly id: string }
  | { readonly type: "short-circuit"; readonly id: string }
  | { readonly type: "reset"; readonly initial: BoardState };

export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "toggle-main":
      return { ...state, mainSwitchOn: !state.mainSwitchOn, lastEvent: null };
    case "toggle-rcd":
      return { ...state, rcdOn: !state.rcdOn, lastEvent: null };
    case "toggle-breaker":
      return { ...state, breakers: { ...state.breakers, [action.id]: !state.breakers[action.id] }, lastEvent: null };
    case "toggle-light-switch": {
      const switchedOn = !state.lightSwitches[action.id];
      return {
        ...state,
        lightSwitches: { ...state.lightSwitches, [action.id]: switchedOn },
        lastEvent: switchedOn ? null : "light-switch",
      };
    }
    case "short-circuit":
      return { ...state, breakers: { ...state.breakers, [action.id]: false }, lastEvent: "short-circuit" };
    case "reset":
      return action.initial;
  }
}

export const isRcdFed = (state: BoardState): boolean => state.mainSwitchOn;

export const isBusLive = (state: BoardState): boolean => state.mainSwitchOn && state.rcdOn;

export const isCircuitLive = (state: BoardState, id: string): boolean => isBusLive(state) && state.breakers[id] === true;

/** Czy odbiornik faktycznie dostaje prąd – dla oświetlenia liczy się też łącznik. */
export const isLoadPowered = (state: BoardState, circuit: CircuitDefinition): boolean =>
  isCircuitLive(state, circuit.id) && (!hasLightSwitch(circuit) || state.lightSwitches[circuit.id] === true);

export const isEverythingOn = (state: BoardState): boolean =>
  state.mainSwitchOn &&
  state.rcdOn &&
  Object.values(state.breakers).every(Boolean) &&
  Object.values(state.lightSwitches).every(Boolean);

export const findShortCircuitTarget = (circuits: readonly CircuitDefinition[]): CircuitDefinition | undefined =>
  circuits.find((circuit) => circuit.kind === LOAD_KIND.SOCKETS);

function joinLabels(circuits: readonly CircuitDefinition[]): string {
  return circuits.map((circuit) => `${circuit.label} (${circuit.breaker})`).join(", ");
}

/** Komunikat pod schematem – tłumaczy klientowi, co właśnie się stało. */
export function describeBoard(state: BoardState, circuits: readonly CircuitDefinition[]): string {
  if (!state.mainSwitchOn) {
    return "Rozłącznik główny wyłączony – cały dom bez prądu. Tak odłącza się instalację przed pracą w rozdzielnicy.";
  }
  if (!state.rcdOn) {
    return "RCD zadziałał. Reaguje na upływ prądu, np. przez uszkodzone urządzenie albo dotknięcie przewodu – i w ułamku sekundy odcina wszystkie obwody za sobą.";
  }
  const offCircuits = circuits.filter((circuit) => !state.breakers[circuit.id]);
  if (state.lastEvent === "short-circuit" && offCircuits.length > 0) {
    const target = findShortCircuitTarget(circuits);
    return `Zwarcie w gniazdku! ${target?.breaker ?? "Wyłącznik"} zadziałał w kilka milisekund i odciął tylko obwód „${target?.label ?? "Gniazda"}”. Bez niego przewód nagrzałby się do czerwoności.`;
  }
  const switchedOffLights = circuits.filter(
    (circuit) => hasLightSwitch(circuit) && !state.lightSwitches[circuit.id] && state.breakers[circuit.id],
  );
  if (offCircuits.length === 0 && switchedOffLights.length > 0) {
    const circuit = switchedOffLights[0];
    return `Światło zgaszone łącznikiem, ale obwód „${circuit.label}” dalej jest pod napięciem aż do łącznika. Dlatego przed wymianą lampy wyłącza się ${circuit.breaker}, a nie sam włącznik.`;
  }
  if (offCircuits.length === 0) {
    return "Wszystkie obwody pod napięciem. Kliknij wyłącznik, rozłącznik albo RCD – albo najedź na element, żeby zobaczyć, do czego służy.";
  }
  if (offCircuits.length === 1 && offCircuits[0].kind === LOAD_KIND.SERVER) {
    return "Serwer bez zasilania – strona leży. Dlatego sprzęt sieciowy dostaje osobny obwód, żeby awaria pralki go nie wyłączała.";
  }
  if (offCircuits.length === circuits.length) {
    return `Wyłączone wszystkie obwody: ${joinLabels(offCircuits)}. Rozdzielnica dalej pod napięciem.`;
  }
  const noun = offCircuits.length === 1 ? "Wyłączony obwód" : "Wyłączone obwody";
  return `${noun}: ${joinLabels(offCircuits)}. Reszta domu działa normalnie – po to dzieli się instalację na obwody.`;
}
