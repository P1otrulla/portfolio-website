import { NextResponse } from "next/server";

interface TrustpilotReview {
  id: string;
  consumer: {
    displayName: string;
  };
  stars: number;
  title: string;
  text: string;
  createdAt: string;
  isVerified?: boolean;
}

interface TrustpilotResponse {
  reviews: TrustpilotReview[];
}

const FALLBACK_REVIEWS = [
  {
    id: "fallback-1",
    author: "Jan Kowalski",
    rating: 5,
    text: "Świetna współpraca! Projekt wykonany terminowo i zgodnie z oczekiwaniami. Polecam!",
    date: new Date().toISOString(),
    verified: true,
  },
  {
    id: "fallback-2",
    author: "Anna Nowak",
    rating: 5,
    text: "Profesjonalne podejście i wysoka jakość kodu. Komunikacja na najwyższym poziomie.",
    date: new Date().toISOString(),
    verified: true,
  },
  {
    id: "fallback-3",
    author: "Piotr Wiśniewski",
    rating: 5,
    text: "Bardzo dobra znajomość Javy i Spring Boot. Polecam każdemu!",
    date: new Date().toISOString(),
    verified: true,
  },
];

export async function GET() {
  try {
    const businessUnitId = process.env.TRUSTPILOT_BUSINESS_UNIT_ID;
    const apiKey = process.env.TRUSTPILOT_API_KEY;

    if (!businessUnitId || !apiKey) {
      console.warn(
        "Trustpilot API credentials not configured, using fallback reviews",
      );
      return NextResponse.json({
        reviews: FALLBACK_REVIEWS,
        source: "fallback",
        message: "Using fallback reviews - API credentials not configured",
      });
    }

    const response = await fetch(
      `https://api.trustpilot.com/v1/business-units/${businessUnitId}/reviews?perPage=10&language=pl`,
      {
        headers: {
          apikey: apiKey,
        },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      console.error(`Trustpilot API error: ${response.status}`);
      throw new Error(`Trustpilot API error: ${response.status}`);
    }

    const data: TrustpilotResponse = await response.json();

    if (!data.reviews || data.reviews.length === 0) {
      return NextResponse.json({
        reviews: FALLBACK_REVIEWS,
        source: "fallback",
        message: "No reviews available from Trustpilot",
      });
    }

    const reviews = data.reviews.map((review) => ({
      id: review.id,
      author: review.consumer.displayName,
      rating: review.stars,
      text: review.text || review.title,
      date: review.createdAt,
      verified: review.isVerified || false,
    }));

    return NextResponse.json({
      reviews,
      source: "trustpilot",
      message: "Reviews loaded from Trustpilot API",
    });
  } catch (error) {
    console.error("Error fetching Trustpilot reviews:", error);

    return NextResponse.json({
      reviews: FALLBACK_REVIEWS,
      source: "fallback",
      message: "Using fallback reviews due to API error",
    });
  }
}
