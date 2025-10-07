"use client";

import {
  Github,
  Linkedin,
  Mail,
  Sparkles,
  MessageSquareQuote,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const router = useRouter();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigation = (href: string) => {
    if (href.startsWith("#")) {
      const sectionId = href.substring(1);
      if (pathname === "/") {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        router.push(`/#${sectionId}`);
      }
    } else {
      router.push(href);
    }
  };

  const socialLinks = [
    { icon: Github, href: "https://github.com/P1otrulla", label: "GitHub" },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/piotrulla/",
      label: "LinkedIn",
    },
    { icon: Mail, href: "mailto:piotrulla.zych@gmail.com", label: "Email" },
    {
      icon: MessageSquareQuote,
      href: "https://discord.com/users/719653565026664628",
      label: "Discord",
    },
  ];

  const quickLinks = [
    { label: "O mnie", href: "#about" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Kontakt", href: "#contact" },
    { label: "Polityka Prywatności", href: "/polityka-prywatnosci" },
  ];

  return (
    <footer className="relative border-t border-border/40 bg-gradient-to-b from-background to-muted/20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: false }}
              className="lg:col-span-2"
            >
              <div className="flex items-center gap-2 mb-6 group">
                <Sparkles className="w-6 h-6 text-accent group-hover:rotate-180 transition-transform duration-700" />
                <h3 className="font-serif text-2xl font-bold bg-gradient-to-r from-accent via-foreground to-accent bg-clip-text text-transparent">
                  piotrulla.dev
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-md mb-6">
                Tworzę nowoczesne rozwiązania z pasją do każdego detalu. Backend
                developer specjalizujący się w Javie i ekosystemie Spring.
              </p>

              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.div
                    key={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-border/50 hover:border-accent/50 hover:bg-accent/10 transition-all duration-300"
                      asChild
                    >
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                      >
                        <social.icon className="w-4 h-4" />
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: false }}
              className="space-y-4"
            >
              <h4 className="font-semibold text-lg mb-6">Nawigacja</h4>
              <nav className="flex flex-col gap-3">
                {quickLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavigation(link.href)}
                    className="text-muted-foreground hover:text-accent transition-colors duration-300 inline-flex items-center group text-left"
                  >
                    <span className="w-0 group-hover:w-4 h-px bg-accent transition-all duration-300 mr-0 group-hover:mr-2" />
                    {link.label}
                  </button>
                ))}
              </nav>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: false }}
              className="space-y-4"
            >
              <h4 className="font-semibold text-lg mb-6">Kontakt</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <a
                  href="mailto:piotrulla.zych@gmail.com"
                  className="block hover:text-accent transition-colors duration-300"
                >
                  piotrulla.zych@gmail.com
                </a>
                <p className="leading-relaxed">
                  Dostępny dla ciekawych projektów i współpracy
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: false }}
            className="border-t border-border/40 py-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                © {currentYear} Piotr "Piotrulla" Zych. Wszelkie prawa
                zastrzeżone.
              </p>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={scrollToTop}
                  className="border-border/50 hover:border-accent/50 hover:bg-accent/10 transition-all duration-300"
                >
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Powrót na górę
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
