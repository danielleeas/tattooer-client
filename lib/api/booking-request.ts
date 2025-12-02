import { createClient } from "../supabase/server";
import type { Database } from "@/types/supabase";

type BookingRequest =
  Database["public"]["Tables"]["booking_requests"]["Insert"];

export async function createBookingRequest(bookingRequest: BookingRequest) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("booking_requests")
    .insert(bookingRequest);
  if (error) {
    throw error;
  }
  return data;
}
