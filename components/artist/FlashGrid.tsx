import { cn } from "@/lib/utils";
import { FlashCard } from "./FlashCard";
import type { Database } from "@/types/supabase";

type Flash = Database["public"]["Tables"]["artist_flashs"]["Row"];

interface WatermarkSettings {
  enabled: boolean;
  image?: string | null;
  opacity?: number | null;
  position?: string | null;
  text?: string | null;
}

interface FlashGridProps {
  flashes: Flash[];
  className?: string;
  onFlashClick?: (flash: Flash) => void;
  watermark?: WatermarkSettings | null;
}

export function FlashGrid({
  flashes,
  className,
  onFlashClick,
  watermark,
}: FlashGridProps) {
  if (flashes.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <p className="text-muted-foreground text-lg">
          No flash items available yet.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-4 justify-around w-full", className)}>
      {flashes.map((flash) => (
        <FlashCard
          key={flash.id}
          image={flash.flash_image}
          name={flash.flash_name}
          price={flash.flash_price}
          onClick={() => {
            onFlashClick?.(flash);
          }}
          watermark={watermark}
        />
      ))}
    </div>
  );
}
