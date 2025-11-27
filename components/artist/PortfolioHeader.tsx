import { cn } from "@/lib/utils";
import Image from "next/image";

interface PortfolioHeaderProps {
  description?: string;
  className?: string;
}

export function PortfolioHeader({
  description = "Take A Browse Through My Work For Inspiration!",
  className,
}: PortfolioHeaderProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative w-16 h-16 flex items-center justify-center">
        <Image
          src="/assets/images/icons/portfolio.png"
          alt="Portfolio"
          fill
          className="object-contain"
        />
      </div>
      <h1 className="text-lg font-medium text-foreground uppercase tracking-wide">
        PORTFOLIO
      </h1>
      {description && (
        <p className="text-base text-foreground/80 text-center max-w-md">
          {description}
        </p>
      )}
    </div>
  );
}
