
"use client";

import {
    Github,
    Linkedin,
    Mail,
    MessageSquareQuote,
    ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function Footer() {
    const currentYear = new Date().getFullYear();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (pathname === "/" && window.location.hash) {
            const sectionId = window.location.hash.substring(1);
            setTimeout(() => {
                const el = document.getElementById(sectionId);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 100);
        }
    }, [pathname]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleNavigation = (href: string) => {
        if (href.startsWith("#")) {
            const sectionId = href.substring(1);
            if (pathname === "/") {
                const el = document.getElementById(sectionId);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
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
        <footer className="border-t border-border/40 bg-muted/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto py-12">
                    {/* Główna zawartość */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        {/* Brand */}
                        <div className="lg:col-span-2">
                            <h3 className="font-serif text-2xl font-bold mb-4">
                                piotrulla.dev
                            </h3>
                            <p className="text-muted-foreground text-sm mb-6 max-w-md">
                                Tworzę nowoczesne rozwiązania z pasją do każdego detalu. Backend
                                developer specjalizujący się w Javie i ekosystemie Spring.
                            </p>
                            <div className="flex gap-3">
                                {socialLinks.map((social) => (
                                    <Button
                                        key={social.label}
                                        variant="outline"
                                        size="icon"
                                        className="hover:bg-accent/10 hover:border-accent/50 transition-colors"
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
                                ))}
                            </div>
                        </div>

                        {/* Nawigacja */}
                        <div>
                            <h4 className="font-semibold mb-4">Nawigacja</h4>
                            <nav className="flex flex-col gap-2">
                                {quickLinks.map((link) => (
                                    <button
                                        key={link.href}
                                        onClick={() => handleNavigation(link.href)}
                                        className="cursor-pointer text-muted-foreground hover:text-accent transition-colors text-left text-sm"
                                    >
                                        {link.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Kontakt */}
                        <div>
                            <h4 className="font-semibold mb-4">Kontakt</h4>
                            <div className="space-y-2">
                                <a
                                    href="mailto:piotrulla.zych@gmail.com"
                                    className="block text-muted-foreground hover:text-accent transition-colors text-sm"
                                >
                                    piotrulla.zych@gmail.com
                                </a>
                                <p className="text-muted-foreground text-sm">
                                    Dostępny dla ciekawych projektów i współpracy
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stopka */}
                    <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            © {currentYear} Piotr "Piotrulla" Zych. Wszelkie prawa
                            zastrzeżone.
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={scrollToTop}
                            className="hover:bg-accent/10 hover:border-accent/50 transition-colors"
                        >
                            <ArrowUp className="w-4 h-4 mr-2" />
                            Powrót na górę
                        </Button>
                    </div>
                </div>
            </div>
        </footer>
    );
}