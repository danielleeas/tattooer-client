/**
 * Artist data type returned from Supabase RPC function get_artist_by_booking_link
 */
export interface Artist {
  id: string;
  full_name: string;
  booking_link: string;
  // Lägg till fler fält baserat på vad RPC-funktionen returnerar
  [key: string]: unknown;
}

/**
 * API response type for artist endpoint
 */
export interface ArtistApiResponse {
  data: Artist | Artist[] | null;
  error?: string;
  details?: string;
}

