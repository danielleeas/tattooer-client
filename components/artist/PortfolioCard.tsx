import { cn } from "@/lib/utils";
import Image from "next/image";

interface PortfolioCardProps {
  image: string | null;
  name: string | null;
  description?: string | null;
  className?: string;
}

export function PortfolioCard({
  image,
  name,
  description,
  className,
}: PortfolioCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden group cursor-pointer w-[174px] h-[216px]",
        className
      )}
    >
      {image ? (
        <Image
          // src={image}
          src="/assets/images/flashs/flash1.png"
          alt={name || "Portfolio item"}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <span className="text-muted-foreground">No image</span>
        </div>
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
      {name && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white">{name}</p>
        </div>
      )}
    </div>
  );
}
