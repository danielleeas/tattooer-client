import { cn } from "@/lib/utils";
import Image from "next/image";
import { WatermarkOverlay } from "../common/WatermarkOverlay";

interface WatermarkSettings {
  enabled: boolean;
  image?: string | null;
  opacity?: number | null;
  position?: string | null;
  text?: string | null;
}

interface FlashCardProps {
  image: string | null;
  name: string | null;
  price: number;
  className?: string;
  onClick?: () => void;
  onImageClick?: () => void;
  watermark?: WatermarkSettings | null;
}

export function FlashCard({
  image,
  name,
  price,
  className,
  onClick,
  onImageClick,
  watermark,
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
          src={image}
          alt={name || "Flash item"}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          onClick={(e) => {
            e.stopPropagation();
            onImageClick?.();
          }}
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <span className="text-muted-foreground">No image</span>
        </div>
      )}

      {/* Watermark Overlay */}
      <WatermarkOverlay watermark={watermark || null} />

      <div
        className={`absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent ${
          onImageClick ? "pointer-events-none" : ""
        }`}
      />
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 ${
          onImageClick ? "pointer-events-none" : ""
        }`}
      >
        {name && <p className="text-white">{name}</p>}
        <p className="text-white/90 text-sm">${price.toFixed(2)}</p>
      </div>
    </div>
  );
}
