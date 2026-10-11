/**
 * Model rozdzielnicy z hero – czysta logika bez Reacta, łatwa do przetestowania.
 * Prąd płynie: zasilanie → rozłącznik główny → RCD → szyna → wyłącznik nadprądowy → odbiornik.
 */

export const CIRCUIT_ID = {
  SOCKETS: "sockets",
  LIGHTING: "lighting",
  SERVER: "server",
} as const;

export type CircuitId = (typeof CIRCUIT_ID)[keyof typeof CIRCUIT_ID];

export interface CircuitDefinition {
  readonly id: CircuitId;
  readonly x: number;
  readonly breaker: string;
  readonly label: string;
}

export const CIRCUITS: readonly CircuitDefinition[] = Object.freeze([
  { id: CIRCUIT_ID.SOCKETS, x: 90, breaker: "B16", label: "Gniazda" },
  { id: CIRCUIT_ID.LIGHTING, x: 220, breaker: "B10", label: "Oświetlenie" },
  { id: CIRCUIT_ID.SERVER, x: 350, breaker: "B16", label: "Serwer" },
]);

export interface BoardState {
  readonly mainSwitchOn: boolean;
  readonly rcdOn: boolean;
  readonly breakers: Readonly<Record<CircuitId, boolean>>;
}

export const INITIAL_BOARD: BoardState = Object.freeze({
  mainSwitchOn: true,
  rcdOn: true,
  breakers: Object.freeze({
    [CIRCUIT_ID.SOCKETS]: true,
    [CIRCUIT_ID.LIGHTING]: true,
    [CIRCUIT_ID.SERVER]: true,
  }),
});

export type BoardAction =
  | { readonly type: "toggle-main" }
  | { readonly type: "toggle-rcd" }
  | { readonly type: "toggle-breaker"; readonly id: CircuitId }
  | { readonly type: "reset" };

export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "toggle-main":
      return { ...state, mainSwitchOn: !state.mainSwitchOn };
    case "toggle-rcd":
      return { ...state, rcdOn: !state.rcdOn };
    case "toggle-breaker":
      return { ...state, breakers: { ...state.breakers, [action.id]: !state.breakers[action.id] } };
    case "reset":
      return INITIAL_BOARD;
  }
}

export const isRcdFed = (state: BoardState): boolean => state.mainSwitchOn;

export const isBusLive = (state: BoardState): boolean => state.mainSwitchOn && state.rcdOn;

export const isCircuitLive = (state: BoardState, id: CircuitId): boolean => isBusLive(state) && state.breakers[id];

export const isEverythingOn = (state: BoardState): boolean =>
  state.mainSwitchOn && state.rcdOn && CIRCUITS.every((circuit) => state.breakers[circuit.id]);

function joinLabels(circuits: readonly CircuitDefinition[]): string {
  return circuits.map((circuit) => `${circuit.label} (${circuit.breaker})`).join(", ");
}

/** Komunikat pod schematem – tłumaczy klientowi, co właśnie się stało. */
export function describeBoard(state: BoardState): string {
  if (!state.mainSwitchOn) {
    return "Rozłącznik główny wyłączony – cały dom bez prądu. Tak odłącza się instalację przed pracą w rozdzielnicy.";
  }
  if (!state.rcdOn) {
    return "RCD zadziałał. Reaguje na upływ prądu, np. przez uszkodzone urządzenie albo dotknięcie przewodu – i w ułamku sekundy odcina wszystkie obwody za sobą.";
  }
  const offCircuits = CIRCUITS.filter((circuit) => !state.breakers[circuit.id]);
  if (offCircuits.length === 0) {
    return "Wszystkie obwody pod napięciem. Kliknij wyłącznik, rozłącznik albo RCD i zobacz, co się stanie.";
  }
  if (offCircuits.length === 1 && offCircuits[0].id === CIRCUIT_ID.SERVER) {
    return "Serwer bez zasilania – strona leży. Dlatego sprzęt sieciowy dostaje osobny obwód, żeby awaria pralki go nie wyłączała.";
  }
  if (offCircuits.length === CIRCUITS.length) {
    return `Wyłączone wszystkie obwody: ${joinLabels(offCircuits)}. Rozdzielnica dalej pod napięciem.`;
  }
  const noun = offCircuits.length === 1 ? "Wyłączony obwód" : "Wyłączone obwody";
  return `${noun}: ${joinLabels(offCircuits)}. Reszta domu działa normalnie – po to dzieli się instalację na obwody.`;
}
