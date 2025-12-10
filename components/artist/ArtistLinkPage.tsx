import { ArtistProfileHeader } from "./ArtistProfileHeader";
import { ArtistProfileImage } from "./ArtistProfileImage";
import { ActionLinkButton } from "./ActionLinkButton";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/supabase";
type Artist = Database["public"]["Tables"]["artists"]["Row"];

interface ArtistLinkPageProps {
  artist: Artist;
  className?: string;
}

export function ArtistLinkPage({ artist, className }: ArtistLinkPageProps) {
  const uniqueUserName = artist.booking_link.split("/").pop();

  // Generate URLs for different actions (you may need to adjust these based on your routing)
  const basePath = `/artist/${uniqueUserName}`;

  // Derive display handle from artist name (firstname.lastname, lowercase)
  const nameParts = (artist.full_name || "").trim().toLowerCase().split(/\s+/);
  const displayHandle =
    nameParts.length > 1
      ? `${nameParts[0]}.${nameParts[nameParts.length - 1]}`
      : nameParts[0] || null;

  // Build social link from social_handler (accepts full URL or handle)
  const rawSocial = artist.social_handler?.replace(/^@/, "").trim();
  const socialLink = rawSocial
    ? rawSocial.startsWith("http")
      ? rawSocial
      : `https://instagram.com/${rawSocial}`
    : null;

  return (
    <div
      className={cn(
        "min-h-screen bg-background flex flex-col items-center justify-center w-[390px] mx-auto gap-8",
        className
      )}
    >
      {/* Header */}
      <ArtistProfileHeader
        name={artist.full_name || "Artist"}
        displayHandle={displayHandle}
        socialLink={socialLink}
      />
      {/* Action Buttons */}
      <div className="flex justify-between items-center w-full">
        <ActionLinkButton
          href={`${basePath}/booking`}
          icon="chat"
          label="BOOKING FORM"
        />
        <ActionLinkButton
          href={`${basePath}/consult`}
          icon="consult"
          label="BOOK A CONSULT"
        />
      </div>
      {/* Profile Image */}
      <ArtistProfileImage
        src={artist.avatar || artist.photo}
        alt={artist.full_name || "Artist profile"}
        className="w-[200px] h-[200px]"
      />
      {/* Action Buttons */}
      <div className="flex justify-between items-center w-full">
        <ActionLinkButton
          href={`${basePath}/flashes`}
          icon="flash"
          label="VIEW FLASH"
        />
        <ActionLinkButton
          href={`${basePath}/portfolio`}
          icon="portfolio"
          label="VIEW PORTFOLIO"
        />
      </div>
      {/* FAQ Button */}
      <ActionLinkButton
        href={`${basePath}/faqs`}
        icon="question"
        label="FAQS"
        size="large"
      />
    </div>
  );
}
