import type { Database } from "@/types/supabase";

export type ArtistInfo = Database["public"]["Tables"]["artists"]["Row"] & {
  flow: Database["public"]["Tables"]["flows"]["Row"] | null;
  app: Database["public"]["Tables"]["apps"]["Row"] | null;
  locations: Database["public"]["Tables"]["locations"]["Row"][];
  rule: Database["public"]["Tables"]["rules"]["Row"] | null;
  subscription: Database["public"]["Tables"]["subscriptions"]["Row"] | null;
};
