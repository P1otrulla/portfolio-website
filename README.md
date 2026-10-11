# piotrulla.dev – portfolio (elektryka + programowanie)

Next.js 16 + [Payload CMS 3](https://payloadcms.com) w jednej aplikacji, baza PostgreSQL.
Strona: `/`, panel do zarządzania treścią: `/admin`.

## Szybki podgląd (Docker)

```bash
docker compose up --build
```

- strona: http://localhost:3000
- panel: http://localhost:3000/admin – przy pierwszym wejściu zakładasz konto administratora

Przy pierwszym starcie baza sama się tworzy (migracje) i wypełnia danymi startowymi:
Twoje projekty z GitHuba, dwie **przykładowe** realizacje elektryczne (z dopiskiem `[PRZYKŁAD]` – podmień albo usuń)
i teksty sekcji. Wszystko edytujesz w panelu.

Reset do zera: `docker compose down -v` (usuwa bazę i wgrane zdjęcia).

## Praca nad kodem (hot reload)

```bash
cp .env.example .env          # Windows: copy .env.example .env
docker compose up db -d       # sama baza
npm install
npm run dev
```

## Co gdzie jest w panelu

| Sekcja panelu | Co robi |
| --- | --- |
| **Realizacje** | Projekty z obu kategorii. Szkic / Opublikuj, zdjęcie główne, galeria, suwak „przed / po” (elektryka), parametry, tagi, linki (programowanie). „Wyróżniona” = duży kafelek na początku. |
| **Opinie (ręczne)** | Opinie spoza Google (Discord, Facebook, przekazane osobiście). |
| **Zapytania** | Wiadomości z formularza kontaktowego na stronie, ze statusem i notatkami. |
| **Ustawienia strony** | Nagłówek, „O mnie”, usługi, kroki współpracy, paszport instalacji, dane kontaktowe, obszar działania, Google Place ID, SEO. |

## Opinie z Google

1. W [Google Cloud Console](https://console.cloud.google.com/) włącz **Places API (New)** i utwórz klucz API
   (najlepiej ogranicz go tylko do Places API).
2. Wpisz klucz do `.env`: `GOOGLE_PLACES_API_KEY=...` i zrestartuj (`docker compose up -d`).
3. Znajdź Place ID swojej wizytówki: [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id).
4. Panel → Ustawienia strony → Opinie Google → wklej Place ID.

Google zwraca średnią ocen, liczbę opinii i maks. 5 opinii – są łączone z opiniami ręcznymi i cache'owane na 6 h.
Przycisk „Wystaw opinię w Google” pojawia się automatycznie, gdy jest ustawione Place ID (działa nawet bez klucza API).

## Analityka (Umami)

`docker compose up` uruchamia też Umami na http://localhost:3001.

1. Zaloguj się (`admin` / `umami`) i **od razu zmień hasło**.
2. Settings → Websites → Add website (np. „piotrulla.dev”), skopiuj **Website ID**.
3. Panel strony → Ustawienia strony → Analityka → wklej Website ID (adres skryptu lokalnie: `http://localhost:3001/script.js`).

Umami nie używa cookies, więc baner zgody nie jest potrzebny. Kliknięcia w ważne przyciski (wycena, formularz,
zwarcie na schemacie, linki do kodu) liczą się jako zdarzenia – nazwy są w `ANALYTICS_EVENT` w `src/lib/constants.ts`.

## Statystyki projektów (GitHub / Modrinth)

Przy projektach programistycznych strona sama pobiera gwiazdki i forki z GitHuba (z pola „Repozytorium”)
oraz pobrania z Modrinth (gdy „Prezentacja” to link do modrinth.com). Wyniki są cache'owane na godzinę.
Bez tokena GitHub pozwala na 60 zapytań/h – wystarczy, ale możesz dodać `GITHUB_TOKEN` w `.env`.

## Mapa realizacji

Realizacje elektryczne z wpisaną miejscowością pojawiają się na mapie w sekcji Realizacje. Współrzędne
uzupełniają się same przy zapisie (OpenStreetMap / Nominatim) – możesz je poprawić w panelu, w bocznym polu
„Pinezka na mapie”. Na mapie jest tylko miejscowość, bez adresu.

## Zmiany w modelu danych

Po zmianie kolekcji w `src/cms/**`:

```bash
npm run generate:types
npm run migrate:create nazwa-zmiany
```

Migracje z `src/migrations` uruchamiają się automatycznie przy starcie produkcyjnym.

## Struktura

```
src/
  app/(frontend)/      strona publiczna
  app/(payload)/       panel i API Payload (pliki generowane)
  cms/                 kolekcje, globalne ustawienia, seed
  components/          sekcje i komponenty UI
  lib/                 zapytania do CMS, opinie Google, formularz
  migrations/          migracje bazy
```
