import { getBaseUrl, joinUrl } from "@/lib/utils";
import { getArtistByBookingLink, getArtistFAQs } from "@/lib/api/artist";
import { FAQsClient } from "./client";
import type { Database } from "@/types/supabase";

type FAQCategory = Database["public"]["Tables"]["faq_categories"]["Row"];

export default async function FAQsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const baseUrl = getBaseUrl();
  const bookingLink = joinUrl(baseUrl, id);

  let artist = null;
  let faqs: Awaited<ReturnType<typeof getArtistFAQs>> = [];
  let error: string | null = null;

  try {
    artist = await getArtistByBookingLink(bookingLink);
    if (!artist) {
      error = "Artist not found";
    } else {
      faqs = await getArtistFAQs(artist.id);
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

  return (
    <FAQsClient
      artistId={id}
      artist={artist}
      faqs={faqs}
      error={error}
    />
  );
}
