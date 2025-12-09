import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";
import type { ArtistInfo } from "@/types/artist";

type Artist = Database["public"]["Tables"]["artists"]["Row"];
type Portfolio = Database["public"]["Tables"]["artist_portfolios"]["Row"];
type Flash = Database["public"]["Tables"]["artist_flashs"]["Row"];
type FAQCategory = Database["public"]["Tables"]["faq_categories"]["Row"];
type FAQItem = Database["public"]["Tables"]["faq_items"]["Row"];
type Location = Database["public"]["Tables"]["locations"]["Row"];

/**
 * Hämtar artistdata via booking link från Supabase RPC-funktion
 * @param bookingLink - Booking link för att hitta artisten
 * @returns Artist data eller null om inte hittad
 * @throws Error om något går fel
 */
export async function getArtistByBookingLink(
  bookingLink: string
): Promise<ArtistInfo | null> {
  if (!bookingLink) {
    throw new Error("booking_link is required");
  }

  const supabase = await createClient();

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
  const artistData = Array.isArray(data) ? data[0] : data;

  // Transform RPC result to match Artist interface
  const artist = {
    id: artistData.artist_id,
    email: artistData.email,
    full_name: artistData.full_name,
    photo: artistData.photo,
    avatar: artistData.avatar,
    studio_name: artistData.studio_name,
    booking_link: artistData.booking_link,
    social_handler: artistData.social_handler,
    subscription_active: artistData.subscription_active,
    subscription_type: artistData.subscription_type,
    // Additional RPC fields
    subscription: artistData.subscription,
    app: artistData.app,
    rule: artistData.rule,
    flow: artistData.flow,
    template: artistData.template,
    locations: artistData.locations,
  } as unknown as ArtistInfo;

  return artist;
}

export async function getArtistById(id: string): Promise<Artist | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq("id", id);

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(`Failed to fetch artist data: ${error.message}`);
  }
  return data[0] as Artist;
}

export async function getArtistPortfolios(
  artistId: string
): Promise<Portfolio[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artist_portfolios")
    .select("*")
    .eq("artist_id", artistId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(`Failed to fetch portfolios: ${error.message}`);
  }

  return data || [];
}

export async function getArtistFlashes(artistId: string): Promise<Flash[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artist_flashs")
    .select("*")
    .eq("artist_id", artistId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(`Failed to fetch flashes: ${error.message}`);
  }

  return data || [];
}

export interface FAQCategoryWithItems extends FAQCategory {
  items: FAQItem[];
}

export async function getArtistFAQs(
  artistId: string
): Promise<FAQCategoryWithItems[]> {
  const supabase = await createClient();

  // Fetch categories
  const { data: categories, error: categoriesError } = await supabase
    .from("faq_categories")
    .select("*")
    .eq("artist_id", artistId)
    .order("created_at", { ascending: true });

  if (categoriesError) {
    console.error("Supabase error:", categoriesError);
    throw new Error(
      `Failed to fetch FAQ categories: ${categoriesError.message}`
    );
  }

  if (!categories || categories.length === 0) {
    return [];
  }

  // Fetch items for each category
  const categoryIds = categories.map((cat) => cat.id);
  const { data: items, error: itemsError } = await supabase
    .from("faq_items")
    .select("*")
    .in("category_id", categoryIds)
    .order("created_at", { ascending: true });

  if (itemsError) {
    console.error("Supabase error:", itemsError);
    throw new Error(`Failed to fetch FAQ items: ${itemsError.message}`);
  }

  // Group items by category
  const categoriesWithItems: FAQCategoryWithItems[] = categories.map(
    (category) => ({
      ...category,
      items: items?.filter((item) => item.category_id === category.id) || [],
    })
  );

  return categoriesWithItems;
}

export async function getArtistLocations(
  artistId: string
): Promise<Location[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("artist_id", artistId)
    .order("is_main_studio", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(`Failed to fetch locations: ${error.message}`);
  }

  return data || [];
}

type Event = Database["public"]["Tables"]["events"]["Row"];

/**
 * Fetch all blocking events (book_off and mark_unavailable) for an artist
 * These events are used to disable entire dates on the calendar
 */
export async function getArtistBlockingEvents(
  artistId: string
): Promise<Event[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("artist_id", artistId)
    .in("source", ["book_off", "mark_unavailable"]);

  if (error) {
    console.error("[getArtistBlockingEvents] Supabase error:", error);
    throw new Error(`Failed to fetch blocking events: ${error.message}`);
  }

  return data || [];
}

export async function getArtistEventsForDates(
  artistId: string,
  dates: string[]
): Promise<Event[]> {
  if (!dates || dates.length === 0) {
    return [];
  }

  const supabase = await createClient();

  // Find the earliest and latest dates to create a range
  const sortedDates = dates.sort();
  const earliestDate = sortedDates[0];
  const latestDate = sortedDates[sortedDates.length - 1];

  // First fetch all events for the artist (can't filter by date since they're pure strings)
  // We'll filter by date and type in JavaScript after fetching
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("artist_id", artistId)
    .in("source", [
      "book_off",
      "session",
      "block_time",
      "quick_appointment",
      "mark_unavailable",
    ]);
  // .eq("id", "4d4629df-6c79-410f-832f-80a3bc8494ef");
  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  // Filter events to only include those that:
  // 1. Overlap with the selected date range (earliest to latest date)
  // 2. Are of types that should block time slots
  const filteredEvents = (data || []).filter((event) => {
    // Try to parse the date strings (they appear to be in format "YYYY-MM-DD HH:mm")
    let eventStart: Date, eventEnd: Date;
    try {
      // Parse as local time - split date and time parts
      const [startDate, startTime] = event.start_date.split(" ");
      const [endDate, endTime] = event.end_date.split(" ");

      if (startDate && startTime) {
        const [year, month, day] = startDate.split("-").map(Number);
        const [hour, minute] = startTime.split(":").map(Number);
        eventStart = new Date(year, month - 1, day, hour, minute);
      } else {
        eventStart = new Date(event.start_date);
      }

      if (endDate && endTime) {
        const [year, month, day] = endDate.split("-").map(Number);
        const [hour, minute] = endTime.split(":").map(Number);
        eventEnd = new Date(year, month - 1, day, hour, minute);
      } else {
        eventEnd = new Date(event.end_date);
      }

      // Check if dates are valid
      if (isNaN(eventStart.getTime()) || isNaN(eventEnd.getTime())) {
        return false;
      }
    } catch {
      return false;
    }

    // Create date range for comparison (earliest to latest selected date)
    // Parse selected dates as local dates (YYYY-MM-DD format)
    const [startYear, startMonth, startDay] = earliestDate
      .split("-")
      .map(Number);
    const rangeStart = new Date(
      startYear,
      startMonth - 1,
      startDay,
      0,
      0,
      0,
      0
    );

    const [endYear, endMonth, endDay] = latestDate.split("-").map(Number);
    const rangeEnd = new Date(endYear, endMonth - 1, endDay, 23, 59, 59, 999);

    // Check if event overlaps with the selected date range
    const overlaps = eventStart <= rangeEnd && eventEnd >= rangeStart;

    return overlaps;
  });

  return filteredEvents;
}
