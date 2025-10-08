import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Eye,
  Lock,
  Database,
  Users,
  Settings,
  AlertTriangle,
} from "lucide-react";

export const metadata = {
  title: "Polityka Prywatności - piotrulla.dev",
  description:
    "Polityka prywatności i ochrona danych osobowych na stronie piotrulla.dev",
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <Header />

      <div className="pt-24 md:pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-accent/10 rounded-2xl">
                  <Shield className="w-10 h-10 text-accent" />
                </div>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-accent via-foreground to-accent bg-clip-text text-transparent">
                Polityka Prywatności
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-6">
                Dowiedz się, jak chronimy Twoje dane osobowe i zapewniamy
                bezpieczeństwo informacji na naszej stronie.
              </p>
              <Badge variant="outline" className="text-sm">
                Ostatnia aktualizacja:{" "}
                {new Date().toLocaleDateString("pl-PL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Badge>
            </div>

            <div className="space-y-6">
              <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Users className="w-5 h-5 text-accent flex-shrink-0" />
                    Administrator danych
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Administratorem Twoich danych osobowych jest:
                  </p>
                  <div className="bg-accent/5 border border-accent/20 p-4 rounded-xl">
                    <p className="font-semibold text-lg">
                      Piotr "Piotrulla" Zych
                    </p>
                    <p className="text-muted-foreground mt-1">
                      Email: piotrulla.zych@gmail.com
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Zbierane dane */}
              <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Database className="w-5 h-5 text-accent flex-shrink-0" />
                    Jakie dane zbieramy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="border-l-4 border-accent pl-4 py-2">
                      <h4 className="font-semibold mb-2">Dane kontaktowe</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Adres email, imię i nazwisko (jeśli podasz je w
                        formularzu kontaktowym)
                      </p>
                    </div>
                    <div className="border-l-4 border-accent pl-4 py-2">
                      <h4 className="font-semibold mb-2">Dane techniczne</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Adres IP, typ przeglądarki, system operacyjny, czas
                        wizyty
                      </p>
                    </div>
                    <div className="border-l-4 border-accent pl-4 py-2">
                      <h4 className="font-semibold mb-2">Pliki cookies</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Pliki cookies niezbędne do funkcjonowania strony oraz
                        opcjonalne pliki analityczne
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Settings className="w-5 h-5 text-accent flex-shrink-0" />
                    Cel przetwarzania danych
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Odpowiedź na zapytania kontaktowe",
                      "Analiza ruchu na stronie (opcjonalne)",
                      "Zapewnienie prawidłowego funkcjonowania strony",
                      "Przestrzeganie obowiązujących przepisów prawa",
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                        <p className="text-muted-foreground leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cookies */}
              <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Eye className="w-5 h-5 text-accent flex-shrink-0" />
                    Pliki Cookies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Nasza strona używa plików cookies w następujących celach:
                  </p>
                  <div className="grid gap-4">
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-4 rounded-xl">
                      <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full" />
                        Cookies niezbędne
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Zawsze aktywne. Niezbędne do podstawowego funkcjonowania
                        strony internetowej.
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl">
                      <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        Cookies analityczne
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Opcjonalne. Pomagają nam zrozumieć, jak użytkownicy
                        korzystają ze strony.
                      </p>
                    </div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                        Możesz w każdej chwili zmienić swoje preferencje
                        dotyczące cookies w ustawieniach przeglądarki.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Lock className="w-5 h-5 text-accent flex-shrink-0" />
                    Bezpieczeństwo danych
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Stosujemy odpowiednie środki techniczne i organizacyjne w
                    celu ochrony Twoich danych:
                  </p>
                  <div className="space-y-3">
                    {[
                      "Szyfrowanie połączeń HTTPS",
                      "Regularne aktualizacje systemów bezpieczeństwa",
                      "Ograniczony dostęp do danych osobowych",
                      "Regularne kopie zapasowe",
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                        <p className="text-muted-foreground leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Shield className="w-5 h-5 text-accent flex-shrink-0" />
                    Twoje prawa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Zgodnie z RODO masz prawo do:
                  </p>
                  <div className="space-y-3">
                    {[
                      "Dostępu do swoich danych",
                      "Sprostowania nieprawidłowych danych",
                      "Usunięcia danych",
                      "Ograniczenia przetwarzania",
                      "Przenoszenia danych",
                      "Wniesienia skargi do organu nadzorczego",
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                        <p className="text-muted-foreground leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">
                    Kontakt w sprawach prywatności
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Jeśli masz pytania dotyczące przetwarzania Twoich danych
                    osobowych, skontaktuj się z nami:
                  </p>
                  <div className="bg-accent/5 border border-accent/20 p-4 rounded-xl">
                    <p className="font-semibold text-lg">
                      Email: piotrulla.zych@gmail.com
                    </p>
                    <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                      Odpowiemy na Twoje zapytanie w ciągu 30 dni.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

