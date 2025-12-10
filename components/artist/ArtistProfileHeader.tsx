import { cn } from "@/lib/utils";

interface ArtistProfileHeaderProps {
  name: string;
  displayHandle?: string | null;
  socialLink?: string | null;
  className?: string;
}

export function ArtistProfileHeader({
  name,
  displayHandle,
  socialLink,
  className,
}: ArtistProfileHeaderProps) {
  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <h1 className="text-4xl text-foreground">{name}</h1>
      {displayHandle && socialLink && (
        <a
          href={socialLink}
          target="_blank"
          rel="noreferrer"
          className="text-xl text-foreground hover:underline"
        >
          @{displayHandle}
        </a>
      )}
    </div>
  );
}
