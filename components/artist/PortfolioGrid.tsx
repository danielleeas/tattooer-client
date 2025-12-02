import { cn } from "@/lib/utils";
import { PortfolioCard } from "./PortfolioCard";
import type { Database } from "@/types/supabase";

type Portfolio = Database["public"]["Tables"]["artist_portfolios"]["Row"];

interface PortfolioGridProps {
  portfolios: Portfolio[];
  className?: string;
  onPortfolioClick?: (portfolio: Portfolio) => void;
}

export function PortfolioGrid({
  portfolios,
  className,
  onPortfolioClick,
}: PortfolioGridProps) {
  if (portfolios.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <p className="text-muted-foreground text-lg">
          No portfolio items available yet.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 gap-4 w-full", className)}>
      {portfolios.map((portfolio) => (
        <PortfolioCard
          key={portfolio.id}
          image={portfolio.portfolio_image}
          name={portfolio.portfolio_name}
          onClick={() => onPortfolioClick?.(portfolio)}
        />
      ))}
    </div>
  );
}
