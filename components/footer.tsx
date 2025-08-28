import { Github, Linkedin, Mail, Heart, Code, Coffee, MessageSquareQuote } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative py-16 border-t border-accent/20 bg-gradient-to-br from-background via-background/95 to-accent/5 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-accent/10 via-transparent to-transparent"></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-accent/30 rounded-full animate-float" />
        <div
          className="absolute top-20 right-20 w-1 h-1 bg-accent/40 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-accent/20 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-10 right-1/3 w-1 h-1 bg-accent/50 rounded-full animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand Section */}
            <div className="text-center md:text-left space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-2 group">
                <Code className="w-6 h-6 text-accent group-hover:animate-pulse" />
                <h3 className="font-serif text-2xl font-bold bg-gradient-to-r from-accent via-foreground to-accent bg-clip-text text-transparent">
                  Piotr "Piotrulla" Zych
                </h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                Pasjonat programowania tworzący nowoczesne aplikacje z dbałością o każdy detal.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center space-y-4">
              <h4 className="font-semibold text-foreground">Szybkie linki</h4>
              <div className="flex flex-col space-y-2">
                {[
                  { label: "O mnie", href: "#about" },
                  { label: "Portfolio", href: "#portfolio" },
                  { label: "Kontakt", href: "#contact" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground hover:text-accent transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Social & Contact */}
            <div className="text-center md:text-right space-y-4">
              <h4 className="font-semibold text-foreground">Znajdź mnie</h4>
              <div className="flex justify-center md:justify-end gap-3">
                {[
                  { icon: Github, href: "https://github.com/P1otrulla", label: "GitHub" },
                  { icon: Linkedin, href: "https://linkedin.com/in/piotrulla/", label: "LinkedIn" },
                  { icon: Mail, href: "mailto:piotrulla.zych@gmail.com", label: "Email" },
                  { icon: MessageSquareQuote, href: "https://discord.com/users/719653565026664628", label: "Discord" },
                ].map((social) => (
                  <Button
                    key={social.label}
                    variant="outline"
                    size="sm"
                    className="group border-accent/20 hover:border-accent hover:bg-accent/10 transition-all duration-300 bg-transparent"
                    asChild
                  >
                    <a href={social.href} aria-label={social.label}>
                      <social.icon className="w-4 h-4 group-hover:scale-110 group-hover:text-foreground transition-all duration-300" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-accent/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>© {currentYear} Wszystkie prawa zastrzeżone.</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground group">
                <span>Stworzone z</span>
                <Heart className="w-4 h-4 text-red-500 group-hover:animate-pulse" />
                <span>przy użyciu Next.js,</span>
                <Coffee className="w-4 h-4 text-amber-600 group-hover:animate-bounce" />
                <span>i dużej ilości kawy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
