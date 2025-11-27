import { cn } from "@/lib/utils";

interface ArtistProfileHeaderProps {
  name: string;
  instagramHandle?: string | null;
  className?: string;
}

export function ArtistProfileHeader({
  name,
  instagramHandle,
  className,
}: ArtistProfileHeaderProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <h1 className="text-3xl font-medium text-foreground">{name}</h1>
      {instagramHandle && (
        <p className="text-base text-foreground/80">@{instagramHandle}</p>
      )}
    </div>
  );
}

