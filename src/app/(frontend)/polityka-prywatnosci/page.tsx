import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: "Jakie dane zbiera strona, w jakim celu i jakie masz prawa.",
};

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();
  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-8 pt-10 sm:px-6 md:pt-16">
      <div className="border-t border-ink pt-6">
        <h1 className="display text-[clamp(2rem,4.4vw,3.2rem)]">Polityka prywatności</h1>
        <div className="prose-content mt-10 text-[1.05rem]">
          <h2>Administrator danych</h2>
          <p>
            Administratorem danych jest Piotr Zych. Kontakt w sprawach danych osobowych:{" "}
            <a href={`mailto:${settings.email}`}>{settings.email}</a>.
          </p>

          <h2>Formularz kontaktowy</h2>
          <p>
            Gdy wysyłasz formularz, zapisuję podane imię, dane kontaktowe, miejscowość (jeśli ją podasz) i treść
            wiadomości. Używam ich wyłącznie do odpowiedzi na zapytanie i ewentualnego przygotowania wyceny (art. 6 ust. 1
            lit. b i f RODO). Zapytania usuwam, gdy nie są już potrzebne do prowadzenia rozmów lub rozliczeń.
          </p>

          <h2>Opinie z Google</h2>
          <p>
            Sekcja opinii może wyświetlać recenzje pobrane z Google (Google Maps Platform). Zdjęcia autorów ładują się
            z serwerów Google, więc Twoja przeglądarka łączy się wtedy z Google. Obowiązuje także{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              polityka prywatności Google
            </a>
            .
          </p>

          <h2>Mapa realizacji</h2>
          <p>
            Mapa ładuje kafelki z serwerów CARTO na podstawie danych OpenStreetMap, więc Twoja przeglądarka łączy się
            wtedy z tymi serwerami. Na mapie pokazuję wyłącznie miejscowości, nigdy adresy klientów.
          </p>

          <h2>Statystyki odwiedzin i pliki cookies</h2>
          <p>
            Do liczenia odwiedzin używam Umami – narzędzia uruchomionego na moim serwerze, które nie zapisuje cookies,
            nie śledzi Cię między stronami i nie przechowuje adresu IP. Widzę jedynie zbiorcze dane: liczbę wejść,
            odwiedzane podstrony, źródło wejścia oraz typ urządzenia i przeglądarki.
          </p>
          <p>
            Strona nie używa cookies analitycznych ani reklamowych. W pamięci przeglądarki zapisuje się jedynie wybrany
            motyw (jasny lub ciemny).
          </p>

          <h2>Twoje prawa</h2>
          <ul>
            <li>dostęp do swoich danych i ich sprostowanie,</li>
            <li>usunięcie danych lub ograniczenie przetwarzania,</li>
            <li>sprzeciw wobec przetwarzania,</li>
            <li>skarga do Prezesa Urzędu Ochrony Danych Osobowych.</li>
          </ul>
          <p>Aby skorzystać z tych praw, napisz na adres podany wyżej.</p>
        </div>
      </div>
    </main>
  );
}
