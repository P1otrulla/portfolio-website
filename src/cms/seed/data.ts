import { PROJECT_CATEGORY, type ProjectCategory } from "@/lib/constants";

export interface SeedProject {
  readonly title: string;
  readonly category: ProjectCategory;
  readonly summary: string;
  readonly body: readonly string[];
  readonly coverUrl?: string;
  readonly tags: readonly string[];
  readonly featured?: boolean;
  readonly location?: string;
  readonly facts?: readonly { readonly label: string; readonly value: string }[];
  readonly links?: { readonly repository?: string; readonly demo?: string };
}

const EXAMPLE_PREFIX = "[PRZYKŁAD]";

export const SEED_SETTINGS = Object.freeze({
  heroTitle: "Kładę instalacje elektryczne i piszę oprogramowanie.",
  heroLead:
    "Instalacje w domach jednorodzinnych – od rozplanowania obwodów po opisaną rozdzielnicę. Do tego pluginy do Minecrafta i aplikacje webowe. W obu przypadkach ta sama zasada: porządek, dokumentacja i rzeczy, które działają latami.",
  availability: "",
  about:
    "Od ponad 8 lat tworzę pluginy do Minecrafta i rozwijam aplikacje webowe. Równolegle prowadzę własną działalność elektryczną i wykonuję instalacje w domach. Z programowania przenoszę do elektryki porządek i dokumentację, a z elektryki do kodu podejście „ma działać latami, bez niespodzianek”.",
  electricalServices: [
    {
      title: "Instalacje w nowych domach",
      description: "Kompletna instalacja od zera: trasy kablowe, puszki, gniazda, oświetlenie i podłączenie urządzeń.",
    },
    {
      title: "Rozdzielnice",
      description: "Montaż i przebudowa rozdzielnic, dobór zabezpieczeń, każdy obwód opisany.",
    },
    {
      title: "Modernizacje",
      description: "Wymiana starej instalacji, dodatkowe obwody, przeniesienie gniazd i punktów świetlnych.",
    },
  ],
  softwareServices: [
    {
      title: "Pluginy do Minecrafta",
      description: "Paper/Bukkit: ekonomia, rynki, osiągnięcia, integracje z Discordem. Wsparcie MySQL, PostgreSQL i SQLite.",
    },
    {
      title: "Aplikacje webowe",
      description: "Backend w Javie (Spring Boot) lub Pythonie (Django), PostgreSQL, wdrożenie w Dockerze.",
    },
    {
      title: "Integracje i automatyzacje",
      description: "Discord, Redis, zewnętrzne API – łączę systemy, które same ze sobą nie rozmawiają.",
    },
  ],
  processSteps: [
    { title: "Rozmowa", description: "Mówisz, czego potrzebujesz. Przy elektryce umawiamy oględziny na miejscu." },
    { title: "Wycena", description: "Dostajesz konkretny zakres i cenę na piśmie, zanim cokolwiek zacznę." },
    { title: "Realizacja", description: "Pracuję etapami i na bieżąco mówię, co jest zrobione, a co przed nami." },
    {
      title: "Odbiór",
      description: "Sprawdzamy wszystko razem. Dostajesz dokumentację: opis obwodów albo kod z instrukcją.",
    },
  ],
  passportEnabled: true,
  passportTitle: "Paszport instalacji",
  passportText:
    "W każdej rozdzielnicy, którą montuję, zostawiam naklejkę z kodem QR. Po zeskanowaniu widać opis obwodów, zastosowane zabezpieczenia i datę wykonania. Kolejny elektryk nie musi zgadywać, a Ty od razu wiesz, który wyłącznik odpowiada za kuchnię.",
  passportUrl: "",
  email: "piotrulla.zych@gmail.com",
  phone: "",
  serviceArea: "",
  githubUrl: "https://github.com/P1otrulla",
  linkedinUrl: "https://linkedin.com/in/piotrulla/",
  discordUrl: "https://discord.com/users/719653565026664628",
  googlePlaceId: "",
  seoTitle: "Piotr Zych – instalacje elektryczne i programowanie",
  seoDescription:
    "Instalacje elektryczne w domach jednorodzinnych oraz pluginy do Minecrafta i aplikacje webowe. Zobacz realizacje i napisz po wycenę.",
});

export const SEED_PROJECTS: readonly SeedProject[] = Object.freeze([
  {
    title: "EternalCore",
    category: PROJECT_CATEGORY.SOFTWARE,
    summary: "Otwartoźródłowa alternatywa dla EssentialsX – najważniejsze funkcje serwera w jednym pluginie.",
    body: [
      "EternalCore łączy najważniejsze i praktyczne funkcje serwera Minecraft w jednym pluginie. Rozwijam m.in. system kar: bany, kicki, wyciszenia i ostrzeżenia.",
    ],
    coverUrl: "https://raw.githubusercontent.com/EternalCodeTeam/EternalCore/refs/heads/master/assets/readme-banner.png",
    tags: ["Java", "ORMLite", "SQLite", "MySQL", "PostgreSQL"],
    featured: true,
    links: { repository: "https://github.com/EternalCodeTeam/EternalCore" },
  },
  {
    title: "EternalCombat",
    category: PROJECT_CATEGORY.SOFTWARE,
    summary: "Plugin PvP: blokuje wylogowanie w trakcie walki, wspiera Crystal PvP i daje pełną kontrolę nad ustawieniami.",
    body: [
      "EternalCombat podnosi poziom PvP na serwerze. Blokuje wylogowania podczas walki, wspiera Crystal PvP i pozwala dokładnie skonfigurować zasady.",
    ],
    coverUrl: "https://raw.githubusercontent.com/EternalCodeTeam/EternalCombat/refs/heads/master/assets/readme-banner.png",
    tags: ["Java"],
    links: {
      repository: "https://github.com/EternalCodeTeam/EternalCombat",
      demo: "https://modrinth.com/plugin/eternalcombat",
    },
  },
  {
    title: "ChatFormatter",
    category: PROJECT_CATEGORY.SOFTWARE,
    summary: "Lekki plugin do personalizacji czatu: kolory, prefiksy i formaty zależne od rangi.",
    body: ["ChatFormatter pozwala w pełni spersonalizować czat na serwerze – wszystko w jednym, łatwym w konfiguracji miejscu."],
    coverUrl: "https://raw.githubusercontent.com/EternalCodeTeam/ChatFormatter/refs/heads/master/assets/img/chatformatter.png",
    tags: ["Java"],
    links: {
      repository: "https://github.com/EternalCodeTeam/ChatFormatter",
      demo: "https://modrinth.com/plugin/chatformatter",
    },
  },
  {
    title: "ptrlNewbieProtection",
    category: PROJECT_CATEGORY.SOFTWARE,
    summary: "Ochrona nowych graczy na serwerze, z obsługą kilku baz danych.",
    body: ["Zaawansowany plugin chroniący nowych graczy przez pierwsze minuty gry."],
    coverUrl: "https://github.com/user-attachments/assets/58f71aab-ecce-449c-9b76-949eacaf7ffc",
    tags: ["Java", "SQLite", "MySQL", "PostgreSQL"],
    links: { repository: "https://github.com/P1otrulla/ptrlNewbieProtection" },
  },
  {
    title: "ptrlSimpleDiscordReward",
    category: PROJECT_CATEGORY.SOFTWARE,
    summary: "Łączy konto Minecraft z serwerem Discord i nagradza graczy za połączenie.",
    body: ["Prosty plugin na połączenie konta Minecraft z serwerem Discord."],
    coverUrl: "https://github.com/user-attachments/assets/29a84a32-3d1f-418e-9752-99d4b77b12f9",
    tags: ["Java", "JDA", "SQLite", "MySQL", "PostgreSQL"],
    links: { repository: "https://github.com/P1otrulla/ptrlSimpleDiscordReward" },
  },
  {
    title: "ptrlVouchers",
    category: PROJECT_CATEGORY.SOFTWARE,
    summary: "System voucherów na serwer – proste nagrody do rozdawania graczom.",
    body: ["Prosty plugin dodający system voucherów na serwerze."],
    coverUrl: "https://github.com/P1otrulla/ptrlVouchers/assets/65517973/847188e7-219c-4b76-bc99-86acde42faa1",
    tags: ["Java"],
    links: { repository: "https://github.com/P1otrulla/ptrlVouchers" },
  },
  {
    title: `${EXAMPLE_PREFIX} Dom jednorodzinny – instalacja od zera`,
    category: PROJECT_CATEGORY.ELECTRICAL,
    summary: "Przykładowy wpis. Podmień zdjęcia, parametry i opis na swoją realizację albo usuń go w panelu.",
    body: [
      "Tu opisz realizację: co było do zrobienia, jakie były wyzwania i co klient dostał na koniec.",
      "Dodaj zdjęcia do galerii, a w zakładce „Przed / po” wrzuć dwa kadry rozdzielnicy – na stronie pojawi się suwak porównania.",
    ],
    tags: ["YDY 3×2,5", "Rozdzielnica 4×18", "RCD 30 mA"],
    featured: true,
    location: "Miejscowość",
    facts: [
      { label: "Powierzchnia", value: "140 m²" },
      { label: "Obwody", value: "22" },
      { label: "Czas realizacji", value: "6 dni" },
    ],
  },
  {
    title: `${EXAMPLE_PREFIX} Wymiana rozdzielnicy`,
    category: PROJECT_CATEGORY.ELECTRICAL,
    summary: "Przykładowy wpis pokazujący mniejszą realizację. Edytuj albo usuń w panelu.",
    body: ["Stara rozdzielnica z bezpiecznikami topikowymi zastąpiona nową, z wyłącznikiem różnicowoprądowym i opisanymi obwodami."],
    tags: ["Wyłączniki B16/B10", "RCD"],
    location: "Miejscowość",
    facts: [
      { label: "Obwody", value: "12" },
      { label: "Czas realizacji", value: "1 dzień" },
    ],
  },
]);
