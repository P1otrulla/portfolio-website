import { NextResponse } from "next/server"

interface TrustpilotReview {
  id: string
  consumer: {
    displayName: string
  }
  stars: number
  title: string
  text: string
  createdAt: string
  verifiedBuyer: boolean
}

interface TrustpilotResponse {
  reviews: TrustpilotReview[]
  links: {
    rel: string
    href: string
    method: string
  }[]
}

const fallbackReviews = [
  {
    id: "1",
    author: "Anna K.",
    rating: 2,
    text: "Przykładowa recenzja...",
    date: "2024-01-15",
    verified: true,
  },
  {
    id: "2",
    author: "Marcin W.",
    rating: 4,
    text: "Przykładowa recenzja...",
    date: "2024-01-10",
    verified: true,
  },
  {
    id: "3",
    author: "Wojtek S.",
    rating: 3,
    text: "Przykładowa recenzja...",
    date: "2024-01-05",
    verified: false,
  },
  {
    id: "4",
    author: "Katarzyna S.",
    rating: 5,
    text: "Przykładowa recenzja...",
    date: "2025-08-05",
    verified: true,
  },
]

export async function GET() {
  try {
    const businessUnitId = process.env.TRUSTPILOT_BUSINESS_UNIT_ID
    const apiKey = process.env.TRUSTPILOT_API_KEY

    if (!businessUnitId || !apiKey) {
      console.log("Trustpilot credentials not configured, using fallback reviews")
      return NextResponse.json({
        reviews: fallbackReviews,
        source: "fallback",
        message: "Using sample reviews - configure Trustpilot API credentials to show real reviews",
      })
    }

    const response = await fetch(
      `https://api.trustpilot.com/v1/business-units/${businessUnitId}/reviews?perPage=6&orderBy=createdat.desc`,
      {
        headers: {
          ApiKey: apiKey,
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    )

    if (!response.ok) {
      throw new Error(`Trustpilot API error: ${response.status}`)
    }

    const data: TrustpilotResponse = await response.json()

    // Transform Trustpilot data to our format
    const reviews = data.reviews.map((review) => ({
      id: review.id,
      author: review.consumer.displayName,
      rating: review.stars,
      text: review.text || review.title,
      date: review.createdAt,
      verified: review.verifiedBuyer,
    }))

    return NextResponse.json({
      reviews,
      source: "trustpilot",
      message: "Reviews loaded from Trustpilot API",
    })
  } catch (error) {
    console.error("Error fetching Trustpilot reviews:", error)

    return NextResponse.json({
      reviews: fallbackReviews,
      source: "fallback",
      message: "Using sample reviews due to API error",
    })
  }
}
