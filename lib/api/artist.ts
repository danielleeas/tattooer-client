import { createClient } from "@/lib/supabase/server";
import type { Artist } from "@/types/artist";

/**
 * Hämtar artistdata via booking link från Supabase RPC-funktion
 * @param bookingLink - Booking link för att hitta artisten
 * @returns Artist data eller null om inte hittad
 * @throws Error om något går fel
 */
export async function getArtistByBookingLink(
  bookingLink: string
): Promise<Artist | null> {
  if (!bookingLink) {
    throw new Error("booking_link is required");
  }

  const supabase = await createClient();

  console.log("bookingLink", bookingLink);

  const { data, error } = await supabase.rpc("get_artist_by_booking_link", {
    booking_link_param: bookingLink,
  });

  if (error) {
    console.error("Supabase RPC error:", error);
    throw new Error(`Failed to fetch artist data: ${error.message}`);
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return null;
  }

  // RPC kan returnera antingen en array eller ett objekt
  const artist = Array.isArray(data) ? data[0] : data;
  return artist as Artist;
}

