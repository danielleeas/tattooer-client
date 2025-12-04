"use server";

import { createClient } from "@/lib/supabase/server";
import { createBookingRequest } from "@/lib/api/booking-request";
import { getArtistById } from "@/lib/api/artist";
import type { Database } from "@/types/supabase";

type BookingRequestInsert =
  Database["public"]["Tables"]["booking_requests"]["Insert"];

export async function submitBookingRequest(
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
    const preferredDays = formData.get("preferredDays") as
      | "any"
      | "weekdays"
      | "weekend";
    const tattooIdea = formData.get("tattooIdea") as string;
    const tattooType = formData.get("tattooType") as
      | "coverup"
      | "addon"
      | "between"
      | "";

    // Get artist information for email
    const artist = await getArtistById(artistId);
    if (!artist) {
      throw new Error("Artist not found");
    }

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

    // Prepare booking request data
    const bookingRequest: BookingRequestInsert = {
      artist_id: artistId,
      location_id: locationId,
      full_name: fullName,
      email: email,
      phone_number: phoneNumber,
      tattoo_idea: tattooIdea,
      type_of_tattoo: tattooType || "",
      prefer_days: preferredDays,
      photos: photoUrls,
      status: "pending",
    };

    // Create booking request
    await createBookingRequest(bookingRequest);

    // Send booking request email (don't fail the booking if email fails)
    try {
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/booking-request-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          variables: {
            "Client First Name": fullName,
            "Your Name": artist.full_name,
            "Studio Name": artist.studio_name,
          },
          avatar_url: artist.avatar,
        }),
      });
    } catch (emailError) {
      // Log email error but don't fail the booking
      console.error("Failed to send booking request email:", emailError);
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting booking request:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to submit booking request",
    };
  }
}
