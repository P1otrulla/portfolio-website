import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code2, Palette, Zap } from "lucide-react"

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
  ]

  const features = [
    {
      icon: Code2,
      title: "Clean Code",
      description: "Piszę czytelny, testowalny i łatwy w utrzymaniu kod",
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Dbam o każdy detal interfejsu użytkownika",
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Optymalizuję aplikacje pod kątem wydajności",
    },
  ]

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">O mnie</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
              Jestem pasjonatem technologii, który uwielbia tworzyć rozwiązania zmieniające sposób, w jaki ludzie korzystają z internetu.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="font-serif text-2xl font-bold mb-4">Moja historia</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Od ponad 8 lat zajmuję się tworzeniem pluginów do Minecrafta, a od ponad roku rozwijam aplikacje webowe.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Każdy projekt traktuję jako okazję do nauki czegoś nowego i doskonalenia swoich umiejętności. Wierzę, że
                dobry kod to nie tylko działające rozwiązanie, ale także czytelna i elegancka architektura.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <feature.icon className="text-accent" size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="text-center">
            <h3 className="font-serif text-2xl font-bold mb-6">Technologie, z którymi pracuję</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
