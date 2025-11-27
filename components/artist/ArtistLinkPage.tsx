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
  // Extract Instagram handle from social_handler (assuming format like "@username" or "username")
  const instagramHandle = artist.social_handler
    ? artist.social_handler.replace(/^@/, "")
    : null;

  const uniqueUserName = artist.booking_link.split("/").pop();

  // Generate URLs for different actions (you may need to adjust these based on your routing)
  const basePath = `/artist/${uniqueUserName}`;

  return (
    <div
      className={cn(
        "min-h-screen bg-background flex flex-col items-center justify-center w-full gap-8",
        className
      )}
    >
      {/* Header */}
      <ArtistProfileHeader
        name={artist.full_name || "Artist"}
        instagramHandle={instagramHandle}
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
        src={artist.photo || artist.avatar}
        alt={artist.full_name || "Artist profile"}
        className="w-[200px] h-[200px]"
      />
      {/* Action Buttons */}
      <div className="flex justify-between items-center w-full">
        <ActionLinkButton
          href={`${basePath}/flash`}
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
