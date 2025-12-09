import { createClient } from "../supabase/server";
import type { Database } from "@/types/supabase";

type ConsultRequest =
  Database["public"]["Tables"]["consult_requests"]["Insert"];

export async function createConsultRequest(consultRequest: ConsultRequest) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("consult_requests")
    .insert(consultRequest);
  if (error) {
    throw error;
  }
  return data;
}
