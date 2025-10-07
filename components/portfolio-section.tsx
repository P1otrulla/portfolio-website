"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Presentation } from "lucide-react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

export function PortfolioSection() {
  const projects = [
    {
      title: "ptrlNewbieProtection",
      description: "Zaawansowany plugin na ochronę nowych graczy na serwerze.",
      image:
        "https://github.com/user-attachments/assets/58f71aab-ecce-449c-9b76-949eacaf7ffc",
      technologies: ["Java", "SQLite", "MySQL", "PostgreSQL"],
      github: "https://github.com/P1otrulla/ptrlNewbieProtection",
    },
    {
      title: "ptrlSimpleDiscordReward",
      description:
        "Prosty plugin na połączenie konta minecraft z serwerem discord",
      image:
        "https://github.com/user-attachments/assets/29a84a32-3d1f-418e-9752-99d4b77b12f9",
      technologies: ["Java", "JDA", "SQLite", "MySQL", "PostgreSQL"],
      github: "https://github.com/P1otrulla/ptrlSimpleDiscordReward",
    },
    {
      title: "ptrlVouchers",
      description: "Prosty plugin dodający system voucherów na twoim serwerze.",
      image:
        "https://github.com/P1otrulla/ptrlVouchers/assets/65517973/847188e7-219c-4b76-bc99-86acde42faa1",
      technologies: ["Java"],
      github: "https://github.com/P1otrulla/ptrlVouchers",
    },
    {
      title: "EternalCore",
      description:
        "EternalCore to niezawodny dodatek, który wzbogaci Twój serwer Minecraft. Łączy najważniejsze i praktyczne funkcje w jednym pluginie.",
      image:
        "https://raw.githubusercontent.com/EternalCodeTeam/EternalCore/refs/heads/master/assets/readme-banner.png",
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
  ];

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    },
  };

  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <section
      id="portfolio"
      className="py-24 bg-gradient-to-b from-background via-muted/20 to-background"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: false }}
              className="font-serif text-4xl md:text-5xl font-bold mb-6"
            >
              Moje projekty
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              viewport={{ once: false }}
              className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              Kilka projektów, które najlepiej pokazują moje podejście do
              jakości, wydajności i dbałości o szczegóły.
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
          >
            {projects.map((project, index) => (
              <motion.div key={index} variants={cardVariants}>
                <motion.div
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                  className="h-full"
                >
                  <Card className="overflow-hidden border-border/50 bg-card/60 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-shadow duration-500 h-full flex flex-col p-0">
                    <div className="aspect-video overflow-hidden m-0 p-0">
                      <motion.div
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <Image
                          src={project.image}
                          alt={project.title}
                          width={400}
                          height={200}
                          className="w-full h-full object-cover block"
                        />
                      </motion.div>
                    </div>
                    <CardContent className="flex flex-col flex-1 p-6">
                      <div className="grow space-y-4">
                        <h3 className="text-2xl font-semibold tracking-tight hover:text-accent transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {project.description}
                        </p>
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
                        <div className="flex-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full cursor-pointer"
                            onClick={() =>
                              window.open(project.github, "_blank")
                            }
                          >
                            <Github size={14} className="mr-2" />
                            Kod
                          </Button>
                        </div>

                        {project.presentation && (
                          <div className="flex-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full cursor-pointer"
                              onClick={() =>
                                window.open(project.presentation, "_blank")
                              }
                            >
                              <Presentation size={14} className="mr-2" />
                              Prezentacja
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
