"use client";

import { Button } from "@/components/ui/button";
import { ArrowDown, Code, BatteryChargingIcon } from "lucide-react";

export function HeroSection() {
  const scrollToPortfolio = () => {
    const element = document.getElementById("portfolio");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-background via-background to-muted/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <BatteryChargingIcon className="text-accent" size={20} />
            <span className="text-muted-foreground text-sm uppercase tracking-wider">
              Witaj w moim świecie
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            Piotr <span className="text-accent">"Piotrulla"</span> Zych
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Tworzę nowoczesne pluginy minecraft oraz aplikacje, które łączą
            elegancki design z wydajną funkcjonalnością.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              onClick={scrollToPortfolio}
              className="group transition-all duration-300"
            >
              <Code
                className="mr-2 group-hover:rotate-12 transition-transform"
                size={18}
              />
              Zobacz moje projekty
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="transition-all duration-300"
            >
              Skontaktuj się ze mną
            </Button>
          </div>

          <div className="animate-bounce">
            <ArrowDown className="mx-auto text-muted-foreground" size={24} />
          </div>
        </div>
      </div>
    </section>
  );
}
