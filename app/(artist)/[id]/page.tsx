import { getBaseUrl, joinUrl } from "@/lib/utils";

export default async function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const baseUrl = getBaseUrl();
  const bookingLink = joinUrl(baseUrl, id);
  
  return (
    <div>
      <h1>Artist Page</h1>
      <p>Artist ID: {id}</p>
      <p>Base URL: {baseUrl}</p>
      <p>Booking Link: {bookingLink}</p>
    </div>
  );
}