import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ActionLinkButtonProps {
  href: string;
  icon: string;
  label: string;
  size?: "default" | "large";
  className?: string;
}

export function ActionLinkButton({
  href,
  icon,
  label,
  size = "default",
  className,
}: ActionLinkButtonProps) {
  const isLarge = size === "large";

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center gap-2 group transition-opacity hover:opacity-80",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center bg-background/80 backdrop-blur-sm transition-colors",
          isLarge ? "w-16 h-16" : "w-12 h-12"
        )}
      >
        <Image
          src={`/assets/images/icons/${icon}.png`}
          alt={label}
          fill
          className="object-contain shrink-0"
        />
      </div>
      <span className="text-lg font-medium text-foreground w-[100px] text-center">
        {label}
      </span>
    </Link>
  );
}
