import { cn } from "@/lib/utils";
import Image from "next/image";

interface BookingHeaderProps {
  artistName: string;
  className?: string;
  title?: string;
  icon?: string;
}

export function BookingHeader({
  artistName,
  className,
  title,
  icon,
}: BookingHeaderProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative w-16 h-16 flex items-center justify-center">
        <Image
          src={icon || "/assets/images/icons/video_camera.png"}
          alt="Tattoo Machine"
          width={64}
          height={64}
          className="object-contain"
        />
      </div>
      <h1 className="text-lg font-medium text-foreground text-center uppercase tracking-wide">
        {title || "Book a Consult"}
      </h1>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        I&apos;m happy you&apos;re here! Please fill out this short form so we
        can get started.
      </p>
    </div>
  );
}
