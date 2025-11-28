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
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <h1 className="text-4xl text-foreground">{name}</h1>
      {instagramHandle && (
        <p className="text-xl text-foreground">@{instagramHandle}</p>
      )}
    </div>
  );
}
