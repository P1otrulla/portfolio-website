"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Loader2, MessageCircle, AlertCircle } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

interface ReviewsResponse {
  reviews: Review[];
  source: "trustpilot" | "fallback";
  message: string;
}

export function ReviewsSection() {
  const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        const data: ReviewsResponse = await response.json();
        setReviewsData(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"}`}
      />
    ));

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
      },
    },
  };

  const averageRating = reviewsData?.reviews.length
    ? (
        reviewsData.reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviewsData.reviews.length
      ).toFixed(1)
    : "0.0";

  return (
    <section
      id="reviews"
      className="py-24 bg-gradient-to-b from-background via-muted/20 to-background"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: false }}
              className="font-serif text-4xl md:text-5xl font-bold mb-6"
            >
              Opinie Klientów
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              viewport={{ once: false }}
              className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              Zobacz co mówią o mnie moi klienci i partnerzy biznesowi
            </motion.p>
          </div>

          {!loading && reviewsData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: false }}
              className="flex justify-center mb-16"
            >
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="flex items-center justify-center gap-4">
                    <div>
                      <div className="text-5xl font-bold text-foreground mb-2">
                        {averageRating}
                      </div>
                      <div className="flex items-center gap-1 justify-center mb-2">
                        {renderStars(Math.round(parseFloat(averageRating)))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Na podstawie {reviewsData.reviews.length}{" "}
                        {reviewsData.reviews.length === 1 ? "opinii" : "opinii"}
                      </p>
                    </div>
                  </div>
                  {reviewsData.source === "fallback" && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>
                        Przykładowe recenzje - skonfiguruj Trustpilot API
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <span className="text-muted-foreground text-lg">
                Ładowanie recenzji z Trustpilot...
              </span>
            </div>
          ) : reviewsData?.reviews.length === 0 ? (
            <div className="text-center py-20">
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg mb-8">
                Brak recenzji do wyświetlenia
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
            >
              {reviewsData?.reviews.map((review) => (
                <motion.div key={review.id} variants={cardVariants}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-full"
                  >
                    <Card className="h-full border-border/50 bg-card/60 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-shadow duration-500">
                      <CardContent className="p-6 flex flex-col h-full">
                        {/* Rating and Verified Badge */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                          {review.verified && (
                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-medium">
                              ✓ Zweryfikowana
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground mb-6 flex-grow leading-relaxed">
                          "{review.text}"
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                          <span className="font-semibold text-foreground">
                            {review.author}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.date).toLocaleDateString("pl-PL", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}

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
                <MessageCircle className="w-16 h-16 text-accent mx-auto mb-6" />
                <h3 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                  Współpracowałeś ze mną?
                </h3>
                <p className="text-muted-foreground text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                  Twoja opinia jest dla mnie bardzo ważna! Podziel się swoimi
                  doświadczeniami ze współpracy na Trustpilot.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    asChild
                  >
                    <a
                      href="https://pl.trustpilot.com/evaluate/piotrulla.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Star className="mr-2 w-5 h-5" />
                      Dodaj opinię na Trustpilot
                    </a>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
