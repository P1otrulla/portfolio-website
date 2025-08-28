"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Linkedin, Mail, MessageSquareQuote } from "lucide-react"

export function SocialSection() {
  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/P1otrulla",
      description: "Sprawdź moje repozytoria",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/in/piotrulla",
      description: "Połączmy się profesjonalnie",
    },
    {
      name: "Email",
      icon: Mail,
      url: "mailto:piotrulla.zych@gmail.com",
      description: "Napisz do mnie bezpośrednio",
    },
    {
      name: "Discord",
      icon: MessageSquareQuote,
      url: "https://discord.com/users/719653565026664628",
      description: "Napisz do mnie na discordzie",
    },
  ]

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section Header */}
          <div className="mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Nawiążmy kontakt</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
              Szukasz developera do swojego projektu? A może chcesz po prostu porozmawiać o technologii? Skontaktuj się
              ze mną!
            </p>
          </div>

          {/* Social Links */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {socialLinks.map((social, index) => (
              <Card key={index} className="group hover:shadow-md transition-all duration-300 border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <div className="inline-flex p-3 bg-accent/10 rounded-full group-hover:bg-accent/20 transition-colors">
                      <social.icon className="text-accent" size={24} />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{social.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{social.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => window.open(social.url, "_blank")}
                  >
                    Odwiedź
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-card rounded-lg p-8 border border-border/50">
            <h3 className="font-serif text-2xl font-bold mb-4">Gotowy na współpracę?</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Jeśli masz ciekawy projekt lub po prostu chcesz porozmawiać o możliwościach współpracy, nie wahaj się
              skontaktować.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => window.open("mailto:piotrulla.zych@gmail.com", "_blank")}
                className="transition-all duration-300"
              >
                <Mail className="mr-2" size={18} />
                Napisz do mnie
              </Button>
              <Button
                size="lg"
                onClick={() => window.open("https://discord.com/users/719653565026664628", "_blank")}
                className="transition-all duration-300"
              >
                <MessageSquareQuote className="mr-2" size={18} />
                Wyślij mi wiadomość
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
