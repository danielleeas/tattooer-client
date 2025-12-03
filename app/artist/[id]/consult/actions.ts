"use server";

import { createClient } from "@/lib/supabase/server";
import { createConsultRequest } from "@/lib/api/book-consult";
import {
  getArtistEventsForDates,
  getArtistBlockingEvents,
} from "@/lib/api/artist";
import type { Database } from "@/types/supabase";

type Event = Database["public"]["Tables"]["events"]["Row"];

export async function submitConsultRequest(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Extract form data
    const artistId = formData.get("artistId") as string;
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const cityCountry = formData.get("cityCountry") as string;
    const locationId = formData.get("locationId") as string;
    const consultationType = formData.get("consultationType") as
      | "online"
      | "in-person";
    const tattooIdea = formData.get("tattooIdea") as string;
    const tattooType = formData.get("tattooType") as
      | "coverup"
      | "addon"
      | "between"
      | "";

    // Parse selected date/times from JSON string
    const selectedDateTimesJson = formData.get("selectedDateTimes") as string;
    const selectedDateTimes = JSON.parse(selectedDateTimesJson) as Array<{
      date: string;
      time: string;
    }>;

    if (!selectedDateTimes || selectedDateTimes.length === 0) {
      throw new Error("Please select at least one date and time");
    }

    // Use the first selected date/time for the consultation
    const firstDateTime = selectedDateTimes[0];
    const consultDate = firstDateTime.date;
    const consultStartTime = firstDateTime.time;

    // Upload photos to Supabase storage
    const photoUrls: string[] = [];
    const bucketName = "request-photos";
    const artistFolder = artistId;

    // Get all photo files from FormData
    const photoFiles = formData.getAll("photos") as File[];

    if (photoFiles.length > 0) {
      for (let i = 0; i < photoFiles.length; i++) {
        const photo = photoFiles[i];
        if (!photo || photo.size === 0) continue;

        const fileExt = photo.name.split(".").pop() || "jpg";
        const fileName = `${Date.now()}-${i}.${fileExt}`;
        const filePath = `${artistFolder}/${fileName}`;

        // Convert File to ArrayBuffer
        const arrayBuffer = await photo.arrayBuffer();
        const fileData = new Uint8Array(arrayBuffer);

        // Upload to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, fileData, {
            contentType: photo.type || "image/jpeg",
            upsert: false,
          });

        if (uploadError) {
          console.error("Error uploading photo:", uploadError);
          throw new Error(`Failed to upload photo: ${uploadError.message}`);
        }

        // Get public URL for the uploaded file
        const {
          data: { publicUrl },
        } = supabase.storage.from(bucketName).getPublicUrl(filePath);

        photoUrls.push(publicUrl);
      }
    }

    // Prepare consult request data
    const consultRequest = {
      artist_id: artistId,
      location_id: locationId,
      full_name: fullName,
      email: email,
      phone_number: phoneNumber || null,
      residence: cityCountry,
      consult_type: consultationType,
      consult_date: consultDate,
      consult_start_time: consultStartTime,
      tattoo_idea: tattooIdea,
      type_of_tattoo: tattooType || "",
      photos: photoUrls,
      status: "pending",
    };

    // Create consult request
    await createConsultRequest(consultRequest);

    return { success: true };
  } catch (error) {
    console.error("Error submitting consult request:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to submit consultation request",
    };
  }
}

export async function fetchEventsForDates(
  artistId: string,
  dates: string[]
): Promise<Event[]> {
  try {
    return await getArtistEventsForDates(artistId, dates);
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function fetchBlockingEvents(artistId: string): Promise<Event[]> {
  try {
    return await getArtistBlockingEvents(artistId);
  } catch (error) {
    console.error("Error fetching blocking events:", error);
    return [];
  }
}
