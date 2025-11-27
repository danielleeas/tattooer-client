import { cn } from "@/lib/utils";
import Image from "next/image";

interface BookingHeaderProps {
  artistName: string;
  className?: string;
}

export function BookingHeader({ artistName, className }: BookingHeaderProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative w-16 h-16 flex items-center justify-center">
        <Image
          src="/assets/images/icons/portfolio.png"
          alt="Tattoo Machine"
          width={64}
          height={64}
          className="object-contain"
        />
      </div>
      <h1 className="text-xl font-semibold text-foreground text-center">
        {artistName} — BOOKING FORM
      </h1>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        I&apos;m happy you&apos;re here! Please fill out this short form so we
        can get started.
      </p>
    </div>
  );
}
