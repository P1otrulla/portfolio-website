"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Loader2, AlertCircle } from "lucide-react"

interface Review {
  id: string
  author: string
  rating: number
  text: string
  date: string
  verified: boolean
}

interface ReviewsResponse {
  reviews: Review[]
  source: "trustpilot" | "fallback"
  message: string
}

export function ReviewsSection() {
  const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoRotating, setIsAutoRotating] = useState(true)

  useEffect(() => {
    // Load Trustpilot widget script
    const script = document.createElement("script")
    script.src = "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
    script.async = true
    document.head.appendChild(script)

    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: ReviewsResponse = await response.json()
        setReviewsData(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching reviews:", err)
        setError("Nie udało się załadować recenzji")
        setReviewsData({
          reviews: [
            {
              id: "1",
              author: "Anna K.",
              rating: 5,
              text: "Profesjonalna współpraca, terminowość i świetna jakość kodu. Polecam!",
              date: "2024-01-15",
              verified: true,
            },
            {
              id: "2",
              author: "Marcin W.",
              rating: 5,
              text: "Piotr wykonał dla nas kompleksową stronę e-commerce. Wszystko zgodnie z ustaleniami.",
              date: "2024-01-10",
              verified: true,
            },
            {
              id: "3",
              author: "Katarzyna L.",
              rating: 4,
              text: "Bardzo dobra komunikacja i szybka realizacja projektu. Dziękuję!",
              date: "2024-01-05",
              verified: true,
            },
            {
              id: "4",
              author: "Tomasz R.",
              rating: 5,
              text: "Nowoczesne rozwiązania i czytelny kod. Współpraca przebiegła bez problemów.",
              date: "2023-12-28",
              verified: true,
            },
            {
              id: "5",
              author: "Magdalena S.",
              rating: 5,
              text: "Fantastyczna praca nad naszą aplikacją mobilną. Polecam każdemu!",
              date: "2023-12-20",
              verified: true,
            },
            {
              id: "6",
              author: "Paweł M.",
              rating: 4,
              text: "Solidne wykonanie i dobra cena. Na pewno skorzystam ponownie z usług.",
              date: "2023-12-15",
              verified: true,
            },
          ],
          source: "fallback",
          message: "Using sample reviews",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(
        'script[src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"]',
      )
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  useEffect(() => {
    if (!isAutoRotating || !reviewsData?.reviews.length) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, reviewsData.reviews.length - 3)
        return prev >= maxIndex ? 0 : prev + 1
      })
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [isAutoRotating, reviewsData?.reviews.length])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const getCurrentReviews = () => {
    if (!reviewsData?.reviews.length) return []
    return reviewsData.reviews.slice(currentIndex, currentIndex + 3)
  }

  const canNavigate = (reviewsData?.reviews.length || 0) > 3

  return (
    <section id="reviews" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold mb-4 text-balance">Opinie Klientów</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Zobacz co mówią o mnie moi klienci i partnerzy biznesowi
          </p>
        </div>

        {reviewsData?.source === "fallback" && (
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-2 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>API Trustpilot nie działa - pokazuje przykladowe recenzje</span>
            </div>
          </div>
        )}

        {/* Trustpilot Widget */}
        <div className="mb-16 flex justify-center">
          <div
            className="trustpilot-widget"
            data-locale="pl-PL"
            data-template-id="5419b6a8b0d04a076446a9ad"
            data-businessunit-id={process.env.NEXT_PUBLIC_TRUSTPILOT_BUSINESS_UNIT_ID || "YOUR_BUSINESS_UNIT_ID"}
            data-style-height="24px"
            data-style-width="100%"
            data-theme="light"
            data-min-review-count="10"
            data-without-reviews-preferred-string-id="1"
            data-string-id="1"
          >
            <a
              href="https://pl.trustpilot.com/review/piotrulla.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Trustpilot
            </a>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Ładowanie recenzji...</span>
          </div>
        ) : (
          <div className="relative">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ease-in-out">
              {getCurrentReviews().map((review, index) => (
                <Card
                  key={review.id}
                  className="hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Zweryfikowana
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">"{review.text}"</p>

                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{review.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString("pl-PL")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination dots moved to bottom after the reviews grid */}
            {canNavigate && (
              <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: Math.ceil((reviewsData?.reviews.length || 0) / 3) }, (_, i) => (
                  <button
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      Math.floor(currentIndex / 3) === i ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                    onClick={() => {
                      setIsAutoRotating(false)
                      setCurrentIndex(i * 3)
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Współpracowałeś ze mną? Podziel się swoją opinią!</p>
          <a
            href="https://pl.trustpilot.com/review/piotrulla.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Dodaj opinię na Trustpilot
          </a>
        </div>
      </div>
    </section>
  )
}
