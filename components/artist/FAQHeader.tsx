import { cn } from "@/lib/utils";
import Image from "next/image";

interface FAQHeaderProps {
  className?: string;
}

export function FAQHeader({ className }: FAQHeaderProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center">
          <span className="text-3xl font-bold text-background">?</span>
        </div>
      </div>
      <h1 className="text-lg font-medium text-foreground uppercase tracking-wide">
        FAQs
      </h1>
      <p className="text-base text-foreground/80 text-center max-w-md">
        Your questions, answered.
      </p>
    </div>
  );
}
