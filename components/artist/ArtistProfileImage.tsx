import Image from "next/image";
import { cn } from "@/lib/utils";

interface ArtistProfileImageProps {
  src: string | null;
  alt: string;
  className?: string;
  size?: number;
}

export function ArtistProfileImage({
  src,
  alt,
  className,
  size = 280,
}: ArtistProfileImageProps) {
  const sizeClass = className?.includes("w-") || className?.includes("h-") 
    ? "" 
    : `w-[${size}px] h-[${size}px]`;
  
  if (!src) {
    return (
      <div
        className={cn(
          "rounded-full bg-muted flex items-center justify-center",
          sizeClass,
          className
        )}
      >
        <span className="text-muted-foreground text-4xl">?</span>
      </div>
    );
  }

  return (
    <div
      className={cn("relative rounded-full overflow-hidden", sizeClass, className)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={`${size}px`}
        priority
      />
    </div>
  );
}

