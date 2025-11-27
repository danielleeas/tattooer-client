import { cn } from "@/lib/utils";
import Image from "next/image";

interface FlashHeaderProps {
  description?: string;
  className?: string;
}

export function FlashHeader({
  description = "Browse My Available Flash Designs!",
  className,
}: FlashHeaderProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative w-16 h-16 flex items-center justify-center">
        <Image
          src="/assets/images/icons/flash.png"
          alt="Flash"
          fill
          className="object-contain"
        />
      </div>
      <h1 className="text-lg font-medium text-foreground uppercase tracking-wide">
        FLASH
      </h1>
      {description && (
        <p className="text-base text-foreground/80 text-center max-w-md">
          {description}
        </p>
      )}
    </div>
  );
}
