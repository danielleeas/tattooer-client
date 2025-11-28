import { cn } from "@/lib/utils";
import { FlashCard } from "./FlashCard";
import type { Database } from "@/types/supabase";

type Flash = Database["public"]["Tables"]["artist_flashs"]["Row"];

interface FlashGridProps {
  flashes: Flash[];
  className?: string;
  onFlashClick?: (flash: Flash) => void;
}

export function FlashGrid({
  flashes,
  className,
  onFlashClick,
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
    <div className={cn("grid grid-cols-2 gap-4 w-full", className)}>
      {flashes.map((flash) => (
        <FlashCard
          key={flash.id}
          image={flash.flash_image}
          name={flash.flash_name}
          price={flash.flash_price}
          onClick={() => onFlashClick?.(flash)}
        />
      ))}
    </div>
  );
}
