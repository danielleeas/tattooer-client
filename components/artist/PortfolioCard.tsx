import { cn } from "@/lib/utils";
import Image from "next/image";

interface PortfolioCardProps {
  image: string | null;
  name: string | null;
  className?: string;
  onClick?: () => void;
}

export function PortfolioCard({
  image,
  name,
  className,
  onClick,
}: PortfolioCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden group cursor-pointer w-[174px] h-[216px]",
        className
      )}
      onClick={onClick}
    >
      {image ? (
        <Image
          src={image}
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
