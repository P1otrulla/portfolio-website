"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Sparkles, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMobileMenuOpen(false)
    }
  }

  if (!mounted) return null

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-40">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5 animate-pulse" />
        <div
          className="absolute top-20 left-10 w-2 h-2 bg-accent/30 rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-40 right-20 w-1 h-1 bg-accent/40 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-accent/20 rounded-full animate-bounce"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-accent/20 shadow-2xl shadow-accent/10"
            : "bg-transparent"
        }`}
      >
        <div
          className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent transition-opacity duration-700 ${isScrolled ? "opacity-100" : "opacity-0"}`}
        />

        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 group cursor-pointer">
              <Sparkles className="w-5 h-5 text-accent group-hover:animate-spin transition-all duration-500" />
              <div className="font-serif text-xl font-bold bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent group-hover:from-accent group-hover:via-foreground group-hover:to-accent transition-all duration-500">
                piotrulla.dev
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {[
                { label: "O mnie", id: "about" },
                { label: "Portfolio", id: "portfolio" },
                { label: "Kontakt", id: "contact" },
              ].map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative text-muted-foreground hover:text-accent transition-all duration-300 py-2 px-4 rounded-lg hover:bg-accent/10"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative overflow-hidden group hover:bg-accent/10 border border-transparent hover:border-accent/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-accent/10 scale-0 group-hover:scale-100 transition-transform duration-300 rounded" />
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 group-hover:text-foreground" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 group-hover:text-foreground" />
                <span className="sr-only">Przełącz motyw</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="md:hidden relative overflow-hidden group hover:bg-accent/10 border border-transparent hover:border-accent/20 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <div className={`transition-transform duration-300 ${isMobileMenuOpen ? "rotate-180" : "rotate-0"}`}>
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </div>
              </Button>
            </div>
          </div>

          <div
            className={`md:hidden overflow-hidden transition-all duration-500 ${isMobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}
          >
            <div className="mt-4 py-4 border-t border-accent/20 bg-background/50 backdrop-blur-sm rounded-lg">
              <div className="flex flex-col space-y-4 px-4">
                {[
                  { label: "O mnie", id: "about" },
                  { label: "Portfolio", id: "portfolio" },
                  { label: "Kontakt", id: "contact" },
                ].map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left text-muted-foreground hover:text-accent transition-all duration-300 py-2 hover:pl-4 transform rounded-lg hover:bg-accent/10"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="border-t border-accent/20 pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="w-full justify-start hover:bg-accent/10 transition-all duration-300 group"
                  >
                    <Sun className="h-4 w-4 mr-2 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 group-hover:text-foreground" />
                    <Moon className="absolute h-4 w-4 ml-2 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 group-hover:text-foreground" />
                    <span className="ml-6">Przełącz motyw</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <hr className="border-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      </header>
    </>
  )
}
