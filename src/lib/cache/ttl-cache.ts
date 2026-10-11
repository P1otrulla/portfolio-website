interface CacheEntry<V> {
  readonly value: V;
  readonly expiresAt: number;
}

/**
 * Prosty cache w pamięci procesu z czasem życia wpisu. Wystarcza dla jednej instancji
 * aplikacji – chroni zewnętrzne API (Google, GitHub, Modrinth) przed odpytywaniem przy każdym wejściu.
 * Równoległe żądania o ten sam klucz współdzielą jedno zapytanie.
 */
export class TtlCache<K, V> {
  private readonly entries = new Map<K, CacheEntry<V>>();
  private readonly pending = new Map<K, Promise<V>>();

  constructor(private readonly ttlMs: number) {
    if (!Number.isFinite(ttlMs) || ttlMs <= 0) {
      throw new Error("TtlCache: ttlMs musi być dodatnią liczbą.");
    }
  }

  async getOrLoad(key: K, loader: () => Promise<V>): Promise<V> {
    const cached = this.entries.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }
    const inFlight = this.pending.get(key);
    if (inFlight) {
      return inFlight;
    }
    const request = loader()
      .then((value) => {
        this.entries.set(key, { value, expiresAt: Date.now() + this.ttlMs });
        return value;
      })
      .finally(() => this.pending.delete(key));
    this.pending.set(key, request);
    return request;
  }
}
