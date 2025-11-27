import { getBaseUrl, joinUrl } from "@/lib/utils";
import { getArtistByBookingLink } from "@/lib/api/artist";
import { ArtistLinkPage } from "@/components/artist/ArtistLinkPage";

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const baseUrl = getBaseUrl();
  const bookingLink = joinUrl(baseUrl, id);

  let artist = null;
  let error: string | null = null;

  try {
    artist = await getArtistByBookingLink(bookingLink);
    if (!artist) {
      error = "Artist not found";
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch artist data";
    console.error("Error fetching artist:", err);
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

  return <ArtistLinkPage artist={artist} />;
}
