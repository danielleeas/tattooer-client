import { cn } from "@/lib/utils";
import Image from "next/image";

interface FlashCardProps {
  image: string | null;
  name: string | null;
  price: number;
  className?: string;
  onClick?: () => void;
}

export function FlashCard({
  image,
  name,
  price,
  className,
  onClick,
}: FlashCardProps) {
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
          // src={image}
          src="/assets/images/flashs/flash2.png"
          alt={name || "Flash item"}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <span className="text-muted-foreground">No image</span>
        </div>
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {name && <p className="text-white font-medium mb-1">{name}</p>}
        <p className="text-white/90 text-sm">${price.toFixed(2)}</p>
      </div>
    </div>
  );
}
