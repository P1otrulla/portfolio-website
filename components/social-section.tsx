"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Mail, MessageSquareQuote } from "lucide-react";
import { motion, Variants } from "framer-motion";

export function SocialSection() {
  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/P1otrulla",
      description: "Sprawdź moje repozytoria",
      color: "from-purple-500 to-purple-600",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/in/piotrulla",
      description: "Połączmy się profesjonalnie",
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Email",
      icon: Mail,
      url: "mailto:piotrulla.zych@gmail.com",
      description: "Napisz do mnie bezpośrednio",
      color: "from-red-500 to-red-600",
    },
    {
      name: "Discord",
      icon: MessageSquareQuote,
      url: "https://discord.com/users/719653565026664628",
      description: "Napisz do mnie na discordzie",
      color: "from-indigo-500 to-indigo-600",
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
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    },
  };

  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section
      id="contact"
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
              Nawiążmy kontakt
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              viewport={{ once: false }}
              className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              Szukasz developera do swojego projektu? A może chcesz po prostu
              porozmawiać o technologii? Skontaktuj się ze mną!
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            {socialLinks.map((social, index) => (
              <motion.div key={index} variants={cardVariants}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full"
                >
                  <Card
                    className="h-full border-border/50 bg-card/60 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden group"
                    onClick={() => window.open(social.url, "_blank")}
                  >
                    <CardContent className="flex flex-col items-center text-center p-8 h-full">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                        className={`mb-6 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${social.color} text-white shadow-lg group-hover:shadow-xl`}
                      >
                        <social.icon size={28} strokeWidth={2} />
                      </motion.div>
                      <h3 className="font-semibold text-xl mb-3 group-hover:text-accent transition-colors duration-300">
                        {social.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6 flex-grow leading-relaxed">
                        {social.description}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full transition-all duration-300 hover:bg-accent/10 hover:border-accent/50"
                      >
                        Odwiedź
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: false }}
            className="relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent rounded-3xl" />
            <Card className="relative border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
              <CardContent className="text-center p-12 md:p-16">
                <motion.div
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: false }}
                >
                  <h3 className="font-serif text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Gotowy na współpracę?
                  </h3>
                  <p className="text-muted-foreground text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                    Masz ciekawy projekt lub chcesz omówić możliwości
                    współpracy? Skontaktuj się ze mną!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1"
                    >
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() =>
                          window.open(
                            "mailto:piotrulla.zych@gmail.com",
                            "_blank",
                          )
                        }
                      >
                        <Mail className="mr-2" size={18} />
                        Napisz Email
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1"
                    >
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-300"
                        onClick={() =>
                          window.open(
                            "https://discord.com/users/719653565026664628",
                            "_blank",
                          )
                        }
                      >
                        <MessageSquareQuote className="mr-2" size={18} />
                        Discord
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
