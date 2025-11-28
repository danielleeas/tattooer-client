import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface BackButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export function BackButton({
  href,
  label = "BACK",
  className,
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity w-full justify-start",
        className
      )}
    >
      <Image
        src="/assets/images/icons/arrow_left.png"
        alt="Back"
        width={24}
        height={24}
        className="object-contain"
      />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
