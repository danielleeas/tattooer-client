import { getBaseUrl, joinUrl } from "@/lib/utils";
import { getArtistByBookingLink, getArtistPortfolios } from "@/lib/api/artist";
import { PortfolioClient } from "./client";
import type { Database } from "@/types/supabase";

type Portfolio = Database["public"]["Tables"]["artist_portfolios"]["Row"];

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const baseUrl = getBaseUrl();
  const bookingLink = joinUrl(baseUrl, id);

  let artist = null;
  let portfolios: Portfolio[] = [];
  let error: string | null = null;

  try {
    artist = await getArtistByBookingLink(bookingLink);
    if (!artist) {
      error = "Artist not found";
    } else {
      portfolios = await getArtistPortfolios(artist.id);
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch data";
    console.error("Error fetching data:", err);
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-medium text-foreground">
            Artist Not Found
          </h1>
          <p className="text-muted-foreground">
            {error || "The artist you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    );
  }

  return <PortfolioClient portfolios={portfolios} artistId={id} />;
}
