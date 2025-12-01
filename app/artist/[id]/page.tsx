import { Suspense } from "react";
import { getBaseUrl, joinUrl } from "@/lib/utils";
import { getArtistByBookingLink } from "@/lib/api/artist";
import { ArtistLinkPage } from "@/components/artist/ArtistLinkPage";
import { ArtistNotFound, LoadingSplash } from "@/components/common";

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
  let loading = true;

  try {
    artist = await getArtistByBookingLink(bookingLink);
    if (!artist) {
      error = "Artist not found";
    } else {
      loading = false;
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch data";
    console.error("Error fetching data:", err);
  }

  console.log(loading);

  if (error || !artist) {
    return <ArtistNotFound error={error} />;
  }

  return (
    <>
      {/* {!loading && ( */}
      <LoadingSplash
        isStartAnimation={!loading}
        welcomImageUrl={artist.photo || ""}
        artistName={artist.full_name}
        instagramHandle={artist.social_handler || ""}
      />
      {/* // )} */}
      <div className="min-h-screen bg-background flex flex-col w-full px-4 gap-8">
        {/* Artist Links */}
        <ArtistLinkPage artist={artist} />
      </div>
    </>
  );
}
