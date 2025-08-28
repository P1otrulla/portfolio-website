"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Presentation } from "lucide-react"

export function PortfolioSection() {
  const projects = [
    {
      title: "ptrlNewbieProtection",
      description: "Zaawansowany plugin na ochronę nowych graczy na serwerze.",
      image: "https://github.com/user-attachments/assets/58f71aab-ecce-449c-9b76-949eacaf7ffc",
      technologies: ["Java", "SQLite", "MySQL", "PostgreSQL"],
      github: "https://github.com/P1otrulla/ptrlNewbieProtection",
    },
    {
      title: "ptrlSimpleDiscordReward",
      description: "Prosty plugin na połączenie konta minecraft z serwerem discord",
      image: "https://github.com/user-attachments/assets/29a84a32-3d1f-418e-9752-99d4b77b12f9",
      technologies: ["Java", "JDA", "SQLite", "MySQL", "PostgreSQL"],
      github: "https://github.com/P1otrulla/ptrlSimpleDiscordReward",
    },
    {
      title: "ptrlVouchers",
      description: "Prosty plugin dodający system voucherów na twoim serwerze.",
      image: "https://github.com/P1otrulla/ptrlVouchers/assets/65517973/847188e7-219c-4b76-bc99-86acde42faa1",
      technologies: ["Java"],
      github: "https://github.com/P1otrulla/ptrlVouchers",
    },
    {
      title: "EternalCore",
      description:
        "EternalCore to niezawodny dodatek, który wzbogaci Twój serwer Minecraft. Łączy najważniejsze i praktyczne funkcje w jednym pluginie.",
      image: "https://raw.githubusercontent.com/EternalCodeTeam/EternalCore/refs/heads/master/assets/readme-banner.png",
      technologies: ["Java", "SQLite", "MySQL", "PostgreSQL", "OrmLite"],
      github: "https://github.com/EternalCodeTeam/EternalCore",
      presentation: "https://modrinth.com/plugin/eternalcombat",
    },
    {
      title: "EternalCombat",
      description:
        "EternalCombat to plugin, który podnosi poziom PvP na Twoim serwerze Minecraft. Blokuje wylogowania, wspiera Crystal PvP i daje pełną kontrolę nad ustawieniami walki.",
      image:
        "https://raw.githubusercontent.com/EternalCodeTeam/EternalCombat/refs/heads/master/assets/readme-banner.png",
      technologies: ["Java"],
      github: "https://github.com/EternalCodeTeam/EternalCombat",
      presentation: "https://modrinth.com/plugin/eternalcombat",
    },
    {
      title: "ChatFormatter",
      description:
        "ChatFormatter to prosty i lekki plugin, który pozwala w pełni spersonalizować czat na Twoim serwerze Minecraft. Kolory, prefiksy, rangowe formaty – wszystko w jednym miejscu i łatwe do konfiguracji.",
      image:
        "https://raw.githubusercontent.com/EternalCodeTeam/ChatFormatter/refs/heads/master/assets/img/chatformatter.png",
      technologies: ["Java"],
      github: "https://github.com/EternalCodeTeam/ChatFormatter",
      presentation: "https://modrinth.com/plugin/chatformatter",
    },
  ]

  return (
    <section id="portfolio" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Moje projekty</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
              Oto kilka projektów, które pokazują moje umiejętności i pasję do tworzenia wysokiej jakości projektów.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {projects.map((project, index) => (
              <Card
                key={index}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card/50 backdrop-blur-sm h-full flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="backdrop-blur-md bg-white/20 border-white/30 text-white hover:bg-white/30"
                      onClick={() => window.open(project.github, "_blank")}
                    >
                      <Github size={14} />
                    </Button>
                    {project.presentation ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="backdrop-blur-md bg-white/20 border-white/30 text-white hover:bg-white/30"
                        onClick={() => window.open(project.presentation, "_blank")}
                      >
                        <Presentation size={14} />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="backdrop-blur-md bg-white/20 border-white/30 text-white hover:bg-white/30"
                        onClick={() => window.open(project.demo, "_blank")}
                      >
                        <ExternalLink size={14} />
                      </Button>
                    )}
                  </div>
                </div>

                <CardContent className="flex flex-col flex-1">
                  <div className="flex-grow space-y-4">
                    <h3 className="font-sans text-2xl font-bold group-hover:text-accent transition-colors duration-300">
                      {project.title}
                    </h3>

                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{project.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="outline"
                          className="text-xs bg-accent/10 border-accent/20 text-accent hover:bg-accent/20 transition-colors"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 mt-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 group-hover:border-accent group-hover:text-accent transition-all duration-300 bg-transparent"
                      onClick={() => window.open(project.github, "_blank")}
                    >
                      <Github size={14} className="mr-2" />
                      Kod
                    </Button>
                    {project.presentation && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 group-hover:border-accent group-hover:text-accent transition-all duration-300 bg-transparent"
                        onClick={() => window.open(project.presentation, "_blank")}
                      >
                        <Presentation size={14} className="mr-2" />
                        Prezentacja
                      </Button>
                    )}
                    {project.demo && (
                      <Button
                        size="sm"
                        className="flex-1 bg-accent hover:bg-accent/90 transition-all duration-300"
                        onClick={() => window.open(project.demo, "_blank")}
                      >
                        <ExternalLink size={14} className="mr-2" />
                        Demo
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
