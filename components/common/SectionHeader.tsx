import { cn } from "@/lib/utils";
import Image from "next/image";
import { ReactNode } from "react";

interface SectionHeaderProps {
  artistName?: string;
  className?: string;
  title?: ReactNode;
  icon?: string;
  description?: ReactNode;
  descriptionClassName?: string;
  titleClassName?: string;
}

export function SectionHeader({
  artistName,
  className,
  title,
  icon,
  description,
  descriptionClassName,
  titleClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative w-16 h-16 flex items-center justify-center">
        <Image
          src={icon || "/assets/images/icons/video_camera.png"}
          alt="Tattoo Machine"
          width={64}
          height={64}
          className="object-contain"
        />
      </div>
      <h1
        className={cn(
          "text-lg text-foreground text-center uppercase tracking-wide leading-tight",
          titleClassName
        )}
      >
        {title}
      </h1>
      <p
        className={cn(
          "text-sm text-muted-foreground text-center max-w-md",
          descriptionClassName
        )}
      >
        {description}
      </p>
    </div>
  );
}
