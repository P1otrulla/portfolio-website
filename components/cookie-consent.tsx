"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cookie, X, Settings, Check, X as XIcon, Shield } from "lucide-react";
import Link from "next/link";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
}

export function CookieConsent() {
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
  });

  const isPrivacyPage = pathname === "/polityka-prywatnosci";

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
    }
  }, []);

  const handleAcceptAll = () => {
    const newPreferences = { necessary: true, analytics: true };
    setPreferences(newPreferences);
    localStorage.setItem("cookie-consent", JSON.stringify(newPreferences));
    setShowBanner(false);
    setShowSettings(false);

    if (typeof window !== "undefined") {
      console.log("Analytics cookies enabled");
    }
  };

  const handleRejectAll = () => {
    const newPreferences = { necessary: true, analytics: false };
    setPreferences(newPreferences);
    localStorage.setItem("cookie-consent", JSON.stringify(newPreferences));
    setShowBanner(false);
    setShowSettings(false);

    if (typeof window !== "undefined") {
      console.log("Analytics cookies disabled");
    }
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);

    if (typeof window !== "undefined") {
      if (preferences.analytics) {
        console.log("Analytics cookies enabled");
      } else {
        console.log("Analytics cookies disabled");
      }
    }
  };

  const toggleAnalytics = () => {
    setPreferences((prev) => ({ ...prev, analytics: !prev.analytics }));
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          {!isPrivacyPage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
              onClick={() => !showSettings && handleRejectAll()}
            />
          )}

          {/* Banner */}
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 z-[101]"
          >
            <Card className="max-w-5xl mx-auto shadow-2xl border-border/50 bg-card/95 backdrop-blur-xl">
              <CardContent className="p-6 md:p-8">
                {!showSettings ? (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-3 bg-accent/10 rounded-xl">
                        <Cookie className="w-7 h-7 text-accent" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="font-serif text-2xl font-bold">
                          Pliki Cookies 🍪
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Używamy plików cookies, aby zapewnić najlepsze
                          doświadczenia na naszej stronie. Cookies niezbędne są
                          zawsze aktywne, ale możesz zdecydować o analitycznych.
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/polityka-prywatnosci"
                      className="text-sm text-accent hover:underline inline-flex items-center gap-1"
                    >
                      <Shield className="w-4 h-4" />
                      Dowiedz się więcej w Polityce Prywatności
                    </Link>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowSettings(true)}
                        className="flex items-center justify-center gap-2 flex-1 sm:flex-initial"
                      >
                        <Settings className="w-4 h-4" />
                        Dostosuj
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleRejectAll}
                        className="flex items-center justify-center gap-2 flex-1 sm:flex-initial"
                      >
                        <XIcon className="w-4 h-4" />
                        Odrzuć
                      </Button>
                      <Button
                        onClick={handleAcceptAll}
                        className="flex items-center justify-center gap-2 flex-1 sm:flex-initial bg-gradient-to-r from-accent to-accent/80"
                      >
                        <Check className="w-4 h-4" />
                        Zaakceptuj wszystkie
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-2xl font-bold">
                        Ustawienia cookies
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowSettings(false)}
                        className="rounded-full"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <Card className="border-border/50 bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">
                                  Cookies niezbędne
                                </h4>
                                <Badge
                                  variant="secondary"
                                  className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                >
                                  Zawsze aktywne
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                Te pliki są niezbędne do prawidłowego działania
                                strony i nie mogą być wyłączone.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Analytics Cookies */}
                      <Card className="border-border/50 bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1 flex-1">
                              <h4 className="font-semibold">
                                Cookies analityczne
                              </h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                Pomagają nam zrozumieć, jak użytkownicy
                                korzystają ze strony, aby móc ją ulepszyć.
                              </p>
                            </div>
                            <Button
                              variant={
                                preferences.analytics ? "default" : "outline"
                              }
                              size="sm"
                              onClick={toggleAnalytics}
                              className="min-w-[100px] flex-shrink-0"
                            >
                              {preferences.analytics ? "Włączone" : "Wyłączone"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        variant="outline"
                        onClick={handleRejectAll}
                        className="flex items-center justify-center gap-2 flex-1"
                      >
                        <XIcon className="w-4 h-4" />
                        Odrzuć wszystkie
                      </Button>
                      <Button
                        onClick={handleSavePreferences}
                        className="flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-accent to-accent/80"
                      >
                        <Check className="w-4 h-4" />
                        Zapisz preferencje
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

