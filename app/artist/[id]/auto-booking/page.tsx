import { getBaseUrl, joinUrl } from "@/lib/utils";
import { getArtistByBookingLink, getArtistLocations } from "@/lib/api/artist";
import { AutoBookingClient } from "./client";
import type { Database } from "@/types/supabase";

type Location = Database["public"]["Tables"]["locations"]["Row"];

export default async function AutoBookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const baseUrl = getBaseUrl();
  const bookingLink = joinUrl(baseUrl, id);

  let artist = null;
  let locations: Location[] = [];
  let error: string | null = null;

  try {
    artist = await getArtistByBookingLink(bookingLink);
    if (!artist) {
      error = "Artist not found";
    } else {
      locations = await getArtistLocations(artist.id);
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
    <AutoBookingClient
      artistId={id}
      artist={artist}
      locations={locations}
      error={error}
    />
  );
}
