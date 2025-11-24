import { getBaseUrl, joinUrl } from "@/lib/utils";
import { getArtistByBookingLink } from "@/lib/api/artist";
import type { Artist } from "@/types/artist";

export default async function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const baseUrl = getBaseUrl();
    const bookingLink = joinUrl(baseUrl, id);

    let artist: Artist | null = null;
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

    if (error) {
        return (
            <div>
                <h1>Artist Page</h1>
                <p className="text-red-500">Error: {error}</p>
                <p>Artist Username: {id}</p>
                <p>Booking Link: {bookingLink}</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Artist Page</h1>
            {artist ? (
                <>
                    <h2>{artist.username || "Unknown Artist"}</h2>
                    <p>Artist ID: {artist.id || id}</p>
                    <p>Booking Link: {artist.booking_link || bookingLink}</p>
                    {/* Lägg till fler fält baserat på vad artist-objektet innehåller */}
                </>
            ) : (
                <p>No artist data available</p>
            )}
        </div>
    );
}