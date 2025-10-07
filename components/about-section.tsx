"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Palette, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function AboutSection() {
  const skills = [
    "Java",
    "MySQL",
    "Redis",
    "SQLite",
    "MongoDB",
    "PostgreSQL",
    "Spring Boot",
    "SAP",
    "Git",
  ];

  const features = [
    {
      icon: Code2,
      title: "Clean Code",
      description: "Piszę czytelny, testowalny i łatwy w utrzymaniu kod.",
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Dbam o każdy detal interfejsu użytkownika.",
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Optymalizuję aplikacje pod kątem wydajności.",
    },
  ];

  return (
    <section
      id="about"
      className="py-24 bg-gradient-to-b from-muted/40 to-background relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-white/[0.03] pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-serif text-4xl md:text-5xl font-bold mb-6 tracking-tight"
            >
              O mnie
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              Jestem pasjonatem technologii, który uwielbia tworzyć rozwiązania
              zmieniające sposób, w jaki ludzie korzystają z internetu.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="font-serif text-3xl font-semibold mb-6">
                Moja historia
              </h3>
              <p className="text-muted-foreground mb-5 leading-relaxed text-base">
                Od ponad 8 lat zajmuję się tworzeniem pluginów do Minecrafta, a
                od ponad roku rozwijam aplikacje webowe.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                Każdy projekt traktuję jako okazję do nauki czegoś nowego i
                doskonalenia swoich umiejętności. Wierzę, że dobry kod to nie
                tylko działające rozwiązanie, ale też elegancka architektura.
              </p>
            </motion.div>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {features.map((feature, index) => (
                <motion.div key={index} whileHover={{ scale: 1.02 }}>
                  <Card className="border-border/50 backdrop-blur-sm bg-card/70 transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="p-3 bg-accent/10 rounded-xl">
                        <feature.icon className="text-accent" size={22} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-serif text-3xl font-semibold mb-8">
              Technologie, z którymi pracuję
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Badge
                    variant="secondary"
                    className="text-sm py-2 px-4 rounded-full backdrop-blur-sm bg-muted/50  transition-colors"
                  >
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
